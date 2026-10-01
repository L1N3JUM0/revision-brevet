// Thème 1 · Les aires urbaines, une nouvelle géographie d'une France mondialisée
import { fabriquer } from '../../sciences/generators/fabrique.js';
import { aireNommer, aireLocaliser } from './exos-cartes.js';

export const banque = {
  id: 'aires-urbaines',
  titre: 'Les aires urbaines',
  discipline: 'g1',
  resume: 'Villes, banlieues, couronnes périurbaines : où et comment vivent les Français.',
  essentiel: [
    'Plus de <strong>8 Français sur 10</strong> vivent dans une <strong>aire urbaine</strong> : une ville-centre, sa banlieue et sa couronne périurbaine.',
    'Depuis les années 1970, la <strong>périurbanisation</strong> étale les villes : on habite une maison dans une commune périurbaine et on se déplace en voiture vers la ville pour travailler (<strong>mobilités pendulaires</strong>).',
    'L\'aire urbaine de <strong>Paris</strong> (plus de 12 millions d\'habitants) domine. Les <strong>métropoles</strong> régionales (Lyon, Marseille, Lille, Toulouse, Bordeaux, Nantes…) concentrent emplois et services.',
    'Les aires urbaines sont reliées au monde (aéroports, gares TGV, ports, sièges d\'entreprises) : c\'est la <strong>métropolisation</strong>.',
    'L\'étalement urbain pose des problèmes : embouteillages, pollution, terres agricoles grignotées. Des solutions : tramways, transports en commun, écoquartiers.'
  ],
  vocabulaire: [
    { mot: 'Aire urbaine', definition: 'Ensemble formé par un pôle urbain et sa couronne périurbaine, dont au moins 40 % des actifs travaillent dans le pôle.' },
    { mot: 'Pôle urbain', definition: 'Ville-centre et sa banlieue, qui offrent beaucoup d\'emplois.' },
    { mot: 'Couronne périurbaine', definition: 'Communes autour du pôle urbain dont de nombreux habitants vont travailler dans la ville.' },
    { mot: 'Périurbanisation', definition: 'Extension des villes vers les campagnes voisines, avec de nouveaux lotissements.' },
    { mot: 'Étalement urbain', definition: 'Avancée de la ville sur les espaces agricoles et naturels qui l\'entourent.' },
    { mot: 'Mobilités pendulaires', definition: 'Trajets quotidiens entre le domicile et le lieu de travail ou d\'études.' },
    { mot: 'Métropole', definition: 'Grande ville qui concentre population, emplois, richesses et fonctions de commandement.' },
    { mot: 'Métropolisation', definition: 'Concentration des hommes, des activités et des richesses dans les plus grandes villes.' },
    { mot: 'Gentrification', definition: 'Arrivée d\'habitants plus aisés dans un quartier populaire, qui fait monter les prix des logements.' },
    { mot: 'Banlieue', definition: 'Ensemble des communes urbanisées qui entourent la ville-centre.' }
  ],
  questions: [
    { q: 'Quelle part des Français vit dans une aire urbaine ?', bonne: 'Plus de 8 sur 10', fausses: ['Environ 1 sur 2', 'Moins de 3 sur 10', 'Environ 6 sur 10'], niveau: 1 },
    { q: 'Quelle est la plus grande aire urbaine de France ?', bonne: 'Paris', fausses: ['Lyon', 'Marseille', 'Lille'], niveau: 1 },
    { q: 'Qu\'est-ce qu\'une mobilité pendulaire ?', bonne: 'Un trajet quotidien entre domicile et travail', fausses: ['Un déménagement dans une autre région', 'Un voyage touristique à l\'étranger', 'Un trajet en avion pour les vacances'], niveau: 1 },
    { q: 'Quel moyen de transport a permis la périurbanisation ?', bonne: 'La voiture individuelle', fausses: ['Le bateau', 'L\'avion', 'Le vélo'], niveau: 1 },
    { q: 'Depuis quand la périurbanisation s\'accélère-t-elle en France ?', bonne: 'Depuis les années 1970', fausses: ['Depuis le Moyen Âge', 'Depuis 1900', 'Depuis 2020'], niveau: 2 },
    { q: 'Pourquoi des familles s\'installent-elles dans les communes périurbaines ?', bonne: 'Pour avoir une maison avec jardin, moins chère qu\'en ville', fausses: ['Pour être plus près de leur travail', 'Pour éviter de prendre la voiture', 'Parce qu\'il y a plus de services qu\'en ville'], niveau: 2 },
    { q: 'Quel est un inconvénient de l\'étalement urbain ?', bonne: 'Il consomme des terres agricoles et augmente les trajets en voiture', fausses: ['Il réduit la pollution', 'Il fait baisser le nombre de voitures', 'Il rapproche les habitants de leur travail'], niveau: 2 },
    { q: 'Qu\'est-ce qui montre qu\'une métropole est connectée au monde ?', bonne: 'Un aéroport international et des sièges de grandes entreprises', fausses: ['Un grand nombre de fermes', 'Une église ancienne', 'Une forêt protégée'], niveau: 2 },
    { q: 'Quelle solution aide à réduire les embouteillages dans une métropole ?', bonne: 'Développer les transports en commun (tramway, métro, RER)', fausses: ['Construire des lotissements plus loin', 'Supprimer les pistes cyclables', 'Fermer les gares'], niveau: 2 },
    { q: 'Qu\'appelle-t-on la gentrification d\'un quartier ?', bonne: 'L\'arrivée d\'habitants aisés qui fait monter les prix', fausses: ['La construction d\'une gare', 'Le départ des commerces', 'La création d\'un parc naturel'], niveau: 3 },
    { q: 'Quelle aire urbaine est la deuxième de France par sa population ?', bonne: 'Lyon', fausses: ['Marseille', 'Toulouse', 'Bordeaux'], niveau: 3 },
    { q: 'Dans une aire urbaine, où trouve-t-on le plus d\'emplois ?', bonne: 'Dans le pôle urbain (ville-centre et banlieue)', fausses: ['Dans la couronne périurbaine', 'Dans les communes rurales isolées', 'Autant partout'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Une aire urbaine comprend seulement la ville-centre.', vrai: false, explication: 'Elle comprend la ville-centre, sa banlieue et sa couronne périurbaine.' },
    { texte: 'Les habitants des couronnes périurbaines utilisent beaucoup la voiture.', vrai: true, explication: 'Les transports en commun y sont rares : la voiture sert à aller travailler en ville.' },
    { texte: 'Paris est la seule ville mondiale française.', vrai: true, explication: 'Paris est une ville mondiale : sièges d\'entreprises, institutions internationales, tourisme, rayonnement culturel.' },
    { texte: 'L\'étalement urbain protège les terres agricoles.', vrai: false, explication: 'Au contraire, les lotissements et les zones commerciales s\'étendent sur les terres agricoles.' }
  ],
  classements: [
    { question: 'Dans quelle partie de l\'aire urbaine trouve-t-on surtout cet élément ?', groupes: [
      { nom: 'Ville-centre', items: ['Quartier historique', 'Mairie et grands musées', 'Gare principale'] },
      { nom: 'Banlieue', items: ['Grands ensembles d\'immeubles', 'Zone industrielle ancienne'] },
      { nom: 'Couronne périurbaine', items: ['Lotissement de maisons individuelles', 'Champs entre les villages', 'Long trajet en voiture vers le travail'] }
    ] }
  ],
  calculs: { aireNommer, aireLocaliser }
};

export default fabriquer(banque);
