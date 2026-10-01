// Croquis : les dynamiques du territoire français (légende à compléter, figurés à placer)
import { fabriquer } from '../../sciences/generators/fabrique.js';
import { croquisComplet, croquisLegende, croquisZone } from './exos-cartes.js';

export const banque = {
  id: 'croquis',
  titre: 'Le croquis : réussir sa légende',
  discipline: 'reperes',
  resume: 'Lire et compléter un croquis de la France : figurés, légende, localisation.',
  essentiel: [
    'Un <strong>croquis</strong> est une carte simplifiée qui montre une idée. Il a toujours un <strong>titre</strong> et une <strong>légende organisée</strong>.',
    'Trois types de figurés : les <strong>surfaces</strong> (zones coloriées ou hachurées), les <strong>points</strong> (villes, ports), les <strong>lignes</strong> (axes, frontières, littoraux).',
    'Plus un phénomène est important, plus le figuré est gros ou foncé (un gros cercle pour une grande aire urbaine).',
    'La légende est rangée en parties (par exemple : « Des espaces attractifs », « Des espaces en difficulté », « Une France ouverte sur l\'Europe »).'
  ],
  cartes: [
    { titre: 'Un croquis modèle', contenu: '<p>Les dynamiques du territoire français : des métropoles et des littoraux qui attirent, une diagonale peu peuplée, des frontières actives.</p>', figure: croquisComplet() }
  ],
  vocabulaire: [
    { mot: 'Croquis', definition: 'Carte simplifiée, dessinée à la main, qui montre une organisation de l\'espace.' },
    { mot: 'Figuré', definition: 'Symbole (couleur, trait, point) utilisé sur une carte pour représenter un phénomène.' },
    { mot: 'Légende', definition: 'Liste organisée qui explique chaque symbole utilisé sur la carte.' },
    { mot: 'Héliotropisme', definition: 'Attirance des populations pour les régions ensoleillées, notamment au sud.' },
    { mot: 'Travailleur frontalier', definition: 'Personne qui vit dans un pays et travaille dans un pays voisin.' },
    { mot: 'Densité de population', definition: 'Nombre moyen d\'habitants par kilomètre carré.' }
  ],
  questions: [
    { q: 'Quel figuré utilise-t-on pour représenter une ville sur un croquis ?', bonne: 'Un point ou un cercle', fausses: ['Une surface hachurée', 'Une flèche', 'Un trait en pointillés'], niveau: 1 },
    { q: 'Quel figuré convient pour représenter une région peu peuplée ?', bonne: 'Une surface coloriée ou hachurée', fausses: ['Un point', 'Une flèche', 'Un petit triangle'], niveau: 1 },
    { q: 'Pourquoi le cercle de Paris est-il plus gros que celui de Lyon ?', bonne: 'Parce que l\'aire urbaine de Paris est beaucoup plus peuplée', fausses: ['Parce que Paris est plus au nord', 'Parce que Paris est une ville plus ancienne', 'Parce que Paris est sur un fleuve'], niveau: 2 },
    { q: 'Que doit toujours comporter un croquis ?', bonne: 'Un titre et une légende organisée', fausses: ['Des photos', 'La liste de tous les départements', 'Les noms de toutes les villes'], niveau: 1 },
    { q: 'Quel figuré représente le mieux des échanges entre deux espaces ?', bonne: 'Une flèche', fausses: ['Une surface', 'Un point', 'Une hachure'], niveau: 2 },
    { q: 'Quelle zone de la France est appelée « diagonale des faibles densités » ?', bonne: 'Une bande peu peuplée des Ardennes aux Landes', fausses: ['Le littoral méditerranéen', 'La région parisienne', 'La frontière avec l\'Allemagne'], niveau: 2 },
    { q: 'Pourquoi les littoraux du sud attirent-ils de nouveaux habitants ?', bonne: 'Pour le soleil, la mer et le cadre de vie', fausses: ['Parce que les logements y sont les moins chers de France', 'Parce qu\'il n\'y a pas de touristes', 'Parce que ce sont des espaces de faible densité'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Sur un croquis, la légende peut être rangée sans ordre.', vrai: false, explication: 'La légende est organisée en parties qui répondent au titre.' },
    { texte: 'Un croquis simplifie la réalité.', vrai: true, explication: 'Il ne garde que les éléments utiles pour montrer une idée.' },
    { texte: 'Les régions frontalières du nord-est échangent beaucoup avec les pays voisins.', vrai: true, explication: 'Beaucoup d\'habitants travaillent en Belgique, au Luxembourg, en Allemagne ou en Suisse.' }
  ],
  calculs: { croquisLegende, croquisZone },
  modeles: {
    1: [['calc:croquisLegende', 3], ['calc:croquisZone', 3], ['qcm', 2], ['vf', 1]],
    2: [['calc:croquisLegende', 3], ['calc:croquisZone', 3], ['qcm', 2], ['vocMot', 1]],
    3: [['calc:croquisLegende', 3], ['calc:croquisZone', 3], ['qcm', 2], ['vocDef', 1]]
  }
};

export default fabriquer(banque);
