// Générateur aléatoire reproductible (mulberry32).
// Une graine permet de rejouer exactement la même suite d'exercices (?seed=42).

export function creerRng(graine = graineAleatoire()) {
  let etat = graine >>> 0;

  // Nombre pseudo-aléatoire dans [0, 1[
  function next() {
    etat = (etat + 0x6d2b79f5) >>> 0;
    let t = etat;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  const rng = {
    graine,
    next,
    // Entier entre min et max inclus
    int(min, max) {
      return min + Math.floor(next() * (max - min + 1));
    },
    // Entier entre min et max inclus, en excluant certaines valeurs
    intSauf(min, max, exclus = [0]) {
      for (let i = 0; i < 1000; i++) {
        const n = rng.int(min, max);
        if (!exclus.includes(n)) return n;
      }
      throw new Error('intSauf : aucune valeur possible');
    },
    // Élément au hasard d'un tableau
    choix(tableau) {
      return tableau[Math.floor(next() * tableau.length)];
    },
    // Vrai avec une probabilité p
    bool(p = 0.5) {
      return next() < p;
    },
    // +1 ou -1
    signe() {
      return next() < 0.5 ? -1 : 1;
    },
    // Copie mélangée (Fisher-Yates)
    melanger(tableau) {
      const t = tableau.slice();
      for (let i = t.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [t[i], t[j]] = [t[j], t[i]];
      }
      return t;
    },
    // Choix pondéré : [[valeur, poids], ...]
    pondere(paires) {
      const total = paires.reduce((s, [, p]) => s + p, 0);
      let r = next() * total;
      for (const [valeur, poids] of paires) {
        r -= poids;
        if (r < 0) return valeur;
      }
      return paires[paires.length - 1][0];
    }
  };
  return rng;
}

export function graineAleatoire() {
  try {
    const t = new Uint32Array(1);
    crypto.getRandomValues(t);
    return t[0];
  } catch {
    return Math.floor(Math.random() * 4294967296);
  }
}

// Lit ?seed=... dans l'URL (null si absent ou invalide)
export function graineDepuisUrl() {
  try {
    const s = new URLSearchParams(location.search).get('seed');
    if (s === null || s === '') return null;
    const n = Number(s);
    return Number.isFinite(n) ? n >>> 0 : null;
  } catch {
    return null;
  }
}
