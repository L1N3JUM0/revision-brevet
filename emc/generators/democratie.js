// EMC · Faire vivre la démocratie : institutions, élections, pouvoirs
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'democratie',
  titre: 'Faire vivre la démocratie',
  discipline: 'emc',
  resume: 'Élections, séparation des pouvoirs, institutions de la Ve République.',
  essentiel: [
    'Une <strong>démocratie</strong> est un régime où le pouvoir appartient au peuple, qui choisit ses représentants par des élections libres.',
    'La <strong>séparation des pouvoirs</strong> : le Parlement (Assemblée nationale et Sénat) vote les lois (pouvoir législatif) ; le gouvernement les applique (exécutif) ; la justice juge (judiciaire).',
    'Le <strong>président de la République</strong> est élu pour 5 ans au suffrage universel direct. Les <strong>députés</strong> sont élus pour 5 ans ; les sénateurs au suffrage indirect.',
    'Le suffrage est <strong>universel, égal et secret</strong>. Le <strong>référendum</strong> permet au peuple de décider directement.',
    'La démocratie vit aussi grâce aux partis politiques, aux syndicats, aux associations, à la presse libre et à la participation des citoyens.'
  ],
  vocabulaire: [
    { mot: 'Démocratie', definition: 'Régime politique où le pouvoir appartient au peuple, qui l\'exerce par des élections libres.' },
    { mot: 'Séparation des pouvoirs', definition: 'Répartition des pouvoirs législatif, exécutif et judiciaire entre des institutions différentes, pour éviter les abus.' },
    { mot: 'Référendum', definition: 'Vote par lequel les citoyens répondent par oui ou par non à une question.' },
    { mot: 'Suffrage universel direct', definition: 'Élection à laquelle tous les citoyens majeurs votent eux-mêmes pour choisir un élu.' },
    { mot: 'Parlement', definition: 'Assemblée nationale et Sénat, qui votent les lois et contrôlent le gouvernement.' },
    { mot: 'État de droit', definition: 'État dans lequel tous, y compris les gouvernants, doivent respecter la loi, sous le contrôle de juges indépendants.' },
    { mot: 'Pluralisme', definition: 'Existence de plusieurs partis, opinions et médias différents.' }
  ],
  questions: [
    { q: 'Qui vote les lois en France ?', bonne: 'Le Parlement (Assemblée nationale et Sénat)', fausses: ['Le président de la République seul', 'Les juges', 'Les maires'], niveau: 1 },
    { q: 'Pour combien de temps le président de la République est-il élu ?', bonne: '5 ans', fausses: ['7 ans', '4 ans', '10 ans'], niveau: 1, explication: 'Depuis le référendum de 2000 (quinquennat). Avant, le mandat était de 7 ans.' },
    { q: 'Comment le président de la République est-il élu ?', bonne: 'Au suffrage universel direct', fausses: ['Par les députés', 'Par les maires', 'Par tirage au sort'], niveau: 1 },
    { q: 'À quoi sert la séparation des pouvoirs ?', bonne: 'À éviter qu\'une seule personne ait tous les pouvoirs', fausses: ['À rendre les lois plus longues', 'À supprimer les élections', 'À donner tous les pouvoirs au président'], niveau: 2 },
    { q: 'Quel pouvoir exerce le gouvernement ?', bonne: 'Le pouvoir exécutif', fausses: ['Le pouvoir législatif', 'Le pouvoir judiciaire', 'Le pouvoir constituant'], niveau: 2 },
    { q: 'Que signifie un vote « secret » ?', bonne: 'Personne ne peut savoir pour qui l\'électeur a voté', fausses: ['Le résultat n\'est jamais publié', 'On vote sans pièce d\'identité', 'Seuls certains citoyens votent'], niveau: 1 },
    { q: 'Qu\'est-ce qu\'un référendum ?', bonne: 'Un vote où les citoyens répondent par oui ou non à une question', fausses: ['Une élection des députés', 'Un sondage d\'opinion', 'Une réunion du gouvernement'], niveau: 2 },
    { q: 'Où siègent les députés ?', bonne: 'À l\'Assemblée nationale', fausses: ['Au Sénat', 'À l\'Élysée', 'À Matignon'], niveau: 2 },
    { q: 'Où réside le président de la République ?', bonne: 'Au palais de l\'Élysée', fausses: ['Au palais Bourbon', 'À l\'hôtel Matignon', 'Au palais du Luxembourg'], niveau: 3 },
    { q: 'Qu\'est-ce qu\'un État de droit ?', bonne: 'Un État où tous, même les gouvernants, doivent respecter la loi', fausses: ['Un État sans lois', 'Un État dirigé par des juges élus', 'Un État où le président fait les lois seul'], niveau: 3 },
    { q: 'Qu\'est-ce que le pluralisme politique ?', bonne: 'L\'existence de plusieurs partis et opinions', fausses: ['L\'existence d\'un parti unique', 'Le vote obligatoire', 'L\'interdiction des manifestations'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'En démocratie, la presse est libre.', vrai: true, explication: 'La liberté de la presse permet d\'informer les citoyens et de critiquer le pouvoir.' },
    { texte: 'Les sénateurs sont élus au suffrage universel direct.', vrai: false, explication: 'Ils sont élus au suffrage indirect, par des grands électeurs (surtout des élus locaux).' },
    { texte: 'Le Premier ministre dirige le gouvernement.', vrai: true, explication: 'Il est nommé par le président et dirige l\'action du gouvernement.' }
  ],
  classements: [
    { question: 'Quel pouvoir cette institution exerce-t-elle ?', groupes: [
      { nom: 'Législatif', items: ['Assemblée nationale', 'Sénat'] },
      { nom: 'Exécutif', items: ['Président de la République', 'Gouvernement', 'Premier ministre'] },
      { nom: 'Judiciaire', items: ['Tribunaux', 'Juges'] }
    ] }
  ]
};

export default fabriquer(banque);
