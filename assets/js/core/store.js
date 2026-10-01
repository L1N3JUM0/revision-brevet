// Persistance locale : profil, XP, progression par chapitre, anti-doublon.
// Tout passe par try/catch : si localStorage est bloqué (navigation privée),
// le site fonctionne quand même, sans rien retenir.
import { normaliserProfil, packActif, THEMES } from './contexts.js';
import './hors-ligne.js';

const CLE = 'revision-brevet.v1';
const MAX_CLES_VUES = 200;

function etatParDefaut() {
  return {
    version: 1,
    // genre : 'f' | 'm' | 'n' (peu importe) ; themes : 3 à 5 ids ; amis : [{ prenom, genre }] ; pack : 'anna' | null
    profil: { prenom: '', genre: '', themes: [], amis: [], pack: null },
    xp: 0,
    flamme: { jours: 0, dernier: null }, // dernier = 'AAAA-MM-JJ'
    badges: [],                          // ids de chapitres maîtrisés
    chapitres: {},                       // id -> statsChapitre()
    calculatrice: { historique: [], ans: 0 }, // 3 derniers calculs { expr, res } et dernier résultat
    controles: []                        // 10 derniers contrôles blancs { date, note, questions }
  };
}

export function statsParDefaut() {
  return {
    total: 0,          // réponses données
    bonnes: 0,         // bonnes réponses
    bonnesN3: 0,       // bonnes réponses au niveau 3 (badge)
    niveau: 1,         // dernier niveau atteint en entraînement
    vues: [],          // dernières clés d'exercices (anti-doublon)
    record: null       // défi chrono : { score, temps }
  };
}

let etat = null;
let aSauver = false; // vrai si l'ancien état a été migré (à réécrire tout de suite)

function lire() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return etatParDefaut();
    const obj = JSON.parse(brut);
    if (!obj || obj.version !== 1) return etatParDefaut();
    // Fusion avec les valeurs par défaut (champs ajoutés plus tard)
    const base = etatParDefaut();
    aSauver = !obj.profil || !('pack' in obj.profil);
    return migrer({
      ...base,
      ...obj,
      profil: { ...base.profil, ...(obj.profil || {}) },
      flamme: { ...base.flamme, ...(obj.flamme || {}) },
      badges: Array.isArray(obj.badges) ? obj.badges : [],
      chapitres: obj.chapitres && typeof obj.chapitres === 'object' ? obj.chapitres : {},
      calculatrice: {
        historique: Array.isArray(obj.calculatrice?.historique) ? obj.calculatrice.historique.slice(-3) : [],
        ans: Number.isFinite(obj.calculatrice?.ans) ? obj.calculatrice.ans : 0
      }
    });
  } catch {
    return etatParDefaut();
  }
}

// Migration des anciens profils (prénom seul) : la progression est gardée telle quelle.
// Un ancien profil « Anna » active le pack Anna et passe l'onboarding.
export function migrer(e) {
  const p = e.profil;
  if (!Array.isArray(p.themes)) p.themes = [];
  if (!Array.isArray(p.amis)) p.amis = [];
  if (packActif(p)) {
    p.pack = 'anna';
    if (!p.genre) p.genre = 'f';
  }
  return e;
}

// ?profil=anna active le pack Anna (et le garde en mémoire)
function lireUrl(e) {
  try {
    const v = new URLSearchParams(location.search).get('profil');
    if (v && v.toLowerCase() === 'anna') {
      e.profil.pack = 'anna';
      e.profil.packUrl = true;
      if (!e.profil.prenom) e.profil.prenom = 'Anna';
      if (!e.profil.genre) e.profil.genre = 'f';
      return true;
    }
  } catch { /* pas de location (tests sous Node) */ }
  return false;
}

export function charger() {
  if (!etat) {
    etat = lire();
    if (lireUrl(etat) || aSauver) sauver();
  }
  return etat;
}

export function sauver() {
  try {
    localStorage.setItem(CLE, JSON.stringify(charger()));
  } catch {
    // stockage indisponible ou plein : on continue sans sauvegarder
  }
}

// Modifie l'état puis sauvegarde : maj(e => { e.xp += 10; })
export function maj(fn) {
  const e = charger();
  fn(e);
  sauver();
  return e;
}

export function chapitre(id) {
  const e = charger();
  if (!e.chapitres[id]) e.chapitres[id] = statsParDefaut();
  else e.chapitres[id] = { ...statsParDefaut(), ...e.chapitres[id] };
  return e.chapitres[id];
}

export function prenom() {
  return (charger().profil.prenom || '').trim();
}

export function definirPrenom(p) {
  maj(e => { e.profil.prenom = String(p || '').trim().slice(0, 30); });
}

// Profil normalisé (pack Anna, genre et thèmes par défaut), pour tirerContexte
export function profil() {
  return normaliserProfil(charger().profil);
}

// Onboarding terminé : prénom, genre et 3 à 5 thèmes (le pack Anna fournit ses thèmes)
export function profilComplet() {
  const p = charger().profil;
  if (!p.prenom || !p.genre) return false;
  return packActif(p) || (p.themes || []).length >= 3;
}

export function definirProfil({ prenom: pr, genre, themes, amis }) {
  maj(e => {
    const p = e.profil;
    p.prenom = String(pr || '').trim().slice(0, 30);
    p.genre = ['f', 'm', 'n'].includes(genre) ? genre : 'n';
    p.themes = (themes || []).filter(t => THEMES.some(x => x.id === t)).slice(0, 5);
    p.amis = (amis || [])
      .map(a => ({ prenom: String(a.prenom || '').trim().slice(0, 30), genre: a.genre === 'm' ? 'm' : 'f' }))
      .filter(a => a.prenom)
      .slice(0, 6);
    // Pack Anna : prénom Anna, ou demandé par l'URL (?profil=anna)
    p.pack = p.prenom.toLowerCase() === 'anna' || p.packUrl ? 'anna' : null;
  });
}

// Anti-doublon
export function dejaVue(idChapitre, cle) {
  return chapitre(idChapitre).vues.includes(cle);
}

export function memoriserCle(idChapitre, cle) {
  const c = chapitre(idChapitre);
  c.vues.push(cle);
  if (c.vues.length > MAX_CLES_VUES) c.vues.splice(0, c.vues.length - MAX_CLES_VUES);
  sauver();
}

// Pour les tests : repartir d'un état vierge en mémoire
export function _reinitialiserMemoire() {
  etat = etatParDefaut();
}
