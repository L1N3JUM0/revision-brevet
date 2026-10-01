// Physique-Chimie — La matière : états, changements d'état, masse volumique, mélanges.
import { choisirSelonTheme } from '../../assets/js/core/contexts.js';
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';
import { graphe } from './figures.js';

// Masses volumiques (g/cm³), valeurs usuelles des manuels
const METAUX = [
  { nom: 'Aluminium', rho: 2.7 },
  { nom: 'Fer', rho: 7.9 },
  { nom: 'Cuivre', rho: 8.9 },
  { nom: 'Argent', rho: 10.5 },
  { nom: 'Plomb', rho: 11.3 },
  { nom: 'Or', rho: 19.3 }
];
const LIQUIDES = [
  { verse: 'd\'huile', de: 'de l\'huile', rho: 0.92 },
  { verse: 'd\'éthanol (alcool)', de: 'de l\'éthanol', rho: 0.79 },
  { verse: 'd\'eau salée', de: 'de l\'eau salée', rho: 1.2 },
  { verse: 'de sirop de grenadine', de: 'du sirop', rho: 1.3 },
  { verse: 'de lait', de: 'du lait', rho: 1.03 }
];

// Objets du quotidien, rattachés aux thèmes quand c'est possible
const OBJETS = [
  { themes: ['grece', 'records'], nom: 'Une statuette en or', metal: 'Or' },
  { themes: ['chevaux', 'animaux'], nom: 'Un fer à cheval', metal: 'Fer' },
  { themes: ['cuisine'], nom: 'Une casserole en aluminium', metal: 'Aluminium' },
  { themes: ['rap', 'mode'], nom: 'Une chaîne en argent', metal: 'Argent' },
  { themes: ['commerce', 'famille'], nom: 'Un tuyau en cuivre', metal: 'Cuivre' },
  { themes: ['sport', 'handball'], nom: 'Une médaille', metal: null },
  { themes: ['espace', 'jeux-video', 'voyages'], nom: 'Une pièce de métal', metal: null }
];

function tirerObjet(rng, ctx) {
  const o = choisirSelonTheme(rng, ctx, OBJETS);
  const metal = o.metal ? METAUX.find(m => m.nom === o.metal) : rng.choix(METAUX);
  return { nom: o.nom, metal };
}

// ---------- Calculs ----------

// ρ = m ÷ V
function calcRho(rng, ctx) {
  const { nom, metal } = tirerObjet(rng, ctx);
  const V = rng.int(2, 40) * 5;
  const m = net(metal.rho * V);
  const err = erreursNombre(metal.rho);
  err.ajouter(net(V / m), 'Tu as divisé le volume par la masse. La masse volumique, c\'est <strong>m ÷ V</strong>.');
  err.ajouter(net(m * V), 'On ne multiplie pas : la masse volumique, c\'est la masse <strong>divisée</strong> par le volume.');
  return {
    cle: `rho:${metal.nom}:${V}`,
    enonce: `<p>${nom} a une masse de ${fmt(m)} g et un volume de ${fmt(V)} cm³.</p><p><strong>Calcule sa masse volumique, en g/cm³.</strong></p>`,
    type: 'nombre',
    unite: 'g/cm³',
    reponse: metal.rho,
    etapes: [
      'Formule : <strong>ρ = m ÷ V</strong> (ρ se lit « rhô »).',
      `ρ = ${fmt(m)} ÷ ${fmt(V)} = ${gras(fmt(metal.rho))} g/cm³`,
      `C'est la masse volumique ${metal.nom === 'Or' || metal.nom === 'Argent' || metal.nom === 'Aluminium' ? 'de l\'' + metal.nom.toLowerCase() : 'du ' + metal.nom.toLowerCase()}.`
    ],
    erreurs: err.liste(),
    expression: `${fmt(m)} ÷ ${fmt(V)}`,
    donnees: { m, V }
  };
}

// m = ρ × V ou V = m ÷ ρ, avec un volume en mL ou en L
function calcMasseOuVolume(rng, ctx) {
  const liq = rng.choix(LIQUIDES);
  if (rng.bool()) {
    const enL = rng.bool(0.4);
    const VmL = enL ? rng.choix([500, 1500, 2000, 250, 750]) : rng.int(1, 30) * 10;
    const m = net(liq.rho * VmL);
    const err = erreursNombre(m);
    err.ajouter(net(VmL / liq.rho), 'Pour une masse, on <strong>multiplie</strong> : m = ρ × V.');
    if (enL) err.ajouter(net(liq.rho * VmL / 1000), `Convertis d'abord le volume : ${fmt(VmL / 1000)} L = ${fmt(VmL)} mL = ${fmt(VmL)} cm³.`);
    return {
      cle: `masse:${liq.de}:${VmL}`,
      enonce: `<p>${ctx.prenom} verse ${enL ? `${fmt(VmL / 1000)} L` : `${fmt(VmL)} mL`} ${liq.verse} dans un récipient.</p>
        <p>La masse volumique ${liq.de} est ${fmt(liq.rho)} g/mL.</p>
        <p><strong>Quelle est la masse de liquide versée, en g ?</strong></p>`,
      type: 'nombre',
      unite: 'g',
      reponse: m,
      etapes: [
        'Formule : <strong>m = ρ × V</strong>.',
        ...(enL ? [`On convertit : ${fmt(VmL / 1000)} L = ${fmt(VmL)} mL (1 L = 1 000 mL).`] : []),
        `m = ${fmt(liq.rho)} × ${fmt(VmL)} = ${gras(fmt(m))} g`
      ],
      erreurs: err.liste(),
      expression: `${fmt(liq.rho)} × ${fmt(VmL)}`
    };
  }
  const { nom, metal } = tirerObjet(rng, ctx);
  const V = rng.int(2, 30) * 2;
  const m = net(metal.rho * V);
  const err = erreursNombre(V);
  err.ajouter(net(m * metal.rho), 'Pour un volume, on <strong>divise</strong> la masse par la masse volumique : V = m ÷ ρ.');
  err.ajouter(net(metal.rho / m), 'C\'est l\'inverse : V = <strong>m ÷ ρ</strong>.');
  return {
    cle: `volume:${metal.nom}:${V}`,
    enonce: `<p>${nom}${/ en /.test(nom) ? '' : ` en ${metal.nom.toLowerCase()}`} a une masse de ${fmt(m)} g.</p>
      <p>Masse volumique : ρ = ${fmt(metal.rho)} g/cm³.</p><p><strong>Quel est son volume, en cm³ ?</strong></p>`,
    type: 'nombre',
    unite: 'cm³',
    reponse: V,
    etapes: [
      'De ρ = m ÷ V, on tire <strong>V = m ÷ ρ</strong>.',
      `V = ${fmt(m)} ÷ ${fmt(metal.rho)} = ${gras(fmt(V))} cm³`
    ],
    erreurs: err.liste(),
    expression: `${fmt(m)} ÷ ${fmt(metal.rho)}`
  };
}

// Identifier un métal par sa masse volumique (type brevet)
function calcIdentifier(rng, ctx) {
  const metal = rng.choix(METAUX);
  const V = rng.int(2, 25) * 4;
  const m = net(metal.rho * V);
  const qui = rng.choix([`${ctx.prenom} trouve un petit objet métallique`, 'Un bijoutier reçoit un lingot', `${ctx.prenom} veut savoir de quoi est faite une figurine`]);
  return {
    cle: `ident:${metal.nom}:${V}`,
    enonce: `<p>${qui}. Masse : ${fmt(m)} g. Volume : ${fmt(V)} cm³.</p>
      <table class="bareme">${METAUX.map(x => `<tr><td>${x.nom}</td><td>${fmt(x.rho)} g/cm³</td></tr>`).join('')}</table>
      <p><strong>De quel métal s'agit-il ?</strong></p>`,
    type: 'qcm',
    choix: METAUX.map(x => x.nom),
    reponse: metal.nom,
    etapes: [
      `On calcule la masse volumique : ρ = m ÷ V = ${fmt(m)} ÷ ${fmt(V)} = ${gras(fmt(metal.rho))} g/cm³.`,
      `On compare avec le tableau : c'est ${gras(metal.nom.toLowerCase())}.`
    ],
    erreurs: [],
    donnees: { m, V }
  };
}

// Flotte ou coule ? On compare à la masse volumique de l'eau (1 g/cm³)
function calcFlotte(rng, ctx) {
  const flotte = rng.bool();
  // ρ entre 0,2 et 0,85 (flotte) ou entre 1,2 et 3 (coule), au centième
  const rho = flotte ? rng.int(20, 85) / 100 : rng.int(12, 30) / 10;
  const V = rng.int(1, 20) * 10;
  const m = net(rho * V);
  const objet = rng.choix(['Un jouet de bain', 'Un bouchon', 'Une balle', 'Un galet', 'Une figurine', 'Un cube de bois', 'Un glaçon décoratif']);
  return {
    cle: `flotte:${rho}:${V}`,
    enonce: `<p>${objet} a une masse de ${fmt(m)} g pour un volume de ${fmt(V)} cm³. ${ctx.prenom} le pose dans l'eau.</p>
      <p><strong>Que se passe-t-il ?</strong> (eau : 1 g/cm³)</p>`,
    type: 'qcm',
    choix: ['Il flotte', 'Il coule'],
    reponse: flotte ? 'Il flotte' : 'Il coule',
    etapes: [
      `ρ = m ÷ V = ${fmt(m)} ÷ ${fmt(V)} = ${fmt(rho)} g/cm³.`,
      flotte
        ? `${fmt(rho)} g/cm³ est <strong>inférieur</strong> à 1 g/cm³ (l'eau) : l'objet ${gras('flotte')}.`
        : `${fmt(rho)} g/cm³ est <strong>supérieur</strong> à 1 g/cm³ (l'eau) : l'objet ${gras('coule')}.`
    ],
    erreurs: [],
    donnees: { m, V, rho }
  };
}

// Conservation de la masse lors d'une dissolution
function calcDissolution(rng, ctx) {
  const solute = rng.choix([['sucre', rng.int(1, 12) * 5], ['sel', rng.int(1, 8) * 5]]);
  const [nom, ms] = solute;
  const VmL = rng.int(4, 50) * 10;
  const total = VmL + ms;
  const err = erreursNombre(total);
  err.ajouter(VmL, 'La masse du soluté ne disparaît pas : elle s\'ajoute à celle de l\'eau.');
  err.ajouter(VmL - ms, 'On <strong>ajoute</strong> les masses : rien ne disparaît lors d\'une dissolution.');
  return {
    cle: `dissol:${nom}:${ms}:${VmL}`,
    enonce: `<p>${ctx.prenom} dissout ${ms} g de ${nom} dans ${VmL} mL d'eau (1 mL d'eau a une masse de 1 g).</p>
      <p><strong>Quelle est la masse de la solution obtenue, en g ?</strong></p>`,
    type: 'nombre',
    unite: 'g',
    reponse: total,
    etapes: [
      `${VmL} mL d'eau ont une masse de ${VmL} g.`,
      'Lors d\'une dissolution, <strong>la masse se conserve</strong> : m(solution) = m(eau) + m(soluté).',
      `m = ${VmL} + ${ms} = ${gras(fmt(total))} g`
    ],
    erreurs: err.liste(),
    expression: `${VmL} + ${ms}`
  };
}

// Lire une température de changement d'état sur un graphique, ou reconnaître un mélange
function calcPalier(rng) {
  const corps = rng.choix([
    { nom: 'de l\'eau pure', T: 0 },
    { nom: 'un corps pur inconnu', T: rng.int(2, 16) * 5 }
  ]);
  const pur = rng.bool(0.65);
  const T = corps.T;
  const yMax = Math.ceil((T + 30) / 10) * 10, yMin = Math.min(0, Math.floor((T - 30) / 10) * 10);
  const debut = T + 25, fin = T - 20;
  const points = pur
    ? [[0, debut], [4, T], [12, T], [16, fin]]
    : [[0, debut], [4, T + 6], [12, T - 6], [16, fin]];
  const figure = graphe({ xMin: 0, xMax: 16, yMin, yMax, pasX: 2, pasY: 10, titreX: 't (min)', titreY: 'T (°C)', series: [{ points }] });
  if (!pur || rng.bool(0.3)) {
    return {
      cle: `palier:qcm:${pur}:${T}`,
      enonce: `<p>On refroidit un liquide et on relève sa température.</p><p><strong>Ce liquide est-il un corps pur ou un mélange ?</strong></p>`,
      figure,
      type: 'qcm',
      choix: ['Un corps pur', 'Un mélange'],
      reponse: pur ? 'Un corps pur' : 'Un mélange',
      etapes: pur
        ? ['La courbe présente un <strong>palier</strong> : la température reste constante pendant la solidification.', `C'est ${gras('un corps pur')}.`]
        : ['La température <strong>baisse sans arrêt</strong>, sans palier.', `C'est ${gras('un mélange')} : un corps pur aurait un palier pendant le changement d'état.`],
      erreurs: []
    };
  }
  return {
    cle: `palier:${corps.nom}:${T}`,
    enonce: `<p>On refroidit ${corps.nom} liquide et on relève sa température.</p><p><strong>À quelle température a lieu la solidification, en °C ?</strong></p>`,
    figure,
    type: 'nombre',
    unite: '°C',
    reponse: T,
    etapes: [
      'Pendant un changement d\'état, la température d\'un corps pur <strong>reste constante</strong> : c\'est le palier horizontal.',
      `Le palier est à ${gras(fmt(T))} °C : c'est la température de solidification (et aussi de fusion).`
    ],
    erreurs: [{ test: v => v === debut, message: 'Ça, c\'est la température de départ. Cherche le <strong>palier horizontal</strong>.' }]
  };
}

// Nom d'un changement d'état
const CHANGEMENTS = [
  { de: 'solide', a: 'liquide', nom: 'Fusion', exemple: 'un glaçon qui fond' },
  { de: 'liquide', a: 'solide', nom: 'Solidification', exemple: 'l\'eau qui gèle au congélateur' },
  { de: 'liquide', a: 'gazeux', nom: 'Vaporisation', exemple: 'l\'eau qui bout dans une casserole' },
  { de: 'gazeux', a: 'liquide', nom: 'Liquéfaction', exemple: 'la buée sur un miroir de salle de bain' },
  { de: 'solide', a: 'gazeux', nom: 'Sublimation', exemple: 'la neige carbonique qui « fume »' }
];
function calcChangement(rng) {
  const c = rng.choix(CHANGEMENTS);
  const choix = rng.melanger(['Fusion', 'Solidification', 'Vaporisation', 'Liquéfaction', 'Dissolution', 'Sublimation'].filter(x => x !== c.nom)).slice(0, 3);
  return {
    cle: `etat:${c.nom}`,
    enonce: `<p><strong>Comment s'appelle le passage de l'état ${c.de} à l'état ${c.a} ?</strong></p><p class="doux">Exemple : ${c.exemple}.</p>`,
    type: 'qcm',
    choix: rng.melanger([c.nom, ...choix]),
    reponse: c.nom,
    etapes: [`${c.de[0].toUpperCase() + c.de.slice(1)} → ${c.a} : ${gras(c.nom.toLowerCase())}.`],
    erreurs: [
      { test: r => r === 'Dissolution', message: 'La dissolution, c\'est un solide qui se mélange à un liquide (le sucre dans l\'eau). Ce n\'est <strong>pas</strong> un changement d\'état.' },
      ...CHANGEMENTS.filter(x => x !== c).map(x => ({ test: r => r === x.nom, message: `La ${x.nom.toLowerCase()}, c'est le passage ${x.de} → ${x.a}.` }))
    ]
  };
}

export const banque = {
  id: 'matiere',
  titre: 'La matière : états et masse volumique',
  discipline: 'pc',
  resume: 'États de la matière, changements d\'état, masse volumique, mélanges.',
  essentiel: [
    'La matière existe sous trois états : <strong>solide</strong>, <strong>liquide</strong> et <strong>gazeux</strong>.',
    'Lors d\'un changement d\'état, <strong>la masse se conserve</strong> mais le volume peut changer (l\'eau augmente de volume en gelant).',
    'Pour un <strong>corps pur</strong>, la température reste constante pendant le changement d\'état (palier) : 0 °C pour la fusion de l\'eau, 100 °C pour son ébullition (au niveau de la mer).',
    'La <strong>masse volumique</strong> ρ = m ÷ V indique la masse d\'un cm³ (ou d\'un m³) de matière. Un objet moins « dense » que l\'eau flotte.',
    'Dans une dissolution, le soluté se disperse dans le solvant : <strong>la masse totale se conserve</strong>.'
  ],
  formules: [
    { nom: 'Masse volumique', formule: 'ρ = m ÷ V', unites: 'm en g, V en cm³ (ou mL) → ρ en g/cm³ · 1 g/cm³ = 1 000 kg/m³' },
    { nom: 'Masse', formule: 'm = ρ × V' },
    { nom: 'Volume', formule: 'V = m ÷ ρ', unites: '1 L = 1 dm³ = 1 000 cm³ · 1 mL = 1 cm³' }
  ],
  cartes: [{
    titre: 'Les changements d\'état',
    contenu: `<ul>${CHANGEMENTS.map(c => `<li>${c.de} → ${c.a} : <strong>${c.nom.toLowerCase()}</strong></li>`).join('')}</ul>
      <p class="doux petit">Piège : la <strong>dissolution</strong> (sucre dans l'eau) n'est pas une fusion !</p>`
  }],
  vocabulaire: [
    { mot: 'Corps pur', definition: 'Matière constituée d\'une seule espèce chimique, par exemple l\'eau distillée.' },
    { mot: 'Mélange', definition: 'Matière constituée de plusieurs espèces chimiques, par exemple l\'eau du robinet ou l\'air.' },
    { mot: 'Mélange homogène', definition: 'Mélange où l\'on ne distingue pas ses constituants à l\'œil nu.' },
    { mot: 'Mélange hétérogène', definition: 'Mélange où l\'on distingue au moins deux constituants à l\'œil nu.' },
    { mot: 'Soluté', definition: 'Espèce chimique qui se dissout (le sucre dans l\'eau sucrée).' },
    { mot: 'Solvant', definition: 'Liquide dans lequel on dissout un soluté (l\'eau dans l\'eau sucrée).' },
    { mot: 'Solution saturée', definition: 'Solution dans laquelle on ne peut plus dissoudre de soluté : le surplus reste au fond.' },
    { mot: 'Miscible', definition: 'Se dit de deux liquides qui se mélangent pour former un mélange homogène.' },
    { mot: 'Masse volumique', definition: 'Masse d\'une unité de volume d\'un matériau : ρ = m ÷ V.' }
  ],
  questions: [
    { q: 'Que devient la masse d\'un glaçon quand il fond ?', bonne: 'Elle reste la même', fausses: ['Elle diminue', 'Elle augmente', 'Elle devient nulle'], explication: 'Lors d\'un changement d\'état, la masse se conserve : seule l\'organisation des molécules change.', niveau: 1 },
    { q: 'Que devient le volume de l\'eau quand elle gèle ?', bonne: 'Il augmente', fausses: ['Il diminue', 'Il reste le même', 'Il devient nul'], explication: 'L\'eau est une exception : la glace prend plus de place que l\'eau liquide. C\'est pour cela qu\'une bouteille pleine éclate au congélateur et que la glace flotte.', niveau: 2 },
    { q: 'À quelle température l\'eau pure bout-elle au niveau de la mer ?', bonne: '100 °C', fausses: ['0 °C', '50 °C', '37 °C', '212 °C'], explication: 'L\'eau pure bout à 100 °C sous la pression atmosphérique normale. Elle gèle à 0 °C.', niveau: 1 },
    { q: 'L\'huile et l\'eau versées ensemble forment…', bonne: 'Un mélange hétérogène', fausses: ['Un mélange homogène', 'Un corps pur', 'Une solution'], explication: 'L\'huile et l\'eau ne sont pas miscibles : on voit deux couches, l\'huile au-dessus car elle est moins dense.', niveau: 1 },
    { q: 'Pourquoi l\'huile flotte-t-elle sur l\'eau ?', bonne: 'Sa masse volumique est plus petite', fausses: ['Elle est plus lourde', 'Elle est plus chaude', 'Elle est un corps pur'], explication: 'L\'huile (environ 0,92 g/cm³) est moins dense que l\'eau (1 g/cm³) : elle reste au-dessus.', niveau: 2 },
    { q: 'Quelle technique permet de récupérer le sel dissous dans l\'eau de mer ?', bonne: 'L\'évaporation', fausses: ['La filtration', 'La décantation', 'L\'aimantation'], explication: 'Le sel dissous traverse le filtre. En faisant évaporer l\'eau (marais salants), le sel reste.', niveau: 2 },
    { q: 'Quelle technique sépare le sable de l\'eau ?', bonne: 'La filtration', fausses: ['L\'évaporation seule', 'La dissolution', 'La fusion'], explication: 'Le filtre retient les particules solides non dissoutes, comme le sable.', niveau: 1 },
    { q: 'Quelle est la masse d\'1 L d\'eau ?', bonne: '1 kg', fausses: ['1 g', '100 g', '10 kg'], explication: 'La masse volumique de l\'eau vaut 1 g/cm³ : 1 L = 1 000 cm³ a donc une masse de 1 000 g = 1 kg.', niveau: 2 },
    { q: 'À l\'état gazeux, les molécules sont…', bonne: 'Éloignées et très agitées', fausses: ['Collées et immobiles', 'Rangées en lignes', 'Collées mais mobiles'], explication: 'Dans un gaz, les molécules sont dispersées et bougent dans tous les sens : un gaz occupe tout l\'espace disponible.', niveau: 2 },
    { q: 'Dans un liquide, les molécules sont…', bonne: 'Proches les unes des autres et désordonnées', fausses: ['Très éloignées et immobiles', 'Rangées et immobiles', 'Absentes'], explication: 'Un liquide n\'a pas de forme propre : ses molécules, proches, glissent les unes sur les autres.', niveau: 3 },
    { q: '1 g/cm³ est égal à…', bonne: '1 000 kg/m³', fausses: ['1 kg/m³', '100 kg/m³', '0,001 kg/m³'], explication: '1 m³ = 1 000 000 cm³. Une masse volumique de 1 g/cm³ donne 1 000 000 g = 1 000 kg par m³.', niveau: 3 },
    { q: 'Pourquoi une bouteille d\'eau pleine peut-elle éclater au congélateur ?', bonne: 'Le volume de l\'eau augmente en gelant', fausses: ['La masse de l\'eau augmente en gelant', 'Le froid rend le plastique plus fragile', 'L\'eau se transforme en gaz'], explication: 'La masse ne change pas, mais la glace occupe plus de place que l\'eau liquide.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Lors d\'un changement d\'état, la masse se conserve.', vrai: true, explication: 'Les molécules sont les mêmes, elles sont seulement organisées différemment.' },
    { texte: 'La fonte d\'un glaçon est une transformation chimique.', vrai: false, explication: 'C\'est une transformation physique : l\'eau reste de l\'eau, elle change seulement d\'état.' },
    { texte: 'Le sucre fond dans le café.', vrai: false, explication: 'Le sucre se <strong>dissout</strong> : il se mélange au liquide. La fusion, c\'est le passage de solide à liquide sous l\'effet de la chaleur.' },
    { texte: 'L\'eau du robinet est un corps pur.', vrai: false, explication: 'Elle contient des sels minéraux dissous : c\'est un mélange homogène.' },
    { texte: 'Un objet de masse volumique 0,6 g/cm³ flotte sur l\'eau.', vrai: true, explication: '0,6 g/cm³ est inférieur à la masse volumique de l\'eau (1 g/cm³).' },
    { texte: 'La température d\'un mélange reste constante pendant sa solidification.', vrai: false, explication: 'Seul un corps pur présente un palier de température.' }
  ],
  calculs: {
    rho: calcRho,
    masseVolume: calcMasseOuVolume,
    identifier: calcIdentifier,
    flotte: calcFlotte,
    dissolution: calcDissolution,
    palier: calcPalier,
    changement: calcChangement
  },
  modeles: {
    1: [['calc:changement', 3], ['calc:rho', 3], ['calc:dissolution', 2], ['qcm', 2], ['vf', 2], ['vocMot', 1]],
    2: [['calc:masseVolume', 3], ['calc:flotte', 2], ['calc:palier', 2], ['qcm', 2], ['vf', 1], ['vocDef', 1]],
    3: [['calc:identifier', 3], ['calc:masseVolume', 2], ['calc:palier', 2], ['qcm', 2]]
  },
  controler(exo) {
    // Second calcul indépendant de la masse volumique
    if (exo.cle.startsWith('ident:')) {
      const rho = exo.donnees.m / exo.donnees.V;
      const m = METAUX.find(x => Math.abs(x.rho - rho) < 1e-6);
      return m && m.nom === exo.reponse ? null : 'métal mal identifié';
    }
    if (exo.cle.startsWith('flotte:')) {
      const rho = exo.donnees.m / exo.donnees.V;
      return (rho < 1) === (exo.reponse === 'Il flotte') ? null : 'flotte/coule incohérent';
    }
    return null;
  }
};

export default fabriquer(banque);
