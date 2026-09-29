// Persistance locale : profil, XP, progression par chapitre, anti-doublon.
// Tout passe par try/catch : si localStorage est bloqué (navigation privée),
// le site fonctionne quand même, sans rien retenir.

const CLE = 'revision-brevet.v1';
const MAX_CLES_VUES = 200;

function etatParDefaut() {
  return {
    version: 1,
    profil: { prenom: '' },
    xp: 0,
    flamme: { jours: 0, dernier: null }, // dernier = 'AAAA-MM-JJ'
    badges: [],                          // ids de chapitres maîtrisés
    chapitres: {},                       // id -> statsChapitre()
    calculatrice: { historique: [], ans: 0 } // 3 derniers calculs { expr, res } et dernier résultat
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

function lire() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return etatParDefaut();
    const obj = JSON.parse(brut);
    if (!obj || obj.version !== 1) return etatParDefaut();
    // Fusion avec les valeurs par défaut (champs ajoutés plus tard)
    const base = etatParDefaut();
    return {
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
    };
  } catch {
    return etatParDefaut();
  }
}

export function charger() {
  if (!etat) etat = lire();
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
