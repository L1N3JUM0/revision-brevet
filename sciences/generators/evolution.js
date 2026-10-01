// SVT — Biodiversité et évolution : classification, parenté, sélection naturelle, histoire de la vie.
import { fabriquer, gras, esc } from './fabrique.js';

// Classes de vertébrés et leurs caractères distinctifs
const CLASSES = [
  { nom: 'Mammifère', caractere: 'des poils et des mamelles', animaux: ['Le cheval', 'Le dauphin', 'La chauve-souris', 'La baleine', 'L\'être humain', 'Le chat', 'L\'ornithorynque', 'La vache'] },
  { nom: 'Oiseau', caractere: 'des plumes et un bec', animaux: ['Le manchot', 'L\'autruche', 'La poule', 'L\'aigle', 'Le pigeon', 'La chouette'] },
  { nom: 'Reptile', caractere: 'des écailles sèches et des poumons', animaux: ['Le crocodile', 'La tortue', 'Le serpent', 'Le lézard', 'Le caméléon'] },
  { nom: 'Amphibien', caractere: 'une peau nue et humide, une vie entre eau et terre', animaux: ['La grenouille', 'La salamandre', 'Le crapaud', 'Le triton'] },
  { nom: 'Poisson', caractere: 'des nageoires et des branchies', animaux: ['La carpe', 'Le saumon', 'La sardine', 'Le thon', 'La truite'] }
];
// Animaux qui ressemblent à une autre classe (pièges classiques)
const PIEGES = {
  'Le dauphin': 'Il vit dans l\'eau et ressemble à un poisson, mais il respire avec des poumons et allaite ses petits : c\'est un mammifère.',
  'La baleine': 'Malgré sa forme de poisson, elle a des poumons et allaite ses petits.',
  'La chauve-souris': 'Elle vole, mais elle a des poils et allaite ses petits : ce n\'est pas un oiseau.',
  'Le manchot': 'Il ne vole pas, mais il a des plumes et un bec.',
  'L\'ornithorynque': 'Il pond des œufs, mais il a des poils et allaite ses petits.',
  'L\'autruche': 'Elle ne vole pas, mais elle a des plumes.'
};

function calcClasse(rng) {
  const c = rng.choix(CLASSES);
  const a = rng.choix(c.animaux);
  return {
    cle: `classe:${a}`,
    enonce: `<p><strong>Dans quel groupe de vertébrés classe-t-on cet animal ?</strong></p><p class="evenement">${esc(a)}</p>`,
    type: 'qcm',
    choix: CLASSES.map(x => x.nom),
    reponse: c.nom,
    etapes: [`${a} possède ${c.caractere} : c'est un ${gras(c.nom.toLowerCase())}.`, ...(PIEGES[a] ? [PIEGES[a]] : [])],
    erreurs: PIEGES[a] ? [{ test: r => r !== c.nom, message: PIEGES[a] }] : []
  };
}

// Le plus proche parent : celui qui partage le plus de caractères (même classe).
// Les reptiles sont exclus comme cible : le crocodile est plus proche des oiseaux que du lézard.
function calcParente(rng) {
  const c = rng.choix(CLASSES.filter(x => x.nom !== 'Reptile'));
  const [cible, parent] = rng.melanger(c.animaux).slice(0, 2);
  const autres = rng.melanger(CLASSES.filter(x => x !== c)).slice(0, 3).map(x => rng.choix(x.animaux));
  const minus = s => s[0].toLowerCase() + s.slice(1);
  return {
    cle: `parente:${cible}:${parent}:${autres.join('|')}`,
    enonce: `<p><strong>Quel animal est le plus proche parent ${cible.startsWith('L\'') ? 'de l\'' + cible.slice(2) : cible.startsWith('Le ') ? 'du ' + cible.slice(3) : 'de la ' + cible.slice(3)} ?</strong></p>`,
    type: 'qcm',
    choix: rng.melanger([parent, ...autres]),
    reponse: parent,
    etapes: [
      'Deux espèces sont d\'autant plus proches parentes qu\'elles <strong>partagent de caractères</strong> hérités d\'un ancêtre commun.',
      `${cible} et ${minus(parent)} ont tous deux ${c.caractere} : ce sont des ${c.nom.toLowerCase()}s. Ils ont un ancêtre commun plus récent qu'avec ${autres.map(minus).join(', ')}.`,
      ...(PIEGES[cible] ? [PIEGES[cible]] : [])
    ],
    erreurs: []
  };
}

export const banque = {
  id: 'evolution',
  titre: 'Biodiversité et évolution',
  discipline: 'svt',
  resume: 'Classer le vivant, liens de parenté, sélection naturelle, histoire de la vie.',
  essentiel: [
    'La <strong>biodiversité</strong>, c\'est la diversité des écosystèmes, des espèces et des individus au sein d\'une espèce.',
    'On classe les êtres vivants selon les <strong>caractères qu\'ils partagent</strong> (pas selon leur mode de vie) : le dauphin est un mammifère, pas un poisson.',
    'Les espèces actuelles descendent d\'<strong>ancêtres communs</strong> : plus deux espèces partagent de caractères, plus elles sont proches parentes.',
    'Les <strong>mutations</strong> créent de nouveaux allèles au hasard. La <strong>sélection naturelle</strong> favorise les individus les mieux adaptés à leur milieu : ils se reproduisent davantage.',
    'Les <strong>fossiles</strong> montrent que les espèces changent au cours du temps. Il y a 66 millions d\'années, une crise biologique a fait disparaître les dinosaures (sauf les ancêtres des oiseaux).'
  ],
  cartes: [{
    titre: 'Les vertébrés',
    contenu: `<ul>${CLASSES.map(c => `<li><strong>${c.nom}s</strong> : ${c.caractere}</li>`).join('')}</ul><p class="doux petit">Tous ont un squelette interne avec une colonne vertébrale.</p>`
  }],
  vocabulaire: [
    { mot: 'Biodiversité', definition: 'Diversité du vivant : écosystèmes, espèces et individus.' },
    { mot: 'Espèce', definition: 'Ensemble d\'individus qui se ressemblent et peuvent se reproduire entre eux en ayant une descendance fertile.' },
    { mot: 'Ancêtre commun', definition: 'Espèce disparue dont descendent plusieurs espèces actuelles.' },
    { mot: 'Sélection naturelle', definition: 'Tri des individus par le milieu : les mieux adaptés survivent et se reproduisent davantage.' },
    { mot: 'Fossile', definition: 'Reste ou trace d\'un être vivant conservé dans une roche.' },
    { mot: 'Crise biologique', definition: 'Disparition d\'un grand nombre d\'espèces en peu de temps à l\'échelle géologique.' },
    { mot: 'Vertébré', definition: 'Animal qui possède une colonne vertébrale.' },
    { mot: 'Dérive génétique', definition: 'Variation au hasard de la fréquence des allèles dans une petite population.' }
  ],
  questions: [
    { q: 'Sur quoi se base la classification actuelle du vivant ?', bonne: 'Les caractères partagés', fausses: ['Le lieu de vie', 'La taille', 'Le régime alimentaire'], explication: 'Un dauphin et un thon vivent dans l\'eau, mais le dauphin partage bien plus de caractères avec le cheval.', niveau: 1 },
    { q: 'D\'où viennent les nouveaux allèles dans une population ?', bonne: 'Des mutations de l\'ADN', fausses: ['De l\'entraînement des individus', 'Des besoins de l\'animal', 'De la nourriture'], explication: 'Les mutations se produisent au hasard ; elles ne sont pas « choisies » pour répondre à un besoin.', niveau: 2 },
    { q: 'Des bactéries deviennent résistantes à un antibiotique utilisé trop souvent. Pourquoi ?', bonne: 'Les bactéries résistantes survivent et se multiplient', fausses: ['Les bactéries apprennent à résister', 'L\'antibiotique fabrique des bactéries', 'Toutes les bactéries mutent en même temps'], explication: 'C\'est la sélection naturelle : l\'antibiotique tue les bactéries sensibles, les rares résistantes prennent toute la place.', niveau: 3 },
    { q: 'Quand les dinosaures non aviens ont-ils disparu ?', bonne: 'Il y a environ 66 millions d\'années', fausses: ['Il y a environ 6 000 ans', 'Il y a environ 66 000 ans', 'Il y a environ 6 milliards d\'années'], niveau: 2 },
    { q: 'Quels animaux actuels descendent des dinosaures ?', bonne: 'Les oiseaux', fausses: ['Les serpents', 'Les grenouilles', 'Les requins'], niveau: 2 },
    { q: 'Que montre la présence de nombreux fossiles d\'espèces disparues ?', bonne: 'Que les espèces changent au cours du temps', fausses: ['Que les espèces ne changent jamais', 'Que la Terre est jeune', 'Que les fossiles se forment en un an'], niveau: 1 },
    { q: 'Quelle action humaine menace le plus la biodiversité ?', bonne: 'La destruction des milieux naturels', fausses: ['La création de réserves naturelles', 'La plantation de haies', 'Les passages à faune sous les routes'], explication: 'Déforestation, urbanisation, pollution, surpêche et espèces invasives font reculer la biodiversité.', niveau: 1 },
    { q: 'Le cheval et l\'âne peuvent avoir un petit (la mule), mais il est presque toujours stérile. Donc…', bonne: 'Le cheval et l\'âne sont deux espèces différentes', fausses: ['Le cheval et l\'âne sont la même espèce', 'La mule est une nouvelle espèce', 'L\'âne est un cheval malade'], explication: 'Une espèce : des individus qui se reproduisent entre eux avec une descendance <strong>fertile</strong>.', niveau: 3 },
    { q: 'Une population d\'oiseaux est isolée sur une île. Au fil des générations…', bonne: 'Elle peut évoluer vers une nouvelle espèce', fausses: ['Elle reste forcément identique', 'Elle devient forcément plus grosse', 'Tous les individus deviennent identiques'], explication: 'Mutations, sélection naturelle et dérive génétique la font évoluer différemment de la population d\'origine.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'L\'être humain descend du chimpanzé.', vrai: false, explication: 'L\'être humain et le chimpanzé ont un <strong>ancêtre commun</strong>. Aucun ne descend de l\'autre.' },
    { texte: 'La chauve-souris est un mammifère.', vrai: true, explication: 'Elle a des poils et allaite ses petits.' },
    { texte: 'Un animal mute pour s\'adapter quand son milieu change.', vrai: false, explication: 'Les mutations sont dues au hasard. Le milieu « trie » ensuite les individus : c\'est la sélection naturelle.' },
    { texte: 'Les oiseaux sont des descendants des dinosaures.', vrai: true, explication: 'Ils sont les seuls dinosaures à avoir survécu à la crise d\'il y a 66 millions d\'années.' }
  ],
  sequences: [
    { titre: 'histoire', consigne: 'Remets ces étapes de l\'histoire de la vie dans l\'ordre.', aide: 'Touche les étapes de la <strong>plus ancienne</strong> à la <strong>plus récente</strong>.', etapes: ['Premières bactéries', 'Premiers poissons', 'Premiers vertébrés à quatre pattes', 'Premiers dinosaures', 'Disparition des dinosaures non aviens', 'Premiers Homo sapiens'], explication: 'La vie apparaît il y a plus de 3,5 milliards d\'années ; Homo sapiens il y a environ 300 000 ans seulement.' },
    { titre: 'selection', consigne: 'Remets dans l\'ordre les étapes de la sélection naturelle.', etapes: ['Des mutations créent des différences entre les individus', 'Le milieu de vie change', 'Les individus les mieux adaptés survivent et ont plus de descendants', 'Leurs allèles deviennent plus fréquents dans la population'] }
  ],
  calculs: { classe: calcClasse, parente: calcParente },
  modeles: {
    1: [['calc:classe', 4], ['qcm', 3], ['vf', 2], ['vocMot', 2]],
    2: [['calc:classe', 2], ['calc:parente', 3], ['sequence', 2], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:parente', 3], ['sequence', 2], ['qcm', 4], ['vocDef', 1]]
  },
  controler(exo) {
    if (exo.cle.startsWith('parente:')) {
      const classeDe = a => CLASSES.find(c => c.animaux.includes(a));
      const cible = exo.cle.split(':')[1];
      const memes = exo.choix.filter(a => classeDe(a) === classeDe(cible));
      return memes.length === 1 && memes[0] === exo.reponse ? null : 'parenté ambiguë';
    }
    return null;
  }
};

export default fabriquer(banque);
