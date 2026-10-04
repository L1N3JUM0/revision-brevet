// Étude de document · La France défaite et occupée (discours et textes officiels, avec leur source)
import donnees from '../donnees/france-occupee.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'petain-17-juin',
      reperes: ['Armistice franco-allemand', 'Appel du général de Gaulle'],
      titre: 'Pétain annonce la fin des combats',
      html: '<p>« C\'est le cœur serré que je vous dis aujourd\'hui qu\'<u>il faut cesser le combat</u>. »</p>',
      source: 'Philippe Pétain, chef du gouvernement, discours radiodiffusé, 17 juin 1940.',
      prelevement: [
        { consigne: 'Relève ce que Pétain annonce aux Français.', mots: [['cesser'], ['combat']], corrige: 'Pétain annonce qu\'« il faut cesser le combat ».' },
        { consigne: 'Par quel moyen ce discours est-il diffusé ?', mots: [['radio']], corrige: 'Ce discours est diffusé à la radio.' }
      ],
      analyse: [
        { consigne: 'Explique dans quelle situation se trouve la France le 17 juin 1940.', mots: [['défaite', 'vaincu'], ['allemagne', 'allemand'], ['armistice']], corrige: 'En juin 1940, l\'armée française est vaincue par l\'Allemagne en quelques semaines. Pétain, nouveau chef du gouvernement, choisit d\'arrêter la guerre. Il demande l\'armistice, qui est signé le 22 juin 1940.' }
      ]
    },
    {
      id: 'appel-18-juin',
      reperes: ['Armistice franco-allemand'],
      titre: 'L\'appel du 18 juin',
      html: '<p>« Mais le dernier mot est-il dit ? L\'espérance doit-elle disparaître ? La défaite est-elle définitive ? Non ! […]</p><p>Quoi qu\'il arrive, <u>la flamme de la résistance française ne doit pas s\'éteindre</u> et ne s\'éteindra pas. »</p>',
      source: 'Charles de Gaulle, appel lancé depuis Londres sur la radio britannique BBC, 18 juin 1940.',
      prelevement: [
        { consigne: 'Relève la phrase qui montre que de Gaulle refuse la défaite.', mots: [['non'], ['définitive', 'flamme', 'résistance']], corrige: 'De Gaulle répond « Non ! » à la question « La défaite est-elle définitive ? ».' },
        { consigne: 'D\'où de Gaulle lance-t-il son appel et par quel moyen ?', mots: [['londres'], ['radio', 'bbc']], corrige: 'De Gaulle lance son appel depuis Londres, à la radio de la BBC.' }
      ],
      analyse: [
        { consigne: 'Explique ce que de Gaulle demande aux Français et quelle est la suite de cet appel.', mots: [['continuer', 'combat'], ['france libre'], ['résistance']], corrige: 'De Gaulle demande aux Français de continuer le combat aux côtés du Royaume-Uni. Cet appel est le début de la France libre. Peu à peu, il devient le chef de la Résistance extérieure, puis il unifie la Résistance avec Jean Moulin.' }
      ]
    },
    {
      id: 'collaboration',
      reperes: ['Armistice franco-allemand', 'Premier statut des Juifs'],
      titre: 'Pétain choisit la collaboration',
      html: '<p>« J\'entre aujourd\'hui dans la voie de la <u>collaboration</u>. »</p>',
      source: 'Philippe Pétain, chef de l\'État français, discours radiodiffusé, 30 octobre 1940, après sa rencontre avec Hitler à Montoire.',
      prelevement: [
        { consigne: 'Relève la politique choisie par Pétain.', mots: [['collaboration']], corrige: 'Pétain choisit la politique de « collaboration ».' },
        { consigne: 'Qui Pétain a-t-il rencontré avant ce discours ?', mots: [['hitler']], corrige: 'Pétain a rencontré Hitler à Montoire.' }
      ],
      analyse: [
        { consigne: 'Explique ce qu\'est la collaboration et donne un exemple.', mots: [['allemagne', 'nazi'], ['juifs', 'rafle', 'sto'], ['vichy']], corrige: 'La collaboration est la politique de coopération du régime de Vichy avec l\'Allemagne nazie. Par exemple, la police française organise la rafle du Vél d\'Hiv en juillet 1942. Vichy crée aussi le STO, qui envoie des jeunes Français travailler en Allemagne.' }
      ]
    },
    {
      id: 'statut-juifs',
      reperes: ['Armistice franco-allemand', 'Rafle du Vél d\'Hiv'],
      titre: 'Le premier statut des Juifs',
      html: '<p>« Article 1. Est regardé comme juif, pour l\'application de la présente loi, toute personne issue de trois grands-parents de race juive ou de deux grands-parents de la même race, si son conjoint lui-même est juif. »</p><p>Les articles suivants <u>interdisent aux Juifs</u> la fonction publique, l\'enseignement, la presse, la radio et le cinéma.</p>',
      source: 'Loi portant statut des Juifs, signée par le maréchal Pétain, 3 octobre 1940 (article 1 cité, articles suivants résumés).',
      prelevement: [
        { consigne: 'Relève deux métiers interdits aux Juifs par cette loi.', mots: [['fonction publique', 'enseignement', 'presse', 'radio', 'cinéma']], corrige: 'La loi interdit aux Juifs, par exemple, l\'enseignement et la presse.' },
        { consigne: 'Qui signe cette loi et en quelle année ?', mots: [['pétain', 'petain'], ['1940']], corrige: 'Cette loi est signée par le maréchal Pétain en 1940.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi cette loi montre que le régime de Vichy est antisémite.', mots: [['antisémit'], ['exclu', 'exclusion'], ['allemand', 'exig']], corrige: 'Cette loi définit les Juifs selon des critères racistes et les exclut de nombreux métiers. Elle est adoptée par Vichy sans que l\'Allemagne l\'ait exigée. Le régime de Vichy mène donc lui-même une politique antisémite.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['petain-17-juin', 'appel-18-juin'], reperes: ['Armistice franco-allemand'], consigne: 'Montre que deux attitudes opposées apparaissent face à la défaite de 1940.', mots: [['armistice'], ['résistance', 'résister'], ['vichy', 'collaboration'], ['france libre'], ['1940']], corrige: 'En juin 1940, la France est vaincue par l\'Allemagne. Le 17 juin, Pétain annonce qu\'il faut cesser le combat : il signe l\'armistice et fonde ensuite le régime de Vichy, qui collabore avec l\'Allemagne (document 1). Au contraire, le 18 juin, de Gaulle refuse la défaite depuis Londres et appelle à continuer le combat (document 2). C\'est le début de la France libre et de la Résistance. Deux choix s\'opposent donc : accepter la défaite ou résister.' },
    { docs: ['collaboration', 'statut-juifs'], reperes: ['Armistice franco-allemand', 'Rafle du Vél d\'Hiv'], consigne: 'Montre que le régime de Vichy collabore avec l\'Allemagne nazie et persécute les Juifs.', mots: [['collaboration'], ['vichy'], ['juifs'], ['antisémit'], ['rafle', 'vél d\'hiv', 'vel d\'hiv']], corrige: 'Après la défaite de 1940, Pétain dirige le régime de Vichy. En octobre 1940, il choisit officiellement la collaboration avec l\'Allemagne nazie (document 1). Le même mois, Vichy adopte le premier statut des Juifs, qui les exclut de nombreux métiers (document 2). Cette politique antisémite va jusqu\'à la rafle du Vél d\'Hiv en juillet 1942, organisée par la police française. Des milliers de Juifs sont ensuite déportés et assassinés.' }
  ]
});
