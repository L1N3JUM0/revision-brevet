// Les repères du brevet : la carte de France de l'annexe (aires urbaines, fleuves, massifs, mers)
import { fabriquer } from '../../sciences/generators/fabrique.js';
import { carte, VILLES, MERS, NOMS_FLEUVES, NOMS_MASSIFS, CENTRES_MASSIFS } from '../cartes/carte.js';
import { CALCULS_CARTES } from './exos-cartes.js';

const tous = o => Object.fromEntries(Object.keys(o).map(k => [k, 'normal']));
const carteVilles = () => carte({ villes: Object.values(VILLES), etiquettes: Object.values(VILLES).map(v => ({ lon: v.lon, lat: v.lat - 0.38, texte: v.nom })), titre: 'Les principales aires urbaines' });
const carteFleuves = () => carte({ fleuves: tous(NOMS_FLEUVES), massifs: tous(NOMS_MASSIFS), etiquettes: [
  { lon: 1.0, lat: 49.65, texte: 'Seine' }, { lon: 0.2, lat: 47.05, texte: 'Loire' }, { lon: 0.0, lat: 44.2, texte: 'Garonne' }, { lon: 4.2, lat: 44.6, texte: 'Rhône' }, { lon: 8.35, lat: 48.0, texte: 'Rhin' },
  ...Object.entries(CENTRES_MASSIFS).map(([m, [lon, lat]]) => ({ lon, lat, texte: NOMS_MASSIFS[m].replace(/^(les|le) /, '').replace(/^./, c => c.toUpperCase()) })),
  ...Object.values(MERS).map(m => ({ lon: m.lon, lat: m.lat, texte: m.court }))
], titre: 'Fleuves, massifs et mers' });

export const banque = {
  id: 'cartes',
  titre: 'La carte du brevet',
  discipline: 'reperes',
  resume: 'Localiser et nommer les aires urbaines, les fleuves, les massifs et les mers.',
  essentiel: [
    'Au brevet, une carte de France est à compléter : tu dois <strong>localiser et nommer</strong> des aires urbaines, des fleuves et des massifs de montagne.',
    'Les quatre aires urbaines du sujet de référence : <strong>Toulouse, Marseille, Lille et Nantes</strong>. Connais aussi Paris, Lyon et Bordeaux.',
    'Les cinq grands fleuves : la <strong>Seine</strong>, la <strong>Loire</strong>, la <strong>Garonne</strong>, le <strong>Rhône</strong> et le <strong>Rhin</strong>.',
    'Les massifs : les <strong>Alpes</strong>, les <strong>Pyrénées</strong>, le <strong>Massif central</strong>, le <strong>Jura</strong> et les <strong>Vosges</strong>.',
    'Sur la carte : écris lisiblement, au bon endroit, et écris le nom des fleuves le long de leur tracé.'
  ],
  cartes: [
    { titre: 'Les aires urbaines', contenu: '<p>Repère d\'abord les quatre du sujet : Lille au nord, Nantes à l\'ouest, Toulouse au sud-ouest, Marseille au sud-est.</p>', figure: carteVilles() },
    { titre: 'Fleuves, massifs et mers', contenu: '<p>Les fleuves se jettent dans la mer : la Seine dans la Manche, la Loire et la Garonne dans l\'Atlantique, le Rhône dans la Méditerranée, le Rhin dans la mer du Nord.</p>', figure: carteFleuves() }
  ],
  vocabulaire: [
    { mot: 'Aire urbaine', definition: 'Ensemble formé par une ville, sa banlieue et les communes périurbaines dont une grande partie des habitants travaille dans la ville.' },
    { mot: 'Fleuve', definition: 'Cours d\'eau qui se jette dans une mer ou un océan.' },
    { mot: 'Massif', definition: 'Ensemble de montagnes ou de hauteurs regroupées.' },
    { mot: 'Estuaire', definition: 'Embouchure large d\'un fleuve, où se mêlent l\'eau douce et l\'eau de mer (la Loire à Saint-Nazaire).' },
    { mot: 'Delta', definition: 'Embouchure d\'un cours d\'eau divisée en plusieurs bras, comme celle du Rhône en Camargue.' },
    { mot: 'Légende', definition: 'Partie d\'une carte qui explique la signification de chaque figuré (couleur, symbole, trait).' }
  ],
  questions: [
    { q: 'Quel massif forme la frontière entre la France et l\'Espagne ?', bonne: 'Les Pyrénées', fausses: ['Les Alpes', 'Le Jura', 'Les Vosges', 'Le Massif central'], niveau: 1 },
    { q: 'Dans quel massif se trouve le mont Blanc, le plus haut sommet de France ?', bonne: 'Les Alpes', fausses: ['Les Pyrénées', 'Le Massif central', 'Le Jura'], niveau: 1 },
    { q: 'Dans quelle mer se jette le Rhône ?', bonne: 'La mer Méditerranée', fausses: ['L\'océan Atlantique', 'La Manche', 'La mer du Nord'], niveau: 1 },
    { q: 'Dans quelle mer se jette la Seine ?', bonne: 'La Manche', fausses: ['L\'océan Atlantique', 'La mer Méditerranée', 'La mer du Nord'], niveau: 2 },
    { q: 'Quel est le plus long fleuve de France ?', bonne: 'La Loire', fausses: ['La Seine', 'La Garonne', 'Le Rhône'], niveau: 2 },
    { q: 'Quel fleuve marque une partie de la frontière avec l\'Allemagne ?', bonne: 'Le Rhin', fausses: ['La Seine', 'Le Rhône', 'La Loire'], niveau: 2 },
    { q: 'Quel massif est le plus proche de Clermont-Ferrand ?', bonne: 'Le Massif central', fausses: ['Les Alpes', 'Les Pyrénées', 'Les Vosges'], niveau: 2 },
    { q: 'Quelle aire urbaine se trouve à l\'embouchure du Rhône, sur la Méditerranée ?', bonne: 'Marseille', fausses: ['Nice', 'Montpellier', 'Toulouse'], niveau: 2, explication: 'Marseille est un peu à l\'est du delta du Rhône : c\'est le premier port de France.' },
    { q: 'Quelle aire urbaine est la plus proche de la Belgique ?', bonne: 'Lille', fausses: ['Strasbourg', 'Rouen', 'Paris'], niveau: 1 },
    { q: 'Quelle est la plus grande aire urbaine de France après Paris ?', bonne: 'Lyon', fausses: ['Marseille', 'Toulouse', 'Lille'], niveau: 3, explication: 'Après Paris, les plus grandes aires urbaines sont Lyon, puis Marseille-Aix, Lille, Toulouse et Bordeaux.' },
    { q: 'Quel massif se trouve entre l\'Alsace et la Lorraine ?', bonne: 'Les Vosges', fausses: ['Le Jura', 'Les Alpes', 'Le Massif central'], niveau: 3 },
    { q: 'Quel massif longe la frontière suisse, au nord des Alpes ?', bonne: 'Le Jura', fausses: ['Les Vosges', 'Les Pyrénées', 'Le Massif central'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'La Loire se jette dans l\'océan Atlantique.', vrai: true, explication: 'Elle se jette dans l\'Atlantique par un estuaire, après Nantes et Saint-Nazaire.' },
    { texte: 'La Garonne passe à Toulouse et à Bordeaux.', vrai: true, explication: 'Elle naît dans les Pyrénées et rejoint l\'Atlantique par l\'estuaire de la Gironde.' },
    { texte: 'Lyon est située sur la Seine.', vrai: false, explication: 'Lyon est au confluent du Rhône et de la Saône. La Seine passe à Paris et à Rouen.' },
    { texte: 'Le Massif central est situé au sud-est de la France, à la frontière italienne.', vrai: false, explication: 'Ce sont les Alpes. Le Massif central est au centre-sud du pays.' },
    { texte: 'Nantes est située près de l\'estuaire de la Loire.', vrai: true, explication: 'Nantes est sur la Loire, à une cinquantaine de kilomètres de l\'océan.' }
  ],
  calculs: CALCULS_CARTES,
  modeles: {
    1: [['calc:aireNommer', 3], ['calc:aireLocaliser', 2], ['calc:fleuveNommer', 2], ['calc:massifNommer', 2], ['calc:merNommer', 1], ['qcm', 1], ['vf', 1]],
    2: [['calc:aireNommer', 2], ['calc:aireLocaliser', 3], ['calc:fleuveNommer', 2], ['calc:fleuveVille', 2], ['calc:massifLocaliser', 2], ['calc:merNommer', 1], ['qcm', 2], ['vf', 1]],
    3: [['calc:aireLocaliser', 3], ['calc:aireNommer', 2], ['calc:fleuveVille', 2], ['calc:fleuveNommer', 1], ['calc:massifLocaliser', 2], ['calc:massifNommer', 1], ['qcm', 2]]
  }
};

export default fabriquer(banque);
