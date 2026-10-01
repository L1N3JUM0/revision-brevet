// Étude de document · Indépendances et nouveaux États (textes officiels et discours, avec leur source)
import donnees from '../donnees/decolonisation.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'charte-onu-peuples',
      titre: 'Les buts des Nations unies',
      html: '<p>« Les buts des Nations unies sont les suivants : […] Développer entre les nations des relations amicales fondées sur le respect du principe de l\'égalité de droits des peuples et de <u>leur droit à disposer d\'eux-mêmes</u>… »</p>',
      source: 'Charte des Nations unies, article 1, 26 juin 1945.',
      prelevement: [
        { consigne: 'Relève le droit des peuples affirmé par la Charte.', mots: [['disposer d\'eux-mêmes', 'droit des peuples']], corrige: 'La Charte affirme le « droit des peuples à disposer d\'eux-mêmes ».' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi ce principe encourage les peuples colonisés à réclamer leur indépendance.', mots: [['colonie', 'colonis'], ['indépendance'], ['choisir', 'décider']], corrige: 'Le droit des peuples à disposer d\'eux-mêmes signifie que chaque peuple peut choisir son gouvernement. Les peuples colonisés s\'appuient sur ce principe pour réclamer leur indépendance. L\'ONU devient une tribune pour les nouveaux États.' }
      ]
    },
    {
      id: 'bandung',
      titre: 'La conférence de Bandung',
      html: '<p>La conférence est d\'accord « pour déclarer que <u>le colonialisme, dans toutes ses manifestations, est un mal</u> auquel il doit être mis fin rapidement ».</p>',
      source: 'Communiqué final de la conférence afro-asiatique de Bandung (Indonésie), 24 avril 1955.',
      prelevement: [
        { consigne: 'Relève comment la conférence qualifie le colonialisme.', mots: [['mal']], corrige: 'La conférence affirme que le colonialisme est « un mal ».' },
        { consigne: 'Où et en quelle année se tient cette conférence ?', mots: [['bandung', 'indonésie'], ['1955']], corrige: 'Cette conférence se tient à Bandung, en Indonésie, en 1955.' }
      ],
      analyse: [
        { consigne: 'Explique quels pays se réunissent à Bandung et ce qu\'ils réclament.', mots: [['asie', 'asiatique'], ['afrique', 'africain'], ['indépendance', 'décolonisation'], ['tiers-monde', 'non-alignés']], corrige: 'À Bandung se réunissent des pays d\'Asie et d\'Afrique, souvent récemment indépendants, comme l\'Inde ou l\'Égypte. Ils condamnent le colonialisme et réclament l\'indépendance de tous les peuples colonisés. Ils veulent aussi former un tiers-monde qui ne choisit ni les États-Unis ni l\'URSS.' }
      ]
    },
    {
      id: 'nehru',
      titre: 'L\'indépendance de l\'Inde',
      html: '<p>« Au douzième coup de minuit, à l\'heure où le monde dort, <u>l\'Inde s\'éveillera à la vie et à la liberté</u>. »</p>',
      source: 'Jawaharlal Nehru, futur Premier ministre de l\'Inde, discours devant l\'Assemblée constituante, 14 août 1947.',
      prelevement: [
        { consigne: 'Relève ce que l\'Inde va obtenir selon Nehru.', mots: [['liberté']], corrige: 'Selon Nehru, l\'Inde va s\'éveiller « à la vie et à la liberté ».' },
        { consigne: 'Qui prononce ce discours et quelle sera sa fonction ?', mots: [['nehru'], ['premier ministre']], corrige: 'Ce discours est prononcé par Jawaharlal Nehru, futur Premier ministre de l\'Inde.' }
      ],
      analyse: [
        { consigne: 'Explique de quelle puissance coloniale l\'Inde devient indépendante et comment.', mots: [['royaume-uni', 'britannique', 'anglais'], ['gandhi'], ['non-violence', 'non violente', 'pacifique'], ['pakistan']], corrige: 'L\'Inde était une colonie du Royaume-Uni. Gandhi a mené une lutte non violente pour l\'indépendance. Elle est obtenue en 1947, mais le territoire est partagé entre l\'Inde et le Pakistan, dans de grandes violences.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['charte-onu-peuples', 'bandung'], consigne: 'Montre qu\'après 1945, le colonialisme est de plus en plus contesté dans le monde.', mots: [['onu'], ['disposer d\'eux-mêmes'], ['bandung'], ['indépendance'], ['1945', '1955']], corrige: 'Après la Seconde Guerre mondiale, les puissances coloniales comme la France et le Royaume-Uni sont affaiblies. En 1945, la Charte des Nations unies affirme le droit des peuples à disposer d\'eux-mêmes (document 1). En 1955, les pays réunis à Bandung condamnent le colonialisme comme « un mal » (document 2). Les peuples colonisés obtiennent alors leur indépendance, parfois par la négociation, comme l\'Inde en 1947, parfois par la guerre, comme l\'Algérie en 1962. Le colonialisme est donc rejeté dans le monde entier.' }
  ],
  reperes: []
});
