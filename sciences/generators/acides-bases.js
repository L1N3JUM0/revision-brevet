// Physique-Chimie — Acides, bases et pH : échelle de pH, dilution, ions H⁺ et HO⁻, réaction acide-métal.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras } from './fabrique.js';

// pH approximatifs de solutions du quotidien (valeurs usuelles, arrondies)
const SOLUTIONS = [
  { nom: 'Jus de citron', pH: 2.5 },
  { nom: 'Vinaigre', pH: 3 },
  { nom: 'Soda au cola', pH: 2.5 },
  { nom: 'Jus d\'orange', pH: 3.5 },
  { nom: 'Café', pH: 5 },
  { nom: 'Lait', pH: 6.7 },
  { nom: 'Eau pure', pH: 7 },
  { nom: 'Eau de mer', pH: 8.2 },
  { nom: 'Eau savonneuse', pH: 10 },
  { nom: 'Eau de Javel', pH: 11.5 },
  { nom: 'Déboucheur pour évier', pH: 13.5 }
];

const nature = pH => (pH < 7 ? 'Acide' : pH > 7 ? 'Basique' : 'Neutre');

function phrase(pH) {
  if (pH < 7) return `${fmt(pH)} est inférieur à 7 : la solution est ${gras('acide')}.`;
  if (pH > 7) return `${fmt(pH)} est supérieur à 7 : la solution est ${gras('basique')}.`;
  return `pH = 7 : la solution est ${gras('neutre')}.`;
}

// Acide, neutre ou basique ?
function calcNature(rng, ctx) {
  let nom, pH;
  if (rng.bool(0.5)) {
    const s = rng.choix(SOLUTIONS);
    nom = s.nom; pH = s.pH;
  } else {
    // Valeur au hasard, loin de 7 sauf exactement 7
    pH = rng.bool(0.12) ? 7 : rng.choix([rng.int(5, 60) / 10, rng.int(80, 140) / 10]);
    nom = `La solution préparée par ${ctx.prenom}`;
  }
  return {
    cle: `nature:${nom}:${pH}`,
    enonce: `<p>${nom} : <strong>pH = ${fmt(pH)}</strong>.</p><p><strong>Cette solution est…</strong></p>`,
    type: 'qcm',
    choix: ['Acide', 'Neutre', 'Basique'],
    reponse: nature(pH),
    etapes: ['Échelle de pH : de 0 à 7, <strong>acide</strong> ; 7, <strong>neutre</strong> ; de 7 à 14, <strong>basique</strong>.', phrase(pH)],
    erreurs: [{ test: r => r !== 'Neutre' && pH !== 7 && r !== nature(pH), message: 'Attention au sens : plus le pH est <strong>petit</strong>, plus la solution est acide.' }],
    donnees: { pH }
  };
}

// Classer des solutions de la plus acide à la plus basique
function calcOrdre(rng) {
  let choisies;
  do {
    choisies = rng.melanger(SOLUTIONS).slice(0, 4);
  } while (new Set(choisies.map(s => s.pH)).size < 4);
  const items = choisies.map(s => s.nom);
  const reponse = choisies.map((s, i) => ({ s, i })).sort((a, b) => a.s.pH - b.s.pH).map(x => x.i);
  return {
    cle: `ordre:${items.slice().sort().join('|')}`,
    enonce: `<p><strong>Range ces solutions de la plus acide à la plus basique.</strong></p>
      <p class="doux">${choisies.map(s => `${s.nom} : pH ${fmt(s.pH)}`).join(' · ')}</p>`,
    type: 'ordre',
    consigneOrdre: 'Touche les solutions de la <strong>plus acide</strong> (pH le plus petit) à la <strong>plus basique</strong>.',
    items,
    reponse,
    etapes: [
      'La plus acide a le pH le plus <strong>petit</strong>.',
      reponse.map(i => `${choisies[i].nom} (pH ${fmt(choisies[i].pH)})`).join(' → ')
    ],
    erreurs: [{
      test: v => Array.isArray(v) && v.every((x, j) => x === reponse[reponse.length - 1 - j]),
      message: 'C\'est à l\'envers : une solution est d\'autant plus acide que son pH est <strong>petit</strong>.'
    }],
    donnees: { ph: choisies.map(s => s.pH) }
  };
}

// Effet d'une dilution sur le pH
function calcDilution(rng) {
  const acide = rng.bool();
  const pH = acide ? rng.int(10, 50) / 10 : rng.int(90, 130) / 10;
  const nom = acide ? rng.choix(['du vinaigre', 'du jus de citron', 'une solution d\'acide chlorhydrique']) : rng.choix(['de l\'eau savonneuse', 'une solution d\'hydroxyde de sodium', 'de l\'eau de Javel']);
  const bonne = acide ? 'Il augmente et se rapproche de 7' : 'Il diminue et se rapproche de 7';
  return {
    cle: `dilution:${nom}:${pH}`,
    enonce: `<p>On ajoute beaucoup d'eau à ${nom} de pH ${fmt(pH)}.</p><p><strong>Que devient le pH ?</strong></p>`,
    type: 'qcm',
    choix: ['Il augmente et se rapproche de 7', 'Il diminue et se rapproche de 7', 'Il ne change pas', acide ? 'Il diminue et s\'éloigne de 7' : 'Il augmente et s\'éloigne de 7'],
    reponse: bonne,
    etapes: [
      'Diluer, c\'est ajouter de l\'eau : la solution devient <strong>moins acide</strong> (ou moins basique).',
      `Le pH se rapproche de 7 sans jamais le dépasser : ${gras(bonne.toLowerCase())}.`
    ],
    erreurs: [{ test: r => r === 'Il ne change pas', message: 'L\'eau ajoutée dilue les ions H⁺ (ou HO⁻) : le pH change.' }]
  };
}

export const banque = {
  id: 'acides-bases',
  titre: 'Acides, bases et pH',
  discipline: 'pc',
  resume: 'Échelle de pH, dilution, ions H⁺ et HO⁻, acide et métal.',
  essentiel: [
    'Le <strong>pH</strong> mesure l\'acidité d\'une solution, sur une échelle de 0 à 14. On le mesure avec du papier pH ou un pH-mètre.',
    'pH &lt; 7 : solution <strong>acide</strong> (plus d\'ions H⁺ que d\'ions HO⁻). pH = 7 : <strong>neutre</strong>. pH &gt; 7 : <strong>basique</strong> (plus d\'ions HO⁻).',
    'Quand on <strong>dilue</strong> une solution, son pH se rapproche de 7.',
    'Un acide réagit avec certains métaux (fer, zinc) : il se forme du <strong>dihydrogène</strong> (détonation à la flamme) et des ions métalliques (Fe²⁺).',
    'Les acides et les bases concentrés sont <strong>corrosifs</strong> : gants, lunettes, et toujours verser l\'acide dans l\'eau, jamais l\'inverse.'
  ],
  cartes: [{
    titre: 'L\'échelle de pH',
    contenu: `<ul class="liste-dates">${SOLUTIONS.map(s => `<li><strong>pH ${fmt(s.pH)}</strong> : ${s.nom} <span class="badge">${nature(s.pH).toLowerCase()}</span></li>`).join('')}</ul>`
  }],
  vocabulaire: [
    { mot: 'pH', definition: 'Nombre de 0 à 14 qui indique si une solution est acide, neutre ou basique.' },
    { mot: 'Solution acide', definition: 'Solution de pH inférieur à 7, qui contient plus d\'ions H⁺ que d\'ions HO⁻.' },
    { mot: 'Solution basique', definition: 'Solution de pH supérieur à 7, qui contient plus d\'ions HO⁻ que d\'ions H⁺.' },
    { mot: 'Solution neutre', definition: 'Solution de pH égal à 7, avec autant d\'ions H⁺ que d\'ions HO⁻.' },
    { mot: 'Dilution', definition: 'Ajout d\'eau à une solution pour la rendre moins concentrée.' },
    { mot: 'Corrosif', definition: 'Qui attaque et détruit les tissus vivants et certains matériaux.' },
    { mot: 'Ion hydroxyde', definition: 'Ion HO⁻, responsable du caractère basique d\'une solution.' }
  ],
  questions: [
    { q: 'Quel ion est responsable de l\'acidité d\'une solution ?', bonne: 'L\'ion hydrogène H⁺', fausses: ['L\'ion hydroxyde HO⁻', 'L\'ion chlorure Cl⁻', 'L\'ion sodium Na⁺'], niveau: 2 },
    { q: 'Quel gaz se forme quand de l\'acide chlorhydrique attaque du fer ?', bonne: 'Du dihydrogène', fausses: ['Du dioxygène', 'Du dioxyde de carbone', 'De la vapeur d\'eau'], explication: 'Le dihydrogène se reconnaît à sa petite détonation au contact d\'une flamme.', niveau: 2 },
    { q: 'Quels ions se forment quand de l\'acide chlorhydrique attaque du fer ?', bonne: 'Des ions fer II (Fe²⁺)', fausses: ['Des ions cuivre II (Cu²⁺)', 'Des ions hydroxyde (HO⁻)', 'Aucun ion'], explication: 'Fe + 2 H⁺ → Fe²⁺ + H₂. On les met en évidence avec la soude : précipité vert.', niveau: 3 },
    { q: 'Avec quoi mesure-t-on précisément le pH d\'une solution ?', bonne: 'Un pH-mètre', fausses: ['Un thermomètre', 'Un voltmètre', 'Une balance'], explication: 'Le papier pH donne une valeur approchée ; le pH-mètre donne une mesure précise.', niveau: 1 },
    { q: 'Que signifie ce pictogramme de danger sur un flacon d\'acide : une main et une surface rongées ?', bonne: 'Corrosif', fausses: ['Inflammable', 'Explosif', 'Dangereux pour l\'environnement'], niveau: 1 },
    { q: 'Pour diluer un acide concentré, il faut…', bonne: 'Verser l\'acide dans l\'eau', fausses: ['Verser l\'eau dans l\'acide', 'Chauffer l\'acide', 'Ajouter du sel'], explication: 'Verser l\'eau dans l\'acide peut provoquer des projections brûlantes : on verse toujours l\'acide dans l\'eau.', niveau: 3 },
    { q: 'Une solution contient plus d\'ions HO⁻ que d\'ions H⁺. Son pH est…', bonne: 'Supérieur à 7', fausses: ['Inférieur à 7', 'Égal à 7', 'Égal à 0'], explication: 'Les ions HO⁻ rendent la solution basique : pH &gt; 7.', niveau: 2 },
    { q: 'Le vinaigre a un pH de 3. Il est…', bonne: 'Acide', fausses: ['Neutre', 'Basique', 'Corrosif pour tous les métaux'], niveau: 1 }
  ],
  vraiFaux: [
    { texte: 'Une solution de pH 9 est acide.', vrai: false, explication: 'pH &gt; 7 : elle est basique.' },
    { texte: 'L\'eau pure a un pH de 7.', vrai: true, explication: 'Elle contient autant d\'ions H⁺ que d\'ions HO⁻ : elle est neutre.' },
    { texte: 'En diluant un acide, on peut obtenir une solution basique.', vrai: false, explication: 'Le pH se rapproche de 7 mais ne le dépasse pas.' },
    { texte: 'Plus le pH est petit, plus la solution est acide.', vrai: true, explication: 'Un pH de 2 est plus acide qu\'un pH de 5.' }
  ],
  calculs: { nature: calcNature, ordre: calcOrdre, dilution: calcDilution },
  modeles: {
    1: [['calc:nature', 5], ['qcm', 2], ['vf', 2], ['vocMot', 1]],
    2: [['calc:nature', 2], ['calc:ordre', 3], ['calc:dilution', 2], ['qcm', 3], ['vocDef', 1]],
    3: [['calc:ordre', 2], ['calc:dilution', 3], ['qcm', 4], ['vf', 1]]
  },
  controler(exo) {
    if (exo.cle.startsWith('nature:')) return nature(exo.donnees.pH) === exo.reponse ? null : 'nature du pH incohérente';
    if (exo.cle.startsWith('ordre:')) {
      const ph = exo.reponse.map(i => exo.donnees.ph[i]);
      return ph.every((x, k) => k === 0 || x > ph[k - 1]) ? null : 'ordre de pH incohérent';
    }
    return null;
  }
};

export default fabriquer(banque);
