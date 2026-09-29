// Saisie et vérification des réponses, formatage des nombres à la française.

const MOINS = '−'; // signe moins typographique « − »
const ESPACE_FINE = ' ';

// ---------- Formatage ----------

// Nombre à la française : virgule décimale, signe « − », espaces des milliers
export function fmt(x) {
  if (typeof x !== 'number' || !Number.isFinite(x)) return String(x);
  const propre = Number(x.toFixed(10)); // évite 0,30000000000000004
  const neg = propre < 0;
  const [ent, dec] = Math.abs(propre).toString().split('.');
  const entier = ent.length > 4 ? ent.replace(/\B(?=(\d{3})+(?!\d))/g, ESPACE_FINE) : ent;
  return (neg ? MOINS : '') + entier + (dec ? ',' + dec : '');
}

// Relatif dans un calcul : parenthèses autour des négatifs, ex. (−3)
export function fmtRel(x) {
  return x < 0 ? `(${fmt(x)})` : fmt(x);
}

export function fmtFraction(n, d) {
  if (d < 0) { n = -n; d = -d; }
  return d === 1 ? fmt(n) : `${fmt(n)}/${fmt(d)}`;
}

// Durée en secondes -> « 1 h 45 min », « 2 min 30 s »
export function fmtDuree(secondes) {
  let s = Math.round(secondes);
  const neg = s < 0;
  s = Math.abs(s);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const morceaux = [];
  if (h) morceaux.push(`${h} h`);
  if (m) morceaux.push(`${m} min`);
  if (r || morceaux.length === 0) morceaux.push(`${r} s`);
  return (neg ? MOINS : '') + morceaux.join(' ');
}

// ---------- Outils ----------

export function pgcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

// Nettoie une saisie : espaces, virgule, signe moins typographique
export function normaliser(saisie) {
  return String(saisie ?? '')
    .trim()
    .replace(/[−–—]/g, '-')      // −, –, — -> -
    .replace(/[\s   ]/g, '')     // tous les espaces
    .replace(/,/g, '.')
    .replace(/÷/g, '/');
}

function retirerUnite(s, unite) {
  if (!unite) return s;
  const u = normaliser(unite).toLowerCase();
  return s.toLowerCase().endsWith(u) ? s.slice(0, s.length - u.length) : s;
}

const RE_NOMBRE = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
const RE_FRACTION = /^\(?([+-]?\d+)\)?\/\(?([+-]?\d+)\)?$/;

// Renvoie un nombre, ou null si la saisie n'est pas un nombre
export function lireNombre(saisie, unite) {
  const s = retirerUnite(normaliser(saisie), unite);
  if (RE_NOMBRE.test(s)) return Number(s);
  const f = lireFraction(s);
  if (f && f.d !== 0) return f.n / f.d;
  return null;
}

// Renvoie { n, d } ou null. Un entier est accepté (d = 1).
export function lireFraction(saisie) {
  const s = normaliser(saisie);
  const m = s.match(RE_FRACTION);
  if (m) {
    const n = Number(m[1]);
    const d = Number(m[2]);
    if (d === 0) return null;
    return { n, d };
  }
  if (/^[+-]?\d+$/.test(s)) return { n: Number(s), d: 1 };
  return null;
}

// Durée -> secondes. Accepte 1h45, 1 h 45 min, 105 min, 1,75 h, 1:45, 90 s.
// Un nombre seul est lu dans l'unité par défaut ('h', 'min' ou 's').
export function lireDuree(saisie, uniteParDefaut = 'min') {
  let s = normaliser(saisie).toLowerCase()
    .replace(/heures?/g, 'h')
    .replace(/minutes?|mn/g, 'min')
    .replace(/secondes?|sec/g, 's');
  if (!s) return null;
  const facteurs = { h: 3600, min: 60, s: 1 };

  if (RE_NOMBRE.test(s)) return Number(s) * facteurs[uniteParDefaut];

  let m = s.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (m) return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3] || 0);

  m = s.match(/^(\d+)h(\d{1,2})$/); // 1h45
  if (m) return Number(m[1]) * 3600 + Number(m[2]) * 60;

  m = s.match(/^(?:(\d+(?:\.\d+)?)h)?(?:(\d+(?:\.\d+)?)min)?(?:(\d+(?:\.\d+)?)s)?$/);
  if (m && (m[1] || m[2] || m[3])) {
    return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0);
  }
  return null;
}

// Point : (3 ; −2), 3;-2, A(3;-2). La virgule sert de séparateur seulement
// pour deux entiers, sinon c'est une virgule décimale.
export function lirePoint(saisie) {
  let s = String(saisie ?? '').trim().replace(/^[A-Za-z]\s*(?=\()/, '');
  s = s.replace(/^\(/, '').replace(/\)$/, '');
  let morceaux;
  if (s.includes(';')) morceaux = s.split(';');
  else if (/^\s*[+\-−]?\d+\s*,\s*[+\-−]?\d+\s*$/.test(s)) morceaux = s.split(',');
  else return null;
  if (morceaux.length !== 2) return null;
  const x = lireNombre(morceaux[0]);
  const y = lireNombre(morceaux[1]);
  return x === null || y === null ? null : { x, y };
}

export function normaliserTexte(s) {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[.!?;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------- Vérification ----------

const AIDE_SAISIE = {
  nombre: 'Écris un nombre, par exemple −12 ou 3,5.',
  fraction: 'Écris une fraction, par exemple 3/4 ou −5/2.',
  duree: 'Écris une durée, par exemple 1 h 45 min ou 105 min.',
  point: 'Écris des coordonnées, par exemple (3 ; −2).',
  qcm: 'Choisis une réponse.',
  'texte-court': 'Écris ta réponse.'
};

// Lit la saisie selon le type d'exercice. Renvoie la valeur ou null.
export function lire(exo, saisie) {
  switch (exo.type) {
    case 'nombre': return lireNombre(saisie, exo.unite);
    case 'fraction': {
      const f = lireFraction(saisie);
      if (f) return f;
      const x = lireNombre(saisie); // 0,75 accepté pour 3/4
      return x === null ? null : { decimal: x };
    }
    case 'duree': return lireDuree(saisie, exo.uniteDuree || 'min');
    case 'point': return lirePoint(saisie);
    case 'qcm':
    case 'texte-court': {
      const t = String(saisie ?? '').trim();
      return t ? t : null;
    }
    default: return null;
  }
}

function egalite(exo, valeur) {
  const tol = (exo.tolerance || 0) + 1e-9;
  const r = exo.reponse;
  switch (exo.type) {
    case 'nombre': return Math.abs(valeur - r) <= tol;
    case 'fraction': {
      if ('decimal' in valeur) return Math.abs(valeur.decimal - r.n / r.d) <= 1e-9;
      return valeur.n * r.d === r.n * valeur.d;
    }
    case 'duree': return Math.abs(valeur - r) <= Math.max(0.5, exo.tolerance || 0);
    case 'point': return Math.abs(valeur.x - r.x) <= tol && Math.abs(valeur.y - r.y) <= tol;
    case 'qcm': return valeur === String(r);
    case 'texte-court': {
      const attendues = Array.isArray(r) ? r : [r];
      return attendues.some(a => normaliserTexte(a) === normaliserTexte(valeur));
    }
    default: return false;
  }
}

/**
 * Vérifie une saisie.
 * Renvoie { valide, correct, presque, message, erreur }
 *  - valide : la saisie a pu être lue (sinon on redemande, sans pénalité)
 *  - presque : juste mais pas sous la forme demandée (fraction non simplifiée)
 *  - erreur : message d'erreur probable fourni par le générateur
 */
export function verifier(exo, saisie) {
  const valeur = lire(exo, saisie);
  if (valeur === null) {
    return { valide: false, correct: false, message: AIDE_SAISIE[exo.type] || 'Réponse illisible.' };
  }
  let correct = egalite(exo, valeur);

  if (correct && exo.type === 'fraction' && exo.simplifiee) {
    const irreductible = 'decimal' in valeur ? false : pgcd(valeur.n, valeur.d) === 1;
    if (!irreductible && !(exo.reponse.d === 1 && 'decimal' in valeur)) {
      return {
        valide: true, correct: false, presque: true, valeur,
        erreur: 'Ta fraction est égale à la bonne réponse, mais elle n\'est pas simplifiée.'
      };
    }
  }

  let erreur = null;
  if (!correct && Array.isArray(exo.erreurs)) {
    for (const e of exo.erreurs) {
      try {
        if (e.test(valeur)) { erreur = e.message; break; }
      } catch { /* test d'erreur mal formé : ignoré */ }
    }
  }
  return { valide: true, correct, presque: false, valeur, erreur };
}

// Réponse attendue sous forme lisible (correction, tests)
export function formaterReponse(exo) {
  const r = exo.reponse;
  switch (exo.type) {
    case 'nombre': return fmt(r);
    case 'fraction': return fmtFraction(r.n, r.d);
    case 'duree': return fmtDuree(r);
    case 'point': return `(${fmt(r.x)} ; ${fmt(r.y)})`;
    case 'texte-court': return Array.isArray(r) ? r[0] : String(r);
    default: return String(r);
  }
}
