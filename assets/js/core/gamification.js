// XP, niveaux mythologiques, série de jours (flamme), badges, messages.
import { charger, sauver, chapitre } from './store.js';

// nom : texte, ou { f, m } accordé selon le genre du profil (« peu importe » → masculin)
export const NIVEAUX = [
  { nom: { f: 'Mortelle', m: 'Mortel' }, seuil: 0, emoji: '🌱' },
  { nom: { f: 'Héroïne', m: 'Héros' }, seuil: 150, emoji: '🛡️' },
  { nom: 'Oracle', seuil: 400, emoji: '🔮' },
  { nom: 'Argonaute', seuil: 800, emoji: '⛵' },
  { nom: 'Hermès', seuil: 1500, emoji: '🪽' },
  { nom: 'Athéna', seuil: 2500, emoji: '🦉' },
  { nom: 'Zeus', seuil: 4000, emoji: '⚡' }
];

export const BONNES_N3_POUR_BADGE = 10;

// Niveau correspondant à un total d'XP, avec la progression vers le suivant
// Nom d'un niveau accordé au genre ('f', 'm' ou 'n')
export function nomNiveau(niveau, genre) {
  return typeof niveau.nom === 'string' ? niveau.nom : genre === 'f' ? niveau.nom.f : niveau.nom.m;
}

export function niveauPourXp(xp, genre = charger().profil.genre) {
  let i = 0;
  while (i + 1 < NIVEAUX.length && xp >= NIVEAUX[i + 1].seuil) i++;
  const accorde = n => (n ? { ...n, nom: nomNiveau(n, genre) } : null);
  const actuel = accorde(NIVEAUX[i]);
  const suivant = accorde(NIVEAUX[i + 1]);
  const progression = suivant ? (xp - actuel.seuil) / (suivant.seuil - actuel.seuil) : 1;
  return { ...actuel, index: i, suivant, progression, xp };
}

// XP d'une bonne réponse : 10 de base, +5 par niveau de difficulté,
// bonus de série à partir de 3 bonnes réponses d'affilée (plafonné)
export function xpPourReponse(niveauDifficulte, serie) {
  const base = 10 + 5 * (niveauDifficulte - 1);
  const bonusSerie = serie >= 3 ? Math.min(serie - 2, 5) * 2 : 0;
  return base + bonusSerie;
}

// ---------- Flamme (jours consécutifs) ----------

function dateLocale(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const j = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${j}`;
}

function veille(dateStr) {
  const [a, m, j] = dateStr.split('-').map(Number);
  return dateLocale(new Date(a, m - 1, j - 1));
}

// Flamme affichée : remise à zéro si la dernière révision date d'avant-hier
export function flammeActuelle() {
  const { flamme } = charger();
  if (!flamme.dernier) return 0;
  const auj = dateLocale();
  return flamme.dernier === auj || flamme.dernier === veille(auj) ? flamme.jours : 0;
}

function entretenirFlamme(e) {
  const auj = dateLocale();
  if (e.flamme.dernier === auj) return false;
  e.flamme.jours = e.flamme.dernier === veille(auj) ? e.flamme.jours + 1 : 1;
  e.flamme.dernier = auj;
  return true;
}

// ---------- Enregistrement d'une réponse ----------

/**
 * Met à jour XP, statistiques, flamme et badges après une réponse.
 * Renvoie { xp, niveauMonte, nouveauNiveau, badge, flammeAllumee }
 */
export function enregistrerResultat(idChapitre, niveauDifficulte, correct, serie) {
  const e = charger();
  const c = chapitre(idChapitre);
  const avant = niveauPourXp(e.xp);
  const res = { xp: 0, niveauMonte: false, nouveauNiveau: null, badge: false, flammeAllumee: false };

  c.total++;
  if (correct) {
    c.bonnes++;
    res.xp = xpPourReponse(niveauDifficulte, serie);
    e.xp += res.xp;
    if (niveauDifficulte >= 3) {
      c.bonnesN3++;
      if (c.bonnesN3 >= BONNES_N3_POUR_BADGE && !e.badges.includes(idChapitre)) {
        e.badges.push(idChapitre);
        res.badge = true;
      }
    }
  }
  res.flammeAllumee = entretenirFlamme(e);

  const apres = niveauPourXp(e.xp);
  if (apres.index > avant.index) {
    res.niveauMonte = true;
    res.nouveauNiveau = apres;
  }
  sauver();
  return res;
}

// Enregistre un record de défi chrono s'il est battu (meilleur score, puis meilleur temps)
export function enregistrerRecord(idChapitre, score, temps) {
  const c = chapitre(idChapitre);
  const r = c.record;
  const battu = !r || score > r.score || (score === r.score && temps < r.temps);
  if (battu) {
    c.record = { score, temps };
    sauver();
  }
  return battu;
}

// Chapitres au plus faible taux de réussite (au moins 5 réponses)
export function pointsFaibles(nombre = 3) {
  const { chapitres } = charger();
  return Object.entries(chapitres)
    .filter(([, c]) => c.total >= 5)
    .map(([id, c]) => ({ id, taux: c.bonnes / c.total, total: c.total }))
    .sort((a, b) => a.taux - b.taux)
    .slice(0, nombre);
}

// ---------- Messages ----------

export const MESSAGES_BRAVO = [
  'Bien joué !',
  'Parfait !',
  'Exactement ça !',
  'Tu gères !',
  'Impeccable !',
  'Carton plein !',
  'Pile dans le mille !',
  'Joli !',
  'Même Pythagore serait fier.',
  'Tu es en feu !',
  'Trop fort !',
  'Nickel !',
  'Ça, c\'est propre.',
  'Validé !',
  'Bravo, {prenom} !',
  'Digne d\'Athéna !',
  'Superbe !',
  'Tir en pleine lucarne !'
];

export const MESSAGES_OUPS = [
  'Pas grave, regarde la correction.',
  'Presque ! On regarde ensemble ?',
  'Une erreur, c\'est une info en plus.',
  'Ça arrive à tout le monde.',
  'On reprend calmement.',
  'Pas cette fois, mais tu progresses.',
  'Regarde bien l\'étape qui coince.',
  'Garde la tête haute, {prenom}.',
  'Même Hermès trébuche parfois.',
  'Allez, la prochaine est pour toi.',
  'C\'est en se trompant qu\'on retient.'
];

export const MESSAGES_SERIE = [
  '{n} d\'affilée !',
  'Série de {n} !',
  '{n} de suite, tu es sur ta lancée !'
];

// Message au hasard ; les modèles dont une variable manque (ex. pas de prénom) sont écartés
export function message(rng, liste, variables = {}) {
  const possibles = liste.filter(m =>
    [...m.matchAll(/\{(\w+)\}/g)].every(([, k]) => variables[k] !== undefined && variables[k] !== ''));
  return rng.choix(possibles.length ? possibles : liste)
    .replace(/\{(\w+)\}/g, (_, k) => variables[k] ?? '');
}
