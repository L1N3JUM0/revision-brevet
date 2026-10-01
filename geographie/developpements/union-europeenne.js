// Développement construit · La France et l'Union européenne
import { fabriquerDeveloppement } from './fabrique-dev.js';

export default fabriquerDeveloppement('La France et l\'Union européenne', {
  definitions: [
    { mot: 'espace Schengen', mots: [['circul', 'circulation'], ['frontières'], ['contrôle']], corrige: 'L\'espace Schengen est un espace de libre circulation des personnes, sans contrôle aux frontières intérieures.' },
    { mot: 'région transfrontalière', mots: [['frontière'], ['échang', 'travaill'], ['part et d\'autre', 'deux pays', 'voisin']], corrige: 'Une région transfrontalière est un espace situé de part et d\'autre d\'une frontière, où les habitants échangent beaucoup et vont parfois travailler dans le pays voisin.' },
    { mot: 'Union européenne', mots: [['27', 'vingt-sept'], ['états', 'pays'], ['commun', 'ensemble']], corrige: 'L\'Union européenne est une association de 27 États européens qui ont mis en commun des politiques et des institutions.' }
  ],
  sujets: [{
    id: 'territoire-reference',
    consigne: 'Montre que l\'Union européenne est un territoire de référence et d\'appartenance pour les Français.',
    motsAide: ['espace Schengen', 'euro', 'région transfrontalière', 'Parlement européen', 'politique agricole commune'],
    plan: ['Un territoire commun : libre circulation et monnaie unique', 'Un territoire d\'appartenance : citoyenneté et institutions', 'Un territoire qui aménage et relie les régions'],
    mots: [['espace schengen', 'schengen'], ['euro'], ['région transfrontalière', 'transfrontali'], ['parlement européen'], ['politique agricole commune', 'pac'], ['27']],
    corrige: 'La France est l\'un des pays fondateurs de la construction européenne. Aujourd\'hui, l\'Union européenne réunit 27 États depuis la sortie du Royaume-Uni en 2020. En quoi l\'Union européenne est-elle devenue un territoire de référence et d\'appartenance pour les Français ?\n\n'
      + 'D\'abord, l\'Union européenne est un territoire commun dans lequel les Français vivent au quotidien. Grâce à l\'espace Schengen, ils peuvent circuler sans contrôle aux frontières intérieures pour voyager, étudier ou travailler. Les marchandises, les services et les capitaux circulent aussi librement dans le marché unique. Une vingtaine de pays, dont la France, utilisent la même monnaie, l\'euro, ce qui facilite les échanges et les voyages.\n\n'
      + 'Ensuite, l\'Union européenne est un territoire d\'appartenance. Chaque Français est aussi citoyen européen : il peut voter aux élections européennes tous les cinq ans pour élire les députés du Parlement européen, qui siège à Strasbourg. Les institutions européennes, comme la Commission européenne à Bruxelles, prennent des décisions qui s\'appliquent dans tous les États membres. Les jeunes peuvent partir étudier dans un autre pays grâce au programme Erasmus+.\n\n'
      + 'Enfin, l\'Union européenne aménage et relie les territoires. La politique agricole commune soutient les agriculteurs français. Les fonds européens financent des routes, des lignes ferroviaires et des projets dans les régions en difficulté et dans les outre-mer. Aux frontières, des régions transfrontalières se développent : des milliers de Français vont chaque jour travailler au Luxembourg, en Allemagne, en Belgique ou en Suisse, et des lignes de tramway traversent même la frontière, comme entre Strasbourg et Kehl.\n\n'
      + 'Pour conclure, l\'Union européenne est un territoire de référence, car les Français y circulent librement et utilisent l\'euro. C\'est aussi un territoire d\'appartenance, grâce à la citoyenneté européenne et au Parlement européen. Elle relie les régions et aide à les aménager, même si certains citoyens se sentent encore éloignés de ses institutions.'
  }]
});
