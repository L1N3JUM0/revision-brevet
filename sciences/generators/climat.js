// SVT — Climat, écosystèmes et environnement : météo et climat, effet de serre, réchauffement,
// chaînes alimentaires, ressources, empreinte carbone.
import { choisirSelonTheme } from '../../assets/js/core/contexts.js';
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';

// Trajets en voiture, selon les thèmes du profil (sans thème = neutre)
const TRAJETS = [
  { dest: 'aller au concert de JUL à Marseille', km: [200, 300, 400, 500], themes: ['rap'] },
  { dest: 'aller à un concert', km: [50, 100, 150, 200], themes: ['musique'] },
  { dest: 'aller à un tournoi de handball', km: [50, 80, 100, 150], themes: ['handball'] },
  { dest: 'aller à un tournoi', km: [50, 80, 100, 150], themes: ['foot', 'basket', 'sport'] },
  { dest: 'aller au centre équestre', km: [20, 30, 40, 60], themes: ['chevaux'] },
  { dest: 'aller à une convention manga', km: [100, 200, 300], themes: ['mangas'] },
  { dest: 'aller voir une course automobile', km: [100, 200, 300], themes: ['voitures'] },
  { dest: 'partir en vacances', km: [400, 600, 800], themes: ['voyages', 'famille'] },
  { dest: 'aller chez ses grands-parents', km: [50, 100, 200] }
];

// Émissions d'un trajet en voiture (valeur d'émission donnée dans l'énoncé)
function calcTrajet(rng, ctx, niveau) {
  const { dest, km } = choisirSelonTheme(rng, ctx, TRAJETS);
  const d = rng.choix(km);
  const g = rng.choix([100, 110, 120, 130, 150]);
  const kg = net(d * g / 1000);
  if (niveau === 3 && rng.bool(0.6)) {
    const n = rng.choix([2, 4, 5]);
    const r = net(kg / n);
    const err = erreursNombre(r);
    err.ajouter(kg, `Ça, ce sont les émissions de toute la voiture. Partage-les entre les ${n} passagers.`);
    return {
      cle: `covoit:${d}:${g}:${n}`,
      enonce: `<p>Pour ${dest}, ${ctx.prenom} fait ${d} km en voiture. La voiture émet ${g} g de CO₂ par km. Ils sont ${n} dans la voiture (covoiturage).</p>
        <p><strong>Quelle masse de CO₂ cela représente-t-il par personne, en kg ?</strong></p>`,
      type: 'nombre',
      unite: 'kg',
      reponse: r,
      etapes: [
        `Émissions de la voiture : ${d} × ${g} = ${fmt(d * g)} g = ${fmt(kg)} kg.`,
        `Par personne : ${fmt(kg)} ÷ ${n} = ${gras(fmt(r))} kg.`,
        'Le covoiturage et les transports en commun réduisent les émissions de chacun.'
      ],
      erreurs: err.liste(),
      expression: `${fmt(kg)} ÷ ${n}`
    };
  }
  const err = erreursNombre(kg);
  err.ajouter(net(d * g), `${fmt(d * g)}, ce sont des <strong>grammes</strong>. 1 kg = 1 000 g.`);
  return {
    cle: `trajet:${d}:${g}`,
    enonce: `<p>Pour ${dest}, ${ctx.prenom} fait ${d} km en voiture. La voiture émet ${g} g de CO₂ par km.</p><p><strong>Quelle masse de CO₂ est rejetée, en kg ?</strong></p>`,
    type: 'nombre',
    unite: 'kg',
    reponse: kg,
    etapes: [`${d} × ${g} = ${fmt(d * g)} g de CO₂.`, `${fmt(d * g)} g = ${fmt(d * g)} ÷ 1000 kg = ${gras(fmt(kg))} kg.`],
    erreurs: err.liste(),
    expression: `${fmt(d * g)} ÷ 1000`
  };
}

// Chaînes alimentaires : remettre dans l'ordre « est mangé par »
const CHAINES = [
  ['Herbe', 'Lapin', 'Renard'],
  ['Phytoplancton', 'Zooplancton', 'Sardine', 'Thon'],
  ['Feuille de chêne', 'Chenille', 'Mésange', 'Épervier'],
  ['Herbe', 'Criquet', 'Grenouille', 'Héron'],
  ['Algue', 'Oursin', 'Loutre de mer'],
  ['Graines', 'Mulot', 'Chouette'],
  ['Herbe', 'Zèbre', 'Lion']
];
function calcChaine(rng) {
  const c = rng.choix(CHAINES);
  let melange;
  do { melange = rng.melanger(c.map((_, i) => i)); } while (melange.every((x, k) => x === k));
  const items = melange.map(i => c[i]);
  const reponse = c.map((_, k) => melange.indexOf(k));
  return {
    cle: `chaine:${c.join('>')}`,
    enonce: '<p><strong>Remets cette chaîne alimentaire dans l\'ordre, du producteur au dernier consommateur.</strong></p>',
    type: 'ordre',
    consigneOrdre: 'Touche les êtres vivants dans l\'ordre « <strong>est mangé par</strong> ».',
    items,
    reponse,
    etapes: [
      c.join(' → '),
      `La flèche signifie « est mangé par ». ${c[0]} est le <strong>producteur</strong> : il fabrique sa matière grâce à la lumière (photosynthèse).`
    ],
    erreurs: [{ test: v => Array.isArray(v) && v.every((x, j) => x === reponse[reponse.length - 1 - j]), message: 'C\'est à l\'envers : on commence par le <strong>producteur</strong> (un végétal).' }]
  };
}

export const banque = {
  id: 'climat',
  titre: 'Climat, écosystèmes et environnement',
  discipline: 'svt',
  resume: 'Météo et climat, effet de serre, réchauffement, chaînes alimentaires, ressources.',
  essentiel: [
    'La <strong>météo</strong> décrit le temps qu\'il fait sur quelques jours ; le <strong>climat</strong> est la moyenne sur au moins 30 ans.',
    'L\'<strong>effet de serre</strong> est naturel : certains gaz (vapeur d\'eau, CO₂, méthane) retiennent la chaleur. Sans lui, la Terre serait glacée.',
    'Depuis la révolution industrielle, la combustion du pétrole, du charbon et du gaz et la déforestation ont fortement augmenté le CO₂ : le climat s\'est réchauffé de plus de 1 °C.',
    'Conséquences : fonte des glaciers, montée du niveau des mers, vagues de chaleur plus fréquentes, menaces sur la biodiversité.',
    'Dans un <strong>écosystème</strong>, les végétaux (producteurs) fabriquent leur matière grâce à la lumière ; les animaux (consommateurs) les mangent. Les décomposeurs recyclent la matière.'
  ],
  vocabulaire: [
    { mot: 'Climat', definition: 'Moyenne des conditions météorologiques d\'une région sur au moins 30 ans.' },
    { mot: 'Météo', definition: 'Temps qu\'il fait en un lieu, sur une courte période.' },
    { mot: 'Effet de serre', definition: 'Phénomène naturel par lequel certains gaz de l\'atmosphère retiennent une partie de la chaleur de la Terre.' },
    { mot: 'Gaz à effet de serre', definition: 'Gaz qui retient la chaleur dans l\'atmosphère : vapeur d\'eau, dioxyde de carbone, méthane…' },
    { mot: 'Écosystème', definition: 'Ensemble formé par un milieu de vie et les êtres vivants qui y vivent, en interaction.' },
    { mot: 'Producteur', definition: 'Être vivant qui fabrique sa propre matière à partir de la lumière, de l\'eau et du CO₂ (les végétaux).' },
    { mot: 'Décomposeur', definition: 'Être vivant (champignon, bactérie, ver de terre…) qui transforme la matière morte en sels minéraux.' },
    { mot: 'Photosynthèse', definition: 'Fabrication de matière organique par les végétaux chlorophylliens, à partir de lumière, d\'eau et de CO₂, avec rejet de dioxygène.' },
    { mot: 'Développement durable', definition: 'Développement qui répond aux besoins actuels sans compromettre ceux des générations futures.' }
  ],
  questions: [
    { q: 'Quelle est la principale cause du réchauffement climatique actuel ?', bonne: 'Les gaz à effet de serre rejetés par les activités humaines', fausses: ['Le trou de la couche d\'ozone', 'Les volcans', 'Les variations de la distance Terre-Soleil'], explication: 'Les scientifiques du GIEC l\'ont établi : l\'essentiel du réchauffement vient de nos émissions (pétrole, charbon, gaz, déforestation).', niveau: 1 },
    { q: 'Pourquoi la déforestation aggrave-t-elle le réchauffement ?', bonne: 'Les arbres absorbent du CO₂ par la photosynthèse', fausses: ['Les arbres produisent du méthane', 'Les arbres réchauffent l\'air', 'Elle n\'a aucun effet'], explication: 'Les forêts stockent du carbone ; les brûler ou les couper libère du CO₂.', niveau: 2 },
    { q: 'Quel gaz les végétaux rejettent-ils lors de la photosynthèse ?', bonne: 'Le dioxygène', fausses: ['Le dioxyde de carbone', 'Le méthane', 'Le diazote'], niveau: 1 },
    { q: 'Qu\'est-ce qui fait monter le niveau des mers ?', bonne: 'La fonte des glaciers terrestres et la dilatation de l\'eau chaude', fausses: ['La fonte de la banquise uniquement', 'L\'évaporation de l\'eau', 'Les marées'], explication: 'La banquise flotte déjà : en fondant, elle ne fait presque pas monter la mer. Ce sont les glaciers posés sur les continents et la dilatation de l\'eau qui comptent.', niveau: 3 },
    { q: 'Quel est le rôle des décomposeurs dans un écosystème ?', bonne: 'Recycler la matière morte en sels minéraux', fausses: ['Produire de la lumière', 'Manger les herbivores', 'Fabriquer du pétrole'], niveau: 2 },
    { q: '« Il pleut à Lyon aujourd\'hui. » Cette phrase parle…', bonne: 'De météo', fausses: ['De climat', 'D\'effet de serre', 'De biodiversité'], niveau: 1 },
    { q: 'Quelle action limite le plus les émissions de CO₂ pour un trajet de 5 km ?', bonne: 'Prendre le vélo ou les transports en commun', fausses: ['Prendre la voiture seule', 'Prendre l\'avion', 'Rouler plus vite'], niveau: 1 },
    { q: 'L\'élevage des ruminants (vaches) émet surtout quel gaz à effet de serre ?', bonne: 'Du méthane', fausses: ['Du dioxygène', 'Du diazote', 'De l\'ozone'], niveau: 2 },
    { q: 'Que se passerait-il sans aucun effet de serre naturel ?', bonne: 'La Terre serait beaucoup plus froide (environ −18 °C en moyenne)', fausses: ['La Terre serait beaucoup plus chaude', 'Rien ne changerait', 'Il n\'y aurait plus de jour'], explication: 'Grâce à l\'effet de serre naturel, la température moyenne est d\'environ +15 °C.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'L\'effet de serre est un phénomène uniquement causé par l\'être humain.', vrai: false, explication: 'Il est naturel et indispensable à la vie. Les humains l\'ont <strong>renforcé</strong>.' },
    { texte: 'Le climat se définit sur une période d\'au moins 30 ans.', vrai: true, explication: 'Une journée froide ne dit rien du climat : c\'est de la météo.' },
    { texte: 'Le pétrole est une ressource renouvelable.', vrai: false, explication: 'Il s\'est formé en millions d\'années : à notre échelle, son stock est limité.' },
    { texte: 'Un hiver très froid prouve que le climat ne se réchauffe pas.', vrai: false, explication: 'Un événement isolé, c\'est de la météo. Le réchauffement se mesure sur des moyennes de plusieurs décennies.' }
  ],
  classements: [{
    question: 'Cette phrase parle-t-elle de météo ou de climat ?',
    groupes: [
      { nom: 'Météo', items: ['Demain, il fera 25 °C à Marseille', 'Un orage a éclaté hier soir', 'Il neige ce matin sur les Alpes', 'Ce week-end sera venteux'], explication: 'Le temps qu\'il fait sur une courte période.' },
      { nom: 'Climat', items: ['Autour de la Méditerranée, les étés sont chauds et secs', 'Le Sahara reçoit très peu de pluie chaque année', 'La température moyenne de la Terre augmente depuis 1900', 'En Bretagne, les hivers sont doux et humides'], explication: 'Une moyenne sur de longues périodes.' }
    ]
  }],
  calculs: { trajet: calcTrajet, chaine: calcChaine },
  modeles: {
    1: [['calc:chaine', 2], ['calc:trajet', 2], ['classement', 3], ['qcm', 3], ['vf', 2], ['vocMot', 1]],
    2: [['calc:chaine', 2], ['calc:trajet', 3], ['classement', 1], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:trajet', 3], ['calc:chaine', 1], ['qcm', 4], ['vf', 1], ['vocDef', 1]]
  }
};

export default fabriquer(banque);
