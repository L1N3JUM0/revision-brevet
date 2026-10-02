// EMC · Les valeurs, les principes et les symboles de la République
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'principes',
  titre: 'Valeurs et principes de la République',
  discipline: 'emc',
  resume: 'Liberté, égalité, fraternité, laïcité : ce qu\'ils veulent dire et leurs symboles.',
  essentiel: [
    'La devise de la République : <strong>« Liberté, Égalité, Fraternité »</strong>. Ce sont ses trois <strong>valeurs</strong>.',
    'La Constitution de 1958 (article 1er) : la France est une République <strong>indivisible, laïque, démocratique et sociale</strong>. Ce sont ses <strong>principes</strong>.',
    'La <strong>laïcité</strong> sépare l\'État et les religions (loi de 1905) : l\'État est neutre et garantit la liberté de croire ou de ne pas croire.',
    'Les symboles : le drapeau tricolore, la Marseillaise, Marianne, la devise et le 14 Juillet (fête nationale).',
    'Les droits fondamentaux sont proclamés dans la <strong>Déclaration des droits de l\'homme et du citoyen</strong> du 26 août 1789.'
  ],
  vocabulaire: [
    { mot: 'Valeur', definition: 'Idéal partagé qui guide les actions des citoyens et de l\'État (liberté, égalité, fraternité).' },
    { mot: 'Principe', definition: 'Règle fondamentale qui organise le fonctionnement de la République (laïcité, indivisibilité…).' },
    { mot: 'Laïcité', definition: 'Séparation de l\'État et des religions, qui garantit la liberté de conscience et la neutralité de l\'État.' },
    { mot: 'Fraternité', definition: 'Lien de solidarité et d\'entraide entre les membres d\'une même société.' },
    { mot: 'Indivisible', definition: 'Se dit d\'une République où la même loi s\'applique partout et à tous, sans qu\'une partie puisse s\'en séparer.' },
    { mot: 'Discrimination', definition: 'Fait de traiter une personne moins bien qu\'une autre à cause d\'un critère interdit par la loi.' },
    { mot: 'Dignité', definition: 'Respect dû à toute personne humaine, quelle qu\'elle soit.' }
  ],
  questions: [
    { q: 'Quelle est la devise de la République française ?', bonne: 'Liberté, Égalité, Fraternité', fausses: ['Travail, Famille, Patrie', 'Unité, Paix, Justice', 'Liberté, Sécurité, Prospérité'], niveau: 1, explication: '« Travail, Famille, Patrie » était la devise du régime de Vichy.' },
    { q: 'Quel est l\'hymne national de la France ?', bonne: 'La Marseillaise', fausses: ['Le Chant des partisans', 'L\'Hymne à la joie', 'La Carmagnole'], niveau: 1 },
    { q: 'Quelle est la date de la fête nationale ?', bonne: 'Le 14 juillet', fausses: ['Le 8 mai', 'Le 11 novembre', 'Le 1er mai'], niveau: 1 },
    { q: 'Quelle figure féminine symbolise la République ?', bonne: 'Marianne', fausses: ['Jeanne d\'Arc', 'Athéna', 'Simone Veil'], niveau: 1 },
    { q: 'Quelle loi a séparé les Églises et l\'État ?', bonne: 'La loi de 1905', fausses: ['La loi de 1881', 'La loi de 1944', 'La loi de 1975'], niveau: 2 },
    { q: 'Que garantit la laïcité ?', bonne: 'La liberté de croire ou de ne pas croire', fausses: ['L\'interdiction de toutes les religions', 'Une religion officielle', 'L\'obligation d\'avoir une religion'], niveau: 1 },
    { q: 'Quels sont les quatre caractères de la République selon l\'article 1er de la Constitution ?', bonne: 'Indivisible, laïque, démocratique et sociale', fausses: ['Libre, égale, fraternelle et juste', 'Unie, forte, riche et sociale', 'Laïque, militaire, démocratique et européenne'], niveau: 2 },
    { q: 'Quel texte de 1789 proclame les droits fondamentaux des citoyens ?', bonne: 'La Déclaration des droits de l\'homme et du citoyen', fausses: ['La Constitution de 1958', 'Le Code civil', 'La Charte des Nations unies'], niveau: 2 },
    { q: 'Que signifie une République « sociale » ?', bonne: 'Elle protège les citoyens (santé, éducation, solidarité)', fausses: ['Elle est dirigée par un parti unique', 'Elle interdit les entreprises', 'Elle n\'a pas d\'impôts'], niveau: 2 },
    { q: 'Pourquoi le port de signes religieux ostensibles est-il interdit aux élèves de l\'école publique ?', bonne: 'Pour respecter la laïcité et protéger tous les élèves des pressions', fausses: ['Parce que les religions sont interdites en France', 'Pour faire des économies', 'Parce que c\'est une règle européenne'], niveau: 3 },
    { q: 'Laquelle de ces situations est une discrimination interdite par la loi ?', bonne: 'Refuser un logement à une personne à cause de son origine', fausses: ['Refuser un emploi à quelqu\'un qui n\'a pas le diplôme exigé', 'Interdire le téléphone en classe', 'Demander une pièce d\'identité pour voter'], niveau: 3 },
    { q: 'Quelle valeur la solidarité envers les personnes en difficulté illustre-t-elle ?', bonne: 'La fraternité', fausses: ['La liberté', 'La laïcité', 'L\'indivisibilité'], niveau: 2 }
  ],
  vraiFaux: [
    { texte: 'La laïcité interdit de pratiquer une religion.', vrai: false, explication: 'Elle garantit au contraire la liberté de conscience et le libre exercice des cultes.' },
    { texte: 'L\'État français ne subventionne aucun culte.', vrai: true, explication: 'Loi de 1905, article 2 : la République ne reconnaît, ne salarie ni ne subventionne aucun culte.' },
    { texte: '« Travail, Famille, Patrie » est la devise de la République.', vrai: false, explication: 'C\'était la devise du régime de Vichy (1940-1944).' },
    { texte: 'L\'égalité signifie que la loi est la même pour tous.', vrai: true, explication: 'Tous les citoyens sont égaux devant la loi.' }
  ],
  classements: [
    { question: 'Est-ce une valeur, un principe ou un symbole de la République ?', groupes: [
      { nom: 'Valeur', items: ['Liberté', 'Égalité', 'Fraternité'] },
      { nom: 'Principe', items: ['Laïcité', 'Indivisibilité'] },
      { nom: 'Symbole', items: ['Marianne', 'La Marseillaise', 'Le drapeau tricolore'] }
    ] }
  ]
};

export default fabriquer(banque);
