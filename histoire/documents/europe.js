// Étude de document · Le projet européen (textes officiels, avec leur source)
import donnees from '../donnees/europe.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'schuman',
      titre: 'La déclaration Schuman',
      html: '<p>« L\'Europe ne se fera pas d\'un coup, ni dans une construction d\'ensemble : elle se fera par des <u>réalisations concrètes</u> créant d\'abord une solidarité de fait. […]</p><p>Le gouvernement français propose de placer l\'ensemble de la <u>production franco-allemande de charbon et d\'acier</u> sous une Haute Autorité commune. […]</p><p>La solidarité de production qui sera ainsi nouée manifestera que toute guerre entre la France et l\'Allemagne devient non seulement impensable, mais matériellement impossible. »</p>',
      source: 'Robert Schuman, ministre français des Affaires étrangères, déclaration du 9 mai 1950.',
      prelevement: [
        { consigne: 'Relève les deux productions que Schuman veut mettre en commun.', mots: [['charbon'], ['acier']], corrige: 'Schuman veut mettre en commun la production de charbon et d\'acier.' },
        { consigne: 'Relève les deux pays concernés en premier.', mots: [['france'], ['allemagne']], corrige: 'Les deux pays concernés sont la France et l\'Allemagne.' },
        { consigne: 'Relève comment l\'Europe doit se construire selon Schuman.', mots: [['réalisations concrètes', 'concrètes'], ['solidarité']], corrige: 'L\'Europe doit se construire « par des réalisations concrètes créant d\'abord une solidarité de fait ».' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi Schuman veut rendre la guerre « matériellement impossible » entre la France et l\'Allemagne.', mots: [['guerre', 'guerres'], ['paix'], ['armes', 'armement'], ['charbon', 'acier']], corrige: 'La France et l\'Allemagne se sont affrontées dans trois guerres depuis 1870. Le charbon et l\'acier servent à fabriquer des armes. En les mettant en commun, aucun des deux pays ne peut préparer seul une guerre : la paix est garantie.' },
        { consigne: 'Explique quelle organisation naît de cette déclaration.', mots: [['ceca'], ['1951'], ['six', '6']], corrige: 'Cette déclaration conduit à la création de la CECA (Communauté européenne du charbon et de l\'acier) en 1951. Elle réunit six pays, dont la France et l\'Allemagne de l\'Ouest. C\'est la première étape de la construction européenne.' }
      ]
    },
    {
      id: 'valeurs-ue',
      titre: 'Les valeurs de l\'Union européenne',
      html: '<p>« L\'Union est fondée sur les valeurs de <u>respect de la dignité humaine, de liberté, de démocratie, d\'égalité, de l\'État de droit</u>, ainsi que de respect des droits de l\'homme, y compris des droits des personnes appartenant à des minorités. »</p>',
      source: 'Traité sur l\'Union européenne, article 2 (rédaction issue du traité de Lisbonne, 2007).',
      prelevement: [
        { consigne: 'Relève trois valeurs de l\'Union européenne.', mots: [['dignité', 'liberté', 'démocratie', 'égalité', 'état de droit', 'droits de l\'homme']], corrige: 'L\'Union européenne est fondée, par exemple, sur la liberté, la démocratie et l\'égalité.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi un pays qui veut entrer dans l\'Union européenne doit respecter ces valeurs.', mots: [['démocratie', 'démocratique'], ['élargissement', 'entrer', 'adhérer'], ['espagne', 'portugal', 'est']], corrige: 'Pour entrer dans l\'Union européenne, un pays doit être une démocratie et respecter les droits de l\'homme. Par exemple, l\'Espagne et le Portugal n\'entrent qu\'en 1986, après la fin de leurs dictatures. Les pays de l\'Est entrent en 2004, après la chute du communisme.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['schuman', 'valeurs-ue'], consigne: 'Montre que la construction européenne cherche à garantir la paix et la démocratie en Europe.', mots: [['paix'], ['ceca', 'charbon'], ['démocratie'], ['union européenne'], ['1950', '1951', '1957']], corrige: 'Après la Seconde Guerre mondiale, des Européens veulent éviter une nouvelle guerre. En 1950, Robert Schuman propose de mettre en commun le charbon et l\'acier de la France et de l\'Allemagne, pour rendre la guerre impossible (document 1). La CECA est créée en 1951, puis la CEE en 1957 avec les traités de Rome. Aujourd\'hui, l\'Union européenne est fondée sur des valeurs comme la liberté et la démocratie (document 2). La construction européenne garantit donc la paix et la démocratie entre ses membres.' }
  ],
  reperes: []
});
