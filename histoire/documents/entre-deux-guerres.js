// Étude de document · L'entre-deux-guerres (citations courtes et sûres, avec leur source)
import donnees from '../donnees/entre-deux-guerres.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'mussolini',
      titre: 'Mussolini définit l\'État fasciste',
      html: '<p>« <u>Tout dans l\'État</u>, rien en dehors de l\'État, rien contre l\'État. »</p>',
      source: 'Benito Mussolini, discours à Milan, 28 octobre 1925.',
      prelevement: [
        { consigne: 'Relève la phrase qui montre la place de l\'État pour Mussolini.', mots: [['tout dans l\'état']], corrige: 'Pour Mussolini, il faut « tout dans l\'État, rien en dehors de l\'État, rien contre l\'État ».' },
        { consigne: 'Qui est l\'auteur de ce texte et quel pays dirige-t-il ?', mots: [['mussolini'], ['italie']], corrige: 'L\'auteur est Benito Mussolini, chef du gouvernement fasciste de l\'Italie depuis 1922.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi cette phrase résume ce qu\'est un régime totalitaire.', mots: [['totalitaire'], ['contrôle', 'contrôler'], ['opposition', 'opposant'], ['liberté']], corrige: 'Dans un régime totalitaire, l\'État veut contrôler toute la vie des individus. Rien ne doit lui échapper : ni la presse, ni la jeunesse, ni le travail. Aucune opposition n\'est permise (« rien contre l\'État ») : les libertés sont supprimées.' }
      ]
    },
    {
      id: 'nuremberg-lois',
      titre: 'Les lois de Nuremberg',
      html: '<p>« Article 1. Les <u>mariages entre Juifs et citoyens de sang allemand</u> ou apparenté sont interdits. »</p>',
      source: 'Loi sur la protection du sang et de l\'honneur allemands, dite loi de Nuremberg, 15 septembre 1935.',
      prelevement: [
        { consigne: 'Relève ce que la loi interdit.', mots: [['mariage'], ['juifs']], corrige: 'La loi interdit les mariages entre Juifs et Allemands « de sang allemand ».' },
        { consigne: 'Dans quel pays et en quelle année cette loi est-elle adoptée ?', mots: [['allemagne'], ['1935']], corrige: 'Cette loi est adoptée en Allemagne en 1935, sous le régime nazi.' }
      ],
      analyse: [
        { consigne: 'Explique sur quelle idée repose cette loi.', mots: [['racis', 'race'], ['antisémit'], ['nazi', 'hitler']], corrige: 'Cette loi repose sur le racisme et l\'antisémitisme des nazis. Hitler pense que les « Aryens » forment une race supérieure qui doit rester « pure ». Les Juifs sont exclus de la communauté nationale.' },
        { consigne: 'Montre que cette loi est une étape de la persécution des Juifs en Allemagne.', mots: [['exclu', 'exclusion'], ['citoyen', 'droits'], ['nuit de cristal', 'génocide', 'extermin']], corrige: 'Avec les lois de Nuremberg, les Juifs perdent leur citoyenneté et sont exclus de la société allemande. Leur vie privée est même contrôlée. La persécution s\'aggrave ensuite avec la Nuit de Cristal en 1938, puis le génocide pendant la guerre.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['mussolini', 'nuremberg-lois'], consigne: 'Montre que les régimes totalitaires contrôlent la société et excluent une partie de la population.', mots: [['totalitaire'], ['contrôle', 'contrôler'], ['juifs'], ['racis', 'antisémit'], ['1935', '1933', '1922']], corrige: 'Dans l\'entre-deux-guerres, des régimes totalitaires s\'installent en Europe. En Italie, Mussolini, au pouvoir depuis 1922, veut que tout passe par l\'État : aucune opposition n\'est tolérée (document 1). En Allemagne, Hitler, au pouvoir en 1933, applique une politique raciste et antisémite. Les lois de Nuremberg de 1935 excluent les Juifs et contrôlent jusqu\'à leur vie privée (document 2). Ces régimes contrôlent donc toute la société et persécutent ceux qu\'ils désignent comme ennemis.' }
  ],
  reperes: []
});
