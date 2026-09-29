// Générateur : vitesses (v = d ÷ t, d = v × t, t = d ÷ v), conversions km/h ↔ m/s, problèmes de trajets.
// Les durées sont des nombres entiers de minutes, choisis pour que les heures décimales soient exactes.
import { fmt } from '../../assets/js/core/answer.js';

const gras = s => `<strong>${s}</strong>`;
const pad = n => String(n).padStart(2, '0');
const net = x => Number(x.toFixed(6));
const d1 = x => Math.round(x * 10) / 10;
const d2 = x => Math.round(x * 100) / 100;

function hm(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (h && m) return `${h} h ${m} min`;
  return h ? `${h} h` : `${m} min`;
}
function horaire(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m ? `${h} h ${pad(m)}` : `${h} h`;
}
// Durée en minutes -> heures décimales (exactes pour des multiples de 3 min)
const enHeures = t => net(t / 60);

// Phrase de conversion d'une durée en heures décimales
function phraseDuree(t) {
  if (t % 60 === 0) return null;
  const h = Math.floor(t / 60), m = t % 60;
  return `${hm(t)} = ${h ? `${h} h + ` : ''}${m} ÷ 60 h = ${fmt(enHeures(t))} h (on convertit la durée en heures).`;
}

// Mauvaise lecture d'une durée : 1 h 30 min lu comme 1,30 h
const dureeMalLue = t => net(Math.floor(t / 60) + (t % 60) / 100);

function erreursNombre(reponse) {
  const liste = [];
  return {
    ajouter(v, message, tol = 1e-6) {
      if (!Number.isFinite(v) || Math.abs(v - reponse) < 0.05 || liste.some(e => Math.abs(e.v - v) < 1e-9)) return;
      liste.push({ v, test: x => typeof x === 'number' && Math.abs(x - v) <= Math.max(tol, 0.05), message });
    },
    liste: () => liste.map(({ test, message }) => ({ test, message }))
  };
}

// ---------- Mobiles réalistes ----------

// v : [min, max, pas] en km/h ; t : durées possibles en minutes
const MOBILES = [
  { themes: ['famille', 'voyages', 'commerce', 'mode'], nom: () => 'Une voiture', pronom: () => 'elle', v: [60, 130, 10], t: [30, 45, 60, 90, 120, 150, 180, 72, 84, 96, 105, 135] },
  { themes: ['rap'], nom: () => 'Le bus de la tournée de JUL', pronom: () => 'il', v: [70, 90, 5], t: [60, 90, 120, 150, 180, 210, 240, 84, 132] },
  { themes: ['voyages', 'records', 'espace'], nom: () => 'Un TGV', pronom: () => 'il', v: [240, 320, 10], t: [30, 45, 60, 90, 120, 150, 180, 72, 96] },
  { themes: ['sport', 'handball', 'famille', 'jeux-video'], nom: ctx => `${ctx.prenom}, à vélo,`, pronom: ctx => ctx.il(), v: [12, 24, 1], t: [30, 45, 60, 75, 90, 120, 36, 48, 72] },
  { themes: ['chevaux', 'animaux'], nom: ctx => `${ctx.prenom}, à cheval au trot,`, pronom: ctx => ctx.il(), v: [10, 15, 1], t: [30, 45, 60, 90, 36, 48, 72] },
  { themes: ['grece', 'voyages'], nom: () => 'Le ferry du Pirée', pronom: () => 'il', v: [30, 45, 5], t: [60, 90, 120, 150, 180, 240, 96, 108] },
  { themes: ['cuisine', 'famille', 'animaux'], nom: ctx => `${ctx.prenom}, en randonnée,`, pronom: ctx => ctx.il(), v: [4, 6, 1], t: [30, 60, 90, 120, 150, 180, 45, 75] }
];

function tirerMobile(rng, ctx, filtre = () => true) {
  const tous = MOBILES.filter(filtre);
  const adaptes = tous.filter(m => m.themes.includes(ctx.theme));
  return rng.choix(adaptes.length ? adaptes : tous);
}

function tirerVitesse(rng, m) {
  const [min, max, p] = m.v;
  return min + p * rng.int(0, Math.round((max - min) / p));
}

// Tire v et t (minutes) pour que d = v × t ÷ 60 ait au plus une décimale
function tirerTrajet(rng, m, { heuresEntieres = false } = {}) {
  for (;;) {
    const v = tirerVitesse(rng, m);
    const liste = heuresEntieres ? m.t.filter(t => t % 60 === 0 || t === 30) : m.t;
    const t = rng.choix(liste.length ? liste : m.t);
    const d = net(v * t / 60);
    if (Math.abs(d - d1(d)) < 1e-9) return { v, t, d };
  }
}

// ---------- Calculer une vitesse ----------

function exoVitesse(rng, ctx, niveau) {
  const m = tirerMobile(rng, ctx);
  const { v, t, d } = tirerTrajet(rng, m, { heuresEntieres: niveau === 1 });
  const th = enHeures(t);
  const expression = `${fmt(d)} ÷ ${fmt(th)}`;
  const conv = phraseDuree(t);
  const err = erreursNombre(v);
  err.ajouter(net(th / d), 'Tu as divisé le temps par la distance. La vitesse, c\'est la <strong>distance ÷ le temps</strong>.');
  err.ajouter(net(d * th), 'Pour une vitesse, on <strong>divise</strong> la distance par le temps.');
  if (t % 60) err.ajouter(net(d / dureeMalLue(t)), `${hm(t)} ne fait pas ${fmt(dureeMalLue(t))} h : ${t % 60} min = ${t % 60} ÷ 60 h = ${fmt(net((t % 60) / 60))} h.`);
  return {
    cle: `vitesse:${m.v[0]}:${v}:${t}`,
    enonce: `<p>${m.nom(ctx)} parcourt ${fmt(d)} km en ${hm(t)}.</p><p><strong>Quelle est sa vitesse moyenne, en km/h ?</strong></p>`,
    type: 'nombre',
    unite: 'km/h',
    reponse: v,
    etapes: [
      'Formule : <strong>v = d ÷ t</strong> (distance en km, temps en h, vitesse en km/h).',
      ...(conv ? [conv] : []),
      `v = ${expression} = ${gras(fmt(v))} km/h`
    ],
    erreurs: err.liste(),
    expression,
    donnees: { attendu: d / (t / 60) }
  };
}

// ---------- Calculer une distance ----------

function exoDistance(rng, ctx, niveau) {
  const m = tirerMobile(rng, ctx);
  const { v, t, d } = tirerTrajet(rng, m, { heuresEntieres: niveau === 1 });
  const th = enHeures(t);
  const expression = `${fmt(v)} × ${fmt(th)}`;
  const conv = phraseDuree(t);
  const err = erreursNombre(d);
  err.ajouter(net(v / th), 'Pour une distance, on <strong>multiplie</strong> la vitesse par le temps : d = v × t.');
  if (t % 60) {
    err.ajouter(net(v * dureeMalLue(t)), `${hm(t)} ne fait pas ${fmt(dureeMalLue(t))} h : ${t % 60} min = ${fmt(net((t % 60) / 60))} h.`);
    err.ajouter(net(v * t), 'Le temps doit être en <strong>heures</strong> (la vitesse est en km par heure), pas en minutes.');
  }
  return {
    cle: `distance:${m.v[0]}:${v}:${t}`,
    enonce: `<p>${m.nom(ctx)} avance à ${fmt(v)} km/h de moyenne pendant ${hm(t)}.</p><p><strong>Quelle distance parcourt-${m.pronom(ctx)}, en km ?</strong></p>`,
    type: 'nombre',
    unite: 'km',
    reponse: d,
    etapes: [
      'Formule : <strong>d = v × t</strong> (vitesse en km/h, temps en h, distance en km).',
      ...(conv ? [conv] : []),
      `d = ${expression} = ${gras(fmt(d))} km`
    ],
    erreurs: err.liste(),
    expression,
    donnees: { attendu: v * t / 60 }
  };
}

// ---------- Calculer un temps ----------

function exoTemps(rng, ctx, niveau) {
  const m = tirerMobile(rng, ctx);
  const { v, t, d } = tirerTrajet(rng, m, { heuresEntieres: niveau === 1 });
  const th = enHeures(t);
  const enHeuresSeulement = niveau === 1 && t % 60 === 0;
  const etapes = [
    'Formule : <strong>t = d ÷ v</strong> (distance en km, vitesse en km/h, temps en h).',
    `t = ${fmt(d)} ÷ ${fmt(v)} = ${fmt(th)} h`
  ];
  if (!enHeuresSeulement && t % 60) {
    const h = Math.floor(t / 60), dec = net(th - h);
    etapes.push(`${fmt(dec)} h = ${fmt(dec)} × 60 min = ${t % 60} min, donc t = ${gras(hm(t))}.`);
  } else {
    etapes[1] = `t = ${fmt(d)} ÷ ${fmt(v)} = ${gras(fmt(th))} h`;
  }
  const commun = {
    cle: `temps:${m.v[0]}:${v}:${t}`,
    enonce: `<p>${m.nom(ctx)} doit parcourir ${fmt(d)} km à ${fmt(v)} km/h de moyenne.</p>
      <p><strong>Combien de temps lui faut-il${enHeuresSeulement ? ', en heures' : ''} ?</strong></p>`,
    etapes
  };
  if (enHeuresSeulement) {
    const err = erreursNombre(th);
    err.ajouter(net(v / d), 'Le temps, c\'est la <strong>distance ÷ la vitesse</strong>, pas l\'inverse.');
    err.ajouter(net(d * v), 'Pour un temps, on <strong>divise</strong> la distance par la vitesse.');
    return { ...commun, type: 'nombre', unite: 'h', reponse: th, erreurs: err.liste(), expression: `${fmt(d)} ÷ ${fmt(v)}`, donnees: { attendu: d / v } };
  }
  const faux = [];
  if (t % 60) {
    const lu = Math.floor(th) * 60 + Math.round((th - Math.floor(th)) * 100); // 2,5 h lu comme 2 h 50 min
    if (lu !== t) faux.push({ test: s => typeof s === 'number' && Math.abs(s - lu * 60) < 0.5, message: `${fmt(th)} h ne fait pas ${hm(lu)} : la partie décimale se multiplie par 60.` });
  }
  return { ...commun, type: 'duree', uniteDuree: 'min', reponse: t * 60, erreurs: faux, donnees: { attendu: d / v * 3600 } };
}

// ---------- Conversions km/h ↔ m/s ----------

function exoConversion(rng) {
  if (rng.bool()) {
    const ms = rng.int(3, 40);
    const kmh = net(ms * 3.6);
    const err = erreursNombre(ms);
    err.ajouter(net(kmh * 3.6), 'Mauvais sens : pour passer de km/h à m/s, on <strong>divise</strong> par 3,6.');
    err.ajouter(net(kmh * 1000 / 60), '1 h = 3 600 s (et pas 60) : on divise par 3,6.');
    return {
      cle: `kmh-ms:${kmh}`,
      enonce: `<p>Convertis en mètres par seconde :</p><p class="calcul">${fmt(kmh)} km/h = … m/s</p>`,
      type: 'nombre',
      unite: 'm/s',
      reponse: ms,
      etapes: [
        `${fmt(kmh)} km/h = ${fmt(kmh)} km en 1 h = ${fmt(kmh * 1000)} m en 3 600 s.`,
        'Multiplier par 1 000 puis diviser par 3 600, cela revient à <strong>diviser par 3,6</strong>.',
        `${fmt(kmh)} ÷ 3,6 = ${gras(fmt(ms))} m/s`
      ],
      erreurs: err.liste(),
      expression: `${fmt(kmh)} ÷ 3,6`,
      donnees: { attendu: kmh * 1000 / 3600 }
    };
  }
  const ms = rng.bool(0.7) ? rng.int(2, 35) : d1(rng.int(20, 300) / 10);
  const kmh = net(ms * 3.6);
  const err = erreursNombre(kmh);
  err.ajouter(net(ms / 3.6), 'Mauvais sens : pour passer de m/s à km/h, on <strong>multiplie</strong> par 3,6.');
  err.ajouter(net(ms * 60 / 1000), 'En 1 h il y a 3 600 s : on multiplie par 3 600 puis on divise par 1 000, soit × 3,6.');
  return {
    cle: `ms-kmh:${ms}`,
    enonce: `<p>Convertis en kilomètres par heure :</p><p class="calcul">${fmt(ms)} m/s = … km/h</p>`,
    type: 'nombre',
    unite: 'km/h',
    reponse: kmh,
    etapes: [
      `${fmt(ms)} m/s = ${fmt(ms)} m en 1 s, donc ${fmt(net(ms * 3600))} m en 1 h (3 600 s), soit ${fmt(kmh)} km.`,
      'Retiens : m/s → km/h, on <strong>multiplie par 3,6</strong>.',
      `${fmt(ms)} × 3,6 = ${gras(fmt(kmh))} km/h`
    ],
    erreurs: err.liste(),
    expression: `${fmt(ms)} × 3,6`,
    donnees: { attendu: ms * 3600 / 1000 }
  };
}

// ---------- Problèmes (niveau 3) ----------

const VILLES = [['Lyon', 315], ['Montpellier', 170], ['Nice', 200], ['Toulouse', 405], ['Bordeaux', 645]];

// Vitesse moyenne à partir des horaires (distances routières approximatives depuis Marseille)
function exoHoraires(rng) {
  for (;;) {
    const [ville, d] = rng.choix(VILLES);
    const t = 15 * rng.int(8, 32);
    const v = d * 60 / t;
    if (!Number.isInteger(v) || v < 65 || v > 110) continue;
    const depart = 5 * rng.int(7 * 12, 11 * 12);
    const arrivee = depart + t;
    const th = enHeures(t);
    const err = erreursNombre(v);
    err.ajouter(net(d / dureeMalLue(t)), `${hm(t)} ne fait pas ${fmt(dureeMalLue(t))} h : ${t % 60} min = ${fmt(net((t % 60) / 60))} h.`);
    err.ajouter(net(d / t), 'Le temps doit être en <strong>heures</strong> pour obtenir des km/h.');
    return {
      cle: `horaires:${ville}:${t}:${depart}`,
      enonce: `<p>Le bus de la tournée de JUL part de Marseille à ${horaire(depart)} et arrive à ${ville} à ${horaire(arrivee)}. Le trajet fait ${d} km.</p>
        <p><strong>Quelle est sa vitesse moyenne, en km/h ?</strong></p>`,
      type: 'nombre',
      unite: 'km/h',
      reponse: v,
      etapes: [
        `Durée du trajet : de ${horaire(depart)} à ${horaire(arrivee)}, soit ${hm(t)}.`,
        ...(phraseDuree(t) ? [phraseDuree(t)] : []),
        `v = d ÷ t = ${fmt(d)} ÷ ${fmt(th)} = ${gras(fmt(v))} km/h`
      ],
      erreurs: err.liste(),
      expression: `${fmt(d)} ÷ ${fmt(th)}`,
      donnees: { attendu: d / ((arrivee - depart) / 60) }
    };
  }
}

// Heure d'arrivée
function exoArrivee(rng, ctx) {
  const m = tirerMobile(rng, ctx, x => x.v[0] >= 30);
  const { v, t, d } = tirerTrajet(rng, m);
  const depart = 5 * rng.int(7 * 12, 14 * 12);
  const th = enHeures(t);
  const etapes = [
    `Durée : t = d ÷ v = ${fmt(d)} ÷ ${fmt(v)} = ${fmt(th)} h${t % 60 ? `, soit ${hm(t)} (${fmt(net(th - Math.floor(th)))} × 60 = ${t % 60} min)` : ''}.`,
    `Arrivée : ${horaire(depart)} + ${hm(t)} = ${gras(horaire(depart + t))}.`
  ];
  const faux = [];
  if (t % 60) {
    const lu = Math.floor(th) * 60 + Math.round((th - Math.floor(th)) * 100);
    if (lu !== t && lu < 24 * 60) faux.push({ test: s => typeof s === 'number' && Math.abs(s - (depart + lu) * 60) < 0.5, message: `${fmt(th)} h ne fait pas ${hm(lu)} : on multiplie la partie décimale par 60.` });
  }
  return {
    cle: `arrivee:${m.v[0]}:${v}:${t}:${depart}`,
    enonce: `<p>${m.nom(ctx)} part à ${horaire(depart)} pour un trajet de ${fmt(d)} km, à ${fmt(v)} km/h de moyenne.</p>
      <p><strong>À quelle heure arrive-t-${m.pronom(ctx)} ?</strong></p>`,
    type: 'duree',
    uniteDuree: 'min',
    reponse: (depart + t) * 60,
    etapes,
    erreurs: faux,
    donnees: { attendu: depart * 60 + d / v * 3600 }
  };
}

// Tir au handball : km/h -> m/s, puis temps en secondes
function exoTir(rng, ctx) {
  const kmh = rng.choix([72, 81, 90, 99, 108]);
  const ms = net(kmh / 3.6);
  const dist = rng.int(6, 12);
  const exact = dist / ms;
  const r = d2(exact);
  const tolerance = Math.abs(exact - r) < 1e-9 ? 0 : 0.005;
  const err = erreursNombre(r);
  err.ajouter(d2(dist / kmh), 'Convertis d\'abord la vitesse en <strong>m/s</strong> (÷ 3,6), puisque la distance est en mètres.', 0.005);
  err.ajouter(d2(ms / dist), 'Le temps, c\'est la <strong>distance ÷ la vitesse</strong>.', 0.005);
  return {
    cle: `tir:${kmh}:${dist}`,
    enonce: `<p>Au handball, ${ctx.prenom} tire à ${dist} m du but. Le ballon part à ${kmh} km/h.</p>
      <p><strong>Combien de temps met-il pour arriver au but, en secondes ?</strong></p>
      <p class="doux petit">Arrondis au centième si besoin.</p>`,
    type: 'nombre',
    unite: 's',
    reponse: r,
    tolerance,
    etapes: [
      `La distance est en mètres : on convertit la vitesse en m/s. ${kmh} ÷ 3,6 = ${fmt(ms)} m/s.`,
      `t = d ÷ v = ${dist} ÷ ${fmt(ms)} ${tolerance ? '≈' : '='} ${gras(fmt(r))} s`,
      'Moins d\'une demi-seconde : c\'est pour ça que les gardiennes doivent anticiper !'
    ],
    erreurs: err.liste(),
    expression: `${dist} ÷ ${fmt(ms)}`,
    donnees: { attendu: dist / (kmh / 3.6) }
  };
}

// Sprint : vitesse moyenne en km/h
function exoSprint(rng, ctx) {
  const t = d1(rng.int(110, 170) / 10);
  const ms = 100 / t;
  const exact = ms * 3.6;
  const r = d1(exact);
  const estExact = Math.abs(exact - r) < 1e-9;
  const err = erreursNombre(r);
  err.ajouter(d1(ms), 'Ça, c\'est la vitesse en <strong>m/s</strong>. Pour l\'avoir en km/h, on multiplie par 3,6.');
  err.ajouter(d1(ms / 3.6), 'De m/s à km/h, on <strong>multiplie</strong> par 3,6.');
  return {
    cle: `sprint:${t}`,
    enonce: `<p>Au collège, ${ctx.prenom} court le 100 m en ${fmt(t)} s.</p>
      <p><strong>Quelle est sa vitesse moyenne, en km/h ?</strong></p>
      <p class="doux petit">Arrondis au dixième.</p>`,
    type: 'nombre',
    unite: 'km/h',
    reponse: r,
    tolerance: estExact ? 0 : 0.05,
    etapes: [
      `En m/s : v = 100 ÷ ${fmt(t)} ${Math.abs(ms - d2(ms)) < 1e-9 ? '=' : '≈'} ${fmt(d2(ms))} m/s.`,
      `En km/h : on multiplie par 3,6. 100 ÷ ${fmt(t)} × 3,6 ${estExact ? '=' : '≈'} ${gras(fmt(r))} km/h`
    ],
    erreurs: err.liste(),
    expression: `100 ÷ ${fmt(t)} × 3,6`,
    donnees: { attendu: 100 / t * 3.6 }
  };
}

// ---------- Export ----------

export default {
  id: 'vitesses',
  titre: 'Vitesses',
  resume: 'Vitesse, distance, temps, et conversions km/h ↔ m/s.',
  niveaux: 3,
  nomsNiveaux: ['v = d ÷ t', 'Heures et minutes, m/s', 'Problèmes'],
  cours: [
    {
      titre: 'La formule',
      contenu: `<p class="calcul">v = d ÷ t</p>
        <p>À partir de cette formule :</p>
        <ul><li><strong>d = v × t</strong> (distance)</li><li><strong>t = d ÷ v</strong> (temps)</li></ul>
        <p>Les unités doivent aller ensemble : km, h et km/h, ou m, s et m/s.</p>`
    },
    {
      titre: 'Le temps en heures',
      contenu: `<p>Avant de calculer, on convertit le temps en <strong>heures décimales</strong> :</p>
        <p class="calcul">1 h 30 min = 1,5 h</p>
        <p class="piege">❌ 1 h 30 min ≠ 1,30 h</p>
        <p>Exemple : 135 km en 1 h 30 min → v = 135 ÷ 1,5 = <strong>90 km/h</strong>.</p>`
    },
    {
      titre: 'km/h ↔ m/s',
      contenu: `<p>1 h = 3 600 s et 1 km = 1 000 m, donc :</p>
        <p class="calcul">km/h → m/s : ÷ 3,6<br>m/s → km/h : × 3,6</p>
        <p>Exemple : 90 km/h = 90 ÷ 3,6 = <strong>25 m/s</strong> (un tir de hand !).</p>`
    }
  ],
  generer(niveau, rng, ctx) {
    if (niveau === 1) {
      const t = rng.pondere([['v', 4], ['d', 3], ['t', 3]]);
      return t === 'v' ? exoVitesse(rng, ctx, 1) : t === 'd' ? exoDistance(rng, ctx, 1) : exoTemps(rng, ctx, 1);
    }
    if (niveau === 2) {
      const t = rng.pondere([['v', 3], ['d', 3], ['t', 2], ['conv', 3]]);
      if (t === 'v') return exoVitesse(rng, ctx, 2);
      if (t === 'd') return exoDistance(rng, ctx, 2);
      if (t === 't') return exoTemps(rng, ctx, 2);
      return exoConversion(rng);
    }
    const t = rng.pondere([['horaires', 3], ['arrivee', 3], ['tir', ctx.theme === 'handball' ? 4 : 2], ['sprint', 2]]);
    if (t === 'horaires') return exoHoraires(rng);
    if (t === 'arrivee') return exoArrivee(rng, ctx);
    if (t === 'tir') return exoTir(rng, ctx);
    return exoSprint(rng, ctx);
  },

  // Contrôle indépendant : formule recalculée sans arrondi intermédiaire
  controler(exo) {
    const a = exo.donnees.attendu;
    const tol = exo.type === 'duree' ? 0.5 : (exo.tolerance || 0) + 1e-6;
    return Math.abs(a - exo.reponse) <= tol ? null : `attendu ${a}, obtenu ${exo.reponse}`;
  }
};
