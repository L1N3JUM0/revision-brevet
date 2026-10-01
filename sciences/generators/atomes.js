// Physique-Chimie — Atomes, molécules et ions : composition, formules, tests d'ions.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre } from './fabrique.js';

// Éléments courants : numéro atomique Z, nombre de nucléons A de l'isotope le plus abondant
const ELEMENTS = [
  { s: 'H', nom: 'hydrogène', Z: 1, A: 1 },
  { s: 'He', nom: 'hélium', Z: 2, A: 4 },
  { s: 'C', nom: 'carbone', Z: 6, A: 12 },
  { s: 'N', nom: 'azote', Z: 7, A: 14 },
  { s: 'O', nom: 'oxygène', Z: 8, A: 16 },
  { s: 'Na', nom: 'sodium', Z: 11, A: 23 },
  { s: 'Mg', nom: 'magnésium', Z: 12, A: 24 },
  { s: 'Al', nom: 'aluminium', Z: 13, A: 27 },
  { s: 'S', nom: 'soufre', Z: 16, A: 32 },
  { s: 'Cl', nom: 'chlore', Z: 17, A: 35 },
  { s: 'K', nom: 'potassium', Z: 19, A: 39 },
  { s: 'Ca', nom: 'calcium', Z: 20, A: 40 },
  { s: 'Fe', nom: 'fer', Z: 26, A: 56 },
  { s: 'Cu', nom: 'cuivre', Z: 29, A: 63 },
  { s: 'Zn', nom: 'zinc', Z: 30, A: 64 },
  { s: 'Ag', nom: 'argent', Z: 47, A: 107 },
  { s: 'Au', nom: 'or', Z: 79, A: 197 }
];
const el = s => ELEMENTS.find(e => e.s === s);
const de = nom => (/^[aeiouyhé]/i.test(nom) ? `d'${nom}` : `de ${nom}`);
const article = nom => (/^[aeiouyhé]/i.test(nom) ? `l'atome d'${nom}` : `l'atome de ${nom}`);

// Ions monoatomiques : charge en nombre de charges élémentaires
const IONS = [
  { s: 'Na', q: 1, ecrit: 'Na⁺', nom: 'ion sodium' },
  { s: 'K', q: 1, ecrit: 'K⁺', nom: 'ion potassium' },
  { s: 'Mg', q: 2, ecrit: 'Mg²⁺', nom: 'ion magnésium' },
  { s: 'Ca', q: 2, ecrit: 'Ca²⁺', nom: 'ion calcium' },
  { s: 'Al', q: 3, ecrit: 'Al³⁺', nom: 'ion aluminium' },
  { s: 'Fe', q: 2, ecrit: 'Fe²⁺', nom: 'ion fer II' },
  { s: 'Fe', q: 3, ecrit: 'Fe³⁺', nom: 'ion fer III' },
  { s: 'Cu', q: 2, ecrit: 'Cu²⁺', nom: 'ion cuivre II' },
  { s: 'Zn', q: 2, ecrit: 'Zn²⁺', nom: 'ion zinc' },
  { s: 'H', q: 1, ecrit: 'H⁺', nom: 'ion hydrogène' },
  { s: 'Cl', q: -1, ecrit: 'Cl⁻', nom: 'ion chlorure' },
  { s: 'O', q: -2, ecrit: 'O²⁻', nom: 'ion oxyde' },
  { s: 'S', q: -2, ecrit: 'S²⁻', nom: 'ion sulfure' }
];

// Molécules : formule écrite (indices) et composition
const MOLECULES = [
  { f: 'H₂O', nom: 'eau', atomes: { H: 2, O: 1 } },
  { f: 'CO₂', nom: 'dioxyde de carbone', atomes: { C: 1, O: 2 } },
  { f: 'O₂', nom: 'dioxygène', atomes: { O: 2 } },
  { f: 'H₂', nom: 'dihydrogène', atomes: { H: 2 } },
  { f: 'N₂', nom: 'diazote', atomes: { N: 2 } },
  { f: 'CH₄', nom: 'méthane', atomes: { C: 1, H: 4 } },
  { f: 'C₃H₈', nom: 'propane', atomes: { C: 3, H: 8 } },
  { f: 'C₄H₁₀', nom: 'butane', atomes: { C: 4, H: 10 } },
  { f: 'NH₃', nom: 'ammoniac', atomes: { N: 1, H: 3 } },
  { f: 'C₂H₆O', nom: 'éthanol', atomes: { C: 2, H: 6, O: 1 } },
  { f: 'C₆H₁₂O₆', nom: 'glucose', atomes: { C: 6, H: 12, O: 6 } },
  { f: 'CO', nom: 'monoxyde de carbone', atomes: { C: 1, O: 1 } }
];
const totalAtomes = m => Object.values(m.atomes).reduce((a, b) => a + b, 0);

// ---------- Calculs ----------

function calcAtome(rng, ctx, niveau) {
  const e = rng.choix(ELEMENTS);
  const demande = niveau === 1 ? rng.choix(['electrons', 'protons']) : rng.choix(['neutrons', 'neutrons', 'electrons']);
  const notation = `<span class="calcul-inline"><sup>${e.A}</sup><sub>${e.Z}</sub>${e.s}</span>`;
  if (demande === 'neutrons') {
    const N = e.A - e.Z;
    const err = erreursNombre(N);
    err.ajouter(e.A, `${e.A}, c'est le nombre total de <strong>nucléons</strong> (protons + neutrons). Retire les ${e.Z} protons.`);
    err.ajouter(e.A + e.Z, 'On <strong>soustrait</strong> : neutrons = A − Z.');
    return {
      cle: `neutrons:${e.s}`,
      enonce: `<p>Le noyau de ${article(e.nom)} est noté ${notation} : il contient ${e.A} nucléons, dont ${e.Z} protons.</p><p><strong>Combien de neutrons contient-il ?</strong></p>`,
      type: 'nombre',
      reponse: N,
      etapes: [
        'Le noyau contient des <strong>protons</strong> et des <strong>neutrons</strong> : ce sont les nucléons (A).',
        `Neutrons = A − Z = ${e.A} − ${e.Z} = ${gras(fmt(N))}`
      ],
      erreurs: err.liste(),
      expression: `${e.A} − ${e.Z}`
    };
  }
  const err = erreursNombre(e.Z);
  err.ajouter(e.A, `${e.A}, c'est le nombre de nucléons (protons + neutrons), pas le numéro atomique.`);
  err.ajouter(e.A - e.Z, 'Ça, c\'est le nombre de neutrons.');
  return {
    cle: `${demande}:${e.s}`,
    enonce: demande === 'protons'
      ? `<p>Le numéro atomique de ${article(e.nom)} (${e.s}) est Z = ${e.Z}.</p><p><strong>Combien de protons contient son noyau ?</strong></p>`
      : `<p>Le noyau de ${article(e.nom)} (${e.s}) contient ${e.Z} protons.</p><p><strong>Combien d'électrons possède cet atome ?</strong></p>`,
    type: 'nombre',
    reponse: e.Z,
    etapes: demande === 'protons'
      ? [`Le numéro atomique Z, c'est le nombre de protons : ${gras(fmt(e.Z))}.`]
      : ['Un atome est <strong>électriquement neutre</strong> : il a autant d\'électrons (−) que de protons (+).', `Il possède donc ${gras(fmt(e.Z))} électrons.`],
    erreurs: err.liste()
  };
}

function calcIon(rng) {
  const ion = rng.choix(IONS);
  const e = el(ion.s);
  const n = e.Z - ion.q;
  const perdu = ion.q > 0;
  const k = Math.abs(ion.q);
  const err = erreursNombre(n);
  err.ajouter(e.Z + ion.q, perdu
    ? `L'ion ${ion.ecrit} est positif : l'atome a <strong>perdu</strong> ${k} électron${k > 1 ? 's' : ''}, il en a donc moins que ${e.Z}.`
    : `L'ion ${ion.ecrit} est négatif : l'atome a <strong>gagné</strong> ${k} électron${k > 1 ? 's' : ''}, il en a donc plus que ${e.Z}.`);
  err.ajouter(e.Z, 'Ça, c\'est le nombre d\'électrons de l\'<strong>atome</strong>. L\'ion en a perdu ou gagné.');
  const expression = perdu ? `${e.Z} − ${k}` : `${e.Z} + ${k}`;
  return {
    cle: `ion:${ion.ecrit}`,
    enonce: `<p>L'atome de ${e.nom} possède ${e.Z} électrons. Il forme l'${ion.nom} <span class="calcul-inline">${ion.ecrit}</span>.</p><p><strong>Combien d'électrons possède cet ion ?</strong></p>`,
    type: 'nombre',
    reponse: n,
    etapes: [
      perdu
        ? `Le signe « + » indique que l'atome a <strong>perdu</strong> ${k} électron${k > 1 ? 's' : ''} (charges négatives) : l'ion est positif.`
        : `Le signe « − » indique que l'atome a <strong>gagné</strong> ${k} électron${k > 1 ? 's' : ''} : l'ion est négatif.`,
      `${expression} = ${gras(fmt(n))} électrons`
    ],
    erreurs: err.liste(),
    expression
  };
}

function calcFormule(rng, ctx, niveau) {
  const m = rng.choix(MOLECULES.filter(x => niveau > 1 || totalAtomes(x) <= 5));
  if (niveau === 1 || rng.bool(0.3)) {
    const t = totalAtomes(m);
    const detail = Object.entries(m.atomes).map(([s, k]) => `${k} atome${k > 1 ? 's' : ''} ${de(el(s).nom)}`).join(', ');
    return {
      cle: `formule:${m.f}`,
      enonce: `<p>La molécule de ${m.nom} a pour formule <span class="calcul-inline">${m.f}</span>.</p><p><strong>Combien d'atomes contient-elle au total ?</strong></p>`,
      type: 'nombre',
      reponse: t,
      etapes: [`Les petits chiffres en bas (indices) donnent le nombre d'atomes ; pas de chiffre = 1 atome.`, `${m.f} : ${detail}.`, `Total : ${gras(fmt(t))} atomes.`],
      erreurs: Object.keys(m.atomes).length !== t ? [{ test: v => v === Object.keys(m.atomes).length, message: 'Ça, c\'est le nombre de <strong>sortes</strong> d\'atomes. Compte chaque atome.' }] : []
    };
  }
  // n molécules : combien d'atomes d'un élément ?
  const n = rng.int(2, 6);
  const [s, k] = rng.choix(Object.entries(m.atomes));
  const r = n * k;
  const err = erreursNombre(r);
  err.ajouter(n + k, 'Le coefficient devant la formule <strong>multiplie</strong> tout : n molécules × atomes par molécule.');
  err.ajouter(k, 'Ça, c\'est pour <strong>une</strong> molécule. Il y en a ' + n + '.');
  return {
    cle: `coef:${n}${m.f}:${s}`,
    enonce: `<p>On écrit <span class="calcul-inline">${n} ${m.f}</span> pour ${n} molécules de ${m.nom}.</p><p><strong>Combien d'atomes ${de(el(s).nom)} cela représente-t-il ?</strong></p>`,
    type: 'nombre',
    reponse: r,
    etapes: [`Une molécule ${m.f} contient ${k} atome${k > 1 ? 's' : ''} ${de(el(s).nom)} (${s}).`, `${n} × ${k} = ${gras(fmt(r))} atomes ${de(el(s).nom)}.`],
    erreurs: err.liste(),
    expression: `${n} × ${k}`
  };
}

// Tests d'identification des ions
const TESTS = [
  { ion: 'Cu²⁺', nom: 'ions cuivre II', reactif: 'hydroxyde de sodium (soude)', resultat: 'Précipité bleu' },
  { ion: 'Fe²⁺', nom: 'ions fer II', reactif: 'hydroxyde de sodium (soude)', resultat: 'Précipité vert' },
  { ion: 'Fe³⁺', nom: 'ions fer III', reactif: 'hydroxyde de sodium (soude)', resultat: 'Précipité orange (couleur rouille)' },
  { ion: 'Zn²⁺', nom: 'ions zinc', reactif: 'hydroxyde de sodium (soude)', resultat: 'Précipité blanc' },
  { ion: 'Cl⁻', nom: 'ions chlorure', reactif: 'nitrate d\'argent', resultat: 'Précipité blanc qui noircit à la lumière' }
];
function calcTestIon(rng) {
  const t = rng.choix(TESTS);
  const resultats = [...new Set(TESTS.map(x => x.resultat))];
  if (rng.bool()) {
    return {
      cle: `test:resultat:${t.ion}`,
      enonce: `<p>On ajoute quelques gouttes de ${t.reactif} à une solution contenant des ${t.nom} <span class="calcul-inline">${t.ion}</span>.</p><p><strong>Qu'observe-t-on ?</strong></p>`,
      type: 'qcm',
      choix: rng.melanger([t.resultat, ...rng.melanger(resultats.filter(x => x !== t.resultat)).slice(0, 3)]),
      reponse: t.resultat,
      etapes: [`Test des ${t.nom} (${t.ion}) au ${t.reactif} : ${gras(t.resultat.toLowerCase())}.`],
      erreurs: []
    };
  }
  // Retrouver l'ion à partir de l'observation (réactif : soude uniquement, résultats tous différents)
  const soude = TESTS.filter(x => x.reactif === t.reactif);
  if (soude.length < 2) {
    return {
      cle: `test:ion:${t.ion}`,
      enonce: `<p>On ajoute du ${t.reactif} à une solution. On observe : ${t.resultat.toLowerCase()}.</p><p><strong>Quel ion est présent ?</strong></p>`,
      type: 'qcm',
      choix: rng.melanger(['Cl⁻', 'Cu²⁺', 'Fe²⁺', 'Fe³⁺']),
      reponse: t.ion,
      etapes: [`Le nitrate d'argent donne un précipité blanc qui noircit à la lumière avec les ${gras('ions chlorure Cl⁻')}.`],
      erreurs: []
    };
  }
  return {
    cle: `test:ion:${t.ion}`,
    enonce: `<p>${rng.choix(['Dans le labo', 'En TP'])}, on ajoute de la soude (hydroxyde de sodium) à une solution. On observe : <strong>${t.resultat.toLowerCase()}</strong>.</p><p><strong>Quel ion est présent ?</strong></p>`,
    type: 'qcm',
    choix: soude.map(x => x.ion),
    reponse: t.ion,
    etapes: [`Avec la soude, ${t.resultat.toLowerCase()} révèle les ${gras(`${t.nom} ${t.ion}`)}.`, soude.map(x => `${x.ion} : ${x.resultat.toLowerCase()}`).join('<br>')],
    erreurs: []
  };
}

export const banque = {
  id: 'atomes',
  titre: 'Atomes, molécules et ions',
  discipline: 'pc',
  resume: 'Constitution de l\'atome, formules des molécules, ions et tests d\'identification.',
  essentiel: [
    'Toute la matière est faite d\'<strong>atomes</strong>. Un atome = un <strong>noyau</strong> (protons + et neutrons) entouré d\'<strong>électrons</strong> (−).',
    'Un atome est <strong>électriquement neutre</strong> : autant d\'électrons que de protons. Le numéro atomique Z = nombre de protons.',
    'Une <strong>molécule</strong> est un assemblage d\'atomes : H₂O contient 2 atomes d\'hydrogène et 1 atome d\'oxygène.',
    'Un <strong>ion</strong> est un atome (ou un groupe d\'atomes) qui a perdu ou gagné des électrons. Na⁺ a perdu 1 électron ; Cl⁻ en a gagné 1.',
    'L\'atome est presque vide : le noyau est environ <strong>100 000 fois plus petit</strong> que l\'atome, mais il concentre presque toute sa masse.'
  ],
  cartes: [{
    titre: 'Tests des ions',
    contenu: `<ul>${TESTS.map(t => `<li><strong>${t.ion}</strong> + ${t.reactif.replace(' (soude)', '')} → ${t.resultat.toLowerCase()}</li>`).join('')}</ul>
      <p class="doux petit">Neutrons = A − Z. Ion X²⁺ : 2 électrons de moins que l'atome. Ion X⁻ : 1 électron de plus.</p>`
  }],
  vocabulaire: [
    { mot: 'Atome', definition: 'Plus petite particule d\'un élément chimique, formée d\'un noyau et d\'électrons.' },
    { mot: 'Molécule', definition: 'Assemblage d\'atomes liés entre eux, électriquement neutre.' },
    { mot: 'Ion', definition: 'Atome ou groupe d\'atomes qui a perdu ou gagné un ou plusieurs électrons.' },
    { mot: 'Électron', definition: 'Particule de charge négative qui se déplace autour du noyau.' },
    { mot: 'Proton', definition: 'Particule du noyau, de charge positive.' },
    { mot: 'Neutron', definition: 'Particule du noyau, électriquement neutre.' },
    { mot: 'Numéro atomique', definition: 'Nombre de protons du noyau, noté Z : il caractérise l\'élément chimique.' },
    { mot: 'Précipité', definition: 'Solide qui apparaît dans une solution lors d\'un test chimique.' },
    { mot: 'Cation', definition: 'Ion positif : l\'atome a perdu des électrons.' },
    { mot: 'Anion', definition: 'Ion négatif : l\'atome a gagné des électrons.' }
  ],
  questions: [
    { q: 'Où se trouve presque toute la masse d\'un atome ?', bonne: 'Dans le noyau', fausses: ['Dans les électrons', 'Dans le vide entre noyau et électrons', 'Elle est répartie également'], explication: 'Les électrons sont environ 2 000 fois plus légers qu\'un proton : la masse est concentrée dans le noyau.', niveau: 2 },
    { q: 'Quelle est la charge d\'un électron ?', bonne: 'Négative', fausses: ['Positive', 'Nulle', 'Elle dépend de l\'atome'], niveau: 1 },
    { q: 'Quelle est la charge du noyau d\'un atome ?', bonne: 'Positive', fausses: ['Négative', 'Nulle', 'Elle change sans arrêt'], explication: 'Le noyau contient les protons (positifs) et les neutrons (neutres) : il est positif.', niveau: 1 },
    { q: 'Un ion positif est un atome qui a…', bonne: 'Perdu des électrons', fausses: ['Gagné des électrons', 'Gagné des protons', 'Perdu des protons'], explication: 'Les électrons sont négatifs : en perdre rend l\'atome positif. Le noyau, lui, ne change pas.', pieges: [{ choix: 'Gagné des protons', message: 'Le noyau ne change jamais lors de la formation d\'un ion : seuls les électrons bougent.' }], niveau: 2 },
    { q: 'Quelle est la taille approximative d\'un atome ?', bonne: '0,000 000 000 1 m (10⁻¹⁰ m)', fausses: ['0,001 m (1 mm)', '0,000 001 m (1 µm)', '10⁻²⁰ m'], explication: 'Un atome mesure environ un dixième de milliardième de mètre : il faut environ 10 millions d\'atomes alignés pour faire 1 mm.', niveau: 3 },
    { q: 'Qu\'est-ce qui caractérise un élément chimique ?', bonne: 'Son nombre de protons (Z)', fausses: ['Son nombre de neutrons', 'Son nombre d\'électrons', 'Sa masse'], explication: 'Tous les atomes de fer ont 26 protons. Les ions Fe²⁺ et Fe³⁺ sont toujours du fer.', niveau: 3 },
    { q: 'L\'eau de chaux permet de détecter…', bonne: 'Le dioxyde de carbone', fausses: ['Le dioxygène', 'Le dihydrogène', 'L\'eau'], explication: 'L\'eau de chaux se trouble en présence de dioxyde de carbone (CO₂).', niveau: 1 },
    { q: 'Le sulfate de cuivre anhydre (blanc) devient bleu au contact…', bonne: 'De l\'eau', fausses: ['Du dioxyde de carbone', 'Du dioxygène', 'Du sel'], explication: 'C\'est le test de l\'eau.', niveau: 2 },
    { q: 'Comment teste-t-on la présence de dihydrogène ?', bonne: 'Une petite détonation avec une flamme', fausses: ['L\'eau de chaux se trouble', 'Une bûchette incandescente se rallume', 'Le sulfate de cuivre devient bleu'], explication: 'Le dihydrogène produit une petite détonation (« pop ») au contact d\'une flamme.', niveau: 2 },
    { q: 'Comment teste-t-on la présence de dioxygène ?', bonne: 'Une bûchette incandescente se rallume', fausses: ['Une petite détonation', 'L\'eau de chaux se trouble', 'Un précipité bleu se forme'], explication: 'Le dioxygène ravive la combustion : une bûchette qui rougeoie se rallume.', niveau: 2 },
    { q: 'La solution d\'eau salée contient des ions Na⁺ et Cl⁻. Elle est…', bonne: 'Électriquement neutre', fausses: ['Positive', 'Négative', 'Chargée selon la quantité de sel'], explication: 'Il y a autant de charges + que de charges − : une solution est toujours neutre.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Un atome contient autant de protons que d\'électrons.', vrai: true, explication: 'C\'est pour cela qu\'il est électriquement neutre.' },
    { texte: 'L\'ion Cl⁻ possède un électron de moins que l\'atome de chlore.', vrai: false, explication: 'Le signe « − » indique qu\'il a <strong>gagné</strong> un électron : 18 au lieu de 17.' },
    { texte: 'Dans une molécule de CO₂, il y a deux atomes d\'oxygène.', vrai: true, explication: 'L\'indice 2 porte sur O : 1 atome de carbone et 2 atomes d\'oxygène.' },
    { texte: 'Lors de la formation d\'un ion, le nombre de protons change.', vrai: false, explication: 'Seuls les électrons sont perdus ou gagnés. Le noyau reste le même.' },
    { texte: 'L\'atome est essentiellement constitué de vide.', vrai: true, explication: 'Le noyau est environ 100 000 fois plus petit que l\'atome : entre le noyau et les électrons, c\'est du vide.' }
  ],
  classements: [{
    question: 'Atome, molécule ou ion ?',
    groupes: [
      { nom: 'Atome', items: ['Fe', 'C', 'He', 'Cu', 'Na'], explication: 'Un seul symbole, sans charge : c\'est un atome.' },
      { nom: 'Molécule', items: ['H₂O', 'O₂', 'CO₂', 'CH₄', 'N₂'], explication: 'Plusieurs atomes liés, sans charge : c\'est une molécule.' },
      { nom: 'Ion', items: ['Na⁺', 'Cl⁻', 'Cu²⁺', 'Fe³⁺', 'HO⁻'], explication: 'Il porte une charge (+ ou −) : c\'est un ion.' }
    ]
  }],
  calculs: { atome: calcAtome, ion: calcIon, formule: calcFormule, test: calcTestIon },
  modeles: {
    1: [['calc:atome', 3], ['calc:formule', 3], ['classement', 2], ['qcm', 2], ['vf', 2], ['vocMot', 1]],
    2: [['calc:atome', 2], ['calc:ion', 3], ['calc:formule', 2], ['calc:test', 2], ['qcm', 2], ['vf', 1], ['vocDef', 1]],
    3: [['calc:ion', 3], ['calc:atome', 2], ['calc:formule', 2], ['calc:test', 2], ['qcm', 3]]
  },
  controler(exo) {
    // Recalcul indépendant à partir de la table des éléments
    const m = exo.cle.match(/^ion:(.+)$/);
    if (m) {
      const ion = IONS.find(x => x.ecrit === m[1]);
      return el(ion.s).Z - ion.q === exo.reponse ? null : 'électrons de l\'ion incohérents';
    }
    const n = exo.cle.match(/^neutrons:(.+)$/);
    if (n) return el(n[1]).A - el(n[1]).Z === exo.reponse ? null : 'neutrons incohérents';
    return null;
  }
};

export default fabriquer(banque);
