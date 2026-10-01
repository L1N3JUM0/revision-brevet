// Développement construit · Les espaces de faible densité (sujet de référence du DNB 2027)
import { fabriquerDeveloppement } from './fabrique-dev.js';

export default fabriquerDeveloppement('Les espaces de faible densité', {
  definitions: [
    { mot: 'espace de faible densité', mots: [['habitants'], ['km'], ['peu']], corrige: 'Un espace de faible densité est un territoire où vivent peu d\'habitants par kilomètre carré, souvent moins de 30. Il s\'agit surtout de campagnes isolées et de montagnes.' },
    { mot: 'néo-rural', mots: [['ville'], ['campagne'], ['installe', 'installer']], corrige: 'Un néo-rural est un habitant venu de la ville pour s\'installer à la campagne.' },
    { mot: 'déprise', mots: [['recul', 'baisse', 'départ'], ['population', 'habitants'], ['activités', 'services']], corrige: 'La déprise est le recul de la population et des activités dans un territoire, avec la fermeture de commerces et de services.' }
  ],
  sujets: [{
    id: 'dynamiques-atouts',
    consigne: 'Explique la diversité des dynamiques des espaces de faible densité et montre qu\'ils possèdent des atouts.',
    motsAide: ['déprise', 'vieillissement', 'tourisme vert', 'aménagement', 'néo-ruraux'],
    plan: ['Des espaces peu peuplés, parfois en difficulté (déprise, vieillissement)', 'Des espaces qui ont des atouts et qui attirent (néo-ruraux, tourisme vert)', 'Des aménagements pour les rendre plus attractifs'],
    mots: [['déprise'], ['vieillissement'], ['tourisme vert'], ['aménagement', 'aménag'], ['néo-ruraux', 'néo-rural'], ['diagonale']],
    corrige: 'Les espaces de faible densité sont des territoires où vivent peu d\'habitants par kilomètre carré, souvent moins de trente. Ils couvrent une grande partie de la France, mais n\'abritent qu\'une petite part de sa population. On les trouve surtout dans la « diagonale des faibles densités », qui va des Ardennes aux Landes, et dans les montagnes. Ces espaces connaissent des dynamiques variées : certains sont en difficulté, d\'autres sont attractifs grâce à leurs atouts.\n\n'
      + 'D\'abord, beaucoup de ces espaces connaissent une déprise. Depuis l\'exode rural, les jeunes partent étudier et travailler dans les grandes villes, où se concentrent les emplois. La population restante connaît donc un vieillissement important. Les commerces, les écoles, les bureaux de poste ferment, et il devient difficile de trouver un médecin : on parle de déserts médicaux. Les habitants doivent faire de longs trajets en voiture, car les transports en commun sont rares. Ces territoires semblent alors isolés et oubliés.\n\n'
      + 'Pourtant, de nombreux espaces de faible densité possèdent des atouts et attirent de nouveaux habitants. Des néo-ruraux, venus des villes, recherchent un cadre de vie calme, des logements moins chers et la nature. Le télétravail, rendu possible par internet, leur permet de garder leur emploi. Des retraités s\'installent aussi à la campagne. Le tourisme vert se développe : randonnée, gîtes, découverte du patrimoine et des produits du terroir. Certains territoires valorisent leurs productions de qualité, comme les fromages ou les vins sous appellation d\'origine protégée, et accueillent des éoliennes ou des panneaux solaires.\n\n'
      + 'Enfin, l\'aménagement de ces territoires est nécessaire pour les rendre plus attractifs. L\'État, les régions et les communes installent la fibre optique, créent des maisons de santé et des espaces France services qui regroupent les démarches administratives. Les parcs naturels régionaux protègent les paysages tout en aidant les activités locales. L\'Union européenne finance aussi des projets dans les campagnes.\n\n'
      + 'Pour conclure, les espaces de faible densité ne sont pas tous en déclin. Certains souffrent de la déprise et du vieillissement, mais d\'autres profitent de leurs atouts, de l\'arrivée de néo-ruraux et du tourisme vert. Grâce à l\'aménagement, ils peuvent devenir des territoires d\'avenir.'
  }]
});
