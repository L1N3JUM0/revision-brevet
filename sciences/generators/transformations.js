// Physique-Chimie — Transformations chimiques : réactifs et produits, conservation de la masse,
// équations ajustées, combustions.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';

// Équations ajustées : [coefficient, formule, composition]
const EQUATIONS = [
  { nom: 'combustion du carbone', r: [[1, 'C', { C: 1 }], [1, 'O₂', { O: 2 }]], p: [[1, 'CO₂', { C: 1, O: 2 }]] },
  { nom: 'combustion du méthane', r: [[1, 'CH₄', { C: 1, H: 4 }], [2, 'O₂', { O: 2 }]], p: [[1, 'CO₂', { C: 1, O: 2 }], [2, 'H₂O', { H: 2, O: 1 }]] },
  { nom: 'combustion du propane', r: [[1, 'C₃H₈', { C: 3, H: 8 }], [5, 'O₂', { O: 2 }]], p: [[3, 'CO₂', { C: 1, O: 2 }], [4, 'H₂O', { H: 2, O: 1 }]] },
  { nom: 'combustion du butane', r: [[2, 'C₄H₁₀', { C: 4, H: 10 }], [13, 'O₂', { O: 2 }]], p: [[8, 'CO₂', { C: 1, O: 2 }], [10, 'H₂O', { H: 2, O: 1 }]] },
  { nom: 'combustion du dihydrogène', r: [[2, 'H₂', { H: 2 }], [1, 'O₂', { O: 2 }]], p: [[2, 'H₂O', { H: 2, O: 1 }]] },
  { nom: 'combustion incomplète du carbone', r: [[2, 'C', { C: 1 }], [1, 'O₂', { O: 2 }]], p: [[2, 'CO', { C: 1, O: 1 }]] },
  { nom: 'oxydation du cuivre', r: [[2, 'Cu', { Cu: 1 }], [1, 'O₂', { O: 2 }]], p: [[2, 'CuO', { Cu: 1, O: 1 }]] },
  { nom: 'réaction du fer avec le soufre', r: [[1, 'Fe', { Fe: 1 }], [1, 'S', { S: 1 }]], p: [[1, 'FeS', { Fe: 1, S: 1 }]] },
  { nom: 'combustion de l\'éthanol', r: [[1, 'C₂H₆O', { C: 2, H: 6, O: 1 }], [3, 'O₂', { O: 2 }]], p: [[2, 'CO₂', { C: 1, O: 2 }], [3, 'H₂O', { H: 2, O: 1 }]] }
];

const terme = ([c, f]) => (c === 1 ? f : `${c} ${f}`);
const ecrire = eq => `${eq.r.map(terme).join(' + ')} → ${eq.p.map(terme).join(' + ')}`;

// Nombre d'atomes de chaque élément d'un côté de l'équation
function compter(cote) {
  const n = {};
  for (const [c, , comp] of cote) for (const [s, k] of Object.entries(comp)) n[s] = (n[s] || 0) + c * k;
  return n;
}
export function estAjustee(eq) {
  const a = compter(eq.r), b = compter(eq.p);
  return Object.keys({ ...a, ...b }).every(s => a[s] === b[s]);
}

// Coefficient manquant dans une équation
function calcAjuster(rng) {
  const eq = rng.choix(EQUATIONS);
  const tous = [...eq.r.map((t, i) => ['r', i, t]), ...eq.p.map((t, i) => ['p', i, t])];
  // On cache un coefficient différent de 1 de préférence (sinon la question est triviale)
  const candidats = tous.filter(([, , t]) => t[0] > 1);
  const [cote, i, t] = rng.choix(candidats.length ? candidats : tous);
  const masque = side => eq[side].map((x, j) => (side === cote && j === i ? `… ${x[1]}` : terme(x))).join(' + ');
  const comptes = (side) => Object.entries(compter(eq[side])).map(([s, k]) => `${k} ${s}`).join(', ');
  return {
    cle: `ajuster:${eq.nom}:${cote}${i}`,
    enonce: `<p>Équation de la ${eq.nom} :</p><p class="calcul">${masque('r')} → ${masque('p')}</p><p><strong>Quel nombre faut-il écrire à la place des pointillés ?</strong></p>`,
    type: 'nombre',
    reponse: t[0],
    etapes: [
      'Une équation est <strong>ajustée</strong> quand il y a autant d\'atomes de chaque sorte à gauche (réactifs) et à droite (produits).',
      `Équation ajustée : <span class="calcul-inline">${ecrire(eq)}</span>`,
      `Réactifs : ${comptes('r')}. Produits : ${comptes('p')}. Le coefficient manquant est ${gras(fmt(t[0]))}.`
    ],
    erreurs: [],
    donnees: { nom: eq.nom, cote, i }
  };
}

// Masses (g) pour une mole des espèces utilisées, arrondies comme dans les manuels
const REACTIONS_MASSES = [
  { nom: 'du carbone', texte: 'Le carbone brûle dans le dioxygène et forme du dioxyde de carbone.', especes: [['carbone', 12], ['dioxygène', 32]], produits: [['dioxyde de carbone', 44]] },
  { nom: 'fer-soufre', texte: 'En chauffant un mélange de fer et de soufre, on obtient du sulfure de fer.', especes: [['fer', 56], ['soufre', 32]], produits: [['sulfure de fer', 88]] },
  { nom: 'du méthane', texte: 'Le méthane du gaz de ville brûle dans le dioxygène et forme du dioxyde de carbone et de l\'eau.', especes: [['méthane', 16], ['dioxygène', 64]], produits: [['dioxyde de carbone', 44], ['eau', 36]] }
];

function calcMasse(rng, ctx) {
  const R = rng.choix(REACTIONS_MASSES);
  const k = rng.choix([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
  const m = x => net(x * k);
  const totalR = R.especes.reduce((s, [, x]) => s + m(x), 0);
  const donnes = R.especes.map(([n, x]) => `${fmt(m(x))} g de ${n}`).join(' et ');
  if (R.produits.length === 1 || rng.bool(0.4)) {
    // Masse totale des produits = masse totale des réactifs
    const p = R.produits.length === 1 ? R.produits[0][0] : 'produits (dioxyde de carbone et eau)';
    const err = erreursNombre(totalR);
    err.ajouter(m(R.especes[0][1]), 'Le dioxygène (ou l\'autre réactif) compte aussi : on additionne les masses de <strong>tous</strong> les réactifs.');
    err.ajouter(m(R.especes[1][1]), 'On additionne les masses de <strong>tous</strong> les réactifs.');
    return {
      cle: `masse:${R.nom}:${k}:total`,
      enonce: `<p>${R.texte}</p><p>${donnes} réagissent entièrement.</p><p><strong>Quelle masse de ${p} obtient-on, en g ?</strong></p>`,
      type: 'nombre',
      unite: 'g',
      reponse: totalR,
      etapes: [
        'Lors d\'une transformation chimique, <strong>la masse totale se conserve</strong> : les atomes se réarrangent, aucun ne disparaît.',
        `Masse des produits = masse des réactifs = ${R.especes.map(([, x]) => fmt(m(x))).join(' + ')} = ${gras(fmt(totalR))} g`
      ],
      erreurs: err.liste(),
      expression: R.especes.map(([, x]) => fmt(m(x))).join(' + ')
    };
  }
  // Méthane : masse d'eau connaissant celle du dioxyde de carbone
  const [[pa, xa], [pb, xb]] = R.produits;
  const r = m(xb);
  const err = erreursNombre(r);
  err.ajouter(totalR, 'Ça, c\'est la masse de <strong>tous</strong> les produits. Retire celle du dioxyde de carbone.');
  return {
    cle: `masse:${R.nom}:${k}:eau`,
    enonce: `<p>${R.texte}</p><p>${donnes} réagissent entièrement. Il se forme ${fmt(m(xa))} g de ${pa}.</p><p><strong>Quelle masse d'${pb} se forme-t-il, en g ?</strong></p>`,
    type: 'nombre',
    unite: 'g',
    reponse: r,
    etapes: [
      'La masse se conserve : masse des réactifs = masse des produits.',
      `Masse des réactifs : ${fmt(m(R.especes[0][1]))} + ${fmt(m(R.especes[1][1]))} = ${fmt(totalR)} g.`,
      `Masse d'${pb} : ${fmt(totalR)} − ${fmt(m(xa))} = ${gras(fmt(r))} g`
    ],
    erreurs: err.liste(),
    expression: `${fmt(totalR)} − ${fmt(m(xa))}`
  };
}

// Lire une équation : réactifs ou produits ?
function calcLire(rng) {
  const eq = rng.choix(EQUATIONS.filter(e => e.p.length + e.r.length >= 3));
  const cote = rng.choix(['r', 'p']);
  const especes = [...eq.r, ...eq.p].map(t => t[1]);
  const bonne = eq[cote].map(t => t[1]).join(' et ');
  const autre = eq[cote === 'r' ? 'p' : 'r'].map(t => t[1]).join(' et ');
  const faux = rng.melanger(especes).slice(0, 2).join(' et ');
  const choix = [...new Set([bonne, autre, faux, especes.join(' et ')])];
  return {
    cle: `lire:${eq.nom}:${cote}`,
    enonce: `<p class="calcul">${ecrire(eq)}</p><p><strong>Quels sont les ${cote === 'r' ? 'réactifs' : 'produits'} de cette transformation ?</strong></p>`,
    type: 'qcm',
    choix: rng.melanger(choix),
    reponse: bonne,
    etapes: [
      'Les <strong>réactifs</strong> sont à gauche de la flèche (ils sont consommés), les <strong>produits</strong> à droite (ils se forment).',
      `${cote === 'r' ? 'Réactifs' : 'Produits'} : ${gras(bonne)}.`
    ],
    erreurs: [{ test: r => r === autre, message: `Inversé : à ${cote === 'r' ? 'droite' : 'gauche'} de la flèche, ce sont les ${cote === 'r' ? 'produits' : 'réactifs'}.` }]
  };
}

export const banque = {
  id: 'transformations',
  titre: 'Transformations chimiques',
  discipline: 'pc',
  resume: 'Réactifs et produits, conservation de la masse, équations, combustions.',
  essentiel: [
    'Lors d\'une <strong>transformation chimique</strong>, des espèces disparaissent (les <strong>réactifs</strong>) et de nouvelles apparaissent (les <strong>produits</strong>).',
    'Les atomes se <strong>réarrangent</strong> : aucun ne disparaît, aucun n\'apparaît. Donc <strong>la masse totale se conserve</strong>.',
    'Une équation est <strong>ajustée</strong> quand chaque sorte d\'atome est présente en même nombre de chaque côté : CH₄ + 2 O₂ → CO₂ + 2 H₂O.',
    'Une <strong>combustion</strong> a besoin d\'un combustible et de dioxygène (le comburant). Celle d\'un composé carboné produit du dioxyde de carbone et de l\'eau.',
    'Sans assez de dioxygène, la combustion est <strong>incomplète</strong> : elle produit du monoxyde de carbone (CO), un gaz toxique et inodore.'
  ],
  cartes: [{
    titre: 'Physique ou chimique ?',
    contenu: `<ul>
      <li><strong>Transformation physique</strong> : les espèces restent les mêmes (changement d'état, dissolution, broyage).</li>
      <li><strong>Transformation chimique</strong> : de nouvelles espèces se forment (combustion, rouille, cuisson, réaction d'un acide sur un métal).</li>
      <li>Indices d'une transformation chimique : gaz qui se dégage, changement de couleur, chaleur, précipité.</li></ul>`
  }],
  vocabulaire: [
    { mot: 'Réactif', definition: 'Espèce chimique consommée au cours d\'une transformation chimique.' },
    { mot: 'Produit', definition: 'Espèce chimique qui se forme au cours d\'une transformation chimique.' },
    { mot: 'Combustible', definition: 'Espèce qui brûle (bois, gaz, essence, carbone…).' },
    { mot: 'Comburant', definition: 'Espèce qui permet la combustion, en général le dioxygène de l\'air.' },
    { mot: 'Équation de réaction', definition: 'Écriture symbolique d\'une transformation chimique, avec les formules des réactifs et des produits.' },
    { mot: 'Combustion incomplète', definition: 'Combustion avec trop peu de dioxygène, qui produit du monoxyde de carbone toxique.' },
    { mot: 'Coefficient', definition: 'Nombre placé devant une formule pour ajuster une équation.' }
  ],
  questions: [
    { q: 'Quel gaz trouble l\'eau de chaux ?', bonne: 'Le dioxyde de carbone', fausses: ['Le dioxygène', 'Le diazote', 'Le dihydrogène', 'La vapeur d\'eau'], explication: 'C\'est le test du dioxyde de carbone (CO₂).', niveau: 1 },
    { q: 'Que produit la combustion complète du méthane ?', bonne: 'Du dioxyde de carbone et de l\'eau', fausses: ['Du dioxygène et de l\'eau', 'Du carbone et du dihydrogène', 'Du monoxyde de carbone seulement'], explication: 'CH₄ + 2 O₂ → CO₂ + 2 H₂O.', niveau: 2 },
    { q: 'Pourquoi une chaudière mal réglée est-elle dangereuse ?', bonne: 'Elle peut produire du monoxyde de carbone', fausses: ['Elle produit trop de dioxygène', 'Elle produit de l\'eau', 'Elle consomme du dioxyde de carbone'], explication: 'Une combustion incomplète produit du monoxyde de carbone (CO), toxique et sans odeur : d\'où les détecteurs de CO.', niveau: 2 },
    { q: 'Quel est le comburant dans la combustion du bois ?', bonne: 'Le dioxygène', fausses: ['Le bois', 'Le dioxyde de carbone', 'La flamme'], explication: 'Le bois est le combustible ; le dioxygène de l\'air est le comburant.', niveau: 1 },
    { q: 'Dans une bouteille ouverte, on mélange vinaigre et bicarbonate : la masse affichée par la balance…', bonne: 'Diminue, car un gaz s\'échappe', fausses: ['Augmente', 'Reste la même', 'Devient nulle'], explication: 'Le dioxyde de carbone formé s\'échappe. Dans une bouteille fermée, la masse resterait constante : la masse se conserve.', niveau: 3 },
    { q: 'Lors d\'une transformation chimique, qu\'est-ce qui se conserve ?', bonne: 'Les atomes et la masse totale', fausses: ['Les molécules', 'Le volume', 'Les espèces chimiques'], explication: 'Les molécules sont cassées et reformées autrement, mais les atomes restent les mêmes.', niveau: 2 },
    { q: 'Pour éteindre un feu, on peut…', bonne: 'Le priver de dioxygène', fausses: ['Ajouter du combustible', 'Souffler de l\'air pur dessus', 'Le chauffer davantage'], explication: 'Il faut supprimer un élément du triangle du feu : combustible, comburant (dioxygène) ou chaleur.', niveau: 1 },
    { q: 'Quels sont les trois éléments du triangle du feu ?', bonne: 'Combustible, comburant, chaleur', fausses: ['Bois, eau, air', 'Flamme, fumée, cendres', 'Dioxygène, eau, dioxyde de carbone'], niveau: 2 },
    { q: 'L\'équation CH₄ + O₂ → CO₂ + 2 H₂O n\'est pas ajustée. Pourquoi ?', bonne: 'Il y a 4 atomes O à droite et 2 à gauche', fausses: ['Il y a trop de carbone à droite', 'Il manque de l\'hydrogène à droite', 'Il faudrait écrire CO à la place de CO₂'], explication: 'À droite : 2 (dans CO₂) + 2 × 1 (dans 2 H₂O) = 4 atomes O. Il faut 2 O₂ à gauche.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'La rouille du fer est une transformation chimique.', vrai: true, explication: 'Le fer réagit avec le dioxygène et l\'eau : une nouvelle espèce (la rouille) se forme.' },
    { texte: 'Lors d\'une combustion, la matière disparaît.', vrai: false, explication: 'Les atomes se réarrangent en gaz (CO₂, eau) qui partent dans l\'air : la masse se conserve.' },
    { texte: 'Faire fondre du chocolat est une transformation chimique.', vrai: false, explication: 'C\'est un changement d\'état (fusion) : une transformation physique.' },
    { texte: 'Le monoxyde de carbone est un gaz toxique et sans odeur.', vrai: true, explication: 'Il est produit par les combustions incomplètes : il faut aérer et entretenir les appareils de chauffage.' },
    { texte: 'Dans une équation, les réactifs sont écrits à droite de la flèche.', vrai: false, explication: 'Les réactifs sont à gauche, les produits à droite.' }
  ],
  classements: [{
    question: 'Transformation physique ou chimique ?',
    groupes: [
      { nom: 'Physique', items: ['Un glaçon qui fond', 'Du sucre qui se dissout dans le thé', 'De l\'eau qui bout', 'Du sel broyé en poudre fine', 'La buée sur une vitre froide'], explication: 'Les espèces chimiques restent les mêmes.' },
      { nom: 'Chimique', items: ['Une bougie qui brûle', 'Un clou qui rouille', 'Un gâteau qui cuit', 'Du calcaire attaqué par du vinaigre', 'Une pomme coupée qui brunit'], explication: 'De nouvelles espèces chimiques se forment.' }
    ]
  }],
  calculs: { ajuster: calcAjuster, masse: calcMasse, lire: calcLire },
  modeles: {
    1: [['calc:lire', 3], ['classement', 3], ['calc:masse', 2], ['qcm', 3], ['vf', 2], ['vocMot', 1]],
    2: [['calc:masse', 3], ['calc:ajuster', 3], ['classement', 1], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:ajuster', 4], ['calc:masse', 3], ['qcm', 3]]
  },
  controler(exo) {
    if (exo.cle.startsWith('ajuster:')) {
      const eq = EQUATIONS.find(e => e.nom === exo.donnees.nom);
      if (!estAjustee(eq)) return `équation non ajustée : ${eq.nom}`;
      return eq[exo.donnees.cote][exo.donnees.i][0] === exo.reponse ? null : 'coefficient incohérent';
    }
    return null;
  }
};

export default fabriquer(banque);
