// Fabrique de générateurs d'histoire : à partir d'une banque de faits (événements datés, personnages,
// vocabulaire), produit un générateur conforme au contrat du moteur (voir CLAUDE.md).
// Les énoncés sont tirés au hasard parmi plusieurs modèles de questions : jamais deux fois les mêmes.
import { svg } from '../../assets/js/core/svg.js';
import { DONNEES } from '../donnees/index.js';

const gras = s => `<strong>${s}</strong>`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const LETTRES = ['A', 'B', 'C', 'D'];

// Texte de date : « 1916 », « 1914-1918 »
const periode = e => (e.fin ? `${e.annee}-${e.fin}` : String(e.annee));
const dateLongue = e => e.date || periode(e);

// Tous les faits de toutes les banques (pour les intrus et les distracteurs)
function tousLesFaits() {
  const ev = [], pers = [], voc = [];
  for (const d of DONNEES) {
    d.evenements.forEach(e => ev.push({ ...e, chapitre: d.id, titreChapitre: d.titre }));
    (d.personnages || []).forEach(p => pers.push({ ...p, chapitre: d.id }));
    (d.vocabulaire || []).forEach(v => voc.push({ ...v, chapitre: d.id }));
  }
  return { ev, pers, voc };
}

// k éléments distincts au hasard
function tirer(rng, liste, k) {
  return rng.melanger(liste).slice(0, k);
}

// Deux événements peuvent être ordonnés s'ils diffèrent par l'année, ou par le mois (s'ils sont
// connus tous les deux), ou par le jour (même mois, jours connus).
export function comparables(a, b) {
  if (a.annee !== b.annee) return true;
  if (a.mois && b.mois && a.mois !== b.mois) return true;
  return !!(a.mois && a.mois === b.mois && a.jour && b.jour && a.jour !== b.jour);
}
// Clé de tri chronologique (valable entre événements comparables)
const chrono = e => e.annee * 10000 + (e.mois || 0) * 100 + (e.jour || 0);

// k événements deux à deux comparables (ordre chronologique sans ambiguïté)
function tirerDistincts(rng, liste, k) {
  const res = [];
  for (const e of rng.melanger(liste)) {
    if (res.every(x => comparables(x, e))) res.push(e);
    if (res.length === k) break;
  }
  return res.length === k ? res : null;
}

// k événements aux années toutes différentes (frise, durées)
function tirerAnneesDistinctes(rng, liste, k) {
  const res = [];
  for (const e of rng.melanger(liste)) {
    if (res.every(x => x.annee !== e.annee)) res.push(e);
    if (res.length === k) break;
  }
  return res.length === k ? res : null;
}

// ---------- Frise chronologique ----------

/**
 * Frise SVG. evenements : [{ annee, fin?, label }] ; segments : [{ de, a, lettre }] (zones colorées).
 * Les étiquettes alternent au-dessus et au-dessous de l'axe pour ne pas se chevaucher.
 */
export function frise({ debut, fin, evenements = [], segments = [], etiquettes = true }) {
  const W = 340, marge = 22;
  const niveaux = etiquettes ? 2 : 0;
  const H = etiquettes ? 170 : 80;
  const yAxe = etiquettes ? 88 : 40;
  const X = a => marge + ((a - debut) / (fin - debut)) * (W - 2 * marge);
  const span = fin - debut;
  const pas = span <= 12 ? 1 : span <= 30 ? 5 : span <= 80 ? 10 : 20;
  const couleurs = ['#8b5cf6', '#14b8a6', '#f59e0b', '#fb7185'];
  let c = '';
  segments.forEach((s, k) => {
    c += `<rect class="frise-segment" x="${X(s.de).toFixed(1)}" y="${yAxe - 16}" width="${(X(s.a) - X(s.de)).toFixed(1)}" height="32" fill="${couleurs[k % 4]}"/>`;
    c += `<text class="frise-lettre" x="${((X(s.de) + X(s.a)) / 2).toFixed(1)}" y="${yAxe + 32}" text-anchor="middle">${s.lettre}</text>`;
  });
  c += `<line class="frise-axe" x1="${marge - 8}" y1="${yAxe}" x2="${W - marge + 8}" y2="${yAxe}"/>`;
  c += `<path class="fleche-pointe" d="M${W - marge + 14} ${yAxe} l-9 -5 v10 z"/>`;
  for (let a = Math.ceil(debut / pas) * pas; a <= fin; a += pas) {
    c += `<line class="graduation" x1="${X(a).toFixed(1)}" y1="${yAxe - 5}" x2="${X(a).toFixed(1)}" y2="${yAxe + 5}"/>`;
    if (!segments.length || !etiquettes) c += `<text class="graduation-texte" x="${X(a).toFixed(1)}" y="${yAxe + 18}" text-anchor="middle">${a}</text>`;
  }
  evenements.forEach((e, k) => {
    const x = X(e.annee);
    if (e.fin) {
      c += `<rect class="frise-periode" x="${x.toFixed(1)}" y="${yAxe - 9}" width="${Math.max(3, X(e.fin) - x).toFixed(1)}" height="7" rx="3"/>`;
    }
    c += `<circle class="point-plein" cx="${x.toFixed(1)}" cy="${yAxe}" r="4.5"/>`;
    if (!etiquettes) return;
    const haut = k % 2 === 0;
    const rang = Math.floor(k / 2) % niveaux;
    const y0 = haut ? yAxe - 22 - rang * 30 : yAxe + (segments.length ? 50 : 30) + rang * 30;
    c += `<line class="graduation" x1="${x.toFixed(1)}" y1="${yAxe + (haut ? -6 : 6)}" x2="${x.toFixed(1)}" y2="${(haut ? y0 + 6 : y0 - 12).toFixed(1)}"/>`;
    const lignes = couper(e.label, 16);
    const xt = Math.min(W - 40, Math.max(40, x));
    lignes.forEach((l, j) => {
      c += `<text class="frise-nom" x="${xt.toFixed(1)}" y="${(y0 + (haut ? (j - lignes.length + 1) * 12 : j * 12)).toFixed(1)}" text-anchor="middle">${esc(l)}</text>`;
    });
  });
  return svg(W, H, c, { titre: 'Frise chronologique' });
}

// Coupe un libellé en 2 lignes au plus
function couper(texte, max) {
  const mots = texte.split(' ');
  const lignes = [''];
  for (const m of mots) {
    const cur = lignes[lignes.length - 1];
    if ((cur + ' ' + m).trim().length > max && cur && lignes.length < 2) lignes.push(m);
    else lignes[lignes.length - 1] = (cur + ' ' + m).trim();
  }
  // Deux lignes au plus, chacune raccourcie si besoin
  return lignes.map(l => (l.length > max + 2 ? l.slice(0, max).trimEnd() + '…' : l));
}

// Bornes de frise englobant des années, arrondies
function bornes(annees) {
  const min = Math.min(...annees), max = Math.max(...annees);
  const span = Math.max(4, max - min);
  const marge = Math.max(1, Math.round(span * 0.12));
  return [min - marge, max + marge];
}

// ---------- Modèles de questions ----------

function explication(e) {
  return [`${gras(e.nom)} : ${dateLongue(e)}.`, e.explication];
}

// Messages « tu confonds avec… » pour les années d'autres événements
function erreursAnnees(evs, bonne, cible) {
  const liste = [];
  for (const e of evs) {
    for (const [a, quoi] of [[e.annee, e.fin ? 'début' : null], [e.fin, 'fin']]) {
      if (!a || a === bonne || liste.some(x => x.a === a) || e === cible) continue;
      liste.push({ a, e, quoi });
    }
  }
  return liste;
}

function exoDate(rng, d, { saisie }) {
  // nomDate : le nom contient déjà la date (« Mai 68 ») → pas de question de date
  const possibles = d.evenements.filter(e => !e.nomDate);
  const candidats = saisie ? possibles.filter(e => e.repere || rng.bool(0.4)) : possibles;
  const e = rng.choix(candidats.length ? candidats : possibles);
  const demandeFin = !!e.fin && rng.bool(0.35);
  const annee = demandeFin ? e.fin : e.annee;
  const libelle = e.fin ? (demandeFin ? 'Année de fin' : 'Année de début') : 'Année';
  const confusions = erreursAnnees(d.evenements, annee, e);
  const erreurs = confusions.map(({ a, e: autre, quoi }) => ({
    test: v => String(v) === String(a),
    message: `Tu confonds : ${a}, c'est ${quoi === 'fin' ? 'la fin de ' : quoi ? 'le début de ' : ''}« ${esc(autre.nom)} ».`
  }));
  const base = {
    cle: `date:${saisie ? 's' : 'q'}:${e.nom}:${demandeFin}`,
    donnees: { nom: e.nom, fin: demandeFin },
    enonce: `<p>${libelle} de cet événement ?</p><p class="evenement">${esc(e.nom)}</p>`,
    etapes: explication(e)
  };
  if (saisie) {
    erreurs.push({ test: v => typeof v === 'number' && Math.abs(v - annee) <= 2 && v !== annee, message: `Tout près ! C'est ${annee}.` });
    return { ...base, type: 'nombre', reponse: annee, erreurs };
  }
  // QCM : années d'autres événements du chapitre et années voisines
  const autres = new Set([...d.evenements.flatMap(x => [x.annee, x.fin]).filter(Boolean), annee - 1, annee + 1, annee - 2, annee + 2, annee - 3, annee + 3]);
  autres.delete(annee);
  const choix = [annee, ...tirer(rng, [...autres], 3)].sort((x, y) => x - y).map(String);
  return { ...base, type: 'qcm', choix, reponse: String(annee), erreurs };
}

function exoAvantApres(rng, d) {
  const paire = tirerDistincts(rng, d.evenements, 2);
  if (!paire) return null;
  const [a, b] = paire;
  const premier = chrono(a) < chrono(b) ? a : b;
  return {
    cle: `avant:${[a.nom, b.nom].sort().join('|')}`,
    enonce: '<p><strong>Lequel de ces deux événements a eu lieu en premier ?</strong></p>',
    type: 'qcm',
    choix: [a.nom, b.nom],
    reponse: premier.nom,
    etapes: [`${a.nom} : ${dateLongue(a)}.`, `${b.nom} : ${dateLongue(b)}.`, `Donc ${gras(premier.nom)} vient en premier.`],
    erreurs: []
  };
}

function exoOrdre(rng, d, k) {
  const evs = tirerDistincts(rng, d.evenements, k);
  if (!evs) return null;
  const items = evs.map(e => e.nom);
  const reponse = evs.map((e, i) => ({ e, i })).sort((x, y) => chrono(x.e) - chrono(y.e)).map(x => x.i);
  const tries = reponse.map(i => evs[i]);
  const [b0, b1] = bornes(evs.flatMap(e => [e.annee, e.fin || e.annee]));
  return {
    cle: `ordre:${items.slice().sort().join('|')}`,
    enonce: '<p><strong>Remets ces événements dans l\'ordre chronologique.</strong></p>',
    type: 'ordre',
    items,
    reponse,
    etapes: [
      tries.map(e => `${dateLongue(e)} : ${e.nom}`).join('<br>'),
      frise({ debut: b0, fin: b1, evenements: tries.map(e => ({ annee: e.annee, fin: e.fin, label: e.nom })) })
    ],
    erreurs: [{
      test: v => Array.isArray(v) && v.every((x, j) => x === reponse[reponse.length - 1 - j]),
      message: 'Tu as tout mis à l\'envers : on commence par le <strong>plus ancien</strong>.'
    }]
  };
}

function exoFrise(rng, d) {
  const evs = tirerAnneesDistinctes(rng, d.evenements, 4);
  if (!evs) return null;
  const [cible, ...refs] = evs;
  refs.sort((x, y) => x.annee - y.annee);
  const annees = [cible.annee, ...refs.map(r => r.annee)];
  const [b0, b1] = bornes(annees);
  const limites = [b0, ...refs.map(r => r.annee), b1];
  // Zones assez larges pour être lisibles : au moins 3 ans entre deux repères
  if (refs.some((r, k) => k > 0 && r.annee - refs[k - 1].annee < 3)) return null;
  const segments = LETTRES.map((lettre, k) => ({ de: limites[k], a: limites[k + 1], lettre }));
  const idx = segments.findIndex(s => cible.annee > s.de && cible.annee < s.a);
  if (idx < 0) return null;
  return {
    cle: `frise:${cible.nom}:${refs.map(r => r.nom).join('|')}`,
    enonce: `<p>Dans quelle zone de la frise faut-il placer cet événement ?</p><p class="evenement">${esc(cible.nom)}</p>`,
    figure: frise({ debut: b0, fin: b1, evenements: refs.map(r => ({ annee: r.annee, label: `${r.annee} ${r.nom}` })), segments }),
    type: 'qcm',
    choix: LETTRES,
    reponse: LETTRES[idx],
    etapes: [
      `${gras(cible.nom)} : ${dateLongue(cible)}.`,
      idx === 0 ? `C'est avant « ${esc(refs[0].nom)} » (${refs[0].annee}) : zone ${gras('A')}.`
        : idx === 3 ? `C'est après « ${esc(refs[2].nom)} » (${refs[2].annee}) : zone ${gras('D')}.`
          : `C'est entre « ${esc(refs[idx - 1].nom)} » (${refs[idx - 1].annee}) et « ${esc(refs[idx].nom)} » (${refs[idx].annee}) : zone ${gras(LETTRES[idx])}.`,
      cible.explication
    ],
    erreurs: []
  };
}

function exoPersonnage(rng, d, faits) {
  const pers = d.personnages || [];
  if (!pers.length) return null;
  const p = rng.choix(pers);
  const autresNoms = [...new Set([...pers, ...faits.pers].map(x => x.nom))].filter(n => n !== p.nom);
  if (autresNoms.length < 3) return null;
  const choix = rng.melanger([p.nom, ...tirer(rng, autresNoms.filter(n => pers.some(x => x.nom === n)), 3)]);
  while (choix.length < 4) choix.push(rng.choix(autresNoms.filter(n => !choix.includes(n))));
  return {
    cle: `pers:${p.nom}`,
    enonce: `<p><strong>De qui s'agit-il ?</strong></p><p class="evenement" style="font-size: 18px; font-weight: 600;">${esc(p.description)}</p>`,
    type: 'qcm',
    choix: rng.melanger(choix),
    reponse: p.nom,
    etapes: [`${gras(p.nom)} : ${esc(p.description)}.`],
    erreurs: []
  };
}

function exoVocabulaire(rng, d, faits, sens) {
  const voc = d.vocabulaire || [];
  if (!voc.length) return null;
  const v = rng.choix(voc);
  const pool = [...voc.filter(x => x !== v), ...faits.voc.filter(x => x.chapitre !== d.id)];
  const autres = [];
  for (const x of rng.melanger(voc.filter(y => y !== v)).concat(rng.melanger(pool))) {
    if (autres.length === 3) break;
    if (!autres.some(y => y.mot === x.mot) && x.mot !== v.mot) autres.push(x);
  }
  if (autres.length < 3) return null;
  if (sens === 'mot') {
    return {
      cle: `voc-mot:${v.mot}`,
      enonce: `<p><strong>Quel mot correspond à cette définition ?</strong></p><p class="evenement" style="font-size: 18px; font-weight: 600;">${esc(v.definition)}</p>`,
      type: 'qcm',
      choix: rng.melanger([v.mot, ...autres.map(x => x.mot)]),
      reponse: v.mot,
      etapes: [`${gras(v.mot)} : ${esc(v.definition)}`],
      erreurs: autres.map(x => ({ test: r => r === x.mot, message: `« ${esc(x.mot)} », c'est : ${esc(x.definition)}` }))
    };
  }
  return {
    cle: `voc-def:${v.mot}`,
    enonce: `<p><strong>Quelle est la bonne définition ?</strong></p><p class="evenement">${esc(v.mot)}</p>`,
    type: 'qcm',
    choix: rng.melanger([v.definition, ...autres.map(x => x.definition)]),
    reponse: v.definition,
    etapes: [`${gras(v.mot)} : ${esc(v.definition)}`],
    erreurs: []
  };
}

function exoIntrus(rng, d, faits) {
  const trois = tirer(rng, d.evenements, 3);
  const [min, max] = d.periode;
  const dehors = faits.ev.filter(e => e.chapitre !== d.id && (e.annee < min - 4 || e.annee > max + 4) && !trois.some(t => t.nom === e.nom));
  if (trois.length < 3 || !dehors.length) return null;
  const intrus = rng.choix(dehors);
  return {
    cle: `intrus:${intrus.nom}:${trois.map(t => t.nom).sort().join('|')}`,
    enonce: `<p><strong>Quel événement n'appartient pas au chapitre « ${esc(d.titre)} » (${d.periode[0]}-${d.periode[1]}) ?</strong></p>`,
    type: 'qcm',
    choix: rng.melanger([intrus.nom, ...trois.map(t => t.nom)]),
    reponse: intrus.nom,
    etapes: [
      `${gras(intrus.nom)} date de ${periode(intrus)} : c'est en dehors de la période ${d.periode[0]}-${d.periode[1]} (chapitre « ${esc(intrus.titreChapitre)} »).`,
      trois.map(t => `${t.nom} : ${periode(t)}`).join('<br>')
    ],
    erreurs: []
  };
}

function exoDuree(rng, d) {
  const paire = tirerAnneesDistinctes(rng, d.evenements, 2);
  if (!paire) return null;
  const [a, b] = paire.sort((x, y) => x.annee - y.annee);
  const r = b.annee - a.annee;
  return {
    cle: `duree:${a.nom}|${b.nom}`,
    enonce: `<p><strong>Combien d'années séparent ces deux événements ?</strong></p>
      <p>${esc(a.nom)} (${a.annee})<br>${esc(b.nom)} (${b.annee})</p>`,
    type: 'nombre',
    unite: 'ans',
    reponse: r,
    etapes: [`${b.annee} − ${a.annee} = ${gras(String(r))} ans.`, `${esc(b.nom)} a lieu ${r} an${r > 1 ? 's' : ''} après « ${esc(a.nom)} ».`],
    erreurs: [{ test: v => v === r + 1, message: 'On soustrait simplement les années, sans ajouter 1.' }],
    expression: `${b.annee} − ${a.annee}`
  };
}

// ---------- Cours ----------

function cours(d) {
  const reperes = d.evenements.slice().sort((x, y) => chrono(x) - chrono(y));
  const [b0, b1] = bornes(reperes.flatMap(e => [e.annee, e.fin || e.annee]));
  const cartes = [];
  if (d.essentiel?.length) {
    cartes.push({ titre: 'L\'essentiel', contenu: `<ul>${d.essentiel.map(x => `<li>${x}</li>`).join('')}</ul>` });
  }
  cartes.push({
    titre: 'Les dates à retenir',
    contenu: `<ul class="liste-dates">${reperes.map(e => `<li><strong>${dateLongue(e)}</strong> : ${esc(e.nom)}${e.repere ? ' <span class="badge">repère</span>' : ''}</li>`).join('')}</ul>`,
    figure: frise({ debut: b0, fin: b1, evenements: reperes.map(e => ({ annee: e.annee, fin: e.fin })), etiquettes: false })
  });
  if (d.personnages?.length) {
    cartes.push({ titre: 'Les personnages', contenu: `<ul>${d.personnages.map(p => `<li><strong>${esc(p.nom)}</strong> : ${esc(p.description)}.</li>`).join('')}</ul>` });
  }
  if (d.vocabulaire?.length) {
    cartes.push({ titre: 'Le vocabulaire', contenu: `<ul>${d.vocabulaire.map(v => `<li><strong>${esc(v.mot)}</strong> : ${esc(v.definition)}</li>`).join('')}</ul>` });
  }
  return cartes;
}

// ---------- Générateur ----------

export function fabriquer(d) {
  const faits = tousLesFaits();
  const modeles = {
    1: [['dateQcm', 3], ['avant', 2], ['vocMot', 2]],
    2: [['dateSaisie', 2], ['ordre4', 3], ['personnage', 2], ['frise', 2]],
    3: [['ordre5', 2], ['intrus', 2], ['duree', 1], ['vocDef', 2], ['dateSaisie', 1], ['personnage', 1]]
  };
  const fabriquerUn = (type, rng) => {
    switch (type) {
      case 'dateQcm': return exoDate(rng, d, { saisie: false });
      case 'dateSaisie': return exoDate(rng, d, { saisie: true });
      case 'avant': return exoAvantApres(rng, d);
      case 'ordre4': return exoOrdre(rng, d, 4);
      case 'ordre5': return exoOrdre(rng, d, 5) || exoOrdre(rng, d, 4);
      case 'frise': return exoFrise(rng, d);
      case 'personnage': return exoPersonnage(rng, d, faits);
      case 'vocMot': return exoVocabulaire(rng, d, faits, 'mot');
      case 'vocDef': return exoVocabulaire(rng, d, faits, 'def');
      case 'intrus': return exoIntrus(rng, d, faits);
      case 'duree': return exoDuree(rng, d);
      default: return null;
    }
  };
  return {
    id: d.id,
    titre: d.titre,
    resume: d.resume,
    niveaux: 3,
    nomsNiveaux: ['Les dates clés', 'Frise et personnages', 'Type brevet'],
    cours: d.cours || cours(d),
    generer(niveau, rng) {
      for (let essai = 0; essai < 30; essai++) {
        const exo = fabriquerUn(rng.pondere(modeles[niveau]), rng);
        if (exo) return exo;
      }
      return exoDate(rng, d, { saisie: false });
    },
    // Contrôle indépendant : la réponse doit correspondre à la banque de faits
    controler(exo) {
      if (exo.type === 'ordre') {
        const evs = exo.reponse.map(i => d.evenements.find(e => e.nom === exo.items[i]));
        const ok = evs.every((e, k) => k === 0 || (comparables(evs[k - 1], e) && chrono(e) > chrono(evs[k - 1])));
        return ok ? null : 'ordre non chronologique ou ambigu';
      }
      if (exo.cle.startsWith('avant:')) {
        const [a, b] = exo.choix.map(n => d.evenements.find(e => e.nom === n));
        if (!comparables(a, b)) return 'avant/après ambigu';
        const premier = chrono(a) < chrono(b) ? a : b;
        return premier.nom === exo.reponse ? null : 'avant/après incohérent';
      }
      if (exo.cle.startsWith('date:')) {
        const { nom, fin } = exo.donnees;
        const e = d.evenements.find(x => x.nom === nom);
        if (!e) return `événement introuvable : ${nom}`;
        return String(fin ? e.fin : e.annee) === String(exo.reponse) ? null : `date de ${nom} incohérente`;
      }
      return null;
    }
  };
}

// Banque des repères du brevet : tous les événements marqués « repère », tous chapitres confondus
export function banqueReperes() {
  const evenements = [];
  for (const d of DONNEES) for (const e of d.evenements) if (e.repere && !evenements.some(x => x.nom === e.nom)) evenements.push(e);
  const annees = evenements.map(e => e.annee);
  return {
    id: 'reperes',
    titre: 'Les repères du brevet',
    resume: 'Toutes les dates à connaître, tous chapitres mélangés.',
    periode: [Math.min(...annees), Math.max(...annees)],
    essentiel: ['Ces dates sont les <strong>dates clés</strong> du programme de 3e : au brevet, il faut savoir les citer et les placer sur une frise.', 'Astuce : associe chaque date à une image ou à un personnage.'],
    evenements,
    personnages: DONNEES.flatMap(d => d.personnages || []).filter((p, i, t) => t.findIndex(x => x.nom === p.nom) === i),
    vocabulaire: DONNEES.flatMap(d => d.vocabulaire || []).filter((v, i, t) => t.findIndex(x => x.mot === v.mot) === i)
  };
}
