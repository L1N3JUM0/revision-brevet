// Physique-Chimie — L'énergie : formes et conversions, sources, E = P × t, coût, énergie cinétique.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';

// Appareils : puissance réaliste (W) et durées d'utilisation plausibles
const APPAREILS = [
  { nom: 'une bouilloire', P: 2000, min: [2, 3, 4, 5], h: [] },
  { nom: 'un sèche-cheveux', P: 1500, min: [4, 5, 6, 8, 10], h: [] },
  { nom: 'un four électrique', P: 2500, min: [], h: [0.5, 1, 1.5, 2] },
  { nom: 'un radiateur électrique', P: 1500, min: [], h: [2, 3, 4, 5, 6, 8] },
  { nom: 'une console de jeux', P: 200, min: [], h: [1, 2, 3, 4], themes: ['jeux-video'] },
  { nom: 'une télévision', P: 100, min: [], h: [2, 3, 4, 5] },
  { nom: 'un ordinateur portable', P: 60, min: [], h: [2, 3, 4, 5, 6] },
  { nom: 'une enceinte pour écouter JUL', P: 50, min: [], h: [2, 3, 4, 6], themes: ['rap'] },
  { nom: 'une lampe LED', P: 10, min: [], h: [3, 4, 5, 6, 8, 10] },
  { nom: 'un lave-linge', P: 2000, min: [], h: [1, 1.5, 2] },
  { nom: 'un fer à lisser', P: 50, min: [10, 15, 20], h: [], themes: ['mode'] }
];

function tirerAppareil(rng, ctx, filtre) {
  const tous = APPAREILS.filter(filtre);
  const adaptes = tous.filter(a => (a.themes || []).includes(ctx.theme));
  return rng.choix(adaptes.length && rng.bool(0.6) ? adaptes : tous);
}

// E = P × t en kWh (ou Wh), avec éventuellement le coût
function calcEnergieKwh(rng, ctx, niveau) {
  const a = tirerAppareil(rng, ctx, x => x.h.length);
  const t = rng.choix(a.h);
  const Wh = net(a.P * t);
  const kWh = net(Wh / 1000);
  if (niveau === 1) {
    const err = erreursNombre(Wh);
    err.ajouter(kWh, 'On demande des <strong>Wh</strong> : pas besoin de diviser par 1 000.');
    err.ajouter(net(a.P / t), 'L\'énergie, c\'est la puissance <strong>multipliée</strong> par la durée.');
    return {
      cle: `wh:${a.nom}:${t}`,
      enonce: `<p>${ctx.prenom} utilise ${a.nom} de ${fmt(a.P)} W pendant ${fmt(t)} h.</p><p><strong>Quelle énergie consomme-t-${a.nom.startsWith('une') ? 'elle' : 'il'}, en wattheures (Wh) ?</strong></p>`,
      type: 'nombre',
      unite: 'Wh',
      reponse: Wh,
      etapes: ['Formule : <strong>E = P × t</strong> (P en W, t en h → E en Wh).', `E = ${fmt(a.P)} × ${fmt(t)} = ${gras(fmt(Wh))} Wh`],
      erreurs: err.liste(),
      expression: `${fmt(a.P)} × ${fmt(t)}`
    };
  }
  const prix = rng.choix([0.2, 0.25]);
  const jours = niveau === 3 ? rng.choix([7, 10, 30]) : 1;
  if (niveau === 3 || rng.bool(0.4)) {
    const kWhTotal = net(kWh * jours);
    const cout = Math.round(kWhTotal * prix * 100) / 100;
    const err = erreursNombre(cout, 0.01);
    err.ajouter(Math.round(Wh * jours * prix * 100) / 100, 'Le prix est donné par <strong>kWh</strong> : convertis d\'abord les Wh en kWh (÷ 1 000).');
    if (jours > 1) err.ajouter(Math.round(kWh * prix * 100) / 100, `Ça, c'est pour un seul jour. Multiplie par ${jours}.`);
    const etapes = [
      `Énergie par jour : E = ${fmt(a.P)} W × ${fmt(t)} h = ${fmt(Wh)} Wh = ${fmt(kWh)} kWh.`,
      ...(jours > 1 ? [`Sur ${jours} jours : ${fmt(kWh)} × ${jours} = ${fmt(kWhTotal)} kWh.`] : []),
      `Coût : ${fmt(kWhTotal)} × ${fmt(prix)} = ${gras(fmt(cout))} €`
    ];
    return {
      cle: `cout:${a.nom}:${t}:${jours}:${prix}`,
      enonce: `<p>${ctx.prenom} utilise ${a.nom} de ${fmt(a.P)} W pendant ${fmt(t)} h${jours > 1 ? ` par jour, pendant ${jours} jours` : ''}.</p>
        <p>Le kWh coûte ${fmt(prix)} €.</p><p><strong>Combien cela coûte-t-il, en euros ?</strong> (arrondis au centime)</p>`,
      type: 'nombre',
      unite: '€',
      tolerance: 0.01,
      reponse: cout,
      etapes,
      erreurs: err.liste(),
      expression: `${fmt(kWhTotal)} × ${fmt(prix)}`
    };
  }
  const err = erreursNombre(kWh);
  err.ajouter(Wh, `${fmt(Wh)}, ce sont des <strong>Wh</strong>. 1 kWh = 1 000 Wh : divise par 1 000.`);
  return {
    cle: `kwh:${a.nom}:${t}`,
    enonce: `<p>${a.nom[0].toUpperCase() + a.nom.slice(1)} de ${fmt(a.P)} W fonctionne pendant ${fmt(t)} h.</p><p><strong>Quelle énergie consomme-t-${a.nom.startsWith('une') ? 'elle' : 'il'}, en kWh ?</strong></p>`,
    type: 'nombre',
    unite: 'kWh',
    reponse: kWh,
    etapes: [
      `E = P × t = ${fmt(a.P)} × ${fmt(t)} = ${fmt(Wh)} Wh.`,
      `1 kWh = 1 000 Wh : ${fmt(Wh)} ÷ 1000 = ${gras(fmt(kWh))} kWh`
    ],
    erreurs: err.liste(),
    expression: `${fmt(Wh)} ÷ 1000`
  };
}

// E = P × t en joules (t en secondes)
function calcEnergieJoules(rng, ctx) {
  const a = tirerAppareil(rng, ctx, x => x.min.length);
  const tmin = rng.choix(a.min);
  const ts = tmin * 60;
  const E = a.P * ts;
  const err = erreursNombre(E);
  err.ajouter(a.P * tmin, `En joules, la durée doit être en <strong>secondes</strong> : ${tmin} min = ${ts} s.`);
  return {
    cle: `joules:${a.nom}:${tmin}`,
    enonce: `<p>${ctx.prenom} utilise ${a.nom} de ${fmt(a.P)} W pendant ${tmin} min.</p><p><strong>Quelle énergie est consommée, en joules (J) ?</strong></p>`,
    type: 'nombre',
    unite: 'J',
    reponse: E,
    etapes: [
      'Formule : <strong>E = P × t</strong> (P en W, t en s → E en J).',
      `t = ${tmin} min = ${tmin} × 60 = ${ts} s.`,
      `E = ${fmt(a.P)} × ${ts} = ${gras(fmt(E))} J`
    ],
    erreurs: err.liste(),
    expression: `${fmt(a.P)} × ${ts}`
  };
}

// Énergie cinétique Ec = ½ × m × v²
const MOBILES = [
  { nom: 'Un ballon de handball', m: [0.45], v: [10, 15, 20, 25], themes: ['handball', 'sport'] },
  { nom: 'Un cheval au galop', m: [400, 450, 500, 550, 600], v: [10, 12, 14, 15], themes: ['chevaux', 'animaux'] },
  { nom: 'Une voiture', m: [800, 1000, 1200, 1500], v: [10, 15, 20, 25, 30], themes: ['famille', 'voyages', 'commerce', 'mode'] },
  { nom: 'Un scooter avec son conducteur', m: [150, 180, 200], v: [10, 12, 14], themes: ['rap', 'famille'] },
  { nom: 'Une joueuse qui sprinte', m: [50, 55, 60, 65], v: [5, 6, 7, 8], themes: ['handball', 'sport'] }
];
function calcCinetique(rng, ctx, niveau) {
  const adaptes = MOBILES.filter(x => x.themes.includes(ctx.theme));
  const mob = rng.choix(adaptes.length ? adaptes : MOBILES);
  const m = rng.choix(mob.m);
  const v = rng.choix(mob.v);
  const kmh = net(v * 3.6);
  const enKmh = niveau === 3 && rng.bool(0.6);
  const Ec = net(0.5 * m * v * v);
  const err = erreursNombre(Ec);
  err.ajouter(net(0.5 * m * v), 'N\'oublie pas le <strong>carré</strong> : v² = v × v.');
  err.ajouter(net(m * v * v), 'N\'oublie pas le <strong>½</strong> : Ec = 0,5 × m × v².');
  if (enKmh) err.ajouter(net(0.5 * m * kmh * kmh), `La vitesse doit être en <strong>m/s</strong> : ${fmt(kmh)} km/h = ${fmt(kmh)} ÷ 3,6 = ${fmt(v)} m/s.`);
  return {
    cle: `ec:${mob.nom}:${m}:${v}:${enKmh}`,
    enonce: `<p>${mob.nom} (masse ${fmt(m)} kg) se déplace à ${enKmh ? `${fmt(kmh)} km/h` : `${fmt(v)} m/s`}.</p><p><strong>Calcule son énergie cinétique, en joules.</strong></p>`,
    type: 'nombre',
    unite: 'J',
    reponse: Ec,
    etapes: [
      'Formule : <strong>Ec = ½ × m × v²</strong> (m en kg, v en m/s → Ec en J).',
      ...(enKmh ? [`On convertit : ${fmt(kmh)} km/h ÷ 3,6 = ${fmt(v)} m/s.`] : []),
      `Ec = 0,5 × ${fmt(m)} × ${fmt(v)}² = ${gras(fmt(Ec))} J`
    ],
    erreurs: err.liste(),
    expression: `0,5 × ${fmt(m)} × ${fmt(v)}²`
  };
}

// Conversions d'énergie réalisées par un convertisseur
const CONVERTISSEURS = [
  { nom: 'Un panneau solaire photovoltaïque', entree: 'lumineuse', sortie: 'électrique' },
  { nom: 'Une éolienne', entree: 'mécanique (cinétique du vent)', sortie: 'électrique' },
  { nom: 'Un moteur électrique', entree: 'électrique', sortie: 'mécanique' },
  { nom: 'Une lampe', entree: 'électrique', sortie: 'lumineuse' },
  { nom: 'Un radiateur électrique', entree: 'électrique', sortie: 'thermique' },
  { nom: 'Une pile', entree: 'chimique', sortie: 'électrique' },
  { nom: 'Les muscles d\'une cavalière', entree: 'chimique', sortie: 'mécanique' },
  { nom: 'Une batterie de téléphone en charge', entree: 'électrique', sortie: 'chimique' },
  { nom: 'Un alternateur de barrage', entree: 'mécanique', sortie: 'électrique' },
  { nom: 'Un haut-parleur', entree: 'électrique', sortie: 'sonore (mécanique)' }
];
const FORMES = ['Électrique', 'Mécanique', 'Lumineuse', 'Thermique', 'Chimique'];
const premierMot = s => s.split(' ')[0];
function calcConversion(rng) {
  const c = rng.choix(CONVERTISSEURS);
  const sens = rng.choix(['sortie', 'entree']);
  const bonne = premierMot(c[sens]);
  const Bonne = bonne[0].toUpperCase() + bonne.slice(1);
  const autre = premierMot(c[sens === 'sortie' ? 'entree' : 'sortie']);
  const choix = rng.melanger([Bonne, ...rng.melanger(FORMES.filter(f => f.toLowerCase() !== bonne && f.toLowerCase() !== autre)).slice(0, 2), autre[0].toUpperCase() + autre.slice(1)]);
  return {
    cle: `conv:${c.nom}:${sens}`,
    enonce: sens === 'sortie'
      ? `<p>${c.nom} reçoit de l'énergie ${c.entree}.</p><p><strong>En quelle forme d'énergie utile la convertit-${/^(Les|Un|Une) /.test(c.nom) && /^Les /.test(c.nom) ? 'ils' : /^Une /.test(c.nom) ? 'elle' : 'il'} ?</strong></p>`
      : `<p>${c.nom} fournit de l'énergie ${c.sortie}.</p><p><strong>Quelle forme d'énergie reçoit-${/^Les /.test(c.nom) ? 'ils' : /^Une /.test(c.nom) ? 'elle' : 'il'} ?</strong></p>`,
    type: 'qcm',
    choix,
    reponse: Bonne,
    etapes: [
      `Chaîne énergétique : énergie ${c.entree} → [ ${c.nom.toLowerCase()} ] → énergie ${c.sortie}.`,
      'Une partie de l\'énergie est toujours « perdue », le plus souvent sous forme <strong>thermique</strong> (chaleur).'
    ],
    erreurs: [{ test: r => r.toLowerCase() === autre, message: `C'est l'inverse : ${c.nom.toLowerCase()} transforme de l'énergie ${c.entree} en énergie ${c.sortie}.` }]
  };
}

export const banque = {
  id: 'energie',
  titre: 'L\'énergie et ses conversions',
  discipline: 'pc',
  resume: 'Formes et sources d\'énergie, chaînes énergétiques, E = P × t, énergie cinétique.',
  essentiel: [
    'L\'énergie existe sous plusieurs <strong>formes</strong> : électrique, mécanique (cinétique, de position), thermique, lumineuse, chimique, nucléaire.',
    'Elle ne se crée pas et ne disparaît pas : elle se <strong>convertit</strong> d\'une forme en une autre. Une partie est toujours perdue, souvent en chaleur.',
    'Les sources d\'énergie <strong>renouvelables</strong> (soleil, vent, eau, biomasse, géothermie) se renouvellent rapidement ; les sources fossiles (pétrole, charbon, gaz) et l\'uranium, non.',
    'L\'énergie consommée par un appareil : <strong>E = P × t</strong>. En J (P en W, t en s) ou en kWh (P en kW, t en h).',
    'Un objet en mouvement possède une <strong>énergie cinétique</strong> Ec = ½ × m × v². Si la vitesse double, Ec est multipliée par 4 : d\'où le danger de la vitesse sur la route.'
  ],
  formules: [
    { nom: 'Énergie', formule: 'E = P × t', unites: 'W et s → J · W et h → Wh · kW et h → kWh · 1 kWh = 3 600 000 J' },
    { nom: 'Énergie cinétique', formule: 'Ec = ½ × m × v²', unites: 'm en kg, v en m/s → Ec en J' },
    { nom: 'Coût', formule: 'coût = E (en kWh) × prix du kWh' }
  ],
  vocabulaire: [
    { mot: 'Énergie cinétique', definition: 'Énergie que possède un objet du fait de sa vitesse.' },
    { mot: 'Énergie de position', definition: 'Énergie que possède un objet du fait de sa hauteur (altitude).' },
    { mot: 'Convertisseur', definition: 'Objet qui transforme une forme d\'énergie en une autre (moteur, lampe, panneau solaire…).' },
    { mot: 'Chaîne énergétique', definition: 'Schéma qui montre les transferts et conversions d\'énergie dans un système.' },
    { mot: 'Puissance', definition: 'Énergie transférée ou convertie par seconde, en watts (W).' },
    { mot: 'Source renouvelable', definition: 'Source d\'énergie qui se renouvelle assez vite pour être considérée comme inépuisable à notre échelle.' },
    { mot: 'Joule', definition: 'Unité d\'énergie du système international (symbole J).' }
  ],
  questions: [
    { q: 'Quelle est l\'unité de la puissance ?', bonne: 'Le watt (W)', fausses: ['Le joule (J)', 'Le kilowattheure (kWh)', 'Le volt (V)'], niveau: 1 },
    { q: 'Le kilowattheure (kWh) est une unité…', bonne: 'D\'énergie', fausses: ['De puissance', 'De tension', 'De durée'], explication: 'C\'est l\'énergie consommée par un appareil de 1 000 W pendant 1 heure. Le compteur électrique la mesure.', niveau: 2 },
    { q: 'Si la vitesse d\'une voiture double, son énergie cinétique est…', bonne: 'Multipliée par 4', fausses: ['Multipliée par 2', 'Divisée par 2', 'Inchangée'], explication: 'Ec = ½ m v² : la vitesse est au carré. (2v)² = 4 v². La distance de freinage augmente beaucoup.', niveau: 3 },
    { q: 'Que devient l\'énergie cinétique d\'une voiture qui freine ?', bonne: 'Elle est convertie en énergie thermique', fausses: ['Elle disparaît', 'Elle est convertie en énergie lumineuse', 'Elle se transforme en masse'], explication: 'Les freins chauffent : l\'énergie cinétique devient de la chaleur.', niveau: 3 },
    { q: 'Une cavalière saute un obstacle : en haut du saut, quelle énergie du cheval est maximale ?', bonne: 'L\'énergie de position', fausses: ['L\'énergie cinétique', 'L\'énergie électrique', 'L\'énergie lumineuse'], explication: 'Plus l\'objet est haut, plus son énergie de position est grande.', niveau: 2 },
    { q: 'Combien de joules vaut 1 kWh ?', bonne: '3 600 000 J', fausses: ['1 000 J', '3 600 J', '60 000 J'], explication: '1 kWh = 1 000 W × 3 600 s = 3 600 000 J.', niveau: 3 },
    { q: 'Quelle est la source d\'énergie d\'une centrale nucléaire ?', bonne: 'L\'uranium', fausses: ['Le charbon', 'Le vent', 'Le soleil'], explication: 'L\'uranium est extrait de mines : c\'est une ressource non renouvelable.', niveau: 1 },
    { q: 'Pourquoi une ampoule LED est-elle plus économe qu\'une ampoule à incandescence ?', bonne: 'Elle perd moins d\'énergie en chaleur', fausses: ['Elle produit plus de chaleur', 'Elle ne consomme pas d\'électricité', 'Elle est plus grosse'], explication: 'Pour la même lumière, la LED consomme beaucoup moins : moins d\'énergie est perdue sous forme thermique.', niveau: 2 }
  ],
  vraiFaux: [
    { texte: 'L\'énergie peut être créée à partir de rien.', vrai: false, explication: 'L\'énergie se conserve : elle ne fait que se convertir d\'une forme en une autre.' },
    { texte: 'Le pétrole est une source d\'énergie renouvelable.', vrai: false, explication: 'Il a mis des millions d\'années à se former : c\'est une énergie fossile, non renouvelable.' },
    { texte: 'Un objet immobile n\'a pas d\'énergie cinétique.', vrai: true, explication: 'Si v = 0, alors Ec = ½ × m × 0² = 0 J.' },
    { texte: 'Le watt est une unité d\'énergie.', vrai: false, explication: 'Le watt est une unité de <strong>puissance</strong>. L\'énergie s\'exprime en joules (ou en kWh).' }
  ],
  classements: [{
    question: 'Source d\'énergie renouvelable ou non renouvelable ?',
    groupes: [
      { nom: 'Renouvelable', items: ['Le soleil', 'Le vent', 'L\'eau d\'un barrage', 'Le bois (biomasse)', 'La géothermie', 'Les marées'], explication: 'Elle se renouvelle à l\'échelle d\'une vie humaine.' },
      { nom: 'Non renouvelable', items: ['Le pétrole', 'Le charbon', 'Le gaz naturel', 'L\'uranium'], explication: 'Son stock est limité : il faut des millions d\'années pour la reformer (ou elle ne se reforme pas).' }
    ]
  }],
  calculs: { kwh: calcEnergieKwh, joules: calcEnergieJoules, cinetique: calcCinetique, conversion: calcConversion },
  modeles: {
    1: [['calc:kwh', 3], ['calc:conversion', 3], ['classement', 3], ['qcm', 2], ['vf', 1], ['vocMot', 1]],
    2: [['calc:kwh', 3], ['calc:joules', 2], ['calc:cinetique', 2], ['calc:conversion', 2], ['qcm', 2], ['vocDef', 1]],
    3: [['calc:kwh', 3], ['calc:cinetique', 3], ['calc:joules', 1], ['qcm', 3]]
  }
};

export default fabriquer(banque);
