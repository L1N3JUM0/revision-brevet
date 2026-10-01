// Banque de contextes : prénoms et thèmes des énoncés, selon le profil.
// Environ 70 % des énoncés sur les thèmes favoris du profil, 30 % sur des thèmes neutres.
// Le « pack Anna » (prénoms des amies, JUL, handball…) est activé si le prénom est Anna ou avec ?profil=anna.

// Tous les thèmes proposés à l'onboarding (3 à 5 favoris)
export const THEMES = [
  { id: 'handball', nom: 'Handball', emoji: '🤾' },
  { id: 'foot', nom: 'Foot', emoji: '⚽' },
  { id: 'basket', nom: 'Basket', emoji: '🏀' },
  { id: 'sport', nom: 'Sport', emoji: '🏃' },
  { id: 'chevaux', nom: 'Chevaux', emoji: '🐴' },
  { id: 'animaux', nom: 'Animaux', emoji: '🐾' },
  { id: 'musique', nom: 'Musique', emoji: '🎵' },
  { id: 'mangas', nom: 'Mangas', emoji: '📖' },
  { id: 'jeux-video', nom: 'Jeux vidéo', emoji: '🎮' },
  { id: 'mode', nom: 'Mode', emoji: '👗' },
  { id: 'commerce', nom: 'Commerce', emoji: '🛍️' },
  { id: 'voitures', nom: 'Voitures', emoji: '🏎️' },
  { id: 'cuisine', nom: 'Cuisine', emoji: '🍳' },
  { id: 'voyages', nom: 'Voyages', emoji: '✈️' },
  { id: 'grece', nom: 'Grèce et mythologie', emoji: '🏛️' },
  { id: 'espace', nom: 'Espace', emoji: '🚀' },
  { id: 'records', nom: 'Records', emoji: '🏆' },
  { id: 'famille', nom: 'Famille et amis', emoji: '👨‍👩‍👧' }
];

// Thèmes « de respiration » : les 30 % d'énoncés hors favoris
export const THEMES_NEUTRES = ['espace', 'sport', 'jeux-video', 'cuisine', 'voyages', 'records', 'animaux'];

// Thèmes réservés au pack Anna : les énoncés qui les portent (JUL…) ne sortent jamais ailleurs
export const THEMES_RESERVES = ['rap'];

// Pack Anna : ses amies et ses centres d'intérêt (anciens contextes du site)
const PACK_ANNA = {
  prenoms: [
    { prenom: 'Louise', genre: 'f' },
    { prenom: 'Léona', genre: 'f' },
    { prenom: 'Soléa', genre: 'f' },
    { prenom: 'Ayline', genre: 'f' },
    { prenom: 'Basile', genre: 'm' },
    { prenom: 'Maud', genre: 'f' },
    { prenom: 'Julien', genre: 'm' }
  ],
  themes: ['handball', 'rap', 'mode', 'commerce', 'chevaux', 'grece', 'famille']
};

// Prénoms neutres et mixtes, pour tous les autres profils
const PRENOMS_MIXTES = [
  { prenom: 'Camille', genre: 'f' }, { prenom: 'Sacha', genre: 'm' }, { prenom: 'Inès', genre: 'f' },
  { prenom: 'Hugo', genre: 'm' }, { prenom: 'Lina', genre: 'f' }, { prenom: 'Adam', genre: 'm' },
  { prenom: 'Jade', genre: 'f' }, { prenom: 'Noah', genre: 'm' }, { prenom: 'Chloé', genre: 'f' },
  { prenom: 'Rayan', genre: 'm' }, { prenom: 'Zoé', genre: 'f' }, { prenom: 'Malo', genre: 'm' }
];

// Quelques données réalistes réutilisables par les générateurs
export const DONNEES = {
  handball: { terrain: { longueur: 40, largeur: 20 }, but: { largeur: 3, hauteur: 2 }, zone: 6 },
  villesGrecques: ['Athènes', 'Thessalonique', 'Delphes', 'Olympie', 'Sparte', 'Corinthe'],
  dieux: ['Zeus', 'Athéna', 'Hermès', 'Poséidon', 'Apollon', 'Artémis', 'Héra'],
  villesConcert: ['Marseille', 'Paris', 'Lyon', 'Toulouse', 'Nice', 'Montpellier', 'Bordeaux']
};

const norm = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Le pack Anna est actif si le prénom est Anna, ou s'il a été demandé (?profil=anna)
export function packActif(profil = {}) {
  return profil.pack === 'anna' || norm(profil.prenom) === 'anna';
}

// Profil complet (tous les champs ont une valeur par défaut)
export function normaliserProfil(profil) {
  const p = typeof profil === 'string' ? { prenom: profil } : (profil || {});
  const anna = packActif(p);
  const themes = Array.isArray(p.themes) ? p.themes.filter(t => THEMES.some(x => x.id === t)) : [];
  return {
    prenom: String(p.prenom || '').trim(),
    genre: ['f', 'm', 'n'].includes(p.genre) ? p.genre : (anna ? 'f' : 'n'),
    themes: anna ? [...new Set([...PACK_ANNA.themes, ...themes])] : themes,
    amis: Array.isArray(p.amis) ? p.amis.filter(a => a && a.prenom && ['f', 'm'].includes(a.genre)) : [],
    pack: anna ? 'anna' : null
  };
}

// « de Louise », mais « d'Anna », « d'Ayline » (élision devant une voyelle)
export function de(nom) {
  return /^[aeiouyàâäéèêëîïôöûü]/i.test(nom) ? `d'${nom}` : `de ${nom}`;
}

// Prénoms des personnages : le profil (sauf genre « peu importe »), ses amis, puis le pack ou la liste mixte
export function listePrenoms(profil) {
  const p = normaliserProfil(profil);
  const autres = [...p.amis, ...(p.pack === 'anna' ? PACK_ANNA.prenoms : PRENOMS_MIXTES)]
    .filter((x, i, t) => norm(x.prenom) !== norm(p.prenom) && t.findIndex(y => norm(y.prenom) === norm(x.prenom)) === i);
  const moi = p.prenom && p.genre !== 'n' ? [{ prenom: p.prenom, genre: p.genre }] : [];
  return { moi, autres };
}

// Éléments autorisés pour ce contexte : sans les thèmes réservés hors pack Anna
export function permis(ctx, liste, cle = 'themes') {
  return liste.filter(x => ctx.pack === 'anna' || !(x[cle] || []).some(t => THEMES_RESERVES.includes(t)));
}

/**
 * Choisit un élément d'une liste d'énoncés selon les thèmes du contexte :
 * d'abord le thème tiré, puis les autres favoris, puis les énoncés neutres, puis n'importe lequel.
 * Les énoncés des thèmes réservés (JUL…) ne sortent que dans le pack Anna.
 * cle : nom du champ qui porte les thèmes (par défaut « themes ») ; un élément sans thème est neutre.
 */
export function choisirSelonTheme(rng, ctx, liste, cle = 'themes') {
  const th = x => x[cle] || [];
  const ok = permis(ctx, liste, cle);
  for (const t of ctx.themes || [ctx.theme]) {
    const a = ok.filter(x => th(x).includes(t));
    if (a.length) return rng.choix(a);
  }
  const neutres = ok.filter(x => !th(x).length || th(x).some(t => THEMES_NEUTRES.includes(t)));
  return rng.choix(neutres.length ? neutres : ok);
}

/**
 * Tire un contexte pour un énoncé, à partir du profil (ou d'un simple prénom, pour compatibilité).
 * Renvoie { prenom, genre, ami, amiGenre, de, deAmi, theme, themes, central, pack, e(fem, masc), il() }
 *  - themes : ordre de préférence pour le repli (thème tiré, puis les autres favoris)
 *  - genre « peu importe » : le profil n'apparaît jamais à la 3e personne (on prend un autre prénom)
 */
export function tirerContexte(rng, profil = {}) {
  const p = normaliserProfil(profil);
  const favoris = p.themes.length ? p.themes : THEMES_NEUTRES;
  const central = rng.bool(0.7);
  const theme = central ? rng.choix(favoris) : rng.choix(THEMES_NEUTRES);
  const themes = [theme, ...rng.melanger(favoris.filter(t => t !== theme))];
  const { moi, autres } = listePrenoms(p);
  // Le profil apparaît plus souvent que les autres
  const principal = moi.length && rng.bool(0.4) ? moi[0] : rng.choix([...moi, ...autres]);
  const ami = rng.choix([...moi, ...autres].filter(x => x.prenom !== principal.prenom));
  return {
    prenom: principal.prenom,
    genre: principal.genre,
    ami: ami.prenom,
    amiGenre: ami.genre,
    de: de(principal.prenom),   // « d'Anna », « de Louise »
    deAmi: de(ami.prenom),
    theme,
    themes,
    central,
    pack: p.pack,
    e(fem = 'e', masc = '') {
      return principal.genre === 'f' ? fem : masc;
    },
    il() {
      return principal.genre === 'f' ? 'elle' : 'il';
    }
  };
}
