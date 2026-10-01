// SVT — La planète Terre : structure du globe, tectonique des plaques, séismes, volcans, risques.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';

const CM_PAR_KM = 100000;

// Déplacement d'une plaque (quelques cm par an) sur une longue durée
function calcPlaques(rng, ctx, niveau) {
  // Vitesses réalistes, associées à chaque situation
  const [lieu, v] = rng.choix([
    ['l\'Afrique et l\'Europe se rapprochent (ce qui fait trembler la Grèce et l\'Italie)', 1],
    ['l\'océan Atlantique s\'élargit au niveau de la dorsale', rng.choix([2, 2.5])],
    ['l\'Inde continue de s\'enfoncer sous l\'Asie, au niveau de l\'Himalaya', rng.choix([4, 5])],
    ['la plaque Pacifique glisse au-dessus du point chaud d\'Hawaï', rng.choix([7, 8])]
  ]);
  const t = rng.choix(niveau === 1 ? [1000000, 10000000] : [100000, 1000000, 10000000, 50000000]);
  const dcm = net(v * t);
  const dkm = net(dcm / CM_PAR_KM);
  const err = erreursNombre(dkm);
  err.ajouter(net(dcm / 1000), `1 km = 100 000 cm (et pas 1 000) : on divise par ${fmt(CM_PAR_KM)}.`);
  err.ajouter(dcm, `${fmt(dcm)}, ce sont des <strong>centimètres</strong>. Convertis en km.`);
  return {
    cle: `plaques:${v}:${t}`,
    enonce: `<p>Les plaques lithosphériques bougent lentement : ${lieu}, à la vitesse d'environ ${fmt(v)} cm par an.</p>
      <p><strong>De combien de kilomètres se déplacent-elles en ${fmt(t)} ans ?</strong></p>`,
    type: 'nombre',
    unite: 'km',
    reponse: dkm,
    etapes: [
      `Distance = vitesse × durée = ${fmt(v)} × ${fmt(t)} = ${fmt(dcm)} cm.`,
      `1 km = 1 000 m = 100 000 cm, donc ${fmt(dcm)} cm = ${fmt(dcm)} ÷ ${fmt(CM_PAR_KM)} km = ${gras(fmt(dkm))} km.`,
      'Quelques centimètres par an (la vitesse de pousse des ongles) suffisent, en millions d\'années, à ouvrir un océan.'
    ],
    erreurs: err.liste(),
    expression: `${fmt(dcm)} ÷ ${fmt(CM_PAR_KM)}`
  };
}

// Distance d'un séisme à partir du temps d'arrivée des ondes
function calcSeisme(rng, ctx) {
  const v = rng.choix([6, 7, 8]);
  const t = rng.int(5, 40);
  const d = v * t;
  const ville = rng.choix(['une station sismique de Nice', 'un sismographe du collège', 'une station sismique de Grenoble', 'une station sismique des Pyrénées']);
  const err = erreursNombre(d);
  err.ajouter(net(t / v), 'Distance = vitesse <strong>×</strong> durée.');
  err.ajouter(net(v + t), 'On <strong>multiplie</strong> la vitesse par la durée.');
  return {
    cle: `seisme:${v}:${t}`,
    enonce: `<p>Les premières ondes d'un séisme (ondes P) voyagent à environ ${v} km/s dans la croûte. Elles arrivent à ${ville} ${t} s après le début du séisme.</p>
      <p><strong>À quelle distance se trouve le foyer, en km ?</strong></p>`,
    type: 'nombre',
    unite: 'km',
    reponse: d,
    etapes: ['Formule : <strong>d = v × t</strong>.', `d = ${v} × ${t} = ${gras(fmt(d))} km`, 'Avec trois stations, on peut localiser l\'épicentre.'],
    erreurs: err.liste(),
    expression: `${v} × ${t}`
  };
}

export const banque = {
  id: 'terre',
  titre: 'La Terre : plaques, séismes et volcans',
  discipline: 'svt',
  resume: 'Structure du globe, tectonique des plaques, séismes, volcans, risques naturels.',
  essentiel: [
    'La surface de la Terre est découpée en <strong>plaques lithosphériques</strong> rigides qui se déplacent de quelques centimètres par an sur le manteau.',
    'Aux <strong>dorsales</strong>, les plaques s\'écartent (divergence) et du magma forme un nouveau plancher océanique. Aux zones de <strong>subduction</strong>, une plaque plonge sous une autre (convergence).',
    'Les <strong>séismes</strong> et les <strong>volcans</strong> se concentrent surtout aux frontières des plaques (Grèce, Italie, Japon, Andes…).',
    'Un séisme naît au <strong>foyer</strong>, en profondeur ; l\'<strong>épicentre</strong> est le point de la surface juste au-dessus. Sa puissance se mesure par la <strong>magnitude</strong>.',
    'Volcan <strong>effusif</strong> : lave fluide, coulées. Volcan <strong>explosif</strong> : lave visqueuse, nuées ardentes, cendres. Le <strong>risque</strong> = aléa × enjeux (population, bâtiments).'
  ],
  vocabulaire: [
    { mot: 'Plaque lithosphérique', definition: 'Grand morceau rigide de la surface de la Terre, qui se déplace lentement.' },
    { mot: 'Dorsale', definition: 'Chaîne de montagnes sous-marine où deux plaques s\'écartent et où se forme un nouveau plancher océanique.' },
    { mot: 'Subduction', definition: 'Plongée d\'une plaque océanique sous une autre plaque.' },
    { mot: 'Foyer', definition: 'Point en profondeur où les roches se cassent lors d\'un séisme.' },
    { mot: 'Épicentre', definition: 'Point de la surface situé à la verticale du foyer d\'un séisme.' },
    { mot: 'Magnitude', definition: 'Valeur qui mesure l\'énergie libérée par un séisme.' },
    { mot: 'Magma', definition: 'Roche fondue en profondeur, qui alimente les volcans.' },
    { mot: 'Aléa', definition: 'Phénomène naturel possible (séisme, éruption…), avec sa probabilité et son intensité.' },
    { mot: 'Tsunami', definition: 'Vague géante provoquée le plus souvent par un séisme sous la mer.' }
  ],
  questions: [
    { q: 'Où se produisent la plupart des séismes ?', bonne: 'Aux frontières des plaques', fausses: ['Au centre des plaques', 'Uniquement au fond des océans', 'Au hasard partout sur Terre'], niveau: 1 },
    { q: 'Pourquoi la Grèce connaît-elle souvent des séismes ?', bonne: 'Elle est située près d\'une frontière entre plaques', fausses: ['Elle a beaucoup de montagnes en calcaire', 'Il y fait chaud', 'Elle est entourée par la mer'], explication: 'La plaque africaine s\'enfonce sous la plaque eurasienne au sud de la Grèce : c\'est le pays le plus sismique d\'Europe.', niveau: 2 },
    { q: 'Que se passe-t-il au niveau d\'une dorsale ?', bonne: 'Les plaques s\'écartent et du nouveau plancher océanique se forme', fausses: ['Une plaque plonge sous l\'autre', 'Deux continents entrent en collision', 'Les plaques sont immobiles'], niveau: 2 },
    { q: 'Comment s\'est formée la chaîne de l\'Himalaya ?', bonne: 'Par la collision de l\'Inde et de l\'Asie', fausses: ['Par l\'écartement de deux plaques', 'Par un seul énorme volcan', 'Par l\'érosion du vent'], niveau: 3 },
    { q: 'Comment réduire le risque sismique ?', bonne: 'Construire des bâtiments parasismiques', fausses: ['Empêcher les séismes', 'Construire plus haut', 'Interdire les mesures'], explication: 'On ne peut pas empêcher l\'aléa, mais on peut réduire la vulnérabilité : normes de construction, information, exercices.', niveau: 1 },
    { q: 'Quelle est la différence entre aléa et risque ?', bonne: 'Le risque tient compte des enjeux humains', fausses: ['Il n\'y en a aucune', 'L\'aléa ne concerne que les volcans', 'Le risque est toujours nul dans le désert'], explication: 'Un fort séisme dans un désert (aléa fort, enjeux faibles) présente un risque faible.', niveau: 3 },
    { q: 'Quel type de volcan forme des nuées ardentes ?', bonne: 'Un volcan explosif', fausses: ['Un volcan effusif', 'Tous les volcans', 'Aucun volcan'], explication: 'Une lave visqueuse bloque les gaz, qui s\'échappent violemment.', niveau: 2 },
    { q: 'Sur quoi « glissent » les plaques lithosphériques ?', bonne: 'Sur le manteau, plus chaud et plus déformable', fausses: ['Sur le noyau liquide', 'Sur les océans', 'Sur une couche d\'air'], niveau: 3 },
    { q: 'Qu\'est-ce qui peut déclencher un tsunami ?', bonne: 'Un fort séisme sous la mer', fausses: ['Une tempête de neige', 'La marée haute', 'Un orage en montagne'], niveau: 1 }
  ],
  vraiFaux: [
    { texte: 'On sait prévoir le jour exact d\'un séisme.', vrai: false, explication: 'On connaît les zones à risque, mais on ne sait pas prévoir la date d\'un séisme.' },
    { texte: 'L\'océan Atlantique s\'élargit de quelques centimètres par an.', vrai: true, explication: 'Les plaques américaines et eurasienne / africaine s\'écartent au niveau de la dorsale.' },
    { texte: 'L\'épicentre est situé en profondeur.', vrai: false, explication: 'C\'est le foyer qui est en profondeur ; l\'épicentre est à la surface.' },
    { texte: 'Le Piton de la Fournaise, à La Réunion, est un volcan effusif.', vrai: true, explication: 'Ses éruptions produisent des coulées de lave fluide.' }
  ],
  sequences: [
    { titre: 'globe', consigne: 'Range les couches de la Terre de la surface vers le centre.', aide: 'Touche les couches de la <strong>surface</strong> vers le <strong>centre</strong>.', etapes: ['Croûte', 'Manteau', 'Noyau externe (liquide)', 'Graine (noyau interne solide)'] }
  ],
  classements: [{
    question: 'Volcan effusif ou explosif ?',
    groupes: [
      { nom: 'Effusif', items: ['Le Piton de la Fournaise (La Réunion)', 'Le Kīlauea (Hawaï)', 'Des coulées de lave fluide', 'Une fontaine de lave'], explication: 'Lave fluide qui s\'écoule en coulées.' },
      { nom: 'Explosif', items: ['La montagne Pelée (Martinique)', 'Le Vésuve (Italie)', 'Santorin (Grèce), dans l\'Antiquité', 'Une nuée ardente', 'Un panache de cendres'], explication: 'Lave visqueuse, explosions, nuées ardentes et cendres.' }
    ]
  }],
  calculs: { plaques: calcPlaques, seisme: calcSeisme },
  modeles: {
    1: [['calc:seisme', 2], ['calc:plaques', 2], ['classement', 2], ['qcm', 3], ['vf', 2], ['vocMot', 2]],
    2: [['calc:plaques', 3], ['calc:seisme', 2], ['classement', 1], ['sequence', 1], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:plaques', 3], ['calc:seisme', 2], ['sequence', 1], ['qcm', 4], ['vocDef', 1]]
  }
};

export default fabriquer(banque);
