// Vérifications de masse des générateurs et de la saisie.
// Utilisé par tests/generators.html (et exécutable sous Node pour le développement).
import { creerRng } from '../assets/js/core/rng.js';
import { tirerContexte } from '../assets/js/core/contexts.js';
import {
  verifier, formaterReponse, lireNombre, lireFraction, lireDuree, lirePoint, fmt, pgcd
} from '../assets/js/core/answer.js';

// Texte visible d'un morceau de HTML (les espaces fines des milliers sont conservées)
const sansBalises = html => html.replace(/<[^>]+>/g, '').replace(/[ \t\n\r]+/g, ' ');

const TYPES = ['nombre', 'fraction', 'qcm', 'duree', 'point', 'texte-court'];
const BORNE = 1e6;

// Recalcule une expression affichée (− × ÷, virgule) indépendamment du générateur
// Une fraction écrite « a/b » est un bloc : « 3/4 ÷ 5/6 » se lit (3/4) ÷ (5/6).
export function evaluerExpression(txt) {
  const js = txt
    .replace(/(\d+)\/(\d+)/g, '($1/$2)')
    .replace(/−/g, '-')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/(\d),(\d)/g, '$1.$2')
    .replace(/ /g, '');
  // Seuls les chiffres, opérations, parenthèses, carrés et racines sont autorisés
  if (!/^[\d\s+\-*/().²√]+$/.test(js)) throw new Error('expression non reconnue : ' + txt);
  const final = js.replace(/²/g, '**2').replace(/√/g, 'Math.sqrt');
  return Function(`"use strict"; return (${final});`)();
}

function valeurNumerique(exo) {
  const r = exo.reponse;
  if (exo.type === 'fraction') return r.n / r.d;
  if (exo.type === 'point') return Math.max(Math.abs(r.x), Math.abs(r.y));
  return typeof r === 'number' ? r : null;
}

/**
 * Génère n exercices par niveau et renvoie un rapport :
 * { id, niveaux: [{ niveau, n, erreurs: [..], exemples: [..], clesDistinctes, duree }] }
 */
export function testerGenerateur(gen, n = 1000, graine = 12345) {
  const rapport = { id: gen.id, titre: gen.titre, niveaux: [] };
  for (let niveau = 1; niveau <= gen.niveaux; niveau++) {
    const rng = creerRng(graine + niveau);
    const erreurs = [];
    const cles = new Set();
    const exemples = [];
    const t0 = Date.now();
    const signaler = (i, exo, msg) => {
      if (erreurs.length < 20) erreurs.push({ i, msg, enonce: exo?.enonce, cle: exo?.cle });
      else erreurs.length === 20 && erreurs.push({ i, msg: '… (erreurs suivantes masquées)' });
    };

    for (let i = 0; i < n; i++) {
      let exo;
      try {
        exo = gen.generer(niveau, rng, tirerContexte(rng, i % 3 ? '' : 'Zoé'));
      } catch (e) {
        signaler(i, null, 'exception : ' + e.message);
        continue;
      }
      if (i < 5) exemples.push(exo);

      if (typeof exo.cle !== 'string' || !exo.cle) signaler(i, exo, 'clé absente');
      else cles.add(exo.cle);
      if (typeof exo.enonce !== 'string' || !exo.enonce.trim()) signaler(i, exo, 'énoncé vide');
      if (!TYPES.includes(exo.type)) signaler(i, exo, 'type inconnu : ' + exo.type);
      if (exo.reponse === undefined || exo.reponse === null) { signaler(i, exo, 'réponse absente'); continue; }
      if (!Array.isArray(exo.etapes) || exo.etapes.length === 0) signaler(i, exo, 'correction absente');
      if (/NaN|undefined|Infinity|null/.test(exo.enonce + (exo.etapes || []).join(' '))) {
        signaler(i, exo, 'NaN / undefined / Infinity dans le texte');
      }

      const v = valeurNumerique(exo);
      if (v !== null) {
        if (!Number.isFinite(v)) signaler(i, exo, 'réponse non finie : ' + v);
        else if (Math.abs(v) > BORNE) signaler(i, exo, 'réponse hors bornes : ' + v);
      }
      if (exo.type === 'fraction') {
        const { n: fn, d: fd } = exo.reponse;
        if (!Number.isInteger(fn) || !Number.isInteger(fd) || fd <= 0) signaler(i, exo, 'fraction invalide');
        else if (exo.simplifiee && pgcd(fn, fd) !== 1) signaler(i, exo, 'la réponse attendue n\'est pas simplifiée');
        if (Math.abs(fn) > 1000 || Math.abs(fd) > 1000) signaler(i, exo, `fraction trop grande : ${fn}/${fd}`);
      }
      if (exo.type === 'qcm' && (!Array.isArray(exo.choix) || !exo.choix.map(String).includes(String(exo.reponse)))) {
        signaler(i, exo, 'la bonne réponse n\'est pas dans les choix');
      }

      // Recalcul indépendant à partir de l'expression affichée
      if (exo.expression) {
        if (!sansBalises(exo.enonce).includes(exo.expression) && !sansBalises(exo.etapes.join(' ')).includes(exo.expression)) {
          signaler(i, exo, 'l\'expression n\'apparaît ni dans l\'énoncé ni dans la correction');
        }
        try {
          const recalc = evaluerExpression(exo.expression);
          if (Math.abs(recalc - v) > (exo.tolerance || 0) + 1e-9) signaler(i, exo, `réponse fausse : ${exo.expression} = ${recalc}, le générateur dit ${v}`);
        } catch (e) {
          signaler(i, exo, e.message);
        }
      }

      // Contrôle propre au générateur (second calcul, indépendant)
      if (typeof gen.controler === 'function') {
        try {
          const msg = gen.controler(exo);
          if (msg) signaler(i, exo, 'contrôle : ' + msg);
        } catch (e) {
          signaler(i, exo, 'contrôle en exception : ' + e.message);
        }
      }

      // La dernière ligne de correction doit contenir la réponse
      if (v !== null && (exo.type === 'nombre' || exo.type === 'fraction') && Array.isArray(exo.etapes)) {
        const tout = sansBalises(exo.etapes.join(' '));
        if (!tout.includes(formaterReponse(exo))) signaler(i, exo, 'la réponse n\'apparaît pas dans la correction');
      }

      // La vérification accepte la bonne réponse, sous plusieurs écritures
      const saisies = [formaterReponse(exo)];
      if (exo.type === 'nombre') {
        saisies.push(String(exo.reponse), String(exo.reponse).replace('.', ','), ` ${String(exo.reponse)} `);
      }
      for (const s of saisies) {
        const res = verifier(exo, s);
        if (!res.correct) signaler(i, exo, `bonne réponse refusée : « ${s} »`);
      }

      // Aucune « erreur probable » ne doit se déclencher sur la bonne réponse
      if (Array.isArray(exo.erreurs)) {
        for (const e of exo.erreurs) {
          try {
            if (e.test(exo.reponse)) signaler(i, exo, 'erreur probable déclenchée par la bonne réponse : ' + e.message);
          } catch (err) {
            signaler(i, exo, 'test d\'erreur en exception : ' + err.message);
          }
        }
      }
      // Une réponse différente doit être refusée
      if (exo.type === 'nombre') {
        const faux = verifier(exo, String(exo.reponse + 1 + (exo.tolerance || 0) * 2));
        if (faux.correct) signaler(i, exo, 'une mauvaise réponse est acceptée');
      }
      if (exo.type === 'fraction') {
        const { n: fn, d: fd } = exo.reponse;
        if (verifier(exo, `${fn + 1}/${fd}`).correct) signaler(i, exo, 'une mauvaise fraction est acceptée');
        // Forme équivalente non simplifiée : « presque » si la forme simplifiée est exigée
        const equiv = verifier(exo, `${fn * 2}/${fd * 2}`);
        if (exo.simplifiee ? !equiv.presque : !equiv.correct) signaler(i, exo, 'forme équivalente mal traitée');
      }
    }
    rapport.niveaux.push({ niveau, n, erreurs, exemples, clesDistinctes: cles.size, duree: Date.now() - t0 });
  }
  return rapport;
}

// Tests unitaires de la saisie : [description, obtenu, attendu]
export function testerSaisie() {
  const cas = [
    ['virgule', lireNombre('3,5'), 3.5],
    ['point', lireNombre('3.5'), 3.5],
    ['espaces', lireNombre(' 1 250 '), 1250],
    ['négatif', lireNombre('-12'), -12],
    ['moins typographique', lireNombre('−12'), -12],
    ['unité tapée', lireNombre('12 cm', 'cm'), 12],
    ['fraction en nombre', lireNombre('-3/4'), -0.75],
    ['pas un nombre', lireNombre('abc'), null],
    ['vide', lireNombre(''), null],
    ['fraction', JSON.stringify(lireFraction('3/4')), JSON.stringify({ n: 3, d: 4 })],
    ['fraction négative', JSON.stringify(lireFraction('-5/2')), JSON.stringify({ n: -5, d: 2 })],
    ['fraction dénominateur nul', lireFraction('3/0'), null],
    ['durée 1h45', lireDuree('1h45'), 6300],
    ['durée 1 h 45 min', lireDuree('1 h 45 min'), 6300],
    ['durée 105 min', lireDuree('105 min'), 6300],
    ['durée 1,75 h', lireDuree('1,75 h'), 6300],
    ['durée nombre seul (min)', lireDuree('105'), 6300],
    ['durée 1:45', lireDuree('1:45'), 6300],
    ['durée 2 min 30 s', lireDuree('2 min 30 s'), 150],
    ['point (3 ; −2)', JSON.stringify(lirePoint('(3 ; −2)')), JSON.stringify({ x: 3, y: -2 })],
    ['point 3,-2', JSON.stringify(lirePoint('3,-2')), JSON.stringify({ x: 3, y: -2 })],
    ['format −1 250,5', fmt(-1250.5), '−1250,5'],
    ['format 12 500', fmt(12500), '12 500'],
    ['format 0,1+0,2', fmt(0.1 + 0.2), '0,3']
  ];
  const exoFrac = { type: 'fraction', reponse: { n: 3, d: 4 }, simplifiee: true };
  cas.push(['fraction équivalente simplifiée exigée', verifier(exoFrac, '6/8').presque, true]);
  cas.push(['fraction simplifiée acceptée', verifier(exoFrac, '3/4').correct, true]);
  cas.push(['fraction décimale refusée si simplifiée exigée', verifier(exoFrac, '0,75').correct, false]);
  const exoFrac2 = { type: 'fraction', reponse: { n: 3, d: 4 } };
  cas.push(['fraction équivalente acceptée', verifier(exoFrac2, '6/8').correct, true]);
  const exoTol = { type: 'nombre', reponse: 7.2, tolerance: 0.05 };
  cas.push(['tolérance ok', verifier(exoTol, '7,2').correct, true]);
  cas.push(['tolérance dépassée', verifier(exoTol, '7,3').correct, false]);

  return cas.map(([nom, obtenu, attendu]) => ({ nom, obtenu, attendu, ok: obtenu === attendu }));
}
