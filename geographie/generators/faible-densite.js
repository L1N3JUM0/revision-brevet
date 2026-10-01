// Thème 1 · Les espaces de faible densité et leurs atouts (sujet de référence du DNB 2027)
import { fabriquer } from '../../sciences/generators/fabrique.js';
import { croquisZone } from './exos-cartes.js';

export const banque = {
  id: 'faible-densite',
  titre: 'Les espaces de faible densité',
  discipline: 'g1',
  resume: 'Campagnes isolées et montagnes : difficultés, atouts et nouvelles dynamiques.',
  essentiel: [
    'Un <strong>espace de faible densité</strong> compte peu d\'habitants au km² (souvent moins de 30, contre plus de 100 en moyenne en France). Il couvre une grande partie du territoire.',
    'On en trouve dans la <strong>« diagonale des faibles densités »</strong>, des Ardennes aux Landes, et dans les montagnes.',
    'Certains connaissent une <strong>déprise</strong> : départ des jeunes, <strong>vieillissement</strong>, fermeture de commerces, d\'écoles et de services publics.',
    'D\'autres sont attractifs : <strong>néo-ruraux</strong>, retraités, télétravail, <strong>tourisme vert</strong>, résidences secondaires, produits de qualité, énergies renouvelables.',
    'L\'<strong>aménagement</strong> (internet à haut débit, maisons de santé, France services) aide ces territoires à garder leurs habitants.'
  ],
  vocabulaire: [
    { mot: 'Espace de faible densité', definition: 'Territoire où vivent peu d\'habitants par kilomètre carré, souvent rural ou montagnard.' },
    { mot: 'Déprise', definition: 'Recul des activités et de la population d\'un territoire.' },
    { mot: 'Vieillissement', definition: 'Augmentation de la part des personnes âgées dans une population.' },
    { mot: 'Néo-rural', definition: 'Habitant venu de la ville pour s\'installer à la campagne.' },
    { mot: 'Tourisme vert', definition: 'Tourisme pratiqué à la campagne, au contact de la nature (randonnée, gîtes).' },
    { mot: 'Exode rural', definition: 'Départ massif des habitants des campagnes vers les villes.' },
    { mot: 'Désert médical', definition: 'Territoire où il manque des médecins pour soigner la population.' },
    { mot: 'Parc naturel régional', definition: 'Territoire rural protégé qui valorise son patrimoine naturel et culturel tout en développant ses activités.' }
  ],
  questions: [
    { q: 'Qu\'est-ce qu\'un espace de faible densité ?', bonne: 'Un espace où vivent peu d\'habitants par km²', fausses: ['Un espace très peuplé', 'Un espace sans aucun habitant', 'Une zone industrielle'], niveau: 1 },
    { q: 'Où se trouve la « diagonale des faibles densités » ?', bonne: 'Des Ardennes aux Landes', fausses: ['De Lille à Marseille', 'Le long de la Méditerranée', 'Autour de Paris'], niveau: 1 },
    { q: 'Qu\'est-ce qu\'un néo-rural ?', bonne: 'Un habitant venu de la ville s\'installer à la campagne', fausses: ['Un agriculteur né à la campagne', 'Un touriste étranger', 'Un habitant qui part vivre en ville'], niveau: 1 },
    { q: 'Quelle est une difficulté de nombreux espaces de faible densité ?', bonne: 'La fermeture des services (écoles, commerces, médecins)', fausses: ['Les embouteillages', 'Le manque de terres agricoles', 'La trop forte densité de population'], niveau: 1 },
    { q: 'Quel est un atout des espaces de faible densité ?', bonne: 'Un cadre de vie calme et des paysages préservés', fausses: ['De nombreuses gares TGV', 'Une population très jeune partout', 'Des loyers très élevés'], niveau: 1 },
    { q: 'Qu\'appelle-t-on la déprise ?', bonne: 'Le recul de la population et des activités', fausses: ['L\'arrivée de nouveaux habitants', 'La construction d\'autoroutes', 'L\'augmentation des naissances'], niveau: 2 },
    { q: 'Quelle évolution récente aide certaines campagnes à attirer des habitants ?', bonne: 'Le télétravail grâce à internet', fausses: ['La fermeture des écoles', 'La disparition des commerces', 'Le départ des jeunes'], niveau: 2 },
    { q: 'Quelle activité valorise les campagnes et les montagnes ?', bonne: 'Le tourisme vert', fausses: ['L\'industrie lourde', 'Les quartiers d\'affaires', 'Les grands ports'], niveau: 2 },
    { q: 'Pourquoi la population de certains villages vieillit-elle ?', bonne: 'Les jeunes partent étudier et travailler en ville', fausses: ['Les personnes âgées partent en ville', 'Il y a trop d\'écoles', 'Les familles y ont beaucoup d\'enfants'], niveau: 2 },
    { q: 'Quelle mesure d\'aménagement aide les habitants des espaces de faible densité ?', bonne: 'Créer des maisons de santé et installer la fibre', fausses: ['Fermer les petites lignes de bus', 'Supprimer les bureaux de poste', 'Construire un aéroport dans chaque village'], niveau: 3 },
    { q: 'Quelle énergie renouvelable se développe dans de nombreux espaces ruraux ?', bonne: 'L\'éolien et le solaire', fausses: ['Le charbon', 'Le pétrole', 'Le gaz naturel'], niveau: 3 },
    { q: 'Quelle est la densité moyenne de la France métropolitaine, environ ?', bonne: 'Un peu plus de 100 habitants par km²', fausses: ['Environ 10 habitants par km²', 'Environ 1 000 habitants par km²', 'Environ 30 habitants par km²'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Tous les espaces de faible densité perdent des habitants.', vrai: false, explication: 'Certains en gagnent grâce aux néo-ruraux, aux retraités ou au tourisme.' },
    { texte: 'Les montagnes sont souvent des espaces de faible densité.', vrai: true, explication: 'Le relief et le climat y limitent le peuplement, sauf dans les vallées et les stations.' },
    { texte: 'Les espaces de faible densité couvrent une petite partie du territoire.', vrai: false, explication: 'Ils couvrent une grande partie du territoire, mais n\'abritent qu\'une petite part de la population.' },
    { texte: 'Le manque de médecins est un problème dans certaines campagnes.', vrai: true, explication: 'On parle de « déserts médicaux ».' }
  ],
  classements: [
    { question: 'Est-ce une difficulté ou un atout pour un espace de faible densité ?', groupes: [
      { nom: 'Difficulté', items: ['Vieillissement de la population', 'Fermeture de l\'école du village', 'Manque de médecins', 'Peu de transports en commun'] },
      { nom: 'Atout', items: ['Paysages et nature préservés', 'Arrivée de néo-ruraux', 'Tourisme vert', 'Produits du terroir (AOP)'] }
    ] }
  ],
  calculs: { croquisZone }
};

export default fabriquer(banque);
