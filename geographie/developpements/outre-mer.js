// Développement construit · Les territoires ultramarins
import { fabriquerDeveloppement } from './fabrique-dev.js';

export default fabriquerDeveloppement('Les territoires ultramarins', {
  definitions: [
    { mot: 'territoire ultramarin', mots: [['français', 'france'], ['loin', 'hors', 'éloigné'], ['mer', 'océan']], corrige: 'Un territoire ultramarin est un territoire français situé loin de la métropole, au-delà des mers, comme la Guadeloupe ou La Réunion.' },
    { mot: 'zone économique exclusive', mots: [['maritime', 'mer'], ['370', '200 milles'], ['ressources']], corrige: 'Une zone économique exclusive est un espace maritime, jusqu\'à 370 km des côtes, où un État exploite seul les ressources.' },
    { mot: 'continuité territoriale', mots: [['éloignement'], ['transport', 'billet', 'avion'], ['aide', 'aider']], corrige: 'La continuité territoriale est une politique qui aide les habitants des outre-mer à faire face à l\'éloignement, par exemple en aidant à payer les billets d\'avion.' }
  ],
  sujets: [{
    id: 'atouts-defis',
    consigne: 'Montre que les territoires ultramarins ont des atouts mais aussi des difficultés, et explique comment ils sont aménagés.',
    motsAide: ['DROM', 'zone économique exclusive', 'éloignement', 'risques naturels', 'continuité territoriale'],
    plan: ['Des territoires dispersés et des atouts pour la France', 'Des territoires qui rencontrent des difficultés', 'Des aménagements pour réduire les inégalités'],
    mots: [['drom', 'département'], ['zone économique exclusive', 'zee'], ['éloignement', 'éloigné'], ['risques naturels', 'cyclone'], ['continuité territoriale'], ['union européenne']],
    corrige: 'La France possède des territoires situés loin de la métropole, dans les océans Atlantique, Indien et Pacifique : ce sont les territoires ultramarins. Parmi eux, cinq sont des départements et régions d\'outre-mer, ou DROM : la Guadeloupe, la Martinique, la Guyane, La Réunion et Mayotte. Quels sont les atouts et les difficultés de ces territoires, et comment sont-ils aménagés ?\n\n'
      + 'Les territoires ultramarins sont dispersés sur toute la planète et apportent de nombreux atouts à la France. Grâce à eux, la France possède la deuxième zone économique exclusive du monde, un immense espace maritime riche en ressources. Ils abritent une biodiversité exceptionnelle, comme la forêt amazonienne en Guyane ou les récifs coralliens. Le tourisme y est important grâce aux plages et aux paysages. En Guyane, le centre spatial de Kourou permet à l\'Europe de lancer ses fusées.\n\n'
      + 'Pourtant, ces territoires rencontrent des difficultés. Leur éloignement de la métropole et leur insularité rendent les échanges coûteux : beaucoup de produits sont importés, donc la vie y est plus chère. Le chômage y est plus élevé qu\'en métropole, surtout chez les jeunes. Ces territoires sont aussi exposés à des risques naturels, comme les cyclones aux Antilles, les éruptions du piton de la Fournaise à La Réunion ou les séismes. À Mayotte et en Guyane, la population augmente vite et les équipements manquent.\n\n'
      + 'Pour réduire ces inégalités, l\'État et l\'Union européenne aménagent les territoires ultramarins. Les DROM sont des régions ultrapériphériques de l\'Union européenne et reçoivent des aides pour construire des routes, des ports, des aéroports, des écoles et des hôpitaux. La continuité territoriale aide les habitants à payer leurs billets d\'avion vers la métropole. Des mesures de prévention protègent la population contre les risques naturels, par exemple des constructions plus résistantes.\n\n'
      + 'Pour conclure, les territoires ultramarins sont une richesse pour la France grâce à leur zone économique exclusive, leur biodiversité et le centre spatial de Kourou. Mais l\'éloignement, le chômage et les risques naturels créent des difficultés, que l\'État et l\'Union européenne tentent de réduire par l\'aménagement et la continuité territoriale.'
  }]
});
