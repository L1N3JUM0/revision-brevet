// SVT — Microbes et immunité : micro-organismes, contamination, défenses de l'organisme,
// vaccination, antibiotiques, hygiène.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre } from './fabrique.js';
import { graphe } from './figures.js';

// Multiplication des bactéries : une division toutes les « d » minutes (conditions idéales)
function calcBacteries(rng, ctx, niveau) {
  const d = rng.choix([20, 30]);
  const k = niveau === 1 ? rng.int(2, 4) : rng.int(4, niveau === 2 ? 6 : 8);
  const N0 = niveau === 1 ? rng.choix([1, 2, 3]) : rng.choix([1, 2, 3, 5, 10]);
  const N = N0 * 2 ** k;
  const duree = d * k;
  const h = Math.floor(duree / 60), m = duree % 60;
  const dureeTxt = h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
  const err = erreursNombre(N);
  err.ajouter(N0 * 2 * k, 'Les bactéries ne s\'ajoutent pas : leur nombre est <strong>multiplié par 2</strong> à chaque division.');
  err.ajouter(N0 * 2 ** (k - 1), `Compte bien les divisions : ${duree} min ÷ ${d} min = ${k} divisions.`);
  err.ajouter(N0 * 2 ** (k + 1), `Compte bien les divisions : ${duree} min ÷ ${d} min = ${k} divisions.`);
  const lieu = rng.choix(['une petite plaie mal nettoyée', 'un plat laissé hors du frigo', 'une éponge de cuisine humide']);
  const facteurs = Array(k).fill('2').join(' × ');
  return {
    cle: `bact:${d}:${k}:${N0}`,
    enonce: `<p>Au départ, il y a ${N0 === 1 ? 'une bactérie' : `${N0} bactéries`} dans ${lieu}. Chaque bactérie se divise en deux toutes les ${d} minutes.</p>
      <p><strong>Combien y a-t-il de bactéries au bout de ${dureeTxt} ?</strong></p>`,
    type: 'nombre',
    unite: 'bactéries',
    reponse: N,
    etapes: [
      `${dureeTxt} = ${duree} min, soit ${duree} ÷ ${d} = ${k} divisions.`,
      'À chaque division, le nombre de bactéries est <strong>multiplié par 2</strong>.',
      `${N0} × ${facteurs} = ${gras(fmt(N))} bactéries`,
      'C\'est pour cela qu\'une infection peut se développer très vite, et qu\'il faut désinfecter une plaie et garder les aliments au frais.'
    ],
    erreurs: err.liste(),
    expression: `${N0} × ${facteurs}`
  };
}

// Taux d'anticorps après deux injections du même vaccin (unités arbitraires)
const GRAPHE_VACCIN = graphe({
  xMin: 0, xMax: 100, yMin: 0, yMax: 20, pasX: 20, pasY: 5,
  titreX: 'jours', titreY: 'anticorps',
  series: [{ points: [[0, 0], [5, 0.2], [10, 1.5], [15, 3], [25, 2.2], [40, 1.2], [60, 1], [62, 3], [66, 12], [72, 18], [85, 16], [100, 14]] }]
});

// Bactérie ou virus ? (maladies dont la cause est certaine)
const MALADIES = {
  question: 'Cette maladie est-elle causée par une bactérie ou par un virus ?',
  groupes: [
    { nom: 'Une bactérie', items: ['La tuberculose', 'Le tétanos', 'Le choléra', 'La salmonellose', 'La coqueluche'], explication: 'Les antibiotiques peuvent la soigner.' },
    { nom: 'Un virus', items: ['La grippe', 'Le rhume', 'La varicelle', 'La rougeole', 'La Covid-19', 'Les oreillons'], explication: 'Les antibiotiques sont inefficaces contre les virus.' }
  ]
};

export const banque = {
  id: 'immunite',
  titre: 'Microbes et immunité',
  discipline: 'svt',
  resume: 'Micro-organismes, défenses de l\'organisme, vaccination, antibiotiques.',
  essentiel: [
    'Les <strong>micro-organismes</strong> (bactéries, virus, champignons) sont partout. La plupart sont inoffensifs ou utiles ; certains sont <strong>pathogènes</strong>.',
    '<strong>Contamination</strong> : un microbe franchit la peau ou une muqueuse. <strong>Infection</strong> : il se multiplie dans l\'organisme.',
    '<strong>Réaction rapide</strong> : inflammation (rougeur, chaleur, gonflement, douleur) et <strong>phagocytose</strong> (des globules blancs « mangent » les microbes).',
    '<strong>Réaction plus lente</strong> : les lymphocytes B produisent des <strong>anticorps</strong> ; les lymphocytes T détruisent les cellules infectées. Des lymphocytes <strong>mémoire</strong> restent.',
    'La <strong>vaccination</strong> crée cette mémoire sans tomber malade. Les <strong>antibiotiques</strong> tuent les bactéries, mais pas les virus.'
  ],
  cartes: [{
    titre: 'Se protéger',
    contenu: `<ul>
      <li><strong>Hygiène</strong> : se laver les mains, tousser dans son coude.</li>
      <li><strong>Asepsie</strong> : éviter l'entrée des microbes (matériel stérile, gants).</li>
      <li><strong>Antisepsie</strong> : tuer les microbes sur une plaie (antiseptique).</li>
      <li><strong>Vaccin</strong> : prévient la maladie. <strong>Antibiotique</strong> : soigne une infection bactérienne.</li></ul>`
  }],
  vocabulaire: [
    { mot: 'Pathogène', definition: 'Se dit d\'un micro-organisme capable de provoquer une maladie.' },
    { mot: 'Contamination', definition: 'Entrée d\'un micro-organisme dans l\'organisme.' },
    { mot: 'Infection', definition: 'Multiplication de micro-organismes pathogènes dans l\'organisme.' },
    { mot: 'Phagocytose', definition: 'Ingestion et destruction d\'un microbe par certains globules blancs (phagocytes).' },
    { mot: 'Anticorps', definition: 'Molécule produite par les lymphocytes B, qui se fixe sur un microbe précis pour le neutraliser.' },
    { mot: 'Antigène', definition: 'Molécule étrangère reconnue par le système immunitaire, qui déclenche la production d\'anticorps.' },
    { mot: 'Vaccin', definition: 'Préparation qui contient un microbe rendu inoffensif (ou un morceau), pour créer une mémoire immunitaire.' },
    { mot: 'Antibiotique', definition: 'Médicament qui tue les bactéries ou bloque leur multiplication, sans effet sur les virus.' },
    { mot: 'Antiseptique', definition: 'Produit qui tue les microbes sur la peau ou une plaie.' },
    { mot: 'Lymphocyte', definition: 'Globule blanc responsable de la réaction immunitaire adaptative (anticorps, destruction des cellules infectées).' }
  ],
  questions: [
    { q: 'Ce graphique montre le taux d\'anticorps après deux injections du même vaccin (jour 0 et jour 60). Que constate-t-on ?', figure: GRAPHE_VACCIN, bonne: 'Après le rappel, la réponse est plus rapide et plus forte', fausses: ['Les deux réponses sont identiques', 'La première réponse est la plus forte', 'Le rappel ne produit aucun anticorps'], explication: 'Grâce aux lymphocytes <strong>mémoire</strong> formés après la 1ʳᵉ injection, la 2ᵉ réponse est plus rapide et beaucoup plus forte. C\'est le principe du rappel de vaccin.', niveau: 3 },
    { q: 'Pourquoi fait-on des rappels de vaccin ?', bonne: 'Pour renforcer et entretenir la mémoire immunitaire', fausses: ['Pour soigner une maladie en cours', 'Pour tuer les bactéries', 'Parce que le premier vaccin rend malade'], niveau: 2 },
    { q: 'Un antibiotique est-il efficace contre la grippe ?', bonne: 'Non, la grippe est due à un virus', fausses: ['Oui, toujours', 'Oui, s\'il est pris le premier jour', 'Non, car la grippe est due à une bactérie'], explication: 'Les antibiotiques n\'agissent que sur les bactéries. « Les antibiotiques, c\'est pas automatique ! »', niveau: 1 },
    { q: 'Quels sont les signes de la réaction inflammatoire ?', bonne: 'Rougeur, chaleur, gonflement, douleur', fausses: ['Pâleur, froid, démangeaisons', 'Fièvre seulement', 'Aucun signe visible'], niveau: 2 },
    { q: 'Quelles cellules produisent les anticorps ?', bonne: 'Les lymphocytes B', fausses: ['Les globules rouges', 'Les lymphocytes T', 'Les neurones'], niveau: 2 },
    { q: 'Quelle est la première barrière naturelle contre les microbes ?', bonne: 'La peau et les muqueuses', fausses: ['Les anticorps', 'Les antibiotiques', 'Le cœur'], niveau: 1 },
    { q: 'Un anticorps peut-il neutraliser n\'importe quel microbe ?', bonne: 'Non, chaque anticorps est spécifique d\'un antigène', fausses: ['Oui, tous les anticorps sont identiques', 'Oui, s\'il y en a assez', 'Non, les anticorps n\'agissent que sur les virus'], explication: 'Un anticorps reconnaît un seul antigène, comme une clé et sa serrure.', niveau: 3 },
    { q: 'Pourquoi le sida affaiblit-il les défenses de l\'organisme ?', bonne: 'Le VIH détruit certains lymphocytes T', fausses: ['Il détruit les globules rouges', 'Il bloque la digestion', 'Il empêche la fabrication des os'], explication: 'Sans ces lymphocytes, l\'organisme ne se défend plus contre des microbes habituellement peu dangereux.', niveau: 3 },
    { q: 'Que faire en premier avec une petite plaie ?', bonne: 'La nettoyer puis appliquer un antiseptique', fausses: ['Prendre un antibiotique', 'La laisser ouverte et sale', 'Mettre du sucre dessus'], niveau: 1 }
  ],
  vraiFaux: [
    { texte: 'Tous les microbes sont dangereux.', vrai: false, explication: 'La plupart sont inoffensifs, et beaucoup sont utiles (digestion, yaourt, fromage…).' },
    { texte: 'Les antibiotiques tuent les virus.', vrai: false, explication: 'Ils n\'agissent que sur les bactéries.' },
    { texte: 'Un vaccin permet d\'acquérir une mémoire immunitaire sans être malade.', vrai: true, explication: 'Il contient un microbe inactivé ou un morceau de microbe : l\'organisme fabrique des lymphocytes mémoire.' },
    { texte: 'La phagocytose est une réaction lente qui dure des semaines.', vrai: false, explication: 'C\'est une réaction rapide, qui commence en quelques heures. La production d\'anticorps, elle, prend plusieurs jours.' },
    { texte: 'Se faire vacciner protège aussi les personnes fragiles autour de soi.', vrai: true, explication: 'Plus il y a de personnes vaccinées, moins le microbe circule : c\'est une protection collective.' }
  ],
  sequences: [
    { titre: 'infection', consigne: 'Remets dans l\'ordre les étapes d\'une infection et de la défense de l\'organisme.', etapes: ['Contamination : le microbe franchit la peau', 'Infection : les microbes se multiplient', 'Réaction inflammatoire et phagocytose', 'Production d\'anticorps par les lymphocytes B', 'Élimination des microbes : guérison'] }
  ],
  classements: [MALADIES],
  calculs: { bacteries: calcBacteries },
  modeles: {
    1: [['calc:bacteries', 3], ['classement', 2], ['qcm', 3], ['vf', 2], ['vocMot', 2]],
    2: [['calc:bacteries', 3], ['classement', 2], ['sequence', 2], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:bacteries', 2], ['sequence', 2], ['qcm', 4], ['vocDef', 1], ['classement', 1]]
  }
};

export default fabriquer(banque);
