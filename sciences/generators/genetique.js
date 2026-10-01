// SVT — Génétique : chromosomes, ADN, gènes et allèles, mitose, méiose, fécondation.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre } from './fabrique.js';

// Nombre de chromosomes des cellules ordinaires (2n), valeurs établies
const ESPECES = [
  { nom: 'l\'être humain', n2: 46, themes: ['famille'] },
  { nom: 'le chimpanzé', n2: 48, themes: ['animaux'] },
  { nom: 'le cheval', n2: 64, themes: ['chevaux'] },
  { nom: 'l\'âne', n2: 62, themes: ['chevaux'] },
  { nom: 'le chien', n2: 78, themes: ['animaux', 'famille'] },
  { nom: 'le chat', n2: 38, themes: ['animaux', 'famille'] },
  { nom: 'la vache', n2: 60, themes: ['animaux', 'cuisine'] },
  { nom: 'la souris', n2: 40, themes: ['animaux', 'jeux-video'] },
  { nom: 'le lapin', n2: 44, themes: ['animaux'] },
  { nom: 'la drosophile (mouche du vinaigre)', n2: 8, themes: ['cuisine', 'animaux'] },
  { nom: 'le maïs', n2: 20, themes: ['cuisine', 'commerce'] }
];
const de = nom => nom.replace(/^l'/, 'de l\'').replace(/^le /, 'du ').replace(/^la /, 'de la ');

// Cellules et nombre de chromosomes attendus (en fonction de 2n)
const CELLULES = [
  { texte: e => `une cellule de peau ${de(e.nom)}`, nb: n2 => n2, pourquoi: 'C\'est une cellule ordinaire du corps : elle a 2n chromosomes, rangés par paires.' },
  { texte: e => `chacune des deux cellules filles obtenues par mitose d'une cellule de muscle`, nb: n2 => n2, pourquoi: 'La mitose produit deux cellules <strong>identiques</strong> à la cellule de départ : même nombre de chromosomes.' },
  { texte: e => `un gamète (cellule reproductrice) ${de(e.nom)}`, nb: n2 => n2 / 2, pourquoi: 'Lors de la méiose, chaque gamète ne reçoit qu\'<strong>un chromosome de chaque paire</strong> : n = 2n ÷ 2.' },
  { texte: e => `la cellule-œuf ${de(e.nom)}, juste après la fécondation`, nb: n2 => n2, pourquoi: 'La fécondation réunit deux gamètes de n chromosomes : n + n = 2n.' }
];

function calcChromosomes(rng, ctx, niveau) {
  const adaptes = ESPECES.filter(e => e.themes.includes(ctx.theme));
  const e = rng.choix(adaptes.length && rng.bool(0.6) ? adaptes : ESPECES);
  if (rng.bool(niveau === 1 ? 0.4 : 0.2)) {
    const paires = e.n2 / 2;
    return {
      cle: `paires:${e.nom}`,
      enonce: `<p>Les cellules ${de(e.nom)} contiennent ${e.n2} chromosomes, rangés par paires.</p><p><strong>Combien de paires de chromosomes ont-elles ?</strong></p>`,
      type: 'nombre',
      reponse: paires,
      etapes: [`Une paire = 2 chromosomes. ${e.n2} ÷ 2 = ${gras(fmt(paires))} paires.`],
      erreurs: [{ test: v => v === e.n2 * 2, message: 'On divise par 2 : une paire contient 2 chromosomes.' }],
      expression: `${e.n2} ÷ 2`
    };
  }
  const c = rng.choix(niveau === 1 ? [CELLULES[0], CELLULES[2]] : niveau === 2 ? CELLULES.slice(0, 3) : CELLULES);
  const r = c.nb(e.n2);
  const err = erreursNombre(r);
  err.ajouter(r === e.n2 ? e.n2 / 2 : e.n2, r === e.n2 ? 'Seuls les gamètes ont moitié moins de chromosomes. Ici, ce n\'est pas un gamète.' : 'Un gamète n\'a qu\'un chromosome de chaque paire : la moitié.');
  err.ajouter(e.n2 * 2, 'Le nombre de chromosomes ne double pas : il reste le même d\'une génération de cellules à l\'autre.');
  return {
    cle: `chromo:${e.nom}:${CELLULES.indexOf(c)}`,
    enonce: `<p>Chez ${e.nom}, les cellules ordinaires contiennent ${e.n2} chromosomes.</p><p><strong>Combien de chromosomes contient ${c.texte(e)} ?</strong></p>`,
    type: 'nombre',
    reponse: r,
    etapes: [c.pourquoi, `Donc ${gras(fmt(r))} chromosomes.`],
    erreurs: err.liste()
  };
}

// La mule (jument × âne) : un exemple de fécondation entre deux espèces proches
function calcMule(rng) {
  const cheval = ESPECES.find(e => e.nom === 'le cheval'), ane = ESPECES.find(e => e.nom === 'l\'âne');
  const r = cheval.n2 / 2 + ane.n2 / 2;
  const err = erreursNombre(r);
  err.ajouter(cheval.n2 + ane.n2, 'Chaque parent ne transmet qu\'un <strong>gamète</strong>, avec la moitié de ses chromosomes.');
  return {
    cle: 'mule',
    enonce: `<p>Une mule naît d'une jument (${cheval.n2} chromosomes) et d'un âne (${ane.n2} chromosomes).</p><p><strong>Combien de chromosomes ont les cellules de la mule ?</strong></p>`,
    type: 'nombre',
    reponse: r,
    etapes: [
      `L'ovule de la jument apporte ${cheval.n2} ÷ 2 = ${cheval.n2 / 2} chromosomes ; le spermatozoïde de l'âne, ${ane.n2} ÷ 2 = ${ane.n2 / 2}.`,
      `${cheval.n2 / 2} + ${ane.n2 / 2} = ${gras(fmt(r))} chromosomes.`,
      'Nombre impair : les chromosomes ne peuvent pas tous former des paires, c\'est pourquoi la mule est presque toujours stérile.'
    ],
    erreurs: err.liste(),
    expression: `${cheval.n2 / 2} + ${ane.n2 / 2}`
  };
}

// Groupes sanguins : chaque parent transmet un allèle (A et B dominants, O récessif)
function groupe(a1, a2) {
  const s = [a1, a2].sort().join('');
  if (s === 'AB') return 'AB';
  if (s.includes('A')) return 'A';
  if (s.includes('B')) return 'B';
  return 'O';
}
function calcGroupe(rng) {
  const a1 = rng.choix(['A', 'B', 'O']), a2 = rng.choix(['A', 'B', 'O']);
  const g = groupe(a1, a2);
  return {
    cle: `groupe:${a1}${a2}`,
    enonce: `<p>Le groupe sanguin dépend d'un gène qui existe sous trois versions (allèles) : A, B et O. Les allèles A et B sont dominants, O est récessif.</p>
      <p>Un enfant reçoit l'allèle <strong>${a1}</strong> de sa mère et l'allèle <strong>${a2}</strong> de son père.</p><p><strong>Quel est son groupe sanguin ?</strong></p>`,
    type: 'qcm',
    choix: ['A', 'B', 'AB', 'O'],
    reponse: g,
    etapes: [
      `Ses deux allèles : ${a1} et ${a2}.`,
      g === 'AB' ? 'A et B s\'expriment tous les deux (codominance) : groupe ' + gras('AB') + '.'
        : g === 'O' ? 'Avec deux allèles O, seul O s\'exprime : groupe ' + gras('O') + '.'
          : a1 === a2 ? `Deux allèles ${g} : groupe ${gras(g)}.` : `L'allèle O est récessif : il est « masqué » par ${g}. Groupe ${gras(g)}.`
    ],
    erreurs: [{ test: r => r === 'O' && g !== 'O', message: 'L\'allèle O est <strong>récessif</strong> : il ne s\'exprime que s\'il est présent en deux exemplaires.' }]
  };
}

export const banque = {
  id: 'genetique',
  titre: 'Génétique et hérédité',
  discipline: 'svt',
  resume: 'Chromosomes, ADN, gènes et allèles, mitose, méiose et fécondation.',
  essentiel: [
    'Le <strong>noyau</strong> de chaque cellule contient les <strong>chromosomes</strong>, faits d\'<strong>ADN</strong> : c\'est le support de l\'information génétique.',
    'Un <strong>gène</strong> est une portion d\'ADN qui détermine un caractère. Il peut exister sous plusieurs versions : les <strong>allèles</strong>.',
    'Chez l\'être humain, les cellules ont <strong>46 chromosomes</strong> (23 paires). Les gamètes (ovules, spermatozoïdes) n\'en ont que 23.',
    'La <strong>mitose</strong> donne deux cellules identiques (croissance, réparation). La <strong>méiose</strong> fabrique les gamètes avec un chromosome de chaque paire.',
    'La <strong>fécondation</strong> réunit un ovule et un spermatozoïde : chaque enfant reçoit une combinaison unique d\'allèles (sauf les vrais jumeaux).'
  ],
  cartes: [{
    titre: 'Du plus petit au plus grand',
    contenu: '<p class="calcul" style="font-size: 18px;">ADN → gène → chromosome → noyau → cellule</p><p>Le <strong>caryotype</strong> est la photo des chromosomes d\'une cellule, rangés par paires. La 23ᵉ paire : XX chez une fille, XY chez un garçon.</p>'
  }],
  vocabulaire: [
    { mot: 'Chromosome', definition: 'Élément du noyau formé d\'ADN, visible au moment de la division de la cellule.' },
    { mot: 'ADN', definition: 'Longue molécule qui porte l\'information génétique.' },
    { mot: 'Gène', definition: 'Portion d\'ADN qui détermine un caractère héréditaire.' },
    { mot: 'Allèle', definition: 'Version d\'un gène (par exemple A, B ou O pour le groupe sanguin).' },
    { mot: 'Caryotype', definition: 'Image des chromosomes d\'une cellule, classés par paires et par taille.' },
    { mot: 'Mitose', definition: 'Division d\'une cellule en deux cellules filles identiques, avec le même nombre de chromosomes.' },
    { mot: 'Méiose', definition: 'Division qui produit les gamètes, avec un seul chromosome de chaque paire.' },
    { mot: 'Gamète', definition: 'Cellule reproductrice : ovule chez la femme, spermatozoïde chez l\'homme.' },
    { mot: 'Fécondation', definition: 'Union d\'un ovule et d\'un spermatozoïde, qui forme la cellule-œuf.' },
    { mot: 'Mutation', definition: 'Modification de l\'ADN, qui peut créer un nouvel allèle.' }
  ],
  questions: [
    { q: 'Où se trouvent les chromosomes dans une cellule ?', bonne: 'Dans le noyau', fausses: ['Dans la membrane', 'Dans le sang', 'Autour de la cellule'], niveau: 1 },
    { q: 'Quelle est la paire de chromosomes sexuels d\'une fille ?', bonne: 'XX', fausses: ['XY', 'YY', 'X seul'], explication: 'Fille : XX. Garçon : XY. C\'est le spermatozoïde (X ou Y) qui détermine le sexe.', niveau: 1 },
    { q: 'Pourquoi deux frères et sœurs (non jumeaux) ne sont-ils pas identiques ?', bonne: 'Chacun a reçu une combinaison différente d\'allèles', fausses: ['Ils n\'ont pas les mêmes gènes', 'Ils n\'ont pas le même nombre de chromosomes', 'Seul le père transmet ses gènes'], explication: 'La méiose et la fécondation brassent les allèles : chaque enfant est unique.', niveau: 2 },
    { q: 'Les vrais jumeaux ont le même ADN car…', bonne: 'Ils viennent d\'une seule cellule-œuf', fausses: ['Ils sont nés le même jour', 'Ils viennent de deux ovules différents', 'Ils ont grandi ensemble'], explication: 'Une cellule-œuf qui se sépare en deux au début du développement donne deux embryons génétiquement identiques.', niveau: 3 },
    { q: 'Quel est le rôle de la mitose ?', bonne: 'Produire des cellules identiques pour la croissance et la réparation', fausses: ['Fabriquer les gamètes', 'Mélanger les allèles des parents', 'Diviser par deux le nombre de chromosomes'], niveau: 2 },
    { q: 'Que se passe-t-il avant une mitose ?', bonne: 'Chaque chromosome est copié (dupliqué)', fausses: ['Les chromosomes disparaissent', 'La moitié des chromosomes est détruite', 'Le noyau sort de la cellule'], explication: 'Chaque chromosome est dupliqué, puis les copies se séparent : chaque cellule fille reçoit l\'information complète.', niveau: 3 },
    { q: 'Les caractères d\'un individu dépendent…', bonne: 'De ses gènes et de son environnement', fausses: ['Uniquement de ses gènes', 'Uniquement de son environnement', 'Uniquement de sa mère'], explication: 'Exemple : la couleur de peau dépend des gènes, mais aussi de l\'exposition au soleil.', niveau: 2 },
    { q: 'La trisomie 21 correspond à…', bonne: 'Trois chromosomes 21 au lieu de deux', fausses: ['L\'absence de chromosome 21', 'Un chromosome 21 cassé en trois', '21 chromosomes au lieu de 46'], explication: 'Les cellules ont alors 47 chromosomes.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Un spermatozoïde humain contient 46 chromosomes.', vrai: false, explication: 'C\'est un gamète : il n\'en contient que 23, un de chaque paire.' },
    { texte: 'Toutes les cellules d\'une personne ont la même information génétique.', vrai: true, explication: 'Elles proviennent toutes de la cellule-œuf par mitoses successives (sauf les gamètes, qui n\'en ont que la moitié).' },
    { texte: 'L\'ADN se trouve dans les chromosomes.', vrai: true, explication: 'Un chromosome est formé d\'une très longue molécule d\'ADN enroulée.' },
    { texte: 'Un allèle récessif s\'exprime toujours.', vrai: false, explication: 'Il ne s\'exprime que s\'il est présent sur les deux chromosomes de la paire.' }
  ],
  sequences: [
    { titre: 'taille', consigne: 'Range du plus petit au plus grand.', aide: 'Touche les éléments du <strong>plus petit</strong> au <strong>plus grand</strong>.', etapes: ['Gène', 'Chromosome', 'Noyau', 'Cellule', 'Organe'], explication: 'Un gène est une portion de chromosome ; les chromosomes sont dans le noyau, lui-même dans la cellule.' },
    { titre: 'reproduction', consigne: 'Remets dans l\'ordre les étapes de la reproduction.', etapes: ['Méiose : fabrication des gamètes', 'Fécondation : un ovule et un spermatozoïde s\'unissent', 'Formation de la cellule-œuf', 'Mitoses successives : l\'embryon se développe'] },
    { titre: 'mitose', consigne: 'Remets dans l\'ordre les étapes de la mitose.', etapes: ['Copie (duplication) de chaque chromosome', 'Les chromosomes deviennent visibles', 'Les deux copies de chaque chromosome se séparent', 'Formation de deux cellules filles identiques'] }
  ],
  calculs: { chromosomes: calcChromosomes, mule: calcMule, groupe: calcGroupe },
  modeles: {
    1: [['calc:chromosomes', 4], ['qcm', 3], ['vf', 2], ['vocMot', 2]],
    2: [['calc:chromosomes', 3], ['calc:groupe', 3], ['sequence', 2], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:chromosomes', 3], ['calc:groupe', 2], ['calc:mule', 1], ['sequence', 2], ['qcm', 3]]
  },
  controler(exo) {
    const m = exo.cle.match(/^groupe:(.)(.)$/);
    if (m) return groupe(m[1], m[2]) === exo.reponse ? null : 'groupe sanguin incohérent';
    return null;
  }
};

export default fabriquer(banque);
