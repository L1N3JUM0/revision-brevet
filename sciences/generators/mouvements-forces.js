// Physique-Chimie — Mouvements et interactions : nature d'un mouvement, vitesse, forces, poids.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';
import { chronophoto } from './figures.js';

// Intensité de la pesanteur (N/kg)
const ASTRES = [
  { nom: 'la Terre', g: 9.8 },
  { nom: 'la Lune', g: 1.6 },
  { nom: 'Mars', g: 3.7 }
];

// Objets dont on calcule le poids (masses réalistes, en kg)
const OBJETS = [
  { themes: ['espace', 'records'], nom: 'Un astronaute avec sa combinaison', m: [100, 160, 5] },
  { themes: ['chevaux', 'animaux'], nom: 'Un cheval', m: [400, 600, 10] },
  { themes: ['chevaux'], nom: 'Une selle', m: [8, 14, 1] },
  { themes: ['handball', 'sport'], nom: 'Un sac de ballons de handball', m: [3, 6, 0.5] },
  { themes: ['rap', 'commerce'], nom: 'Une enceinte de concert', m: [20, 60, 5] },
  { themes: ['famille', 'mode', 'voyages'], nom: 'Une valise', m: [10, 23, 1] },
  { themes: ['cuisine'], nom: 'Un sac de farine', m: [1, 25, 1] },
  { themes: ['espace', 'jeux-video', 'grece'], nom: 'Un robot d\'exploration', m: [150, 1000, 50] }
];

function tirerObjet(rng, ctx) {
  const adaptes = OBJETS.filter(o => o.themes.includes(ctx.theme));
  const o = rng.choix(adaptes.length ? adaptes : OBJETS);
  const [min, max, p] = o.m;
  return { nom: o.nom, m: net(min + p * rng.int(0, Math.round((max - min) / p))) };
}

// ---------- Nature du mouvement (chronophotographie) ----------

function calcNature(rng) {
  const nature = rng.choix(['uniforme', 'accéléré', 'ralenti']);
  const n = 6;
  const d0 = rng.int(3, 6);
  const pas = rng.int(2, 3);
  const ecarts = Array.from({ length: n - 1 }, (_, k) => (nature === 'uniforme' ? d0 + 2 : nature === 'accéléré' ? d0 + k * pas : d0 + (n - 2 - k) * pas));
  const positions = ecarts.reduce((acc, e) => [...acc, acc[acc.length - 1] + e], [0]);
  const objet = rng.choix(['Un ballon de handball', 'Une voiture', 'Un cheval au galop', 'Une bille', 'Un skateur', 'Une fusée au décollage']);
  return {
    cle: `nature:${nature}:${ecarts.join(',')}`,
    enonce: `<p>Voici la chronophotographie d'un objet (${objet.toLowerCase()}) : ses positions sont prises à intervalles de temps égaux.</p><p><strong>Le mouvement est…</strong></p>`,
    figure: chronophoto(positions, { legende: 'sens du mouvement' }),
    type: 'qcm',
    choix: ['Rectiligne uniforme', 'Rectiligne accéléré', 'Rectiligne ralenti'],
    reponse: `Rectiligne ${nature}`,
    etapes: [
      'Les positions sont alignées : le mouvement est <strong>rectiligne</strong>.',
      nature === 'uniforme'
        ? 'Les points sont <strong>régulièrement espacés</strong> : l\'objet parcourt la même distance pendant chaque intervalle. La vitesse est constante : mouvement ' + gras('uniforme') + '.'
        : nature === 'accéléré'
          ? 'Les écarts entre les points <strong>augmentent</strong> : la vitesse augmente, mouvement ' + gras('accéléré') + '.'
          : 'Les écarts entre les points <strong>diminuent</strong> : la vitesse diminue, mouvement ' + gras('ralenti') + '.'
    ],
    erreurs: [],
    donnees: { ecarts }
  };
}

// Vitesse à partir d'une chronophotographie (distance entre deux images et durée)
function calcVitesseImages(rng) {
  const dt = rng.choix([0.1, 0.2, 0.25, 0.5]);
  const v = rng.choix([1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]);
  const dcm = net(v * dt * 100);
  const dm = net(dcm / 100);
  const err = erreursNombre(v);
  err.ajouter(net(dcm / dt), `La distance doit être en <strong>mètres</strong> : ${fmt(dcm)} cm = ${fmt(dm)} m.`);
  err.ajouter(net(dt / dm), 'La vitesse, c\'est la distance ÷ la durée, pas l\'inverse.');
  err.ajouter(net(dm * dt), 'On <strong>divise</strong> la distance par la durée.');
  return {
    cle: `vimages:${dt}:${v}`,
    enonce: `<p>Sur une chronophotographie, les images sont prises toutes les ${fmt(dt)} s. Entre deux images, la balle parcourt ${fmt(dcm)} cm.</p>
      <p><strong>Quelle est sa vitesse, en m/s ?</strong></p>`,
    type: 'nombre',
    unite: 'm/s',
    reponse: v,
    etapes: [
      'Formule : <strong>v = d ÷ t</strong>, avec d en m et t en s pour obtenir des m/s.',
      `d = ${fmt(dcm)} cm = ${fmt(dm)} m.`,
      `v = ${fmt(dm)} ÷ ${fmt(dt)} = ${gras(fmt(v))} m/s`
    ],
    erreurs: err.liste(),
    expression: `${fmt(dm)} ÷ ${fmt(dt)}`
  };
}

// ---------- Poids ----------

function calcPoids(rng, ctx, niveau) {
  const { nom, m } = tirerObjet(rng, ctx);
  const astre = niveau === 1 ? ASTRES[0] : rng.choix(ASTRES);
  const P = net(m * astre.g);
  const err = erreursNombre(P);
  err.ajouter(m, 'Ça, c\'est la masse (en kg). Le poids, en newtons, vaut P = m × g.');
  err.ajouter(net(m / astre.g), 'On <strong>multiplie</strong> la masse par g : P = m × g.');
  if (astre !== ASTRES[0]) err.ajouter(net(m * 9.8), `Ça, c'est le poids sur Terre. Sur ${astre.nom}, g = ${fmt(astre.g)} N/kg.`);
  return {
    cle: `poids:${nom}:${m}:${astre.nom}`,
    enonce: `<p>${nom} a une masse de ${fmt(m)} kg.</p><p>Sur ${astre.nom}, g = ${fmt(astre.g)} N/kg.</p><p><strong>Calcule son poids sur ${astre.nom}, en newtons (N).</strong></p>`,
    type: 'nombre',
    unite: 'N',
    reponse: P,
    etapes: [
      'Formule : <strong>P = m × g</strong> (m en kg, g en N/kg, P en N).',
      `P = ${fmt(m)} × ${fmt(astre.g)} = ${gras(fmt(P))} N`
    ],
    erreurs: err.liste(),
    expression: `${fmt(m)} × ${fmt(astre.g)}`
  };
}

// Masse à partir du poids, ou piège : la masse ne change pas d'un astre à l'autre
function calcMasse(rng, ctx) {
  const { nom, m } = tirerObjet(rng, ctx);
  if (rng.bool(0.4)) {
    const astre = rng.choix(ASTRES.slice(1));
    const err = erreursNombre(m);
    err.ajouter(net(m * astre.g), 'C\'est le <strong>poids</strong> qui change, pas la masse.');
    err.ajouter(net(m * 1.6 / 9.8), 'La masse (quantité de matière) ne dépend pas de l\'astre : seul le poids change.');
    return {
      cle: `piege:${nom}:${m}:${astre.nom}`,
      enonce: `<p>${nom} a une masse de ${fmt(m)} kg sur Terre. On l'emmène sur ${astre.nom}.</p><p><strong>Quelle est sa masse sur ${astre.nom}, en kg ?</strong></p>`,
      type: 'nombre',
      unite: 'kg',
      reponse: m,
      etapes: [
        'La <strong>masse</strong> mesure la quantité de matière : elle est la même partout.',
        `Sur ${astre.nom}, la masse vaut toujours ${gras(fmt(m))} kg. C'est le <strong>poids</strong> (en N) qui change.`
      ],
      erreurs: err.liste()
    };
  }
  const P = net(m * 9.8);
  const err = erreursNombre(m);
  err.ajouter(net(P * 9.8), 'Pour retrouver la masse, on <strong>divise</strong> le poids par g : m = P ÷ g.');
  return {
    cle: `masse:${nom}:${m}`,
    enonce: `<p>Sur Terre (g = 9,8 N/kg), le poids ${nom.replace(/^Un /, 'd\'un ').replace(/^Une /, 'd\'une ')} vaut ${fmt(P)} N.</p><p><strong>Quelle est sa masse, en kg ?</strong></p>`,
    type: 'nombre',
    unite: 'kg',
    reponse: m,
    etapes: [
      'De P = m × g, on tire <strong>m = P ÷ g</strong>.',
      `m = ${fmt(P)} ÷ 9,8 = ${gras(fmt(m))} kg`
    ],
    erreurs: err.liste(),
    expression: `${fmt(P)} ÷ 9,8`
  };
}

export const banque = {
  id: 'mouvements-forces',
  titre: 'Mouvements et forces',
  discipline: 'pc',
  resume: 'Décrire un mouvement, vitesse, interactions, poids et masse.',
  essentiel: [
    'Un mouvement se décrit <strong>par rapport à un référentiel</strong> : assise dans le train, tu es immobile par rapport au wagon mais en mouvement par rapport au quai.',
    'Trajectoire <strong>rectiligne</strong> (droite), <strong>circulaire</strong> (cercle) ou <strong>curviligne</strong>. Vitesse <strong>constante</strong> (uniforme), qui augmente (accéléré) ou qui diminue (ralenti).',
    'Une <strong>action mécanique</strong> se modélise par une <strong>force</strong> : direction, sens, valeur (en newtons, N) et point d\'application. Elle peut être de contact ou à distance.',
    'Le <strong>poids</strong> P est la force d\'attraction de la Terre sur un objet : P = m × g, avec g = 9,8 N/kg sur Terre. Vertical, vers le bas.',
    'La <strong>masse</strong> (en kg) est la même partout ; le <strong>poids</strong> (en N) dépend de l\'astre : sur la Lune, il est environ 6 fois plus faible.'
  ],
  formules: [
    { nom: 'Vitesse', formule: 'v = d ÷ t', unites: 'd en m, t en s → v en m/s · d en km, t en h → v en km/h' },
    { nom: 'Poids', formule: 'P = m × g', unites: 'm en kg, g en N/kg, P en N · g = 9,8 N/kg sur Terre, 1,6 N/kg sur la Lune' }
  ],
  vocabulaire: [
    { mot: 'Référentiel', definition: 'Objet de référence par rapport auquel on décrit un mouvement.' },
    { mot: 'Trajectoire', definition: 'Ensemble des positions successives occupées par un point d\'un objet en mouvement.' },
    { mot: 'Mouvement uniforme', definition: 'Mouvement dont la vitesse reste constante.' },
    { mot: 'Force', definition: 'Modélisation d\'une action mécanique, caractérisée par une direction, un sens, une valeur et un point d\'application.' },
    { mot: 'Newton', definition: 'Unité de la valeur d\'une force (symbole N).' },
    { mot: 'Dynamomètre', definition: 'Appareil qui mesure la valeur d\'une force.' },
    { mot: 'Poids', definition: 'Force d\'attraction exercée par un astre sur un objet, verticale et vers le bas sur Terre.' },
    { mot: 'Gravitation', definition: 'Attraction à distance qui s\'exerce entre deux objets qui ont une masse.' }
  ],
  questions: [
    { q: 'Quelle est l\'unité du poids ?', bonne: 'Le newton (N)', fausses: ['Le kilogramme (kg)', 'Le gramme (g)', 'Le N/kg'], explication: 'Le poids est une force : il s\'exprime en newtons. La masse, elle, s\'exprime en kg.', niveau: 1 },
    { q: 'Avec quel instrument mesure-t-on un poids ?', bonne: 'Un dynamomètre', fausses: ['Une balance', 'Un chronomètre', 'Un thermomètre'], explication: 'La balance mesure une masse (kg) ; le dynamomètre mesure une force (N).', niveau: 1 },
    { q: 'Quelle est la direction du poids ?', bonne: 'Verticale, vers le bas', fausses: ['Horizontale', 'Verticale, vers le haut', 'Dans le sens du mouvement'], explication: 'Le poids est dirigé vers le centre de la Terre.', niveau: 1 },
    { q: 'Assise dans un bus qui roule, par rapport à quoi es-tu immobile ?', bonne: 'Par rapport au bus', fausses: ['Par rapport à la route', 'Par rapport aux arbres', 'Par rapport à un piéton sur le trottoir'], explication: 'Un mouvement dépend du référentiel choisi : immobile par rapport au bus, en mouvement par rapport à la route.', niveau: 2 },
    { q: 'La trajectoire d\'un point d\'une roue de manège, vue du sol, est…', bonne: 'Circulaire', fausses: ['Rectiligne', 'Immobile', 'En zigzag'], niveau: 1 },
    { q: 'Sur la Lune, le poids d\'un astronaute est…', bonne: 'Environ 6 fois plus petit que sur Terre', fausses: ['Le même que sur Terre', 'Plus grand que sur Terre', 'Nul'], explication: 'g vaut 1,6 N/kg sur la Lune contre 9,8 N/kg sur Terre : 9,8 ÷ 1,6 ≈ 6.', niveau: 2 },
    { q: 'De quoi dépend la force de gravitation entre deux objets ?', bonne: 'De leurs masses et de la distance entre eux', fausses: ['De leur couleur', 'De leur vitesse uniquement', 'De leur température'], explication: 'Plus les masses sont grandes et plus les objets sont proches, plus l\'attraction est forte.', niveau: 3 },
    { q: 'Qu\'est-ce qui maintient la Lune en orbite autour de la Terre ?', bonne: 'L\'attraction gravitationnelle de la Terre', fausses: ['Le vent solaire', 'Le champ magnétique de la Lune', 'Rien : elle s\'éloigne en ligne droite'], niveau: 3 },
    { q: 'Quelles sont les caractéristiques d\'une force ?', bonne: 'Direction, sens, valeur, point d\'application', fausses: ['Masse, volume, couleur, forme', 'Vitesse, durée, distance, trajectoire', 'Longueur, largeur, hauteur, poids'], niveau: 2 },
    { q: 'Que se passe-t-il si aucune force n\'agit sur un objet en mouvement (ou si elles se compensent) ?', bonne: 'Il garde un mouvement rectiligne uniforme', fausses: ['Il s\'arrête aussitôt', 'Il accélère', 'Il tourne en rond'], explication: 'C\'est le principe d\'inertie : sans force (ou avec des forces qui se compensent), la vitesse ne change pas.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'La masse d\'un objet est plus petite sur la Lune que sur Terre.', vrai: false, explication: 'La masse est la même partout. C\'est le poids qui est plus petit sur la Lune.' },
    { texte: 'Un aimant agit à distance sur un clou en fer.', vrai: true, explication: 'C\'est une action à distance, comme le poids.' },
    { texte: 'Un mouvement peut être à la fois rectiligne et accéléré.', vrai: true, explication: 'Une voiture qui démarre en ligne droite a un mouvement rectiligne accéléré.' },
    { texte: 'Le poids s\'exprime en kilogrammes.', vrai: false, explication: 'Le poids est une force : il s\'exprime en newtons (N).' }
  ],
  classements: [{
    question: 'Action de contact ou à distance ?',
    groupes: [
      { nom: 'De contact', items: ['Le pied qui frappe le ballon', 'Le sol qui soutient un cheval', 'Le vent qui pousse un voilier', 'La main qui lance le ballon de handball', 'La corde qui tire un seau'], explication: 'Les deux objets se touchent.' },
      { nom: 'À distance', items: ['La Terre qui attire une pomme', 'Un aimant qui attire un clou', 'La Terre qui attire la Lune', 'Un ballon frotté qui attire des cheveux', 'Le Soleil qui attire la Terre'], explication: 'Les objets agissent l\'un sur l\'autre sans se toucher.' }
    ]
  }],
  calculs: { nature: calcNature, vitesse: calcVitesseImages, poids: calcPoids, masse: calcMasse },
  modeles: {
    1: [['calc:nature', 3], ['calc:poids', 3], ['classement', 2], ['qcm', 3], ['vf', 1], ['vocMot', 1]],
    2: [['calc:nature', 2], ['calc:poids', 2], ['calc:masse', 2], ['calc:vitesse', 2], ['classement', 1], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:poids', 2], ['calc:masse', 2], ['calc:vitesse', 3], ['qcm', 3]]
  },
  controler(exo) {
    if (exo.cle.startsWith('nature:')) {
      const e = exo.donnees.ecarts;
      const montant = e.every((x, k) => k === 0 || x > e[k - 1]);
      const descendant = e.every((x, k) => k === 0 || x < e[k - 1]);
      const constant = e.every(x => x === e[0]);
      const attendu = constant ? 'uniforme' : montant ? 'accéléré' : descendant ? 'ralenti' : '?';
      return exo.reponse === `Rectiligne ${attendu}` ? null : 'nature du mouvement incohérente';
    }
    return null;
  }
};

export default fabriquer(banque);
