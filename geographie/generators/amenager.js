// Thème 2 · Aménager pour répondre aux inégalités croissantes entre territoires
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'amenager',
  titre: 'Aménager le territoire',
  discipline: 'g2',
  resume: 'Réduire les inégalités entre territoires : acteurs, projets, débats.',
  essentiel: [
    '<strong>Aménager le territoire</strong>, c\'est organiser l\'espace (transports, services, logements, activités) pour réduire les <strong>inégalités</strong> entre territoires et les rendre attractifs.',
    'Les inégalités existent à toutes les échelles : entre métropoles et espaces ruraux, entre quartiers d\'une même ville, entre la métropole et les outre-mer.',
    'Les <strong>acteurs</strong> : l\'État, les collectivités territoriales (régions, départements, communes, intercommunalités), l\'Union européenne, les entreprises et les habitants.',
    'Exemples : lignes à grande vitesse (le premier TGV relie Paris et Lyon en 1981), désenclavement des territoires isolés, fibre optique, rénovation des quartiers prioritaires.',
    'Un projet d\'aménagement peut provoquer des <strong>débats</strong> : il faut concilier développement économique, environnement et avis des habitants.'
  ],
  vocabulaire: [
    { mot: 'Aménagement du territoire', definition: 'Ensemble des actions publiques qui organisent l\'espace pour le développer et réduire les inégalités.' },
    { mot: 'Collectivité territoriale', definition: 'Structure administrative élue qui gère un territoire : commune, département, région.' },
    { mot: 'Désenclavement', definition: 'Action de relier un territoire isolé aux grands axes de transport et de communication.' },
    { mot: 'Intercommunalité', definition: 'Regroupement de communes qui gèrent ensemble des services (transports, déchets).' },
    { mot: 'Inégalités territoriales', definition: 'Différences de richesse, d\'emplois ou d\'accès aux services entre des territoires.' },
    { mot: 'Politique de la ville', definition: 'Actions de l\'État et des communes pour améliorer la vie dans les quartiers en difficulté.' },
    { mot: 'Zone blanche', definition: 'Territoire mal couvert par la téléphonie mobile ou par internet.' }
  ],
  questions: [
    { q: 'Quel est le but principal de l\'aménagement du territoire ?', bonne: 'Réduire les inégalités entre les territoires', fausses: ['Augmenter les impôts', 'Créer de nouvelles frontières', 'Faire disparaître les campagnes'], niveau: 1 },
    { q: 'Lequel de ces acteurs est une collectivité territoriale ?', bonne: 'La région', fausses: ['Une entreprise', 'Une association', 'L\'ONU'], niveau: 1 },
    { q: 'Entre quelles villes circule le premier TGV, en 1981 ?', bonne: 'Paris et Lyon', fausses: ['Paris et Lille', 'Lyon et Marseille', 'Bordeaux et Toulouse'], niveau: 2 },
    { q: 'Qu\'est-ce que le désenclavement d\'un territoire ?', bonne: 'Le relier aux grands axes de transport et de communication', fausses: ['L\'entourer de murs', 'Le transformer en parc naturel', 'Y interdire les voitures'], niveau: 1 },
    { q: 'Quel aménagement réduit la « fracture numérique » ?', bonne: 'Le déploiement de la fibre optique', fausses: ['La construction d\'un stade', 'La fermeture des bureaux de poste', 'Un nouveau rond-point'], niveau: 2 },
    { q: 'Quel acteur européen finance des aménagements dans les régions françaises ?', bonne: 'L\'Union européenne', fausses: ['L\'OTAN', 'L\'ONU', 'Le Conseil de l\'Europe'], niveau: 2 },
    { q: 'Que vise la politique de la ville ?', bonne: 'Améliorer la vie dans les quartiers en difficulté', fausses: ['Construire des autoroutes à la campagne', 'Agrandir les ports', 'Protéger les montagnes'], niveau: 2 },
    { q: 'Pourquoi un projet d\'aménagement peut-il provoquer des oppositions ?', bonne: 'Il peut abîmer l\'environnement ou gêner des habitants', fausses: ['Il est toujours gratuit', 'Il est décidé par les élèves', 'Il ne change rien au territoire'], niveau: 2 },
    { q: 'Quelle est la plus petite collectivité territoriale ?', bonne: 'La commune', fausses: ['Le département', 'La région', 'L\'État'], niveau: 3 },
    { q: 'Combien la France compte-t-elle de régions en métropole depuis 2016 ?', bonne: '13', fausses: ['22', '5', '101'], niveau: 3 },
    { q: 'Quelle inégalité territoriale existe à l\'échelle d\'une même ville ?', bonne: 'Des quartiers riches et des quartiers pauvres', fausses: ['Une différence de fuseau horaire', 'Une frontière entre deux pays', 'Un climat différent'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Seul l\'État aménage le territoire.', vrai: false, explication: 'Les régions, départements, communes, intercommunalités, l\'Union européenne et les entreprises sont aussi des acteurs.' },
    { texte: 'Une ligne à grande vitesse peut rapprocher des villes éloignées.', vrai: true, explication: 'Elle réduit les temps de trajet et rend les villes desservies plus attractives.' },
    { texte: 'Les inégalités territoriales n\'existent qu\'entre la ville et la campagne.', vrai: false, explication: 'Elles existent à toutes les échelles : entre régions, entre quartiers, entre la métropole et les outre-mer.' }
  ],
  classements: [
    { question: 'Quelle collectivité ou quel acteur s\'occupe surtout de cet aménagement ?', groupes: [
      { nom: 'Commune ou intercommunalité', items: ['Ramassage des déchets', 'Écoles maternelles et élémentaires', 'Bus de la ville'] },
      { nom: 'Département', items: ['Collèges', 'Routes départementales'] },
      { nom: 'Région', items: ['Lycées', 'Trains régionaux (TER)'] }
    ] }
  ]
};

export default fabriquer(banque);
