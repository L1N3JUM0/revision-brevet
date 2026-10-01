// Thème 2 · Les territoires ultramarins français : une problématique spécifique
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'outre-mer',
  titre: 'Les territoires ultramarins',
  discipline: 'g2',
  resume: 'Départements et collectivités d\'outre-mer : atouts, difficultés, aménagements.',
  essentiel: [
    'Les <strong>territoires ultramarins</strong> sont les territoires français situés loin de la métropole, dans les océans Atlantique, Indien et Pacifique.',
    'Cinq sont des <strong>départements et régions d\'outre-mer (DROM)</strong> : la Guadeloupe, la Martinique, la Guyane, La Réunion et Mayotte (département depuis 2011). Ils font partie de l\'Union européenne (régions ultrapériphériques).',
    'Ils apportent à la France une immense <strong>zone économique exclusive (ZEE)</strong>, la deuxième du monde, et des atouts : biodiversité, tourisme, centre spatial de Kourou en Guyane.',
    'Ils font face à des difficultés : <strong>éloignement</strong>, insularité, chômage plus élevé, vie chère, risques naturels (cyclones, volcans, séismes).',
    'L\'État et l\'Union européenne financent des aménagements (ports, aéroports, routes) et la <strong>continuité territoriale</strong> (aide aux billets d\'avion).'
  ],
  vocabulaire: [
    { mot: 'Territoire ultramarin', definition: 'Territoire français situé hors du continent européen, au-delà des mers.' },
    { mot: 'DROM', definition: 'Département et région d\'outre-mer, qui a les mêmes institutions et les mêmes lois que la métropole.' },
    { mot: 'Zone économique exclusive', definition: 'Espace maritime, jusqu\'à 370 km des côtes, où un État exploite seul les ressources.' },
    { mot: 'Insularité', definition: 'Situation d\'un territoire entouré par la mer, qui complique les échanges.' },
    { mot: 'Région ultrapériphérique', definition: 'Région de l\'Union européenne très éloignée du continent européen.' },
    { mot: 'Continuité territoriale', definition: 'Politique qui réduit les effets de l\'éloignement, par exemple en aidant à payer les transports.' },
    { mot: 'Risque naturel', definition: 'Danger lié à un phénomène naturel (cyclone, éruption, séisme) qui menace une population.' }
  ],
  questions: [
    { q: 'Combien y a-t-il de départements et régions d\'outre-mer (DROM) ?', bonne: '5', fausses: ['2', '13', '101'], niveau: 1 },
    { q: 'Lequel de ces territoires est un DROM ?', bonne: 'La Réunion', fausses: ['La Polynésie française', 'La Corse', 'La Nouvelle-Calédonie'], niveau: 1 },
    { q: 'Dans quel océan se trouve La Réunion ?', bonne: 'L\'océan Indien', fausses: ['L\'océan Atlantique', 'L\'océan Pacifique', 'L\'océan Arctique'], niveau: 1 },
    { q: 'Sur quel continent se trouve la Guyane ?', bonne: 'L\'Amérique du Sud', fausses: ['L\'Afrique', 'L\'Asie', 'L\'Océanie'], niveau: 1 },
    { q: 'Quel atout majeur la Guyane apporte-t-elle à l\'Europe ?', bonne: 'Le centre spatial de Kourou', fausses: ['Une grande station de ski', 'Des mines de charbon', 'Le plus grand port d\'Europe'], niveau: 2 },
    { q: 'Quel est le rang de la ZEE française dans le monde ?', bonne: 'Deuxième', fausses: ['Premier', 'Dixième', 'Vingtième'], niveau: 2, explication: 'Grâce aux outre-mer, la ZEE française est la deuxième du monde, après celle des États-Unis.' },
    { q: 'Depuis quand Mayotte est-elle un département ?', bonne: '2011', fausses: ['1946', '1958', '1981'], niveau: 3 },
    { q: 'Quelle difficulté touche particulièrement les territoires ultramarins ?', bonne: 'Un chômage plus élevé qu\'en métropole', fausses: ['Un manque de littoral', 'Un climat trop froid', 'Une trop grande proximité avec Paris'], niveau: 2 },
    { q: 'Quel risque naturel menace souvent les Antilles ?', bonne: 'Les cyclones', fausses: ['Les avalanches', 'Les tempêtes de neige', 'Le grand froid'], niveau: 2 },
    { q: 'Que permet la continuité territoriale ?', bonne: 'Aider les habitants à payer leurs déplacements vers la métropole', fausses: ['Construire un pont vers la métropole', 'Supprimer la mer', 'Rendre les produits plus chers'], niveau: 3 },
    { q: 'Pourquoi la vie est-elle souvent plus chère dans les outre-mer ?', bonne: 'Beaucoup de produits sont importés de loin', fausses: ['Il n\'y a pas de magasins', 'Les produits y sont tous fabriqués à la main', 'L\'euro n\'y est pas utilisé'], niveau: 3 },
    { q: 'Quel volcan actif se trouve à La Réunion ?', bonne: 'Le piton de la Fournaise', fausses: ['Le mont Blanc', 'Le puy de Dôme', 'L\'Etna'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Les DROM font partie de l\'Union européenne.', vrai: true, explication: 'Ce sont des régions ultrapériphériques de l\'Union européenne.' },
    { texte: 'La Martinique est dans l\'océan Pacifique.', vrai: false, explication: 'La Martinique et la Guadeloupe sont aux Antilles, dans l\'océan Atlantique (mer des Caraïbes).' },
    { texte: 'Les outre-mer abritent une très grande biodiversité.', vrai: true, explication: 'Forêt amazonienne en Guyane, récifs coralliens, espèces endémiques.' },
    { texte: 'En Guadeloupe, on n\'applique pas les lois françaises.', vrai: false, explication: 'Dans les DROM, les lois sont les mêmes qu\'en métropole, avec quelques adaptations.' }
  ],
  classements: [
    { question: 'Dans quel océan se trouve ce territoire ?', groupes: [
      { nom: 'Océan Atlantique', items: ['Guadeloupe', 'Martinique', 'Guyane', 'Saint-Pierre-et-Miquelon'] },
      { nom: 'Océan Indien', items: ['La Réunion', 'Mayotte'] },
      { nom: 'Océan Pacifique', items: ['Polynésie française', 'Nouvelle-Calédonie', 'Wallis-et-Futuna'] }
    ] }
  ]
};

export default fabriquer(banque);
