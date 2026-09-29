// Générateur : conversions de durées (h, min, s), heures décimales, calculs d'horaires.
// Toutes les durées sont manipulées en minutes entières (ou en secondes) : calculs exacts.
// Les réponses de type 'duree' sont en secondes (voir answer.js, lireDuree).
import { fmt, fmtDuree } from '../../assets/js/core/answer.js';

const gras = s => `<strong>${s}</strong>`;
const pad = n => String(n).padStart(2, '0');

// 135 -> « 2 h 15 min » ; 120 -> « 2 h » ; 45 -> « 45 min »
function hm(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (h && m) return `${h} h ${m} min`;
  return h ? `${h} h` : `${m} min`;
}
// Horaire : 875 -> « 14 h 35 », 900 -> « 15 h », 845 -> « 14 h 05 »
function horaire(minutes) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m ? `${h} h ${pad(m)}` : `${h} h`;
}
// Une durée de type 'duree' attend des secondes
const sec = minutes => minutes * 60;

function erreurDuree(liste, minutesFausses, bonnes, message) {
  if (!Number.isFinite(minutesFausses) || minutesFausses === bonnes || liste.some(e => e.m === minutesFausses)) return;
  liste.push({ m: minutesFausses, test: v => typeof v === 'number' && Math.abs(v - sec(minutesFausses)) < 0.5, message });
}
const nettoyer = liste => liste.map(({ test, message }) => ({ test, message }));

// ---------- Niveau 1 ----------

// Heures (et minutes) -> minutes
function heuresEnMinutes(rng) {
  const h = rng.int(1, 9);
  const m = rng.bool(0.6) ? rng.int(1, 59) : 0;
  const r = h * 60 + m;
  const expression = m ? `${h} × 60 + ${m}` : `${h} × 60`;
  return {
    cle: `h-en-min:${h}:${m}`,
    enonce: `<p>Convertis en minutes :</p><p class="calcul">${hm(r)} = … min</p>`,
    type: 'nombre',
    unite: 'min',
    reponse: r,
    etapes: [
      '1 h = <strong>60 min</strong>.',
      m ? `${h} h = ${h} × 60 = ${h * 60} min, puis on ajoute les ${m} min.` : `${h} h = ${h} × 60 min.`,
      `${expression} = ${gras(fmt(r))} min`
    ],
    erreurs: [
      ...(h * 100 + m !== r ? [{ test: v => v === h * 100 + m, message: '1 h = 60 min, pas 100 min.' }] : []),
      ...(m && h * 60 !== r ? [{ test: v => v === h * 60, message: `N'oublie pas d'ajouter les ${m} min.` }] : [])
    ],
    expression,
    donnees: { attendu: h * 60 + m }
  };
}

// Minutes -> h et min
function minutesEnHeures(rng) {
  let r;
  do { r = rng.int(65, 480); } while (r % 60 === 0);
  const h = Math.floor(r / 60), m = r % 60;
  const erreurs = [];
  erreurDuree(erreurs, Math.floor(r / 100) * 60 + (r % 100), r, '1 h = <strong>60 min</strong>, pas 100 min : on fait des paquets de 60.');
  return {
    cle: `min-en-h:${r}`,
    enonce: `<p>Convertis en heures et minutes :</p><p class="calcul">${r} min = … h … min</p>`,
    type: 'duree',
    uniteDuree: 'min',
    reponse: sec(r),
    etapes: [
      `Dans ${r} min, combien de paquets de 60 min (1 h) ? ${r} = ${h} × 60 + ${m}.`,
      `${h} × 60 = ${h * 60} min = ${h} h, et il reste ${r} − ${h * 60} = ${m} min.`,
      `${r} min = ${gras(hm(r))}`
    ],
    erreurs: nettoyer(erreurs),
    donnees: { attendu: sec(r) }
  };
}

// Minutes et secondes
function minutesSecondes(rng) {
  if (rng.bool()) {
    const m = rng.int(2, 12), s = rng.int(1, 59);
    const r = m * 60 + s;
    return {
      cle: `min-en-s:${m}:${s}`,
      enonce: `<p>Convertis en secondes :</p><p class="calcul">${m} min ${s} s = … s</p>`,
      type: 'nombre',
      unite: 's',
      reponse: r,
      etapes: ['1 min = <strong>60 s</strong>.', `${m} min = ${m} × 60 = ${m * 60} s.`, `${m} × 60 + ${s} = ${gras(fmt(r))} s`],
      erreurs: m * 100 + s !== r ? [{ test: v => v === m * 100 + s, message: '1 min = 60 s, pas 100 s.' }] : [],
      expression: `${m} × 60 + ${s}`,
      donnees: { attendu: r }
    };
  }
  let r;
  do { r = rng.int(70, 600); } while (r % 60 === 0);
  const m = Math.floor(r / 60), s = r % 60;
  return {
    cle: `s-en-min:${r}`,
    enonce: `<p>Convertis en minutes et secondes :</p><p class="calcul">${r} s = … min … s</p>`,
    type: 'duree',
    uniteDuree: 's',
    reponse: r,
    etapes: [
      `${r} = ${m} × 60 + ${s}.`,
      `${m} × 60 s = ${m} min, et il reste ${s} s.`,
      `${r} s = ${gras(`${m} min ${s} s`)}`
    ],
    erreurs: Math.floor(r / 100) * 60 + (r % 100) !== r
      ? [{ test: v => typeof v === 'number' && Math.abs(v - (Math.floor(r / 100) * 60 + (r % 100))) < 0.5, message: '1 min = 60 s, pas 100 s.' }]
      : [],
    donnees: { attendu: r }
  };
}

// ---------- Niveau 2 ----------

// Heures décimales -> h et min (1,75 h = 1 h 45 min)
function decimalEnHeures(rng) {
  const h = rng.int(0, 8);
  const centiemes = rng.choix([10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 15, 35, 45, 55, 65, 85, 95]);
  const d = Number((h + centiemes / 100).toFixed(2));
  const m = centiemes * 60 / 100; // entier : centièmes multiples de 5
  const r = h * 60 + m;
  const partie = Number((centiemes / 100).toFixed(2));
  const erreurs = [];
  erreurDuree(erreurs, h * 60 + centiemes, r, `${fmt(partie)} h ne fait pas ${centiemes} min : une heure a 60 minutes, donc ${fmt(partie)} h = ${fmt(partie)} × 60 = ${m} min.`);
  if (centiemes % 10 === 0) erreurDuree(erreurs, h * 60 + centiemes / 10, r, `${fmt(partie)} h ne fait pas ${centiemes / 10} min : ${fmt(partie)} × 60 = ${m} min.`);
  return {
    cle: `dec-en-h:${d}`,
    enonce: `<p>Convertis en heures et minutes :</p><p class="calcul">${fmt(d)} h = … h … min</p>`,
    type: 'duree',
    uniteDuree: 'min',
    reponse: sec(r),
    etapes: [
      h ? `${fmt(d)} h = ${h} h + ${fmt(partie)} h.` : `${fmt(d)} h, c'est moins d'une heure.`,
      `${fmt(partie)} h = ${fmt(partie)} × 60 min = ${m} min.`,
      `${fmt(d)} h = ${gras(hm(r))}`,
      `<span class="piege">Piège : ${fmt(d)} h ≠ ${h} h ${centiemes} min !</span>`
    ],
    erreurs: nettoyer(erreurs),
    donnees: { attendu: Math.round(d * 3600) }
  };
}

// h et min -> heures décimales (2 h 36 min = 2,6 h)
function heuresEnDecimal(rng) {
  const h = rng.int(0, 8);
  const m = rng.choix([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54, 3, 9, 21, 27, 33, 39, 51, 57]);
  const partie = Number((m / 60).toFixed(4));
  const r = Number((h + partie).toFixed(4));
  const expression = h ? `${h} + ${m} ÷ 60` : `${m} ÷ 60`;
  return {
    cle: `h-en-dec:${h}:${m}`,
    enonce: `<p>Convertis en heures (nombre décimal) :</p><p class="calcul">${hm(h * 60 + m)} = … h</p>`,
    type: 'nombre',
    unite: 'h',
    reponse: r,
    etapes: [
      `${m} min = ${m} ÷ 60 h = ${fmt(partie)} h (une minute, c'est un soixantième d'heure).`,
      `${expression} = ${gras(fmt(r))} h`,
      `<span class="piege">Piège : ${hm(h * 60 + m)} ≠ ${h},${pad(m)} h !</span>`
    ],
    erreurs: [
      ...(Number((h + m / 100).toFixed(2)) !== r
        ? [{ test: v => Math.abs(v - (h + m / 100)) < 1e-9, message: `${m} min, ce n'est pas 0,${pad(m)} h : ${m} ÷ 60 = ${fmt(partie)} h.` }]
        : [])
    ],
    expression,
    donnees: { attendu: h + m / 60 }
  };
}

// Durée entre deux horaires, méthode « on complète jusqu'à l'heure pleine »
function etapesEcart(debut, fin) {
  const hPleine = Math.ceil(debut / 60) * 60;
  const etapes = [];
  if (hPleine > debut && hPleine <= fin) {
    const avant = hPleine - debut;
    const heures = Math.floor((fin - hPleine) / 60);
    const apres = fin - hPleine - heures * 60;
    etapes.push('On avance par étapes, en passant par les heures pleines :');
    const morceaux = [`${horaire(debut)} → ${horaire(hPleine)} : ${avant} min`];
    if (heures) morceaux.push(`${horaire(hPleine)} → ${horaire(hPleine + heures * 60)} : ${heures} h`);
    if (apres) morceaux.push(`${horaire(hPleine + heures * 60)} → ${horaire(fin)} : ${apres} min`);
    etapes.push(morceaux.join('<br>'));
    const minutes = avant + apres;
    if (minutes >= 60) etapes.push(`${avant} min + ${apres} min = ${minutes} min = ${hm(minutes)}.`);
  } else {
    etapes.push(`${horaire(fin)} − ${horaire(debut)} : on soustrait les heures et les minutes.`);
  }
  etapes.push(`Durée : ${gras(hm(fin - debut))}`);
  return etapes;
}

function ecartHoraires(rng) {
  const debut = rng.int(7 * 12, 18 * 12) * 5;           // multiple de 5 min
  const fin = debut + rng.int(8, 60) * 5;
  const r = fin - debut;
  const erreurs = [];
  const [h1, m1, h2, m2] = [Math.floor(debut / 60), debut % 60, Math.floor(fin / 60), fin % 60];
  if (m2 < m1) {
    erreurDuree(erreurs, (h2 - h1) * 60 + (m1 - m2), r, `Attention : on ne peut pas faire ${m2} − ${m1}. Passe par l'heure pleine (${horaire(Math.ceil(debut / 60) * 60)}).`);
    erreurDuree(erreurs, (h2 - h1) * 60 + (m2 + 60 - m1), r, 'Tu as oublié la retenue : en empruntant 60 min, il faut enlever 1 h.');
  }
  return {
    cle: `ecart:${debut}:${fin}`,
    enonce: `<p>Un trajet commence à <strong>${horaire(debut)}</strong> et se termine à <strong>${horaire(fin)}</strong>.</p><p><strong>Combien de temps dure-t-il ?</strong></p>`,
    type: 'duree',
    uniteDuree: 'min',
    reponse: sec(r),
    etapes: etapesEcart(debut, fin),
    erreurs: nettoyer(erreurs),
    donnees: { attendu: sec(fin - debut) }
  };
}

// ---------- Niveau 3 : problèmes ----------

// Horaire + durée, avec retenue sur les minutes
function etapesAjout(debut, duree) {
  const fin = debut + duree;
  const [h, m] = [Math.floor(debut / 60), debut % 60];
  const [dh, dm] = [Math.floor(duree / 60), duree % 60];
  const etapes = [`${horaire(debut)} + ${hm(duree)} : on ajoute les heures, puis les minutes.`];
  if (m + dm >= 60) {
    etapes.push(`${h} h + ${dh} h = ${h + dh} h et ${m} min + ${dm} min = ${m + dm} min.`);
    etapes.push(`${m + dm} min = 1 h ${pad(m + dm - 60)} min, donc on obtient ${horaire(fin)}.`);
  } else {
    etapes.push(`${h} h + ${dh} h = ${h + dh} h et ${m} min + ${dm} min = ${m + dm} min.`);
  }
  return etapes;
}

const PROBLEMES = [
  {
    themes: ['rap'],
    creer(rng) {
      const debut = rng.int(19 * 4, 21 * 4) * 15 + rng.choix([0, 5, 10]);
      const duree = rng.int(21, 30) * 5;
      return { sorte: 'arrivee', debut, duree, texte: `Le concert de JUL commence à ${horaire(debut)} et dure ${hm(duree)}.`, question: 'À quelle heure se termine-t-il ?', concl: t => `Le concert se termine à ${t}.` };
    }
  },
  {
    themes: ['rap', 'voyages'],
    creer(rng) {
      const debut = rng.int(6 * 12, 10 * 12) * 5;
      const fin = debut + rng.int(36, 60) * 5;
      return { sorte: 'ecart', debut, fin, texte: `Le bus de la tournée de JUL part de Marseille à ${horaire(debut)} et arrive à Lyon à ${horaire(fin)}.`, question: 'Combien de temps dure le trajet ?', concl: t => `Le trajet dure ${t}.` };
    }
  },
  {
    themes: ['handball', 'sport'],
    creer(rng, ctx) {
      const debut = rng.int(14 * 4, 20 * 4) * 15 + rng.choix([0, 5]);
      const pause = rng.choix([10, 15]);
      return { sorte: 'arrivee', debut, duree: 60 + pause, detail: `2 mi-temps de 30 min et ${pause} min de pause`, texte: `Le match de hand ${ctx.de} commence à ${horaire(debut)}. Il y a 2 mi-temps de 30 min et une pause de ${pause} min.`, question: 'À quelle heure se termine le match (sans arrêts de jeu) ?', concl: t => `Le match se termine à ${t}.` };
    }
  },
  {
    themes: ['chevaux'],
    creer(rng, ctx) {
      const debut = rng.int(9 * 12, 16 * 12) * 5;
      const fin = debut + rng.int(15, 40) * 5;
      return { sorte: 'ecart', debut, fin, texte: `${ctx.prenom} part en balade à cheval à ${horaire(debut)} et rentre aux écuries à ${horaire(fin)}.`, question: 'Combien de temps a duré la balade ?', concl: t => `La balade a duré ${t}.` };
    }
  },
  {
    themes: ['cuisine', 'commerce'],
    creer(rng, ctx) {
      const ouverture = rng.int(11 * 4, 12 * 4) * 15;
      const prepa = rng.int(14, 30) * 5;
      return { sorte: 'depart', fin: ouverture, duree: prepa, texte: `Le food truck ${ctx.de} ouvre à ${horaire(ouverture)}. Il faut ${hm(prepa)} de préparation avant l'ouverture.`, question: `À quelle heure ${ctx.prenom} doit-${ctx.il()} commencer la préparation ?`, concl: t => `${ctx.prenom} doit commencer à ${t}.` };
    }
  },
  {
    themes: ['voyages', 'grece'],
    creer(rng) {
      const debut = rng.int(6 * 12, 15 * 12) * 5;
      const duree = rng.int(38, 45) * 5;
      return { sorte: 'arrivee', debut, duree, texte: `Un avion décolle de Paris à ${horaire(debut)} (heure de Paris) pour Athènes. Le vol dure ${hm(duree)}.`, question: 'À quelle heure (heure de Paris) atterrit-il ?', concl: t => `L'avion atterrit à ${t}, heure de Paris.` };
    }
  },
  {
    themes: ['famille', 'mode'],
    creer(rng, ctx) {
      const debut = rng.int(13 * 12, 15 * 12) * 5;
      const fin = debut + rng.int(20, 50) * 5;
      const ils = ctx.genre === 'f' && ctx.amiGenre === 'f' ? 'elles' : 'ils';
      return { sorte: 'ecart', debut, fin, texte: `Pendant les soldes, ${ctx.prenom} et ${ctx.ami} font les boutiques de ${horaire(debut)} à ${horaire(fin)}.`, question: `Combien de temps ont-${ils} fait les boutiques ?`, concl: t => `${ils === 'elles' ? 'Elles' : 'Ils'} ont fait les boutiques pendant ${t}.` };
    }
  },
  {
    themes: ['sport', 'records'],
    creer(rng) {
      const debut = rng.int(8 * 4, 9 * 4) * 15;
      const duree = rng.int(3 * 60 + 5, 4 * 60 + 30);
      return { sorte: 'arrivee', debut, duree, texte: `Au marathon d'Athènes, un coureur prend le départ à ${horaire(debut)} et court pendant ${hm(duree)}.`, question: 'À quelle heure franchit-il la ligne d\'arrivée ?', concl: t => `Il arrive à ${t}.` };
    }
  },
  {
    themes: ['jeux-video'],
    creer(rng, ctx) {
      const durees = [rng.int(40, 170), rng.int(40, 170)];
      return { sorte: 'total', durees, texte: `Samedi, ${ctx.prenom} joue ${hm(durees[0])} à son jeu vidéo préféré. Dimanche, ${ctx.il()} joue ${hm(durees[1])}.`, question: 'Combien de temps a-t-' + ctx.il() + ' joué en tout ?', concl: t => `${ctx.prenom} a joué ${t} en tout.` };
    }
  },
  {
    themes: ['espace', 'animaux'],
    creer(rng) {
      const tours = rng.int(2, 5);
      const duree = rng.int(90, 93);
      return { sorte: 'total', durees: Array(tours).fill(duree), texte: `La Station spatiale internationale fait le tour de la Terre en ${hm(duree)} environ.`, question: `Combien de temps lui faut-il pour faire ${tours} tours ?`, concl: t => `Il lui faut ${t}.` };
    }
  }
];

function exoProbleme(rng, ctx) {
  const adaptes = PROBLEMES.filter(p => p.themes.includes(ctx.theme));
  const modele = rng.choix(adaptes.length ? adaptes : PROBLEMES);
  const p = modele.creer(rng, ctx);
  let r, etapes, attendu;
  const erreurs = [];

  if (p.sorte === 'arrivee') {
    r = p.debut + p.duree;
    etapes = [...(p.detail ? [`Durée totale : ${p.detail}, soit ${hm(p.duree)}.`] : []), ...etapesAjout(p.debut, p.duree)];
    const m = p.debut % 60, dm = p.duree % 60;
    if (m + dm >= 60) erreurDuree(erreurs, p.debut + p.duree - 60, r, `${m + dm} min, c'est plus d'une heure : ${m + dm} min = 1 h ${pad(m + dm - 60)} min. Il faut ajouter cette heure.`);
    attendu = sec(p.debut) + sec(p.duree);
  } else if (p.sorte === 'depart') {
    r = p.fin - p.duree;
    etapes = [
      `On remonte le temps : ${horaire(p.fin)} − ${hm(p.duree)}.`,
      `${horaire(p.fin)} − ${Math.floor(p.duree / 60)} h = ${horaire(p.fin - Math.floor(p.duree / 60) * 60)}, puis on enlève encore ${p.duree % 60} min.`
    ];
    attendu = sec(p.fin) - sec(p.duree);
    erreurDuree(erreurs, p.fin + p.duree, r, 'La préparation se fait <strong>avant</strong> l\'ouverture : on soustrait la durée.');
  } else if (p.sorte === 'ecart') {
    r = p.fin - p.debut;
    etapes = etapesEcart(p.debut, p.fin);
    const [h1, m1, h2, m2] = [Math.floor(p.debut / 60), p.debut % 60, Math.floor(p.fin / 60), p.fin % 60];
    if (m2 < m1) erreurDuree(erreurs, (h2 - h1) * 60 + (m2 + 60 - m1), r, 'Tu as oublié la retenue : en empruntant 60 min, il faut enlever 1 h.');
    attendu = sec(p.fin) - sec(p.debut);
  } else {
    r = p.durees.reduce((s, x) => s + x, 0);
    const heures = p.durees.reduce((s, x) => s + Math.floor(x / 60), 0);
    const minutes = p.durees.reduce((s, x) => s + (x % 60), 0);
    etapes = [
      `On additionne les heures, puis les minutes : ${p.durees.map(hm).join(' + ')}.`,
      `${heures} h et ${minutes} min.`,
      ...(minutes >= 60 ? [`${minutes} min = ${hm(minutes)}, donc au total ${hm(r)}.`] : [])
    ];
    attendu = p.durees.reduce((s, x) => s + sec(x), 0);
    if (minutes >= 100) erreurDuree(erreurs, heures * 60 + Math.floor(minutes / 100) * 60 + (minutes % 100), r, '1 h = 60 min : on fait des paquets de 60 minutes, pas de 100.');
  }
  const estHoraire = p.sorte === 'arrivee' || p.sorte === 'depart';
  const texteR = estHoraire ? horaire(r) : hm(r);
  etapes.push(estHoraire ? `Réponse : ${gras(texteR)}.` : '');
  etapes.push(p.concl(texteR));

  return {
    cle: `probleme:${modele.themes[0]}:${p.sorte}:${p.debut ?? ''}:${p.fin ?? ''}:${p.duree ?? ''}:${(p.durees || []).join(',')}`,
    enonce: `<p>${p.texte}</p><p><strong>${p.question}</strong></p>`,
    type: 'duree',
    uniteDuree: 'min',
    reponse: sec(r),
    etapes: etapes.filter(Boolean),
    erreurs: nettoyer(erreurs),
    donnees: { attendu }
  };
}

// Heures décimales en contexte
function exoDecimalContexte(rng, ctx) {
  const e = decimalEnHeures(rng);
  const d = e.enonce.match(/class="calcul">([^ ]+) h/)[1];
  e.enonce = `<p>Le GPS indique que le trajet jusqu'au match de hand ${ctx.de} durera <strong>${d} h</strong>.</p>
    <p><strong>Combien d'heures et de minutes cela fait-il ?</strong></p>`;
  e.cle = e.cle + ':ctx';
  return e;
}

// ---------- Export ----------

export default {
  id: 'conversions-durees',
  titre: 'Conversions de durées',
  resume: 'Heures, minutes, secondes, heures décimales et horaires.',
  niveaux: 3,
  nomsNiveaux: ['h, min, s', 'Heures décimales, horaires', 'Problèmes'],
  cours: [
    {
      titre: 'Les bases',
      contenu: `<p class="calcul">1 h = 60 min<br>1 min = 60 s<br>1 h = 3 600 s</p>
        <p>Pour passer de minutes à heures, on fait des <strong>paquets de 60</strong> :</p>
        <p class="calcul">150 min = 2 × 60 + 30<br>= 2 h 30 min</p>`
    },
    {
      titre: 'Les heures décimales',
      contenu: `<p>1,75 h, ce n'est <strong>pas</strong> 1 h 75 min !</p>
        <p class="calcul">0,75 h = 0,75 × 60 min = 45 min<br>1,75 h = 1 h 45 min</p>
        <p>Dans l'autre sens, on divise par 60 :</p>
        <p class="calcul">2 h 36 min = 2 + 36 ÷ 60<br>= 2,6 h</p>
        <p>À connaître : 0,5 h = 30 min ; 0,25 h = 15 min ; 0,1 h = 6 min.</p>`
    },
    {
      titre: 'Durée entre deux horaires',
      contenu: `<p>De 14 h 35 à 17 h 10 : on passe par les heures pleines.</p>
        <p class="calcul">14 h 35 → 15 h : 25 min<br>15 h → 17 h : 2 h<br>17 h → 17 h 10 : 10 min</p>
        <p>Total : 2 h + 25 min + 10 min = <strong>2 h 35 min</strong>.</p>
        <p class="piege">Piège : 10 − 35 ne marche pas, d'où la méthode par étapes.</p>`
    }
  ],
  generer(niveau, rng, ctx) {
    if (niveau === 1) {
      const t = rng.pondere([['h-min', 3], ['min-h', 3], ['s', 2]]);
      if (t === 'h-min') return heuresEnMinutes(rng);
      if (t === 'min-h') return minutesEnHeures(rng);
      return minutesSecondes(rng);
    }
    if (niveau === 2) {
      const t = rng.pondere([['dec-h', 3], ['h-dec', 3], ['ecart', 3]]);
      if (t === 'dec-h') return decimalEnHeures(rng);
      if (t === 'h-dec') return heuresEnDecimal(rng);
      return ecartHoraires(rng);
    }
    return rng.bool(0.85) ? exoProbleme(rng, ctx) : exoDecimalContexte(rng, ctx);
  },

  // Contrôle indépendant : valeur recalculée directement à partir des données de départ
  controler(exo) {
    const a = exo.donnees.attendu;
    const ecart = Math.abs(a - exo.reponse);
    if (exo.type === 'duree') {
      if (exo.reponse < 0 || exo.reponse >= 24 * 3600) return 'durée ou horaire hors de la journée';
      return ecart < 0.5 ? null : `attendu ${a} s, obtenu ${exo.reponse} s (${fmtDuree(exo.reponse)})`;
    }
    return ecart < 1e-9 ? null : `attendu ${a}, obtenu ${exo.reponse}`;
  }
};
