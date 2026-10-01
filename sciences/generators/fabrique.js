// Fabrique de générateurs de sciences : à partir d'une banque de notions (questions, vrai/faux,
// vocabulaire, étapes à ordonner, éléments à classer) et de calculs générés propres au chapitre,
// produit un générateur conforme au contrat du moteur (voir CLAUDE.md).
// Les questions de connaissances sont tirées au hasard (choix mélangés, distracteurs variés) ;
// les calculs sont générés à partir de paramètres aléatoires.
import { fmt } from '../../assets/js/core/answer.js';

export const gras = s => `<strong>${s}</strong>`;
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Arrondi propre (évite 0,30000000000000004)
export const net = x => Number(x.toFixed(9));
export const arrondi = (x, n = 1) => Math.round(x * 10 ** n) / 10 ** n;

/**
 * Liste d'« erreurs probables » pour une réponse numérique : chaque valeur fausse typique
 * reçoit un message. Les valeurs trop proches de la bonne réponse sont ignorées.
 */
export function erreursNombre(reponse, tolerance = 0) {
  const liste = [];
  return {
    ajouter(v, message) {
      const marge = Math.max(tolerance, Math.abs(reponse) * 1e-6, 1e-6);
      if (!Number.isFinite(v) || Math.abs(v - reponse) <= marge * 2 || liste.some(e => Math.abs(e.v - v) < 1e-9)) return;
      const tol = Math.max(tolerance, Math.abs(v) * 1e-6, 1e-6);
      liste.push({ v, test: x => typeof x === 'number' && Math.abs(x - v) <= tol, message });
    },
    liste: () => liste.map(({ test, message }) => ({ test, message }))
  };
}

// Carte « formules » du cours
function carteFormules(formules) {
  return {
    titre: 'Les formules',
    contenu: `<ul>${formules.map(f => `<li><strong>${f.nom}</strong> : <span class="calcul-inline">${f.formule}</span>${f.unites ? `<br><span class="doux petit">${f.unites}</span>` : ''}</li>`).join('')}</ul>`
  };
}

function cours(d) {
  const cartes = [];
  if (d.essentiel?.length) cartes.push({ titre: 'L\'essentiel', contenu: `<ul>${d.essentiel.map(x => `<li>${x}</li>`).join('')}</ul>` });
  if (d.formules?.length) cartes.push(carteFormules(d.formules));
  for (const c of d.cartes || []) cartes.push(c);
  if (d.vocabulaire?.length) {
    cartes.push({ titre: 'Le vocabulaire', contenu: `<ul>${d.vocabulaire.map(v => `<li><strong>${esc(v.mot)}</strong> : ${esc(v.definition)}</li>`).join('')}</ul>` });
  }
  return cartes;
}

// ---------- Modèles de questions de connaissances ----------

// Question à choix multiple : 3 mauvaises réponses tirées parmi celles proposées
function exoQuestion(rng, d, niveau) {
  const pool = (d.questions || []).filter(q => (q.niveau || 1) <= niveau);
  // On privilégie les questions du niveau demandé
  const duNiveau = pool.filter(q => (q.niveau || 1) === niveau);
  const liste = duNiveau.length && rng.bool(0.7) ? duNiveau : pool;
  if (!liste.length) return null;
  const q = rng.choix(liste);
  const fausses = rng.melanger(q.fausses).slice(0, 3);
  return {
    cle: `q:${q.q}`,
    enonce: `<p><strong>${q.q}</strong></p>`,
    figure: q.figure,
    type: 'qcm',
    choix: q.ordonne ? [q.bonne, ...fausses].sort(q.ordonne) : rng.melanger([q.bonne, ...fausses]),
    reponse: q.bonne,
    etapes: [`Réponse : ${gras(esc(q.bonne))}.`, ...(q.explication ? [q.explication] : [])],
    erreurs: (q.pieges || []).map(p => ({ test: r => r === p.choix, message: p.message }))
  };
}

function exoVraiFaux(rng, d) {
  const vf = d.vraiFaux || [];
  if (!vf.length) return null;
  const a = rng.choix(vf);
  const bonne = a.vrai ? 'Vrai' : 'Faux';
  return {
    cle: `vf:${a.texte}`,
    enonce: `<p><strong>Vrai ou faux ?</strong></p><p class="evenement" style="font-size: 18px; font-weight: 600;">${a.texte}</p>`,
    type: 'qcm',
    choix: ['Vrai', 'Faux'],
    reponse: bonne,
    etapes: [`C'est ${gras(bonne.toLowerCase())}.`, a.explication],
    erreurs: []
  };
}

function exoVocabulaire(rng, d, sens) {
  const voc = d.vocabulaire || [];
  if (voc.length < 4) return null;
  const v = rng.choix(voc);
  const autres = rng.melanger(voc.filter(x => x.mot !== v.mot)).slice(0, 3);
  if (sens === 'mot') {
    return {
      cle: `voc-mot:${v.mot}`,
      enonce: `<p><strong>Quel mot correspond à cette définition ?</strong></p><p class="evenement" style="font-size: 18px; font-weight: 600;">${esc(v.definition)}</p>`,
      type: 'qcm',
      choix: rng.melanger([v.mot, ...autres.map(x => x.mot)]),
      reponse: v.mot,
      etapes: [`${gras(esc(v.mot))} : ${esc(v.definition)}`],
      erreurs: autres.map(x => ({ test: r => r === x.mot, message: `« ${esc(x.mot)} », c'est : ${esc(x.definition)}` }))
    };
  }
  return {
    cle: `voc-def:${v.mot}`,
    enonce: `<p><strong>Quelle est la bonne définition ?</strong></p><p class="evenement">${esc(v.mot)}</p>`,
    type: 'qcm',
    choix: rng.melanger([v.definition, ...autres.map(x => x.definition)]),
    reponse: v.definition,
    etapes: [`${gras(esc(v.mot))} : ${esc(v.definition)}`],
    erreurs: []
  };
}

// Remettre des étapes dans l'ordre (trajet d'un aliment, message nerveux, chaîne d'énergie…)
function exoSequence(rng, d) {
  const seqs = d.sequences || [];
  if (!seqs.length) return null;
  const s = rng.choix(seqs);
  // On mélange jusqu'à obtenir un ordre différent du bon
  let melange;
  do { melange = rng.melanger(s.etapes.map((_, i) => i)); } while (melange.every((x, k) => x === k));
  const items = melange.map(i => s.etapes[i]);
  const reponse = s.etapes.map((_, k) => melange.indexOf(k));
  return {
    cle: `seq:${s.titre}`,
    enonce: `<p><strong>${s.consigne}</strong></p>`,
    type: 'ordre',
    consigneOrdre: s.aide || 'Touche les étapes <strong>dans l\'ordre</strong>, de la première à la dernière.',
    items,
    reponse,
    etapes: [s.etapes.map((e, k) => `${k + 1}. ${esc(e)}`).join('<br>'), ...(s.explication ? [s.explication] : [])],
    erreurs: [{
      test: v => Array.isArray(v) && v.every((x, j) => x === reponse[reponse.length - 1 - j]),
      message: 'Tu as tout mis à l\'envers : commence par la <strong>première</strong> étape.'
    }]
  };
}

// Classer un élément dans la bonne catégorie (capteur ou actionneur, renouvelable ou non…)
function exoClassement(rng, d) {
  const cl = d.classements || [];
  if (!cl.length) return null;
  const c = rng.choix(cl);
  const groupe = rng.choix(c.groupes);
  const item = rng.choix(groupe.items);
  const nom = typeof item === 'string' ? item : item.nom;
  const pourquoi = typeof item === 'string' ? null : item.pourquoi;
  return {
    cle: `classe:${c.question}:${nom}`,
    enonce: `<p><strong>${c.question}</strong></p><p class="evenement">${esc(nom)}</p>`,
    type: 'qcm',
    choix: c.groupes.map(g => g.nom),
    reponse: groupe.nom,
    etapes: [`${esc(nom)} : ${gras(esc(groupe.nom.toLowerCase()))}.`, pourquoi || groupe.explication].filter(Boolean),
    erreurs: []
  };
}

// ---------- Générateur ----------

const MODELES_CONNAISSANCES = {
  qcm: exoQuestion,
  vf: (rng, d) => exoVraiFaux(rng, d),
  vocMot: (rng, d) => exoVocabulaire(rng, d, 'mot'),
  vocDef: (rng, d) => exoVocabulaire(rng, d, 'def'),
  sequence: (rng, d) => exoSequence(rng, d),
  classement: (rng, d) => exoClassement(rng, d)
};

// Répartition par défaut si le chapitre n'en donne pas
function modelesParDefaut(d) {
  const calc = Object.keys(d.calculs || {}).map(k => [`calc:${k}`, 2]);
  const a = (cond, x) => (cond ? [x] : []);
  return {
    1: [['qcm', 3], ...a(d.vraiFaux?.length, ['vf', 2]), ...a(d.vocabulaire?.length >= 4, ['vocMot', 2]), ...a(d.classements?.length, ['classement', 2]), ...calc],
    2: [['qcm', 3], ...a(d.vraiFaux?.length, ['vf', 1]), ...a(d.vocabulaire?.length >= 4, ['vocDef', 1]), ...a(d.sequences?.length, ['sequence', 2]), ...a(d.classements?.length, ['classement', 1]), ...calc],
    3: [['qcm', 3], ...a(d.sequences?.length, ['sequence', 1]), ...a(d.vocabulaire?.length >= 4, ['vocDef', 1]), ...calc]
  };
}

export function fabriquer(d) {
  const modeles = d.modeles || modelesParDefaut(d);
  const fabriquerUn = (type, rng, ctx, niveau) => {
    if (type.startsWith('calc:')) return d.calculs[type.slice(5)](rng, ctx, niveau);
    const f = MODELES_CONNAISSANCES[type];
    return f ? f(rng, d, niveau) : null;
  };
  return {
    id: d.id,
    titre: d.titre,
    resume: d.resume,
    niveaux: 3,
    nomsNiveaux: d.nomsNiveaux || ['Les bases', 'Je m\'entraîne', 'Type brevet'],
    cours: cours(d),
    generer(niveau, rng, ctx) {
      for (let essai = 0; essai < 30; essai++) {
        const exo = fabriquerUn(rng.pondere(modeles[niveau]), rng, ctx, niveau);
        if (exo) return exo;
      }
      return exoQuestion(rng, d, 3);
    },
    controler: d.controler
  };
}

// Phrase « on arrondit » pour une valeur approchée
export function phraseArrondi(valeur, n, unite = '') {
  const a = arrondi(valeur, n);
  const exact = Math.abs(a - valeur) < 1e-9;
  const u = unite ? ` ${unite}` : '';
  return exact ? `${fmt(a)}${u}` : `${fmt(arrondi(valeur, n + 2))}…${u} ≈ ${fmt(a)}${u}`;
}
