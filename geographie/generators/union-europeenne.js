// Thème 3 · L'Union européenne, un nouveau territoire de référence et d'appartenance
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'union-europeenne',
  titre: 'La France et l\'Union européenne',
  discipline: 'g3',
  resume: 'Un territoire de référence : libre circulation, institutions, régions transfrontalières.',
  essentiel: [
    'L\'<strong>Union européenne</strong> (UE) réunit <strong>27 États</strong> depuis la sortie du Royaume-Uni en 2020. La France en est un membre fondateur.',
    'L\'UE est un territoire de référence : <strong>libre circulation</strong> des personnes (espace Schengen), des marchandises, des services et des capitaux ; une monnaie commune, l\'<strong>euro</strong>, dans une vingtaine de pays.',
    'Ses institutions siègent à <strong>Bruxelles</strong> (Commission), <strong>Strasbourg</strong> (Parlement européen, élu au suffrage universel direct) et <strong>Francfort</strong> (Banque centrale européenne).',
    'L\'UE aide les régions en difficulté (fonds régionaux) et les agriculteurs (<strong>politique agricole commune</strong>). Erasmus+ permet aux jeunes d\'étudier dans un autre pays.',
    'Aux frontières, des <strong>régions transfrontalières</strong> se développent : des milliers de Français travaillent au Luxembourg, en Suisse, en Belgique ou en Allemagne.'
  ],
  vocabulaire: [
    { mot: 'Union européenne', definition: 'Association de 27 États européens qui ont mis en commun des politiques et des institutions.' },
    { mot: 'Espace Schengen', definition: 'Espace de libre circulation des personnes, sans contrôle aux frontières intérieures.' },
    { mot: 'Zone euro', definition: 'Ensemble des pays de l\'Union qui utilisent la même monnaie.' },
    { mot: 'Région transfrontalière', definition: 'Espace situé de part et d\'autre d\'une frontière, où les habitants échangent beaucoup.' },
    { mot: 'Politique agricole commune', definition: 'Politique de l\'Union qui soutient et organise l\'agriculture des États membres.' },
    { mot: 'Citoyenneté européenne', definition: 'Statut qui s\'ajoute à la nationalité et donne des droits (voter aux élections européennes, circuler librement).' },
    { mot: 'État membre', definition: 'Pays qui fait partie de l\'Union européenne.' }
  ],
  questions: [
    { q: 'Combien d\'États compte l\'Union européenne depuis 2020 ?', bonne: '27', fausses: ['12', '28', '50'], niveau: 1 },
    { q: 'Quel pays a quitté l\'Union européenne en 2020 ?', bonne: 'Le Royaume-Uni', fausses: ['La Suisse', 'La Norvège', 'La Grèce'], niveau: 1 },
    { q: 'Quelle est la monnaie commune d\'une partie des pays de l\'UE ?', bonne: 'L\'euro', fausses: ['Le dollar', 'La livre', 'Le franc'], niveau: 1 },
    { q: 'Dans quelle ville française siège le Parlement européen ?', bonne: 'Strasbourg', fausses: ['Paris', 'Lyon', 'Lille'], niveau: 1 },
    { q: 'Que permet l\'espace Schengen ?', bonne: 'Circuler sans contrôle aux frontières intérieures', fausses: ['Utiliser l\'euro', 'Voter pour le président français', 'Étudier gratuitement partout dans le monde'], niveau: 2 },
    { q: 'Dans quelle ville siège la Commission européenne ?', bonne: 'Bruxelles', fausses: ['Strasbourg', 'Francfort', 'Rome'], niveau: 2 },
    { q: 'Comment les députés européens sont-ils désignés ?', bonne: 'Ils sont élus au suffrage universel direct par les citoyens', fausses: ['Ils sont nommés par le président français', 'Ils sont tirés au sort', 'Ils sont choisis par la Commission'], niveau: 2 },
    { q: 'Quel programme permet aux jeunes d\'étudier dans un autre pays de l\'UE ?', bonne: 'Erasmus+', fausses: ['La PAC', 'Schengen', 'L\'OTAN'], niveau: 2 },
    { q: 'Pourquoi de nombreux Lorrains travaillent-ils au Luxembourg ?', bonne: 'Les salaires y sont plus élevés et il y a beaucoup d\'emplois', fausses: ['Parce qu\'il n\'y a pas de frontière avec la France', 'Parce que le Luxembourg n\'a pas d\'habitants', 'Parce que le travail y est interdit aux Luxembourgeois'], niveau: 3 },
    { q: 'Quelle politique européenne aide les agriculteurs ?', bonne: 'La politique agricole commune (PAC)', fausses: ['Erasmus+', 'L\'espace Schengen', 'La Banque centrale européenne'], niveau: 3 },
    { q: 'Où siège la Banque centrale européenne ?', bonne: 'Francfort', fausses: ['Bruxelles', 'Strasbourg', 'Paris'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Tous les pays de l\'UE utilisent l\'euro.', vrai: false, explication: 'Une vingtaine de pays seulement l\'utilisent ; d\'autres, comme la Suède ou la Pologne, gardent leur monnaie.' },
    { texte: 'La France est un membre fondateur de la construction européenne.', vrai: true, explication: 'Elle fait partie des six pays fondateurs de la CECA (1951) et de la CEE (1957).' },
    { texte: 'La Suisse fait partie de l\'Union européenne.', vrai: false, explication: 'La Suisse n\'est pas membre de l\'UE, mais elle fait partie de l\'espace Schengen.' },
    { texte: 'Les citoyens européens élisent le Parlement européen.', vrai: true, explication: 'Les élections européennes ont lieu tous les cinq ans.' }
  ],
  classements: [
    { question: 'Ce pays est-il membre de l\'Union européenne ?', groupes: [
      { nom: 'Membre de l\'UE', items: ['Allemagne', 'Espagne', 'Italie', 'Belgique', 'Pologne'] },
      { nom: 'Pas membre de l\'UE', items: ['Suisse', 'Royaume-Uni', 'Norvège'] }
    ] }
  ]
};

export default fabriquer(banque);
