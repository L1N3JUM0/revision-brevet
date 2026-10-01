// Développement construit · Les aires urbaines
import { fabriquerDeveloppement } from './fabrique-dev.js';

export default fabriquerDeveloppement('Les aires urbaines', {
  definitions: [
    { mot: 'aire urbaine', mots: [['ville', 'pôle'], ['couronne', 'périurbain'], ['travaill']], corrige: 'Une aire urbaine est un ensemble formé par une ville, sa banlieue et sa couronne périurbaine, dont une grande partie des habitants travaille dans la ville.' },
    { mot: 'périurbanisation', mots: [['ville'], ['campagne'], ['extension', 'étend', 'étalement']], corrige: 'La périurbanisation est l\'extension des villes vers les campagnes voisines, avec la construction de lotissements de maisons individuelles.' },
    { mot: 'mobilités pendulaires', mots: [['trajets', 'déplacements'], ['domicile'], ['travail']], corrige: 'Les mobilités pendulaires sont les trajets quotidiens entre le domicile et le lieu de travail ou d\'études.' }
  ],
  sujets: [{
    id: 'organisation-dynamiques',
    consigne: 'Décris l\'organisation d\'une aire urbaine et explique ses dynamiques et ses difficultés.',
    motsAide: ['ville-centre', 'banlieue', 'couronne périurbaine', 'mobilités pendulaires', 'métropole'],
    plan: ['Une aire urbaine organisée en plusieurs espaces', 'Des espaces dynamiques : périurbanisation et métropolisation', 'Des difficultés et des solutions pour une ville durable'],
    mots: [['ville-centre'], ['banlieue'], ['couronne périurbaine', 'périurbain'], ['mobilités pendulaires', 'pendulaire'], ['métropole'], ['étalement urbain', 'étalement']],
    corrige: 'Aujourd\'hui, plus de huit Français sur dix vivent dans une aire urbaine. Une aire urbaine est l\'ensemble formé par une ville, sa banlieue et les communes périurbaines dont une grande partie des habitants vient travailler dans la ville. Comment les aires urbaines sont-elles organisées, et quelles dynamiques et difficultés connaissent-elles ?\n\n'
      + 'Une aire urbaine est organisée en plusieurs espaces. Au centre se trouve la ville-centre, avec ses quartiers anciens, ses monuments, ses commerces et ses administrations. Autour, la banlieue regroupe des communes urbanisées où l\'on trouve des immeubles, des zones d\'activités et des centres commerciaux. Plus loin encore, la couronne périurbaine est formée de villages et de lotissements entourés de champs. Le pôle urbain, c\'est-à-dire la ville-centre et sa banlieue, concentre la plupart des emplois.\n\n'
      + 'Les aires urbaines sont des espaces dynamiques. Depuis les années 1970, la périurbanisation les fait grandir : de nombreuses familles quittent la ville pour une maison avec jardin, moins chère, dans la couronne périurbaine. Chaque jour, elles font des mobilités pendulaires en voiture pour aller travailler dans le pôle urbain. Les plus grandes aires urbaines, comme Paris, Lyon, Marseille ou Toulouse, sont des métropoles : elles concentrent les sièges d\'entreprises, les universités, les hôpitaux et sont reliées au monde par des aéroports et des gares TGV. C\'est la métropolisation.\n\n'
      + 'Cependant, cette croissance pose des difficultés. L\'étalement urbain consomme des terres agricoles et des espaces naturels. Les trajets en voiture provoquent des embouteillages et de la pollution. Dans certains quartiers, les habitants rencontrent des difficultés sociales, tandis que d\'autres quartiers deviennent très chers. Pour y répondre, les villes développent les transports en commun, comme les tramways et les pistes cyclables, rénovent les quartiers en difficulté et construisent des écoquartiers.\n\n'
      + 'Pour conclure, les aires urbaines sont organisées autour d\'une ville-centre, d\'une banlieue et d\'une couronne périurbaine. Elles grandissent grâce à la périurbanisation et à la métropolisation, mais elles doivent devenir plus durables pour limiter l\'étalement urbain et la pollution.'
  }]
});
