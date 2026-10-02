// EMC · S'informer : médias, désinformation, esprit critique
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'information',
  titre: 'S\'informer, exercer son esprit critique',
  discipline: 'emc',
  resume: 'Liberté d\'expression, médias, fausses informations et ingérences.',
  essentiel: [
    'La <strong>liberté d\'expression</strong> est garantie par la Déclaration de 1789 (article 11), mais elle a des limites : la diffamation, l\'injure, l\'incitation à la haine sont punies.',
    'La <strong>liberté de la presse</strong> (loi de 1881) permet aux journalistes d\'enquêter et d\'informer. Ils vérifient et citent leurs sources.',
    'La <strong>désinformation</strong> consiste à diffuser volontairement de fausses informations pour tromper ou manipuler.',
    'Des États étrangers peuvent mener des <strong>ingérences</strong> : faux sites, faux comptes, campagnes coordonnées sur les réseaux sociaux.',
    'Pour exercer son <strong>esprit critique</strong> : qui parle ? quelle est la source ? d\'autres médias fiables le confirment-ils ? l\'image est-elle authentique ?'
  ],
  vocabulaire: [
    { mot: 'Désinformation', definition: 'Diffusion volontaire de fausses informations pour tromper ou manipuler.' },
    { mot: 'Source', definition: 'Origine d\'une information : personne, document ou média qui la fournit.' },
    { mot: 'Esprit critique', definition: 'Capacité à examiner une information avant de la croire, en cherchant des preuves.' },
    { mot: 'Ingérence', definition: 'Intervention d\'un État étranger dans les affaires intérieures d\'un pays.' },
    { mot: 'Complotisme', definition: 'Tendance à expliquer les événements par un complot secret, sans preuves sérieuses.' },
    { mot: 'Diffamation', definition: 'Accusation publique qui porte atteinte à l\'honneur d\'une personne et que la loi punit.' },
    { mot: 'Hypertrucage', definition: 'Image, vidéo ou son fabriqué par intelligence artificielle pour imiter une personne réelle.' }
  ],
  questions: [
    { q: 'Quel article de la Déclaration de 1789 garantit la liberté d\'expression ?', bonne: 'L\'article 11', fausses: ['L\'article 1', 'L\'article 3', 'L\'article 17'], niveau: 3 },
    { q: 'Que doit-on faire avant de partager une information surprenante ?', bonne: 'Vérifier sa source et la comparer avec d\'autres médias', fausses: ['La partager vite pour prévenir tout le monde', 'Compter le nombre de « j\'aime »', 'Croire la première version lue'], niveau: 1 },
    { q: 'Qu\'est-ce que la désinformation ?', bonne: 'La diffusion volontaire de fausses informations', fausses: ['Une erreur de frappe', 'Un article d\'opinion signé', 'Une publicité autorisée'], niveau: 1 },
    { q: 'La liberté d\'expression permet-elle de tout dire ?', bonne: 'Non, la loi punit par exemple l\'injure, la diffamation et l\'incitation à la haine', fausses: ['Oui, sans aucune limite', 'Non, il faut une autorisation pour parler', 'Oui, sauf à l\'école'], niveau: 2 },
    { q: 'Quelle loi garantit la liberté de la presse en France ?', bonne: 'La loi de 1881', fausses: ['La loi de 1905', 'La loi de 1901', 'La loi de 1975'], niveau: 3 },
    { q: 'Quel indice doit rendre méfiant face à une publication ?', bonne: 'Aucune source n\'est citée et le titre cherche à choquer', fausses: ['L\'auteur est un journaliste identifié', 'D\'autres médias donnent la même information', 'La date est indiquée'], niveau: 2 },
    { q: 'Qu\'est-ce qu\'une ingérence étrangère dans l\'information ?', bonne: 'Une action d\'un État étranger pour manipuler l\'opinion d\'un pays', fausses: ['Un reportage tourné à l\'étranger', 'Un journal traduit en anglais', 'Un voyage de journalistes'], niveau: 2 },
    { q: 'Pourquoi les journalistes citent-ils leurs sources ?', bonne: 'Pour que l\'on puisse vérifier l\'origine de l\'information', fausses: ['Pour remplir l\'article', 'Parce que c\'est une publicité', 'Pour cacher la vérité'], niveau: 2 },
    { q: 'Pourquoi les réseaux sociaux favorisent-ils la diffusion des fausses informations ?', bonne: 'Les contenus choquants sont partagés vite et beaucoup, sans vérification', fausses: ['Ils sont tous contrôlés par des journalistes', 'Les informations y sont toujours vérifiées', 'On ne peut rien y partager'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Une vidéo peut être entièrement fabriquée par une intelligence artificielle.', vrai: true, explication: 'On parle d\'hypertrucage : il faut vérifier la source avant d\'y croire.' },
    { texte: 'Une information partagée des milliers de fois est forcément vraie.', vrai: false, explication: 'Le nombre de partages ne prouve rien : les fausses informations circulent souvent plus vite que les vraies.' },
    { texte: 'En France, la presse est soumise à une censure préalable.', vrai: false, explication: 'La presse est libre depuis la loi de 1881 ; les abus sont jugés après publication.' }
  ],
  sequences: [
    { titre: 'vérifier', consigne: 'Remets dans l\'ordre les étapes pour vérifier une information.', etapes: ['Je lis l\'information en entier, pas seulement le titre', 'Je cherche qui l\'a publiée et quand', 'Je regarde si des médias fiables la confirment', 'Je décide de la partager ou non'] }
  ]
};

export default fabriquer(banque);
