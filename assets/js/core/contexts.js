// Banque de contextes : prénoms et thèmes des énoncés.
// Environ 70 % des énoncés sur les centres d'intérêt, 30 % sur des thèmes de respiration.

// genre : 'f' ou 'm', pour accorder les phrases (« elle est partie »)
const PRENOMS = [
  { prenom: 'Anna', genre: 'f' },
  { prenom: 'Louise', genre: 'f' },
  { prenom: 'Léona', genre: 'f' },
  { prenom: 'Soléa', genre: 'f' },
  { prenom: 'Ayline', genre: 'f' },
  { prenom: 'Basile', genre: 'm' },
  { prenom: 'Maud', genre: 'f' },
  { prenom: 'Julien', genre: 'm' }
];

export const THEMES_CENTRAUX = [
  'handball', 'rap', 'mode', 'commerce', 'chevaux', 'grece', 'famille'
];

export const THEMES_RESPIRATION = [
  'espace', 'sport', 'jeux-video', 'cuisine', 'voyages', 'records', 'animaux'
];

// Quelques données réalistes réutilisables par les générateurs
export const DONNEES = {
  handball: { terrain: { longueur: 40, largeur: 20 }, but: { largeur: 3, hauteur: 2 }, zone: 6 },
  villesGrecques: ['Athènes', 'Thessalonique', 'Delphes', 'Olympie', 'Sparte', 'Corinthe'],
  dieux: ['Zeus', 'Athéna', 'Hermès', 'Poséidon', 'Apollon', 'Artémis', 'Héra'],
  villesConcert: ['Marseille', 'Paris', 'Lyon', 'Toulouse', 'Nice', 'Montpellier', 'Bordeaux']
};

// Liste des prénoms, « Anna » remplacé par le prénom du profil
export function listePrenoms(prenomProfil = '') {
  const p = String(prenomProfil || '').trim();
  if (!p || p.toLowerCase() === 'anna') return PRENOMS.slice();
  return PRENOMS
    .filter(x => x.prenom.toLowerCase() !== p.toLowerCase())
    .map(x => (x.prenom === 'Anna' ? { prenom: p, genre: 'f' } : x));
}

/**
 * Tire un contexte pour un énoncé.
 * Renvoie { prenom, genre, ami, theme, central, e(fem, masc) }
 *  - ami : un deuxième prénom différent, pour les énoncés à deux personnes
 *  - e('e') : accord selon le genre (« parti » + ctx.e('e'))
 */
export function tirerContexte(rng, prenomProfil = '') {
  const prenoms = listePrenoms(prenomProfil);
  const central = rng.bool(0.7);
  const theme = rng.choix(central ? THEMES_CENTRAUX : THEMES_RESPIRATION);
  // Le prénom du profil (ou Anna) apparaît plus souvent que les autres
  const principal = rng.bool(0.4) ? prenoms[0] : rng.choix(prenoms);
  const ami = rng.choix(prenoms.filter(x => x.prenom !== principal.prenom));
  return {
    prenom: principal.prenom,
    genre: principal.genre,
    ami: ami.prenom,
    amiGenre: ami.genre,
    theme,
    central,
    e(fem = 'e', masc = '') {
      return principal.genre === 'f' ? fem : masc;
    },
    il() {
      return principal.genre === 'f' ? 'elle' : 'il';
    }
  };
}
