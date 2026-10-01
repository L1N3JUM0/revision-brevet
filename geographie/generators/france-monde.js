// Thème 3 · La France et l'Europe dans le monde
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'france-monde',
  titre: 'La France et l\'Europe dans le monde',
  discipline: 'g3',
  resume: 'Puissance diplomatique, militaire, économique et culturelle.',
  essentiel: [
    'La France est une <strong>puissance</strong> présente dans le monde entier grâce à ses territoires ultramarins et à sa <strong>ZEE</strong>, la deuxième du monde.',
    'Puissance diplomatique et militaire : <strong>membre permanent du Conseil de sécurité de l\'ONU</strong> (avec un droit de veto), puissance nucléaire, armée présente à l\'étranger.',
    'Puissance économique et culturelle : grandes entreprises, première destination touristique du monde, luxe, gastronomie, la <strong>francophonie</strong> (plus de 300 millions de francophones).',
    'L\'<strong>Union européenne</strong> est l\'un des premiers acteurs du commerce mondial et le premier donateur d\'aide au développement.',
    'Cette puissance a des limites : la France pèse moins que les États-Unis ou la Chine, et l\'UE peine parfois à parler d\'une seule voix.'
  ],
  vocabulaire: [
    { mot: 'Puissance', definition: 'Capacité d\'un État à influencer les autres, par son économie, son armée, sa diplomatie ou sa culture.' },
    { mot: 'Francophonie', definition: 'Ensemble des personnes et des pays qui parlent le français.' },
    { mot: 'Conseil de sécurité', definition: 'Organe de l\'ONU chargé de maintenir la paix, avec cinq membres permanents.' },
    { mot: 'Droit de veto', definition: 'Pouvoir de bloquer seul une décision.' },
    { mot: 'Soft power', definition: 'Influence d\'un pays par sa culture, sa langue et son image, sans la force.' },
    { mot: 'Aide au développement', definition: 'Argent et projets fournis aux pays pauvres pour améliorer les conditions de vie.' }
  ],
  questions: [
    { q: 'De quel organe de l\'ONU la France est-elle membre permanent ?', bonne: 'Le Conseil de sécurité', fausses: ['La Commission européenne', 'Le Parlement européen', 'Le G20'], niveau: 1 },
    { q: 'Combien de membres permanents compte le Conseil de sécurité de l\'ONU ?', bonne: '5', fausses: ['2', '15', '27'], niveau: 2 },
    { q: 'Qu\'est-ce que la francophonie ?', bonne: 'L\'ensemble des personnes et des pays qui parlent français', fausses: ['Une fête nationale', 'Une organisation militaire', 'Une monnaie'], niveau: 1 },
    { q: 'Combien y a-t-il environ de francophones dans le monde ?', bonne: 'Plus de 300 millions', fausses: ['Environ 10 millions', 'Environ 67 millions', 'Plus de 3 milliards'], niveau: 2 },
    { q: 'Qu\'est-ce qui permet à la France d\'avoir la deuxième ZEE du monde ?', bonne: 'Ses territoires ultramarins dans tous les océans', fausses: ['Sa grande surface en Europe', 'Ses fleuves', 'Ses montagnes'], niveau: 2 },
    { q: 'Quel exemple montre le soft power de la France ?', bonne: 'Le rayonnement de sa culture, de sa langue et de sa gastronomie', fausses: ['Ses sous-marins nucléaires', 'Ses frontières', 'Son nombre d\'habitants'], niveau: 2 },
    { q: 'Quel droit particulier ont les membres permanents du Conseil de sécurité ?', bonne: 'Le droit de veto', fausses: ['Le droit de ne pas payer d\'impôts', 'Le droit de vote des étrangers', 'Le droit d\'asile'], niveau: 2 },
    { q: 'Quelle puissance l\'Union européenne est-elle surtout ?', bonne: 'Une grande puissance commerciale', fausses: ['La première puissance militaire du monde', 'Une puissance sans échanges', 'Un seul État'], niveau: 3 },
    { q: 'Quelle est une limite de la puissance française ?', bonne: 'Elle pèse moins que les États-Unis ou la Chine', fausses: ['Elle n\'a aucune armée', 'Elle n\'est pas à l\'ONU', 'Elle n\'a pas de territoires hors d\'Europe'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'La France possède l\'arme nucléaire.', vrai: true, explication: 'C\'est un élément de sa puissance militaire et de sa dissuasion.' },
    { texte: 'Le français n\'est parlé qu\'en France.', vrai: false, explication: 'Il est parlé sur tous les continents, notamment en Afrique, en Belgique, en Suisse et au Québec.' },
    { texte: 'L\'Union européenne est un grand acteur du commerce mondial.', vrai: true, explication: 'C\'est l\'un des premiers ensembles commerciaux du monde.' }
  ],
  classements: [
    { question: 'Quel aspect de la puissance française cet exemple illustre-t-il ?', groupes: [
      { nom: 'Puissance militaire et diplomatique', items: ['Siège permanent au Conseil de sécurité', 'Arme nucléaire', 'Bases militaires à l\'étranger'] },
      { nom: 'Puissance économique', items: ['Grandes entreprises mondiales', 'Exportations d\'avions'] },
      { nom: 'Puissance culturelle (soft power)', items: ['Francophonie', 'Musées et patrimoine', 'Gastronomie'] }
    ] }
  ]
};

export default fabriquer(banque);
