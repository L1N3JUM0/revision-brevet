// Étude de document · 1944-1947 : refonder la République (textes officiels, avec leur source)
import donnees from '../donnees/refonder-republique.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'cnr',
      reperes: ['Création du Conseil national de la Résistance', 'Création de la Sécurité sociale'],
      titre: 'Le programme du Conseil national de la Résistance',
      html: '<p>Les résistants veulent, une fois le territoire libéré :</p><p>« le retour à la nation des grands moyens de production monopolisés, fruits du travail commun, des sources d\'énergie, des richesses du sous-sol, des compagnies d\'assurances et des grandes banques ; […]</p><p><u>un plan complet de sécurité sociale</u>, visant à assurer à tous les citoyens des moyens d\'existence, dans tous les cas où ils sont incapables de se les procurer par le travail. »</p>',
      source: 'Programme du Conseil national de la Résistance, adopté le 15 mars 1944.',
      prelevement: [
        { consigne: 'Relève deux secteurs que le CNR veut rendre à la nation.', mots: [['énergie', 'sous-sol', 'assurances', 'banques', 'production']], corrige: 'Le CNR veut rendre à la nation, par exemple, les sources d\'énergie et les grandes banques.' },
        { consigne: 'Relève la mesure sociale prévue par le programme.', mots: [['sécurité sociale']], corrige: 'Le programme prévoit « un plan complet de sécurité sociale ».' }
      ],
      analyse: [
        { consigne: 'Explique comment ce programme est appliqué après la Libération.', mots: [['nationalisation'], ['sécurité sociale'], ['1945']], corrige: 'Après la Libération, le gouvernement provisoire du général de Gaulle applique ce programme. Des entreprises sont nationalisées, comme Renault ou les houillères. En 1945, la Sécurité sociale est créée pour protéger les Français face à la maladie et à la vieillesse.' }
      ]
    },
    {
      id: 'vote-femmes',
      reperes: ['Libération de Paris', 'Premier vote des femmes'],
      titre: 'Le droit de vote des femmes',
      html: '<p>« Article 17. <u>Les femmes sont électrices et éligibles</u> dans les mêmes conditions que les hommes. »</p>',
      source: 'Ordonnance du Comité français de la Libération nationale (CFLN), présidé par le général de Gaulle, Alger, 21 avril 1944.',
      prelevement: [
        { consigne: 'Relève le nouveau droit accordé aux femmes.', mots: [['électrices', 'électrice', 'voter'], ['éligibles', 'éligible']], corrige: 'Les femmes deviennent « électrices et éligibles », comme les hommes.' },
        { consigne: 'Qui accorde ce droit et en quelle année ?', mots: [['comité français de la libération nationale', 'cfln', 'de gaulle'], ['1944']], corrige: 'Ce droit est accordé en 1944 par le Comité français de la Libération nationale (CFLN), dirigé par le général de Gaulle. Ce comité devient le Gouvernement provisoire en juin 1944.' }
      ],
      analyse: [
        { consigne: 'Explique ce que signifie « électrices et éligibles » et quand les femmes votent pour la première fois.', mots: [['voter', 'vote'], ['candidat', 'élue', 'élu'], ['1945']], corrige: 'Être électrice signifie avoir le droit de voter. Être éligible signifie pouvoir être candidate et élue. Les femmes votent pour la première fois aux élections municipales d\'avril 1945.' }
      ]
    },
    {
      id: 'preambule-1946',
      reperes: ['Création de la Sécurité sociale', 'Référendum qui met fin à la IIIe République'],
      titre: 'Le préambule de la Constitution de 1946',
      html: '<p>« <u>La loi garantit à la femme</u>, dans tous les domaines, <u>des droits égaux</u> à ceux de l\'homme. […]</p><p>Chacun a le devoir de travailler et le droit d\'obtenir un emploi. […]</p><p>Elle garantit à tous, notamment à l\'enfant, à la mère et aux vieux travailleurs, la protection de la santé, la sécurité matérielle, le repos et les loisirs. »</p>',
      source: 'Préambule de la Constitution de la IV<sup>e</sup> République, 27 octobre 1946 (extraits).',
      prelevement: [
        { consigne: 'Relève le droit garanti aux femmes.', mots: [['droits égaux', 'égaux']], corrige: 'La loi garantit à la femme « des droits égaux à ceux de l\'homme ».' },
        { consigne: 'Relève deux protections garanties à tous.', mots: [['santé', 'sécurité matérielle', 'repos', 'loisirs']], corrige: 'La Constitution garantit à tous, par exemple, la protection de la santé et le repos.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi on dit que ce texte fonde une République sociale.', mots: [['social', 'sociaux'], ['droits'], ['sécurité sociale', 'santé', 'emploi']], corrige: 'Ce texte ne garantit pas seulement des libertés : il donne aussi des droits sociaux. Il protège la santé, le droit au travail et la sécurité matérielle. Il prolonge la création de la Sécurité sociale en 1945 : l\'État protège les citoyens.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['cnr', 'preambule-1946'], reperes: ['Droit de vote des femmes', 'Création de la Sécurité sociale'], consigne: 'Montre qu\'entre 1944 et 1946, la France refonde une République plus sociale.', mots: [['résistance', 'cnr'], ['sécurité sociale'], ['nationalisation'], ['femmes', 'égaux'], ['1945', '1946']], corrige: 'À la Libération, la France doit refonder la République. Dès 1944, le programme du Conseil national de la Résistance prévoit des nationalisations et un plan de sécurité sociale (document 1). Le gouvernement provisoire l\'applique : la Sécurité sociale est créée en 1945. En 1946, le préambule de la Constitution de la IVe République garantit des droits sociaux comme la protection de la santé et l\'égalité entre les femmes et les hommes (document 2). La nouvelle République est donc plus démocratique et plus sociale.' }
  ]
});
