// Étude de document · La Ve République (articles de la Constitution, avec leur source)
import donnees from '../donnees/cinquieme-republique.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'article-1',
      reperes: ['Retour au pouvoir du général de Gaulle', 'Fondation de la Ve République'],
      titre: 'Les principes de la République',
      html: '<p>« La France est une République <u>indivisible, laïque, démocratique et sociale</u>. Elle assure l\'égalité devant la loi de tous les citoyens sans distinction d\'origine, de race ou de religion. Elle respecte toutes les croyances. »</p>',
      source: 'Constitution de la V<sup>e</sup> République, 4 octobre 1958, article 1<sup>er</sup> (numéroté article 2 en 1958).',
      prelevement: [
        { consigne: 'Relève les quatre caractères de la République française.', mots: [['indivisible'], ['laïque'], ['démocratique'], ['sociale']], corrige: 'La République française est « indivisible, laïque, démocratique et sociale ».' },
        { consigne: 'Relève ce que la République assure à tous les citoyens.', mots: [['égalité']], corrige: 'La République assure « l\'égalité devant la loi de tous les citoyens ».' }
      ],
      analyse: [
        { consigne: 'Explique ce que signifie « une République laïque ».', mots: [['religion'], ['séparation', 'neutre'], ['croyance', 'liberté']], corrige: 'Une République laïque est séparée des religions : l\'État est neutre et n\'en favorise aucune. Chacun est libre de croire ou de ne pas croire. La République respecte toutes les croyances.' }
      ]
    },
    {
      id: 'article-3',
      reperes: ['Retour au pouvoir du général de Gaulle', 'Fondation de la Ve République'],
      titre: 'La souveraineté nationale',
      html: '<p>« <u>La souveraineté nationale appartient au peuple</u> qui l\'exerce par ses représentants et par la voie du référendum. »</p>',
      source: 'Constitution de la V<sup>e</sup> République, 4 octobre 1958, article 3.',
      prelevement: [
        { consigne: 'Relève à qui appartient la souveraineté nationale.', mots: [['peuple']], corrige: 'La souveraineté nationale appartient au peuple.' },
        { consigne: 'Relève les deux moyens par lesquels le peuple exerce sa souveraineté.', mots: [['représentants'], ['référendum']], corrige: 'Le peuple exerce sa souveraineté par ses représentants et par le référendum.' }
      ],
      analyse: [
        { consigne: 'Explique ce qu\'est un référendum et donne un exemple sous la Ve République.', mots: [['vote', 'voter'], ['question', 'oui', 'non'], ['1962', '1958', '2000']], corrige: 'Un référendum est un vote où les citoyens répondent par oui ou par non à une question. Par exemple, en 1962, les Français approuvent par référendum l\'élection du président de la République au suffrage universel direct.' }
      ]
    },
    {
      id: 'article-6',
      reperes: ['Élection du président au suffrage universel direct', 'Première élection présidentielle au suffrage universel direct'],
      titre: 'L\'élection du président de la République',
      html: '<p>« <u>Le Président de la République est élu pour sept ans au suffrage universel direct</u>. »</p>',
      source: 'Constitution de la V<sup>e</sup> République, article 6, dans sa rédaction issue du référendum du 28 octobre 1962.',
      prelevement: [
        { consigne: 'Relève la durée du mandat du président fixée par ce texte.', mots: [['sept ans', '7 ans']], corrige: 'Le président est élu pour sept ans.' },
        { consigne: 'Relève le mode d\'élection du président.', mots: [['suffrage universel direct']], corrige: 'Le président est élu au suffrage universel direct.' }
      ],
      analyse: [
        { consigne: 'Explique ce que change cette réforme de 1962 pour le président.', mots: [['citoyens', 'peuple', 'français'], ['pouvoir', 'légitimité', 'renforc'], ['de gaulle']], corrige: 'Avant 1962, le président était élu par un collège de grands électeurs. Désormais, il est élu directement par tous les citoyens. Le président voulu par de Gaulle en sort renforcé : il tient son pouvoir du peuple.' },
        { consigne: 'Ce texte est-il encore en vigueur aujourd\'hui ? Explique.', mots: [['cinq ans', '5 ans', 'quinquennat'], ['2000']], corrige: 'Non, pas tout à fait. Depuis le référendum de 2000, le président est élu pour cinq ans : c\'est le quinquennat. Il reste élu au suffrage universel direct.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['article-3', 'article-6'], reperes: ['Fondation de la Ve République', 'Élection du président au suffrage universel direct'], consigne: 'Montre que la Ve République donne une place importante au peuple et au président.', mots: [['peuple'], ['référendum'], ['suffrage universel direct'], ['président'], ['1958', '1962']], corrige: 'La Ve République est fondée en 1958 par le général de Gaulle. Sa Constitution affirme que la souveraineté appartient au peuple, qui l\'exerce par ses représentants et par le référendum (document 1). En 1962, un référendum décide que le président sera élu au suffrage universel direct (document 2). Le président tient donc son pouvoir directement des citoyens, ce qui renforce son rôle. Le peuple peut aussi être consulté directement par référendum.' }
  ]
});
