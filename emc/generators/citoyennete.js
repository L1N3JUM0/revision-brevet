// EMC · Être citoyen : droits, devoirs, engagement
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'citoyennete',
  titre: 'Être citoyen',
  discipline: 'emc',
  resume: 'Nationalité, droits et devoirs, vote, engagement des jeunes.',
  essentiel: [
    'Un <strong>citoyen</strong> est une personne qui a la nationalité française et qui possède des droits civils et politiques (voter, être élu).',
    'On peut voter à <strong>18 ans</strong>. Le vote est un droit et un devoir civique, mais il n\'est pas obligatoire en France.',
    'Les citoyens des pays de l\'Union européenne ont aussi la <strong>citoyenneté européenne</strong> : ils votent aux élections européennes et municipales dans le pays où ils vivent.',
    'À 16 ans, chaque jeune doit se faire <strong>recenser</strong> à la mairie, puis participer à la <strong>Journée défense et citoyenneté (JDC)</strong>.',
    'On peut s\'engager avant 18 ans : délégué de classe, éco-délégué, association, conseil municipal des jeunes.'
  ],
  vocabulaire: [
    { mot: 'Citoyen', definition: 'Personne qui a la nationalité d\'un pays et y possède des droits civils et politiques.' },
    { mot: 'Nationalité', definition: 'Lien juridique qui rattache une personne à un État.' },
    { mot: 'Droit de vote', definition: 'Possibilité de participer aux élections pour choisir des représentants.' },
    { mot: 'Abstention', definition: 'Fait de ne pas aller voter alors qu\'on est inscrit sur les listes électorales.' },
    { mot: 'Recensement', definition: 'Démarche obligatoire à 16 ans, à la mairie, qui permet d\'être convoqué à la JDC et inscrit sur les listes électorales.' },
    { mot: 'Engagement', definition: 'Fait d\'agir volontairement pour une cause ou pour les autres.' },
    { mot: 'Devoir', definition: 'Obligation que chacun doit respecter envers les autres et la société.' }
  ],
  questions: [
    { q: 'À quel âge peut-on voter en France ?', bonne: '18 ans', fausses: ['16 ans', '21 ans', '15 ans'], niveau: 1 },
    { q: 'Le vote est-il obligatoire en France ?', bonne: 'Non, c\'est un droit et un devoir civique', fausses: ['Oui, sous peine d\'amende', 'Oui, seulement pour les présidentielles', 'Non, il est réservé aux élus'], niveau: 1 },
    { q: 'À quel âge doit-on se faire recenser à la mairie ?', bonne: '16 ans', fausses: ['18 ans', '12 ans', '21 ans'], niveau: 2 },
    { q: 'Que signifie JDC ?', bonne: 'Journée défense et citoyenneté', fausses: ['Journée des collégiens', 'Jeunesse, droits et citoyenneté', 'Journée de la Constitution'], niveau: 2 },
    { q: 'Lequel de ces éléments est un devoir du citoyen ?', bonne: 'Payer ses impôts', fausses: ['Partir en vacances', 'Avoir un téléphone', 'Faire du sport'], niveau: 1 },
    { q: 'Lequel de ces éléments est un droit du citoyen ?', bonne: 'Voter aux élections', fausses: ['Ne jamais respecter la loi', 'Refuser de payer ses impôts', 'Choisir les lois qu\'on veut respecter'], niveau: 1 },
    { q: 'Que permet la citoyenneté européenne ?', bonne: 'Voter aux élections européennes et municipales dans le pays de l\'UE où l\'on vit', fausses: ['Voter pour le président de n\'importe quel pays', 'Ne plus avoir de nationalité', 'Ne plus payer d\'impôts'], niveau: 3 },
    { q: 'Comment un collégien peut-il s\'engager au collège ?', bonne: 'En devenant délégué de classe ou éco-délégué', fausses: ['En votant aux élections présidentielles', 'En devenant maire', 'En siégeant au Parlement'], niveau: 1 },
    { q: 'Comment appelle-t-on le fait de ne pas aller voter ?', bonne: 'L\'abstention', fausses: ['Le vote blanc', 'Le référendum', 'La procuration'], niveau: 2 },
    { q: 'Que permet une procuration ?', bonne: 'Confier son vote à un autre électeur qui vote à sa place', fausses: ['Voter deux fois', 'Être élu sans candidature', 'Annuler une élection'], niveau: 3 },
    { q: 'Quel texte international protège les droits des enfants depuis 1989 ?', bonne: 'La Convention internationale des droits de l\'enfant', fausses: ['La Déclaration de 1789', 'Le traité de Versailles', 'La loi de 1905'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'On peut s\'engager dans une association avant 18 ans.', vrai: true, explication: 'De nombreuses associations accueillent des jeunes ; certaines sont même créées par des collégiens.' },
    { texte: 'Le vote en France est public : chacun voit pour qui on vote.', vrai: false, explication: 'Le vote est secret : on vote seul dans l\'isoloir.' },
    { texte: 'Le recensement à 16 ans est obligatoire.', vrai: true, explication: 'Il permet d\'être convoqué à la JDC et d\'être inscrit automatiquement sur les listes électorales à 18 ans.' }
  ],
  classements: [
    { question: 'Est-ce un droit ou un devoir du citoyen ?', groupes: [
      { nom: 'Droit', items: ['Voter', 'S\'exprimer librement', 'Être protégé par la justice', 'Créer une association'] },
      { nom: 'Devoir', items: ['Respecter les lois', 'Payer ses impôts', 'Participer à la JDC', 'Être juré d\'assises si l\'on est tiré au sort'] }
    ] }
  ]
};

export default fabriquer(banque);
