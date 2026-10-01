// Exercices sur carte, comme l'annexe du brevet : localiser et nommer des aires urbaines,
// des fleuves, des massifs et des espaces maritimes ; compléter la légende d'un croquis.
// Chaque fonction a la signature d'un « calcul » de la fabrique : (rng, ctx, niveau) => exo.
import { carte, cheminGeo, projeter, VILLES, NOMS_FLEUVES, NOMS_MASSIFS, MERS, CENTRES_MASSIFS } from '../cartes/carte.js';

const LETTRES = ['A', 'B', 'C', 'D'];
const maj = s => s.charAt(0).toUpperCase() + s.slice(1);
const TOUS_FLEUVES = Object.fromEntries(Object.keys(NOMS_FLEUVES).map(f => [f, 'normal']));
const TOUS_MASSIFS = Object.fromEntries(Object.keys(NOMS_MASSIFS).map(m => [m, 'normal']));

// Les quatre aires urbaines du sujet de référence, puis les plus grandes, puis les autres
const AIRES_BREVET = ['toulouse', 'marseille', 'lille', 'nantes'];
const AIRES_N1 = [...AIRES_BREVET, 'paris', 'lyon', 'bordeaux', 'strasbourg'];
const airesDuNiveau = niveau => (niveau === 1 ? AIRES_N1 : Object.keys(VILLES));

// Fleuve qui passe dans l'aire urbaine
export const FLEUVE_DE = { paris: 'seine', rouen: 'seine', lyon: 'rhone', nantes: 'loire', bordeaux: 'garonne', toulouse: 'garonne', strasbourg: 'rhin' };

const points = ids => ids.map(id => ({ ...VILLES[id] }));
const distance = (a, b) => { const [x1, y1] = projeter(a.lon, a.lat), [x2, y2] = projeter(b.lon, b.lat); return Math.hypot(x1 - x2, y1 - y2); };

// Tire n éléments assez éloignés les uns des autres sur la carte
function eloignes(rng, ids, n, min = 34) {
  for (let essai = 0; essai < 50; essai++) {
    const choix = rng.melanger([...ids]).slice(0, n);
    if (choix.every((a, i) => choix.every((b, j) => i >= j || distance(VILLES[a], VILLES[b]) >= min))) return choix;
  }
  return rng.melanger([...ids]).slice(0, n);
}

// « Quelle est cette aire urbaine ? » (point en couleur)
export function aireNommer(rng, ctx, niveau) {
  const ids = airesDuNiveau(niveau);
  const cible = rng.choix(ids);
  const autres = rng.melanger(Object.keys(VILLES).filter(v => v !== cible)).slice(0, 3);
  const villes = (niveau === 1 ? AIRES_N1 : Object.keys(VILLES)).map(id => ({ ...VILLES[id], actif: id === cible }));
  return {
    cle: `carte-aire:${cible}:${niveau}`,
    enonce: '<p><strong>Quelle est l\'aire urbaine marquée en orange ?</strong></p>',
    figure: carte({ villes, titre: 'Carte des aires urbaines' }),
    type: 'qcm',
    choix: rng.melanger([cible, ...autres].map(id => VILLES[id].nom)),
    reponse: VILLES[cible].nom,
    etapes: [`C'est l'aire urbaine de <strong>${VILLES[cible].nom}</strong>.`, indiceVille(cible)],
    erreurs: []
  };
}

// « Où se trouve l'aire urbaine de … ? » (4 points lettrés)
export function aireLocaliser(rng, ctx, niveau) {
  const ids = eloignes(rng, airesDuNiveau(niveau), 4);
  const k = rng.int(0, 3);
  const villes = ids.map((id, i) => ({ ...VILLES[id], lettre: LETTRES[i] }));
  return {
    cle: `carte-loc:${ids.join(',')}:${k}`,
    enonce: `<p><strong>Où se trouve l'aire urbaine de ${VILLES[ids[k]].nom} ?</strong></p>`,
    figure: carte({ villes, titre: 'Carte avec quatre aires urbaines repérées par des lettres' }),
    type: 'qcm',
    choix: LETTRES,
    reponse: LETTRES[k],
    etapes: [`${VILLES[ids[k]].nom} est le point <strong>${LETTRES[k]}</strong>. ${indiceVille(ids[k])}`,
      `Les autres : ${ids.map((id, i) => (i === k ? null : `${LETTRES[i]} = ${VILLES[id].nom}`)).filter(Boolean).join(', ')}.`],
    erreurs: ids.map((id, i) => (i === k ? null : { test: r => r === LETTRES[i], message: `Le point ${LETTRES[i]}, c'est ${VILLES[id].nom}.` })).filter(Boolean)
  };
}

// Repère pour retrouver une ville sur la carte
function indiceVille(id) {
  const INDICES = {
    paris: 'Au centre du Bassin parisien, sur la Seine : c\'est la plus grande aire urbaine de France.',
    lyon: 'Au confluent du Rhône et de la Saône, entre le Massif central et les Alpes.',
    marseille: 'Sur la côte méditerranéenne, à l\'est du delta du Rhône : c\'est le premier port de France.',
    toulouse: 'Dans le Sud-Ouest, sur la Garonne, au nord des Pyrénées.',
    lille: 'Tout au nord, près de la frontière belge.',
    bordeaux: 'Dans le Sud-Ouest, sur la Garonne, près de l\'océan Atlantique.',
    nantes: 'À l\'ouest, sur la Loire, près de son estuaire.',
    nice: 'Au sud-est, sur la Méditerranée, près de l\'Italie.',
    strasbourg: 'À l\'est, sur le Rhin, à la frontière allemande.',
    rennes: 'À l\'ouest, en Bretagne, au nord de Nantes.',
    montpellier: 'Sur la côte méditerranéenne, à l\'ouest du delta du Rhône.',
    grenoble: 'Au cœur des Alpes, au sud-est de Lyon.',
    rouen: 'Au nord-ouest de Paris, sur la Seine, avant la Manche.'
  };
  return INDICES[id];
}

// « Quel est ce fleuve ? »
export function fleuveNommer(rng) {
  const ids = Object.keys(NOMS_FLEUVES);
  const cible = rng.choix(ids);
  const autres = rng.melanger(ids.filter(f => f !== cible)).slice(0, 3);
  return {
    cle: `carte-fleuve:${cible}`,
    enonce: '<p><strong>Quel est le fleuve tracé en orange ?</strong></p>',
    figure: carte({ fleuves: { ...TOUS_FLEUVES, [cible]: 'actif' }, titre: 'Carte des fleuves' }),
    type: 'qcm',
    choix: rng.melanger([cible, ...autres].map(f => maj(NOMS_FLEUVES[f]))),
    reponse: maj(NOMS_FLEUVES[cible]),
    etapes: [`C'est <strong>${NOMS_FLEUVES[cible]}</strong>.`, INDICES_FLEUVES[cible]],
    erreurs: []
  };
}

const INDICES_FLEUVES = {
  seine: 'La Seine traverse le Bassin parisien (Paris, Rouen) et se jette dans la Manche, au Havre.',
  loire: 'La Loire, le plus long fleuve de France, naît dans le Massif central et se jette dans l\'océan Atlantique après Nantes.',
  garonne: 'La Garonne naît dans les Pyrénées, passe à Toulouse et Bordeaux, et rejoint l\'océan Atlantique par l\'estuaire de la Gironde.',
  rhone: 'Le Rhône naît dans les Alpes suisses, passe à Lyon et se jette dans la mer Méditerranée par un delta (la Camargue).',
  rhin: 'Le Rhin marque la frontière avec l\'Allemagne, passe à Strasbourg et se jette dans la mer du Nord.'
};

// « Quel fleuve passe à … ? »
export function fleuveVille(rng) {
  const ville = rng.choix(Object.keys(FLEUVE_DE));
  const f = FLEUVE_DE[ville];
  const autres = rng.melanger(Object.keys(NOMS_FLEUVES).filter(x => x !== f)).slice(0, 3);
  return {
    cle: `carte-fleuve-ville:${ville}`,
    enonce: `<p><strong>Quel fleuve passe dans l'aire urbaine de ${VILLES[ville].nom} ?</strong></p>`,
    figure: carte({ fleuves: TOUS_FLEUVES, villes: [{ ...VILLES[ville], actif: true }], titre: 'Carte des fleuves et d\'une aire urbaine' }),
    type: 'qcm',
    choix: rng.melanger([f, ...autres].map(x => maj(NOMS_FLEUVES[x]))),
    reponse: maj(NOMS_FLEUVES[f]),
    etapes: [`${VILLES[ville].nom} est sur <strong>${NOMS_FLEUVES[f]}</strong>.`, INDICES_FLEUVES[f]],
    erreurs: []
  };
}

// « Quel est ce massif ? »
export function massifNommer(rng) {
  const ids = Object.keys(NOMS_MASSIFS);
  const cible = rng.choix(ids);
  const autres = rng.melanger(ids.filter(m => m !== cible)).slice(0, 3);
  return {
    cle: `carte-massif:${cible}`,
    enonce: '<p><strong>Quel est le massif de montagne en orange ?</strong></p>',
    figure: carte({ massifs: { ...TOUS_MASSIFS, [cible]: 'actif' }, titre: 'Carte des massifs' }),
    type: 'qcm',
    choix: rng.melanger([cible, ...autres].map(m => maj(NOMS_MASSIFS[m]))),
    reponse: maj(NOMS_MASSIFS[cible]),
    etapes: [`Ce sont <strong>${NOMS_MASSIFS[cible]}</strong>.`.replace('Ce sont <strong>le', 'C\'est <strong>le'), INDICES_MASSIFS[cible]],
    erreurs: []
  };
}

const INDICES_MASSIFS = {
  alpes: 'Les Alpes, au sud-est, forment le plus haut massif de France (mont Blanc, 4 805 m), à la frontière avec l\'Italie et la Suisse.',
  pyrenees: 'Les Pyrénées forment la frontière avec l\'Espagne, au sud-ouest.',
  'massif-central': 'Le Massif central, au centre-sud, est un massif ancien aux volcans éteints (Auvergne).',
  jura: 'Le Jura est un massif de moyenne montagne à la frontière avec la Suisse, au nord des Alpes.',
  vosges: 'Les Vosges sont un massif ancien du nord-est, à l\'ouest de l\'Alsace et du Rhin.'
};

// « Où sont les … ? » (4 massifs lettrés)
export function massifLocaliser(rng) {
  const ids = rng.melanger(Object.keys(NOMS_MASSIFS)).slice(0, 4);
  const k = rng.int(0, 3);
  return {
    cle: `carte-massif-loc:${ids.join(',')}:${k}`,
    enonce: `<p><strong>Où se trouve${ids[k] === 'massif-central' || ids[k] === 'jura' ? '' : 'nt'} ${NOMS_MASSIFS[ids[k]]} ?</strong></p>`,
    figure: carte({ massifs: Object.fromEntries(ids.map(m => [m, 'normal'])), etiquettes: ids.map((m, i) => ({ lon: CENTRES_MASSIFS[m][0], lat: CENTRES_MASSIFS[m][1], texte: LETTRES[i], pastille: true })), titre: 'Carte avec quatre massifs repérés par des lettres' }),
    type: 'qcm',
    choix: LETTRES,
    reponse: LETTRES[k],
    etapes: [`${maj(NOMS_MASSIFS[ids[k]])} : lettre <strong>${LETTRES[k]}</strong>. ${INDICES_MASSIFS[ids[k]]}`],
    erreurs: ids.map((m, i) => (i === k ? null : { test: r => r === LETTRES[i], message: `La lettre ${LETTRES[i]}, ce sont ${NOMS_MASSIFS[m]}.`.replace('ce sont le', 'c\'est le') })).filter(Boolean)
  };
}

// « Comment s'appelle l'espace maritime … ? »
export function merNommer(rng) {
  const ids = Object.keys(MERS);
  const k = rng.int(0, 3);
  return {
    cle: `carte-mer:${ids[k]}`,
    enonce: `<p><strong>Comment s'appelle l'espace maritime ${LETTRES[k]} ?</strong></p>`,
    figure: carte({ etiquettes: ids.map((m, i) => ({ ...MERS[m], texte: LETTRES[i], pastille: true })), titre: 'Carte avec les mers repérées par des lettres' }),
    type: 'qcm',
    choix: ids.map(m => MERS[m].court),
    reponse: MERS[ids[k]].court,
    etapes: [`L'espace ${LETTRES[k]}, c'est <strong>${MERS[ids[k]].nom}</strong>.`, 'Au nord : la mer du Nord et la Manche ; à l\'ouest : l\'océan Atlantique ; au sud-est : la mer Méditerranée.'],
    erreurs: []
  };
}

// ---------- Croquis : « Les dynamiques du territoire français » ----------

// Tracés schématiques (en degrés) : un croquis simplifie volontairement la réalité
const DIAGONALE = [[4.9, 49.95], [5.4, 49.4], [5.5, 48.6], [5.0, 47.4], [4.4, 46.2], [4.0, 45.0], [3.2, 44.1], [2.4, 44.0], [1.2, 43.95], [0.3, 43.7], [-1.0, 43.8], [-1.0, 44.4], [-0.2, 45.0], [0.8, 45.8], [1.4, 46.6], [2.4, 47.8], [3.2, 49.0], [4.0, 49.7]];
const LITTORAL_SUD = [[3.1, 42.5], [3.05, 43.0], [3.5, 43.3], [4.2, 43.45], [5.0, 43.35], [5.9, 43.1], [6.6, 43.2], [7.3, 43.7], [7.5, 43.78]];
const LITTORAL_OUEST = [[-1.75, 43.35], [-1.4, 44.0], [-1.25, 44.6], [-1.2, 45.5], [-1.5, 46.2], [-2.1, 46.8], [-2.5, 47.3], [-3.1, 47.5], [-4.3, 47.8]];
const FRONTIERE_NE = [[2.6, 51.0], [3.2, 50.75], [4.2, 50.25], [5.8, 49.55], [6.8, 49.2], [8.0, 49.0], [7.6, 47.6], [6.9, 47.45], [6.1, 46.2]];

export const LEGENDE = [
  { id: 'paris', texte: 'L\'aire urbaine de Paris, la plus peuplée', swatch: '<circle cx="14" cy="10" r="8" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>', lettre: [2.35, 48.86] },
  { id: 'metropoles', texte: 'Une grande aire urbaine régionale', swatch: '<circle cx="14" cy="10" r="5" fill="#f97316" stroke="#fff" stroke-width="1.2"/>', lettre: null },
  { id: 'diagonale', texte: 'Les espaces de faible densité (la « diagonale »)', swatch: '<rect x="2" y="2" width="24" height="16" fill="#f59e0b" fill-opacity="0.45"/>', lettre: [3.0, 46.0] },
  { id: 'littoraux', texte: 'Un littoral attractif (tourisme, nouveaux habitants)', swatch: '<path d="M2 10h24" stroke="#38bdf8" stroke-width="5"/>', lettre: [5.6, 42.75] },
  { id: 'frontiere', texte: 'Une frontière dynamique (travailleurs frontaliers, échanges)', swatch: '<path d="M2 10h24" stroke="#a855f7" stroke-width="4" stroke-dasharray="5 3"/>', lettre: [7.0, 49.75] }
];
const METROPOLES = ['lyon', 'marseille', 'toulouse', 'lille', 'bordeaux', 'nantes', 'nice', 'strasbourg'];

function elementsCroquis(sauf = []) {
  const avec = id => !sauf.includes(id);
  return {
    zones: avec('diagonale') ? [{ d: cheminGeo(DIAGONALE), fill: '#f59e0b', opacite: 0.45 }] : [],
    traits: [
      ...(avec('littoraux') ? [{ d: cheminGeo(LITTORAL_SUD, false), stroke: '#38bdf8', largeur: 5 }, { d: cheminGeo(LITTORAL_OUEST, false), stroke: '#38bdf8', largeur: 5 }] : []),
      ...(avec('frontiere') ? [{ d: cheminGeo(FRONTIERE_NE, false), stroke: '#a855f7', largeur: 4, tirets: '7 4' }] : [])
    ],
    villes: [
      ...(avec('paris') ? [{ ...VILLES.paris, taille: 10, fill: '#ef4444' }] : []),
      ...(avec('metropoles') ? METROPOLES.map(id => ({ ...VILLES[id], taille: 5.5, fill: '#f97316' })) : [])
    ]
  };
}

const legendeHtml = (items, numeros) => `<ul class="legende">${items.map((l, i) => `<li><svg viewBox="0 0 28 20" width="28" height="20" aria-hidden="true">${l.swatch}</svg> ${numeros ? `<strong>${i + 1}.</strong> …` : l.texte}</li>`).join('')}</ul>`;

export const croquisComplet = () => carte({ ...elementsCroquis(), titre: 'Croquis des dynamiques du territoire français' }) + legendeHtml(LEGENDE, false);

// Légende à compléter : « Que représente le figuré n° k ? »
export function croquisLegende(rng) {
  const k = rng.int(0, LEGENDE.length - 1);
  const choix = rng.melanger([LEGENDE[k], ...rng.melanger(LEGENDE.filter((_, i) => i !== k)).slice(0, 3)]).map(l => l.texte);
  return {
    cle: `croquis-legende:${LEGENDE[k].id}`,
    enonce: `<p><strong>Complète la légende : que représente le figuré n° ${k + 1} ?</strong></p>`,
    figure: carte({ ...elementsCroquis(), titre: 'Croquis des dynamiques du territoire français' }) + legendeHtml(LEGENDE, true),
    type: 'qcm',
    choix,
    reponse: LEGENDE[k].texte,
    etapes: [`Le figuré n° ${k + 1} représente <strong>${LEGENDE[k].texte.charAt(0).toLowerCase() + LEGENDE[k].texte.slice(1)}</strong>.`, EXPLICATIONS_CROQUIS[LEGENDE[k].id]],
    erreurs: []
  };
}

const EXPLICATIONS_CROQUIS = {
  paris: 'Paris domine le territoire : c\'est la seule ville mondiale française. Un cercle plus gros montre qu\'elle est plus peuplée.',
  metropoles: 'Les grandes métropoles régionales (Lyon, Marseille, Toulouse, Lille…) attirent habitants et emplois.',
  diagonale: 'Une bande peu peuplée va des Ardennes aux Landes : c\'est la « diagonale des faibles densités ».',
  littoraux: 'Les littoraux de la Méditerranée et de l\'Atlantique attirent touristes et nouveaux habitants (héliotropisme).',
  frontiere: 'Au nord-est, les régions frontalières échangent beaucoup avec les pays voisins : de nombreux habitants travaillent en Belgique, au Luxembourg, en Allemagne ou en Suisse.'
};

// Zone à colorier : « Où faut-il placer ce figuré ? » (4 lettres sur un fond vierge)
export function croquisZone(rng) {
  const avecLettre = LEGENDE.filter(l => l.lettre);
  const k = rng.int(0, avecLettre.length - 1);
  const l = avecLettre[k];
  return {
    cle: `croquis-zone:${l.id}`,
    enonce: `<p><strong>Tu réalises le croquis. Où dois-tu placer le figuré : « ${l.texte.charAt(0).toLowerCase() + l.texte.slice(1)} » ?</strong></p>`,
    figure: carte({ fleuves: {}, etiquettes: avecLettre.map((x, i) => ({ lon: x.lettre[0], lat: x.lettre[1], texte: LETTRES[i], pastille: true })), titre: 'Fond de carte avec quatre emplacements repérés par des lettres' }) + `<ul class="legende"><li><svg viewBox="0 0 28 20" width="28" height="20" aria-hidden="true">${l.swatch}</svg> ${l.texte}</li></ul>`,
    type: 'qcm',
    choix: LETTRES.slice(0, avecLettre.length),
    reponse: LETTRES[k],
    etapes: [`Il faut le placer en <strong>${LETTRES[k]}</strong>.`, EXPLICATIONS_CROQUIS[l.id]],
    erreurs: []
  };
}

export const CALCULS_CARTES = { aireNommer, aireLocaliser, fleuveNommer, fleuveVille, massifNommer, massifLocaliser, merNommer, croquisLegende, croquisZone };
