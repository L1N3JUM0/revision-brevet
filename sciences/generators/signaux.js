// Physique-Chimie — Signaux : lumière et son. Vitesses de propagation, orage, écho et sonar,
// fréquences (infrasons, sons audibles, ultrasons), niveaux sonores.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net, arrondi } from './fabrique.js';

const V_SON_AIR = 340;       // m/s
const V_SON_EAU = 1500;      // m/s
const C = 300000;            // km/s (lumière, dans le vide et l'air)

// Distance de l'orage : la lumière arrive presque instantanément, le son à 340 m/s
function calcOrage(rng, ctx, niveau) {
  const t = rng.int(1, niveau === 1 ? 6 : 15);
  const d = V_SON_AIR * t;
  const enKm = niveau >= 2 && rng.bool(0.5);
  const r = enKm ? net(d / 1000) : d;
  const err = erreursNombre(r);
  err.ajouter(enKm ? d : net(d / 1000), enKm ? `${fmt(d)} m, c'est la distance en mètres : divise par 1 000 pour l'avoir en km.` : 'On demande la distance en <strong>mètres</strong>.');
  err.ajouter(net(V_SON_AIR / t), 'Distance = vitesse <strong>×</strong> durée, pas vitesse ÷ durée.');
  err.ajouter(net(C * 1000 * t), 'C\'est le <strong>son</strong> (le tonnerre) qui met du temps à arriver : on utilise 340 m/s.');
  return {
    cle: `orage:${t}:${enKm}`,
    enonce: `<p>${ctx.prenom} voit un éclair, puis entend le tonnerre ${t} s plus tard.</p>
      <p>Vitesse du son dans l'air : 340 m/s. La lumière arrive presque instantanément.</p>
      <p><strong>À quelle distance se trouve l'orage, en ${enKm ? 'km' : 'm'} ?</strong></p>`,
    type: 'nombre',
    unite: enKm ? 'km' : 'm',
    reponse: r,
    etapes: [
      'La lumière de l\'éclair arrive quasi instantanément ; le son du tonnerre met <strong>t secondes</strong>.',
      `d = v × t = 340 × ${t} = ${enKm ? fmt(d) + ' m' : gras(fmt(d)) + ' m'}`,
      ...(enKm ? [`${fmt(d)} m = ${fmt(d)} ÷ 1000 km = ${gras(fmt(r))} km`] : [])
    ],
    erreurs: err.liste(),
    expression: enKm ? `${fmt(d)} ÷ 1000` : `340 × ${t}`
  };
}

// Écho et sonar : le signal fait l'aller-retour
function calcEcho(rng, ctx) {
  const eau = rng.bool(0.6);
  const v = eau ? V_SON_EAU : V_SON_AIR;
  const t = eau ? rng.choix([0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.6, 2, 3, 4]) : rng.choix([1, 2, 3, 4, 5]);
  const d = net(v * t / 2);
  const situation = eau
    ? rng.choix([`Le sonar d'un bateau envoie des ultrasons vers le fond de la mer, près des côtes grecques.`, 'Un sonar de pêche envoie des ultrasons vers un banc de poissons.', 'Un dauphin envoie des ultrasons vers un obstacle.'])
    : rng.choix([`En randonnée, ${ctx.prenom} crie face à une falaise.`, `Dans un canyon, ${ctx.prenom} crie face à la paroi d'en face.`]);
  const err = erreursNombre(d);
  err.ajouter(net(v * t), 'Le son fait un <strong>aller-retour</strong> : il faut diviser la distance parcourue par 2.');
  if (eau) err.ajouter(net(V_SON_AIR * t / 2), 'Dans l\'eau, le son va à 1 500 m/s, pas 340 m/s.');
  return {
    cle: `echo:${eau}:${t}`,
    enonce: `<p>${situation} L'écho revient au bout de ${fmt(t)} s.</p>
      <p>Vitesse du son ${eau ? 'dans l\'eau : 1 500 m/s' : 'dans l\'air : 340 m/s'}.</p>
      <p><strong>À quelle distance se trouve ${eau ? 'l\'obstacle' : 'la paroi'}, en m ?</strong></p>`,
    type: 'nombre',
    unite: 'm',
    reponse: d,
    etapes: [
      `En ${fmt(t)} s, le son parcourt ${fmt(v)} × ${fmt(t)} = ${fmt(net(v * t))} m.`,
      'Mais il fait l\'<strong>aller ET le retour</strong> : la distance à l\'obstacle est la moitié.',
      `d = ${fmt(net(v * t))} ÷ 2 = ${gras(fmt(d))} m`
    ],
    erreurs: err.liste(),
    expression: `${fmt(net(v * t))} ÷ 2`
  };
}

// Durée de trajet de la lumière
const DISTANCES = [
  { nom: 'de la Lune à la Terre', d: 384000, unite: 's', n: 2 },
  { nom: 'du Soleil à la Terre', d: 150000000, unite: 's', n: 0 },
  { nom: 'd\'un satellite GPS (à 20 000 km) jusqu\'au sol', d: 20000, unite: 's', n: 3 },
  { nom: 'd\'un satellite de télévision (à 36 000 km) jusqu\'au sol', d: 36000, unite: 's', n: 2 }
];
function calcLumiere(rng) {
  const D = rng.choix(DISTANCES);
  const t = D.d / C;
  const r = arrondi(t, D.n);
  const tol = D.n ? 0.5 * 10 ** -D.n : 0;
  const err = erreursNombre(r, tol);
  err.ajouter(arrondi(D.d * C, 0), 'Le temps, c\'est la distance <strong>÷</strong> la vitesse.');
  err.ajouter(arrondi(C / D.d, 3), 'C\'est l\'inverse : t = <strong>d ÷ v</strong>.');
  return {
    cle: `lumiere:${D.nom}`,
    enonce: `<p>La lumière se propage à 300 000 km/s. Elle parcourt ${fmt(D.d)} km pour aller ${D.nom}.</p>
      <p><strong>Combien de temps met-elle, en secondes ?</strong>${D.n ? ` (arrondis ${D.n === 2 ? 'au centième' : 'au millième'})` : ''}</p>`,
    type: 'nombre',
    unite: 's',
    tolerance: tol,
    reponse: r,
    etapes: [
      'Formule : <strong>t = d ÷ v</strong>.',
      `t = ${fmt(D.d)} ÷ ${fmt(C)} ${Math.abs(t - r) < 1e-9 ? '=' : '≈'} ${gras(fmt(r))} s`,
      ...(D.d === 150000000 ? ['Soit 8 min 20 s : la lumière du Soleil que tu vois est partie il y a plus de 8 minutes !'] : [])
    ],
    erreurs: err.liste(),
    expression: `${fmt(D.d)} ÷ ${fmt(C)}`
  };
}

// Infrason, son audible ou ultrason ?
function calcFrequence(rng) {
  const zone = rng.choix(['infra', 'audible', 'ultra']);
  const f = zone === 'infra' ? rng.choix([2, 5, 8, 10, 12, 15]) : zone === 'audible' ? rng.choix([50, 100, 440, 1000, 2000, 5000, 10000, 15000]) : rng.choix([25000, 30000, 40000, 50000, 80000, 100000]);
  const bonne = { infra: 'Un infrason', audible: 'Un son audible', ultra: 'Un ultrason' }[zone];
  return {
    cle: `freq:${f}`,
    enonce: `<p>Un son a une fréquence de <strong>${fmt(f)} Hz</strong>.</p><p><strong>Pour l'oreille humaine, c'est…</strong></p>`,
    type: 'qcm',
    choix: ['Un infrason', 'Un son audible', 'Un ultrason'],
    reponse: bonne,
    etapes: [
      'L\'oreille humaine entend les sons de <strong>20 Hz à 20 000 Hz</strong> environ.',
      zone === 'infra' ? `${fmt(f)} Hz &lt; 20 Hz : ${gras('infrason')} (trop grave, inaudible).`
        : zone === 'ultra' ? `${fmt(f)} Hz &gt; 20 000 Hz : ${gras('ultrason')} (trop aigu, inaudible pour nous, mais pas pour les chiens ou les chauves-souris).`
          : `${fmt(f)} Hz est entre 20 Hz et 20 000 Hz : ${gras('son audible')}.`
    ],
    erreurs: [],
    donnees: { f }
  };
}

// Fréquence à partir de la période : f = 1 ÷ T
function calcPeriode(rng) {
  const TmS = rng.choix([1, 2, 2.5, 4, 5, 8, 10, 20, 25, 50]);
  const T = net(TmS / 1000);
  const f = net(1 / T);
  const err = erreursNombre(f);
  err.ajouter(net(1 / TmS), `La période doit être en <strong>secondes</strong> : ${fmt(TmS)} ms = ${fmt(T)} s.`);
  err.ajouter(TmS, 'La fréquence, c\'est 1 ÷ T (le nombre de répétitions par seconde).');
  return {
    cle: `periode:${TmS}`,
    enonce: `<p>Sur l'écran d'un oscilloscope, un signal sonore se répète toutes les ${fmt(TmS)} ms : c'est sa <strong>période</strong> T.</p><p><strong>Quelle est sa fréquence, en hertz (Hz) ?</strong></p>`,
    type: 'nombre',
    unite: 'Hz',
    reponse: f,
    etapes: [
      'Formule : <strong>f = 1 ÷ T</strong> (T en secondes, f en Hz).',
      `T = ${fmt(TmS)} ms = ${fmt(T)} s.`,
      `f = 1 ÷ ${fmt(T)} = ${gras(fmt(f))} Hz`
    ],
    erreurs: err.liste(),
    expression: `1 ÷ ${fmt(T)}`
  };
}

export const banque = {
  id: 'signaux',
  titre: 'Lumière et son',
  discipline: 'pc',
  resume: 'Propagation de la lumière et du son, vitesses, écho, fréquences.',
  essentiel: [
    'La <strong>lumière</strong> se propage en ligne droite, même dans le vide, à environ <strong>300 000 km/s</strong>.',
    'Le <strong>son</strong> a besoin de matière pour se propager (pas de son dans le vide). Dans l\'air : environ <strong>340 m/s</strong> ; dans l\'eau : 1 500 m/s ; encore plus vite dans les solides.',
    'Orage : on voit l\'éclair tout de suite, on entend le tonnerre plus tard. Distance = 340 × durée (en m).',
    'Écho, sonar : le signal fait un aller-retour, donc <strong>d = v × t ÷ 2</strong>.',
    'L\'oreille humaine entend de <strong>20 Hz à 20 000 Hz</strong>. En dessous : infrasons ; au-dessus : ultrasons. Au-delà de 85 dB, le son peut abîmer l\'oreille.'
  ],
  formules: [
    { nom: 'Distance parcourue', formule: 'd = v × t', unites: 'Lumière : 300 000 km/s · Son dans l\'air : 340 m/s' },
    { nom: 'Écho', formule: 'd = v × t ÷ 2' },
    { nom: 'Fréquence', formule: 'f = 1 ÷ T', unites: 'T (période) en s → f en hertz (Hz)' }
  ],
  vocabulaire: [
    { mot: 'Fréquence', definition: 'Nombre de vibrations par seconde d\'un son, en hertz (Hz). Plus elle est grande, plus le son est aigu.' },
    { mot: 'Période', definition: 'Durée d\'un motif qui se répète dans un signal périodique, en secondes.' },
    { mot: 'Ultrason', definition: 'Son de fréquence supérieure à 20 000 Hz, inaudible pour l\'être humain.' },
    { mot: 'Infrason', definition: 'Son de fréquence inférieure à 20 Hz, inaudible pour l\'être humain.' },
    { mot: 'Décibel', definition: 'Unité du niveau d\'intensité sonore (dB).' },
    { mot: 'Année-lumière', definition: 'Distance parcourue par la lumière en un an, environ 9 500 milliards de km.' },
    { mot: 'Source primaire', definition: 'Objet qui produit lui-même la lumière qu\'il émet (Soleil, lampe allumée, flamme).' },
    { mot: 'Objet diffusant', definition: 'Objet qui renvoie dans toutes les directions une partie de la lumière qu\'il reçoit.' }
  ],
  questions: [
    { q: 'Pourquoi n\'y a-t-il aucun son dans l\'espace ?', bonne: 'Le son a besoin de matière pour se propager', fausses: ['Il fait trop froid', 'La lumière empêche le son de passer', 'Le son va trop vite dans le vide'], explication: 'Le son est une vibration de la matière : dans le vide, rien ne peut vibrer.', niveau: 1 },
    { q: 'Dans quel milieu le son se propage-t-il le plus vite ?', bonne: 'Dans l\'acier', fausses: ['Dans l\'air', 'Dans l\'eau', 'Dans le vide'], explication: 'Environ 340 m/s dans l\'air, 1 500 m/s dans l\'eau et près de 6 000 m/s dans l\'acier.', niveau: 2 },
    { q: 'L\'année-lumière est une unité…', bonne: 'De distance', fausses: ['De durée', 'De vitesse', 'De luminosité'], explication: 'C\'est la distance parcourue par la lumière en un an.', niveau: 2 },
    { q: 'La Lune est…', bonne: 'Un objet diffusant', fausses: ['Une source primaire de lumière', 'Une étoile', 'Une source de lumière qui brûle'], explication: 'La Lune ne produit pas de lumière : elle renvoie celle du Soleil.', niveau: 2 },
    { q: 'À partir de quel niveau sonore l\'oreille risque-t-elle d\'être abîmée ?', bonne: 'Environ 85 dB', fausses: ['Environ 20 dB', 'Environ 40 dB', 'Seulement au-delà de 200 dB'], explication: 'Au-delà de 85 dB, une exposition longue est dangereuse. Le seuil de douleur est vers 120 dB.', niveau: 2 },
    { q: 'À un concert de JUL, près des enceintes, le niveau sonore peut dépasser 100 dB. Que faire ?', bonne: 'Porter des bouchons d\'oreilles et s\'éloigner des enceintes', fausses: ['Se rapprocher des enceintes', 'Rien, l\'oreille s\'habitue', 'Monter le son de son téléphone'], explication: 'Les dégâts de l\'oreille interne ne se réparent pas : on se protège et on fait des pauses au calme.', niveau: 1 },
    { q: 'Comment se propage la lumière dans un milieu homogène ?', bonne: 'En ligne droite', fausses: ['En zigzag', 'En cercle', 'Seulement vers le bas'], explication: 'On représente son trajet par un rayon lumineux : une droite avec une flèche.', niveau: 1 },
    { q: 'Plus la fréquence d\'un son est grande, plus il est…', bonne: 'Aigu', fausses: ['Grave', 'Fort', 'Lent'], explication: 'Grande fréquence = son aigu ; petite fréquence = son grave. Le niveau sonore (fort ou faible), c\'est autre chose.', niveau: 2 },
    { q: 'Quel animal se repère grâce aux ultrasons (écholocation) ?', bonne: 'La chauve-souris', fausses: ['Le cheval', 'Le chat', 'La poule'], explication: 'Elle émet des ultrasons et écoute leur écho pour repérer obstacles et insectes. Le dauphin fait de même.', niveau: 1 }
  ],
  vraiFaux: [
    { texte: 'La lumière peut se propager dans le vide.', vrai: true, explication: 'La lumière du Soleil traverse le vide spatial pour nous parvenir.' },
    { texte: 'Le son se propage plus vite que la lumière.', vrai: false, explication: 'La lumière (300 000 km/s) est près d\'un million de fois plus rapide que le son dans l\'air (340 m/s).' },
    { texte: 'Un son de 30 000 Hz est audible par l\'être humain.', vrai: false, explication: 'C\'est un ultrason : au-dessus de 20 000 Hz, l\'oreille humaine n\'entend plus.' },
    { texte: 'Les étoiles que l\'on voit la nuit sont des sources primaires de lumière.', vrai: true, explication: 'Comme le Soleil, elles produisent leur propre lumière.' }
  ],
  classements: [{
    question: 'Source primaire de lumière ou objet diffusant ?',
    groupes: [
      { nom: 'Source primaire', items: ['Le Soleil', 'Une lampe allumée', 'La flamme d\'une bougie', 'Un écran de téléphone allumé', 'Une étoile'], explication: 'Elle produit sa propre lumière.' },
      { nom: 'Objet diffusant', items: ['La Lune', 'Une feuille de papier', 'Un cheval dans un pré', 'Un mur blanc', 'La planète Mars'], explication: 'Il renvoie la lumière qu\'il reçoit.' }
    ]
  }],
  calculs: { orage: calcOrage, echo: calcEcho, lumiere: calcLumiere, frequence: calcFrequence, periode: calcPeriode },
  modeles: {
    1: [['calc:orage', 4], ['calc:frequence', 3], ['classement', 2], ['qcm', 3], ['vf', 1], ['vocMot', 1]],
    2: [['calc:orage', 2], ['calc:echo', 3], ['calc:frequence', 2], ['calc:lumiere', 2], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:echo', 3], ['calc:lumiere', 3], ['calc:periode', 3], ['qcm', 3]]
  },
  controler(exo) {
    if (exo.cle.startsWith('freq:')) {
      const f = exo.donnees.f;
      const attendu = f < 20 ? 'Un infrason' : f > 20000 ? 'Un ultrason' : 'Un son audible';
      return attendu === exo.reponse ? null : 'domaine de fréquence incohérent';
    }
    return null;
  }
};

export default fabriquer(banque);
