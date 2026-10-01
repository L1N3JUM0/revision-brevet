// Thème 1 · Les espaces productifs et leurs évolutions
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'espaces-productifs',
  titre: 'Les espaces productifs',
  discipline: 'g1',
  resume: 'Agriculture, industrie, services, tourisme : où produit-on en France ?',
  essentiel: [
    'Un <strong>espace productif</strong> est un espace aménagé pour produire des richesses : agricole, industriel, de services ou touristique.',
    'Les <strong>services</strong> (commerce, santé, banques, informatique…) représentent environ <strong>trois emplois sur quatre</strong>. Ils sont surtout dans les métropoles.',
    'L\'industrie a perdu beaucoup d\'emplois (<strong>désindustrialisation</strong>, délocalisations), mais des industries de pointe se développent dans des <strong>technopôles</strong> (aéronautique à Toulouse, Sophia Antipolis près de Nice).',
    'La France est le <strong>premier producteur agricole de l\'Union européenne</strong>. L\'agriculture est souvent productiviste, mais l\'agriculture biologique et les produits de qualité (AOP) progressent.',
    'La France est la <strong>première destination touristique du monde</strong> : littoraux, montagnes, Paris et le patrimoine. Tous ces espaces sont liés à la <strong>mondialisation</strong>.'
  ],
  vocabulaire: [
    { mot: 'Espace productif', definition: 'Espace aménagé et utilisé pour produire des richesses (biens ou services).' },
    { mot: 'Désindustrialisation', definition: 'Recul des emplois et des activités industrielles dans un territoire.' },
    { mot: 'Délocalisation', definition: 'Transfert d\'une activité vers un autre pays où la production coûte moins cher.' },
    { mot: 'Technopôle', definition: 'Espace qui rassemble entreprises de haute technologie, universités et centres de recherche.' },
    { mot: 'Agriculture productiviste', definition: 'Agriculture qui cherche à produire le plus possible grâce aux machines, aux engrais et aux techniques modernes.' },
    { mot: 'Agro-industrie', definition: 'Ensemble des activités qui transforment les produits agricoles (laiteries, conserveries…).' },
    { mot: 'Zone industrialo-portuaire', definition: 'Espace qui associe un port et des usines qui transforment les marchandises importées.' },
    { mot: 'Mondialisation', definition: 'Mise en relation des territoires du monde par les échanges de marchandises, de capitaux, d\'informations et de personnes.' }
  ],
  questions: [
    { q: 'Quel secteur d\'activité emploie le plus de Français ?', bonne: 'Les services', fausses: ['L\'industrie', 'L\'agriculture', 'La pêche'], niveau: 1 },
    { q: 'Quelle part des emplois se trouve dans les services ?', bonne: 'Environ trois sur quatre', fausses: ['Environ un sur dix', 'Environ un sur deux', 'Presque tous'], niveau: 2 },
    { q: 'Quelle ville est le centre de l\'industrie aéronautique française ?', bonne: 'Toulouse', fausses: ['Lille', 'Brest', 'Strasbourg'], niveau: 1, explication: 'Airbus assemble ses avions près de Toulouse.' },
    { q: 'Qu\'est-ce qu\'un technopôle ?', bonne: 'Un espace qui réunit entreprises de haute technologie, universités et recherche', fausses: ['Une grande ferme moderne', 'Un port de commerce', 'Une station de ski'], niveau: 1 },
    { q: 'Quel est le rang de la France pour la production agricole dans l\'Union européenne ?', bonne: 'Premier', fausses: ['Dixième', 'Dernier', 'Cinquième'], niveau: 2 },
    { q: 'Quel est le rang de la France pour le nombre de touristes étrangers accueillis ?', bonne: 'Première destination mondiale', fausses: ['Dixième destination mondiale', 'Dernière destination européenne', 'Cinquième destination européenne'], niveau: 1 },
    { q: 'Pourquoi des usines s\'installent-elles près des grands ports (Le Havre, Dunkerque, Fos-sur-Mer) ?', bonne: 'Pour transformer sur place les matières premières importées par bateau', fausses: ['Parce que les terres y sont fertiles', 'Pour être loin des clients', 'Parce qu\'il y fait plus chaud'], niveau: 2 },
    { q: 'Qu\'est-ce qu\'une délocalisation ?', bonne: 'Le transfert d\'une production vers un pays où elle coûte moins cher', fausses: ['L\'ouverture d\'une nouvelle usine en France', 'La fermeture définitive d\'un magasin', 'La vente de produits à l\'étranger'], niveau: 2 },
    { q: 'Quel est un label qui garantit l\'origine d\'un produit agricole ?', bonne: 'AOP (appellation d\'origine protégée)', fausses: ['TGV', 'ZEE', 'SNCF'], niveau: 2 },
    { q: 'Pourquoi les entreprises de services s\'installent-elles surtout dans les métropoles ?', bonne: 'Elles y trouvent des clients, des diplômés et de bons transports', fausses: ['Les loyers y sont les moins chers', 'Il y a moins de concurrence', 'Il y a peu d\'habitants'], niveau: 3 },
    { q: 'Quel effet de la mondialisation touche les régions industrielles anciennes du Nord et de l\'Est ?', bonne: 'La fermeture d\'usines et le chômage', fausses: ['L\'arrivée massive de touristes', 'La création de stations de ski', 'La hausse de la production de charbon'], niveau: 3 },
    { q: 'Quel technopôle se trouve près de Nice ?', bonne: 'Sophia Antipolis', fausses: ['La Défense', 'Fos-sur-Mer', 'Roissy'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'L\'industrie emploie aujourd\'hui plus de Français que les services.', vrai: false, explication: 'Les services emploient environ trois actifs sur quatre.' },
    { texte: 'Le tourisme est une activité productive.', vrai: true, explication: 'Il crée des emplois et des richesses (hôtels, restaurants, loisirs).' },
    { texte: 'L\'agriculture biologique progresse en France.', vrai: true, explication: 'Les surfaces en bio augmentent, pour répondre à la demande et protéger l\'environnement.' },
    { texte: 'Un technopôle est d\'abord un espace agricole.', vrai: false, explication: 'C\'est un espace de haute technologie qui associe entreprises, universités et recherche.' }
  ],
  classements: [
    { question: 'À quel type d\'espace productif appartient cet exemple ?', groupes: [
      { nom: 'Agricole', items: ['Champs de blé de la Beauce', 'Vignobles du Bordelais', 'Élevage laitier en Normandie'] },
      { nom: 'Industriel', items: ['Zone industrialo-portuaire de Fos-sur-Mer', 'Usine aéronautique près de Toulouse'] },
      { nom: 'Services et tourisme', items: ['Quartier d\'affaires de La Défense', 'Station de ski dans les Alpes', 'Côte d\'Azur'] }
    ] }
  ]
};

export default fabriquer(banque);
