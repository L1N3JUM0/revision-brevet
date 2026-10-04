// Étude de document · Femmes et hommes dans la société (1950-1980) (textes officiels et discours, avec leur source)
import donnees from '../donnees/societe-1950-1980.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'veil-1974',
      reperes: ['Loi Neuwirth', 'Loi Veil'],
      titre: 'Simone Veil devant l\'Assemblée nationale',
      html: '<p>« Je voudrais tout d\'abord vous faire partager une conviction de femme – je m\'excuse de le faire devant cette <u>Assemblée presque exclusivement composée d\'hommes</u> : aucune femme ne recourt de gaieté de cœur à l\'avortement. »</p>',
      source: 'Simone Veil, ministre de la Santé, discours à l\'Assemblée nationale, 26 novembre 1974.',
      prelevement: [
        { consigne: 'Relève comment Simone Veil décrit l\'Assemblée nationale.', mots: [['hommes'], ['exclusivement', 'presque']], corrige: 'Simone Veil décrit une « Assemblée presque exclusivement composée d\'hommes ».' },
        { consigne: 'Qui est Simone Veil en 1974 ?', mots: [['ministre'], ['santé']], corrige: 'En 1974, Simone Veil est ministre de la Santé.' }
      ],
      analyse: [
        { consigne: 'Explique ce que montre la remarque de Simone Veil sur la place des femmes en politique.', mots: [['femmes'], ['politique', 'députées', 'élues'], ['inégalité', 'peu']], corrige: 'En 1974, les femmes votent depuis trente ans, mais elles restent très peu nombreuses à l\'Assemblée. La vie politique est dominée par les hommes. Simone Veil doit défendre une loi qui concerne les femmes devant des députés presque tous masculins.' },
        { consigne: 'Explique ce que permet la loi défendue par Simone Veil.', mots: [['avortement', 'ivg', 'interruption'], ['1975'], ['femmes']], corrige: 'La loi Veil autorise l\'interruption volontaire de grossesse (IVG). Elle est adoptée en janvier 1975. Elle donne aux femmes le droit de choisir d\'avoir un enfant ou non.' }
      ]
    },
    {
      id: 'majorite-18',
      reperes: ['Élection de Valéry Giscard d\'Estaing', 'Loi Veil'],
      titre: 'La majorité à 18 ans',
      html: '<p>« <u>La majorité est fixée à dix-huit ans accomplis</u> ; à cet âge, chacun est capable d\'exercer les droits dont il a la jouissance. »</p>',
      source: 'Code civil, article 414 (rédaction actuelle). L\'âge de la majorité est abaissé de 21 à 18 ans par la loi du 5 juillet 1974.',
      prelevement: [
        { consigne: 'Relève l\'âge de la majorité.', mots: [['dix-huit', '18']], corrige: 'La majorité est fixée à dix-huit ans.' },
        { consigne: 'Quel était l\'âge de la majorité avant 1974 ?', mots: [['21', 'vingt et un']], corrige: 'Avant 1974, la majorité était fixée à 21 ans.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi l\'abaissement de la majorité à 18 ans répond aux attentes des jeunes.', mots: [['jeunes', 'jeunesse'], ['voter', 'vote'], ['mai 68', '1968']], corrige: 'Depuis Mai 68, les jeunes réclament plus de liberté et une place dans la société. En 1974, la majorité passe à 18 ans : les jeunes peuvent voter et décider seuls plus tôt. La loi tient compte des changements de la société.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['veil-1974', 'majorite-18'], reperes: ['Élection de Valéry Giscard d\'Estaing', 'Loi Veil'], consigne: 'Montre que dans les années 1970, la loi accompagne les transformations de la société française.', mots: [['femmes'], ['jeunes'], ['avortement', 'ivg'], ['18 ans', 'dix-huit'], ['1974', '1975']], corrige: 'Dans les années 1960 et 1970, la société française change : les femmes et les jeunes réclament plus de droits. En 1974, la majorité est abaissée à 18 ans : les jeunes peuvent voter plus tôt (document 2). La même année, Simone Veil défend devant des députés presque tous masculins une loi autorisant l\'avortement (document 1). Adoptée en 1975, la loi Veil donne aux femmes le droit de choisir. La loi accompagne donc l\'évolution de la société.' }
  ]
});
