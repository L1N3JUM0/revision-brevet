// Technologie — Objets techniques : besoin et fonctions, matériaux, chaîne d'information et d'énergie,
// capteurs et actionneurs, transmission de mouvement, autonomie, cycle de vie.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net, esc } from './fabrique.js';

// Composants et fonction réalisée dans la chaîne d'information ou d'énergie
const FONCTIONS = [
  { f: 'Acquérir', chaine: 'information', items: ['Un capteur de température', 'Un bouton-poussoir', 'Un détecteur de mouvement', 'Un capteur de luminosité', 'Un micro'] },
  { f: 'Traiter', chaine: 'information', items: ['Une carte microcontrôleur (Arduino, micro:bit)', 'Le processeur d\'une console', 'Un programme informatique'] },
  { f: 'Communiquer', chaine: 'information', items: ['Un écran', 'Une DEL témoin', 'Un buzzer d\'alarme', 'Une antenne Wi-Fi'] },
  { f: 'Alimenter', chaine: 'énergie', items: ['Une batterie', 'Une pile', 'Un panneau solaire', 'Le secteur 230 V'] },
  { f: 'Distribuer', chaine: 'énergie', items: ['Un relais', 'Un variateur de vitesse', 'Un transistor qui commande un moteur'] },
  { f: 'Convertir', chaine: 'énergie', items: ['Un moteur électrique', 'Une lampe', 'Une résistance chauffante', 'Un vérin'] },
  { f: 'Transmettre', chaine: 'énergie', items: ['Un engrenage', 'Une courroie et des poulies', 'Une chaîne de vélo', 'Un système pignon-crémaillère'] }
];

function calcFonction(rng) {
  const g = rng.choix(FONCTIONS);
  const item = rng.choix(g.items);
  // Distracteurs : de préférence de la même chaîne
  const meme = FONCTIONS.filter(x => x !== g && x.chaine === g.chaine).map(x => x.f);
  const autre = FONCTIONS.filter(x => x.chaine !== g.chaine).map(x => x.f);
  const choix = rng.melanger([g.f, ...rng.melanger(meme).slice(0, 2), rng.choix(autre)]);
  return {
    cle: `fonction:${item}`,
    enonce: `<p><strong>Dans un objet technique, quelle fonction réalise cet élément ?</strong></p><p class="evenement">${esc(item)}</p>`,
    type: 'qcm',
    choix,
    reponse: g.f,
    etapes: [
      `${esc(item)} : ${gras(g.f.toLowerCase())} (chaîne d'${g.chaine}).`,
      g.chaine === 'information'
        ? 'Chaîne d\'information : <strong>acquérir</strong> (capteurs) → <strong>traiter</strong> (programme) → <strong>communiquer</strong> (affichage, ordres).'
        : 'Chaîne d\'énergie : <strong>alimenter</strong> → <strong>distribuer</strong> → <strong>convertir</strong> → <strong>transmettre</strong>.'
    ],
    erreurs: []
  };
}

// Transmission par engrenages : N2 = N1 × Z1 ÷ Z2
function calcEngrenage(rng) {
  let Z1, Z2, N1, N2;
  do {
    Z1 = rng.choix([10, 12, 15, 20, 24, 30, 36, 40, 48, 60]);
    Z2 = rng.choix([10, 12, 15, 20, 24, 30, 36, 40, 48, 60]);
    N1 = rng.choix([30, 60, 90, 100, 120, 150, 200, 300]);
    N2 = net(N1 * Z1 / Z2);
  } while (Z1 === Z2 || !Number.isInteger(N2));
  const err = erreursNombre(N2);
  err.ajouter(net(N1 * Z2 / Z1), 'Inversé : la petite roue tourne <strong>plus vite</strong> que la grande. N₂ = N₁ × Z₁ ÷ Z₂.');
  err.ajouter(N1, 'Les deux roues n\'ont pas le même nombre de dents : leurs vitesses sont différentes.');
  return {
    cle: `engrenage:${Z1}:${Z2}:${N1}`,
    enonce: `<p>Une roue menante de ${Z1} dents tourne à ${N1} tours/min. Elle entraîne une roue menée de ${Z2} dents.</p><p><strong>À quelle vitesse tourne la roue menée, en tours/min ?</strong></p>`,
    type: 'nombre',
    unite: 'tr/min',
    reponse: N2,
    etapes: [
      'Les dents qui passent sont les mêmes pour les deux roues : <strong>N₁ × Z₁ = N₂ × Z₂</strong>.',
      `N₂ = ${N1} × ${Z1} ÷ ${Z2} = ${gras(fmt(N2))} tr/min`,
      Z2 < Z1 ? 'La roue menée est plus petite : elle tourne plus vite.' : 'La roue menée est plus grande : elle tourne moins vite (mais avec plus de force).'
    ],
    erreurs: err.liste(),
    expression: `${N1} × ${Z1} ÷ ${Z2}`
  };
}

// Autonomie d'un appareil sur batterie : t = énergie stockée ÷ puissance
const BATTERIES = [
  { nom: 'Une trottinette électrique', E: [250, 300, 360, 480], P: [120, 150, 200, 240] },
  { nom: 'Une enceinte Bluetooth', E: [20, 30, 36, 40], P: [4, 5, 6, 10] },
  { nom: 'Un robot aspirateur', E: [40, 50, 60, 72], P: [20, 24, 30] },
  { nom: 'Un drone', E: [60, 75, 90], P: [150, 180, 225] }
];
function calcAutonomie(rng) {
  let b, E, P, t;
  do {
    b = rng.choix(BATTERIES);
    E = rng.choix(b.E);
    P = rng.choix(b.P);
    t = net(E / P);
  } while (Math.abs(t * 100 - Math.round(t * 100)) > 1e-9 || t * 60 % 1);
  const minutes = net(t * 60);
  const err = erreursNombre(t);
  err.ajouter(net(E * P), 'Autonomie = énergie ÷ puissance : on <strong>divise</strong>.');
  err.ajouter(net(P / E), 'C\'est l\'inverse : t = <strong>E ÷ P</strong>.');
  return {
    cle: `autonomie:${b.nom}:${E}:${P}`,
    enonce: `<p>${b.nom} a une batterie qui stocke ${E} Wh. Son moteur consomme ${P} W.</p><p><strong>Quelle est son autonomie, en heures ?</strong></p>`,
    type: 'nombre',
    unite: 'h',
    reponse: t,
    etapes: [
      'De E = P × t, on tire <strong>t = E ÷ P</strong> (E en Wh, P en W → t en h).',
      `t = ${E} ÷ ${P} = ${gras(fmt(t))} h${Number.isInteger(t) ? '' : `, soit ${fmt(minutes)} min`}.`
    ],
    erreurs: err.liste(),
    expression: `${E} ÷ ${P}`
  };
}

export const banque = {
  id: 'objets-techniques',
  titre: 'Objets techniques',
  discipline: 'techno',
  resume: 'Besoin et fonctions, matériaux, chaînes d\'information et d\'énergie, mécanismes.',
  essentiel: [
    'Un objet technique répond à un <strong>besoin</strong>. Sa <strong>fonction d\'usage</strong> dit à quoi il sert ; le <strong>cahier des charges</strong> liste les fonctions et les contraintes (prix, taille, sécurité…).',
    'Les matériaux se rangent en familles : <strong>métaux</strong>, <strong>matières plastiques</strong>, <strong>matériaux organiques</strong> (bois, cuir…), <strong>céramiques et verres</strong>, <strong>composites</strong>.',
    '<strong>Chaîne d\'information</strong> : acquérir (capteurs) → traiter (programme) → communiquer (écran, ordre).',
    '<strong>Chaîne d\'énergie</strong> : alimenter (batterie) → distribuer (relais) → convertir (moteur) → transmettre (engrenages) → l\'action est réalisée.',
    'Un <strong>capteur</strong> mesure une grandeur (température, lumière…) ; un <strong>actionneur</strong> agit sur le monde (moteur, lampe, vérin).'
  ],
  formules: [
    { nom: 'Engrenages', formule: 'N₁ × Z₁ = N₂ × Z₂', unites: 'N : vitesse (tr/min), Z : nombre de dents' },
    { nom: 'Autonomie', formule: 't = E ÷ P', unites: 'E en Wh, P en W → t en h' }
  ],
  vocabulaire: [
    { mot: 'Besoin', definition: 'Ce que l\'utilisateur désire ou ce qui lui est nécessaire.' },
    { mot: 'Fonction d\'usage', definition: 'Ce à quoi sert l\'objet technique, en une phrase.' },
    { mot: 'Cahier des charges', definition: 'Document qui décrit les fonctions que doit remplir un objet et les contraintes à respecter.' },
    { mot: 'Contrainte', definition: 'Condition imposée à l\'objet (coût, encombrement, normes, environnement…).' },
    { mot: 'Capteur', definition: 'Composant qui prélève une information sur son environnement (température, présence, lumière…).' },
    { mot: 'Actionneur', definition: 'Composant qui transforme une énergie pour agir sur le monde (moteur, lampe, vérin…).' },
    { mot: 'Prototype', definition: 'Premier exemplaire d\'un objet, réalisé pour le tester avant la fabrication en série.' },
    { mot: 'Cycle de vie', definition: 'Ensemble des étapes de la vie d\'un objet, de l\'extraction des matières premières à son recyclage.' },
    { mot: 'Matériau composite', definition: 'Assemblage de plusieurs matériaux pour combiner leurs qualités (fibre de carbone, béton armé…).' }
  ],
  questions: [
    { q: 'Quelle est la fonction d\'usage d\'une trottinette électrique ?', bonne: 'Déplacer une personne', fausses: ['Être rechargée', 'Avoir un guidon', 'Coûter moins de 400 €'], explication: 'La fonction d\'usage dit à quoi sert l\'objet. Le prix ou le guidon sont des contraintes ou des solutions techniques.', niveau: 1 },
    { q: 'Pour le cadre d\'un vélo de course léger et rigide, quel matériau choisir ?', bonne: 'Un composite en fibre de carbone', fausses: ['Du verre', 'Du bois tendre', 'Du caoutchouc'], niveau: 2 },
    { q: 'Pourquoi les câbles électriques sont-ils en cuivre entouré de plastique ?', bonne: 'Le cuivre conduit le courant, le plastique isole', fausses: ['Le plastique conduit le courant, le cuivre isole', 'Pour la couleur', 'Le cuivre est le métal le moins cher'], niveau: 1 },
    { q: 'Que doit contenir un cahier des charges ?', bonne: 'Les fonctions et les contraintes de l\'objet', fausses: ['Le mode d\'emploi seulement', 'Le prix de vente final', 'La liste des clients'], niveau: 2 },
    { q: 'Dans un portail automatique, quel élément est un capteur ?', bonne: 'La cellule qui détecte un obstacle', fausses: ['Le moteur', 'Le feu clignotant', 'Les engrenages'], explication: 'Le capteur acquiert une information ; le moteur est un actionneur, le feu communique.', niveau: 2 },
    { q: 'Pourquoi fabrique-t-on un prototype ?', bonne: 'Pour tester une solution avant la fabrication en série', fausses: ['Pour le vendre plus cher', 'Pour remplacer le cahier des charges', 'Pour éviter de faire des essais'], niveau: 2 },
    { q: 'Quelle étape du cycle de vie d\'un smartphone a le plus d\'impact sur l\'environnement ?', bonne: 'La fabrication (extraction des métaux, usines)', fausses: ['La recharge de la batterie', 'L\'emballage', 'La lecture des notifications'], explication: 'Pour un smartphone, la fabrication pèse beaucoup plus que l\'utilisation : le garder longtemps et le faire réparer réduit son impact.', niveau: 3 },
    { q: 'Une petite roue dentée entraîne une grande roue. La grande roue tourne…', bonne: 'Moins vite que la petite', fausses: ['Plus vite que la petite', 'À la même vitesse', 'Dans le même sens'], explication: 'N₂ = N₁ × Z₁ ÷ Z₂ : si Z₂ est plus grand, N₂ est plus petit. Et deux roues en contact tournent en sens inverse.', niveau: 3 },
    { q: 'Comment appelle-t-on la recherche de solutions qui consomment moins de matière et d\'énergie ?', bonne: 'L\'écoconception', fausses: ['L\'obsolescence', 'La miniaturisation', 'La publicité'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Un moteur électrique est un actionneur.', vrai: true, explication: 'Il convertit l\'énergie électrique en énergie mécanique pour agir.' },
    { texte: 'Un capteur de température transmet de l\'énergie au moteur.', vrai: false, explication: 'Un capteur acquiert une <strong>information</strong> : il appartient à la chaîne d\'information.' },
    { texte: 'Le bois est un matériau organique.', vrai: true, explication: 'Il est d\'origine végétale.' },
    { texte: 'Le cycle de vie d\'un objet commence au moment où on l\'achète.', vrai: false, explication: 'Il commence à l\'extraction des matières premières et se termine par le recyclage ou l\'élimination.' }
  ],
  sequences: [
    { titre: 'cycle', consigne: 'Remets dans l\'ordre les étapes du cycle de vie d\'un objet.', etapes: ['Extraction des matières premières', 'Fabrication', 'Transport et distribution', 'Utilisation', 'Fin de vie : recyclage'] },
    { titre: 'projet', consigne: 'Remets dans l\'ordre les étapes d\'un projet technique.', etapes: ['Exprimer le besoin', 'Rédiger le cahier des charges', 'Chercher des solutions', 'Réaliser un prototype', 'Tester et valider'] },
    { titre: 'energie', consigne: 'Remets dans l\'ordre les fonctions de la chaîne d\'énergie.', etapes: ['Alimenter', 'Distribuer', 'Convertir', 'Transmettre'] }
  ],
  classements: [
    {
      question: 'Capteur ou actionneur ?',
      groupes: [
        { nom: 'Capteur', items: ['Un thermomètre électronique', 'Un détecteur de fumée', 'Un capteur de luminosité', 'Un interrupteur de fin de course', 'Un micro'], explication: 'Il prélève une information.' },
        { nom: 'Actionneur', items: ['Un moteur', 'Un vérin', 'Une électrovanne', 'Un haut-parleur', 'Une résistance chauffante'], explication: 'Il agit sur le monde extérieur.' }
      ]
    },
    {
      question: 'À quelle famille appartient ce matériau ?',
      groupes: [
        { nom: 'Métal', items: ['L\'acier', 'L\'aluminium', 'Le cuivre'] },
        { nom: 'Plastique', items: ['Le polystyrène', 'Le PVC', 'Le polyéthylène'] },
        { nom: 'Organique', items: ['Le bois', 'Le cuir', 'Le coton'] },
        { nom: 'Céramique ou verre', items: ['La porcelaine', 'Le verre', 'La terre cuite'] }
      ]
    }
  ],
  calculs: { fonction: calcFonction, engrenage: calcEngrenage, autonomie: calcAutonomie },
  modeles: {
    1: [['calc:fonction', 3], ['classement', 4], ['qcm', 3], ['vf', 2], ['vocMot', 1]],
    2: [['calc:fonction', 3], ['calc:autonomie', 2], ['sequence', 2], ['classement', 2], ['qcm', 3], ['vocDef', 1]],
    3: [['calc:engrenage', 3], ['calc:autonomie', 3], ['calc:fonction', 1], ['sequence', 1], ['qcm', 3]]
  }
};

export default fabriquer(banque);
