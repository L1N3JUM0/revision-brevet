// Vérifications de masse des générateurs et de la saisie.
// Utilisé par tests/generators.html (et exécutable sous Node pour le développement).
import { creerRng } from '../assets/js/core/rng.js';
import { tirerContexte } from '../assets/js/core/contexts.js';
import {
  verifier, formaterReponse, lireNombre, lireFraction, lireDuree, lirePoint, fmt, pgcd
} from '../assets/js/core/answer.js';

// Profils de test : pack Anna, « peu importe » sans thème, et deux profils avec les nouveaux thèmes.
// Elouan (genre « peu importe ») ne doit jamais apparaître dans un énoncé.
export const PROFILS_TEST = [
  { prenom: 'Anna', genre: 'f' },
  { prenom: 'Elouan', genre: 'n', themes: [] },
  { prenom: 'Zoé', genre: 'f', themes: ['foot', 'mangas', 'voitures'] },
  { prenom: 'Tom', genre: 'm', themes: ['basket', 'musique', 'animaux', 'cuisine'] }
];

// Texte visible d'un morceau de HTML (les espaces fines des milliers sont conservées)
const sansBalises = html => html.replace(/<[^>]+>/g, '').replace(/[ \t\n\r]+/g, ' ');

const TYPES = ['nombre', 'fraction', 'qcm', 'duree', 'point', 'texte-court', 'ordre'];
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
      let exo, profilTest;
      try {
        profilTest = PROFILS_TEST[i % PROFILS_TEST.length];
        exo = gen.generer(niveau, rng, tirerContexte(rng, profilTest));
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

      // Personnalisation : JUL seulement dans le pack Anna, le prénom « peu importe » jamais à la 3e personne
      const texteExo = sansBalises(exo.enonce + ' ' + (exo.etapes || []).join(' ') + ' ' + (exo.choix || []).join(' '));
      if (profilTest.prenom !== 'Anna' && /JUL/.test(texteExo)) signaler(i, exo, 'JUL hors du pack Anna');
      if (profilTest.genre === 'n' && texteExo.includes(profilTest.prenom)) signaler(i, exo, 'prénom « peu importe » utilisé dans un énoncé');

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
      if (exo.type === 'ordre') {
        if (!Array.isArray(exo.items) || exo.items.length < 2) signaler(i, exo, 'ordre sans éléments');
        else if (new Set(exo.items).size !== exo.items.length) signaler(i, exo, 'éléments en double');
        else if (verifier(exo, exo.reponse.slice().reverse().join(',')).correct) signaler(i, exo, 'un ordre inversé est accepté');
      }
      if (exo.type === 'qcm' && new Set(exo.choix.map(String)).size !== exo.choix.length) signaler(i, exo, 'choix de QCM en double');
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

// Tests du parseur de la calculatrice : [expression, résultat affiché attendu ou message d'erreur]
export function testerCalculatrice(evaluer, formaterResultat) {
  const cas = [
    ['2+3×4', '14'],
    ['(2+3)×4', '20'],
    ['−3²', '−9'],
    ['(−3)²', '9'],
    ['√(6²+8²)', '10'],
    ['√(13²−5²', '12'],              // parenthèse fermée automatiquement
    ['√(4²+7²)', '8,062257748'],
    ['1,5×2', '3'],
    ['0,1+0,2', '0,3'],
    ['10÷4', '2,5'],
    ['2(3+1)', '8'],
    ['3√(4)', '6'],
    ['2²²', '16'],
    ['5−−2', '7'],
    ['Ans+1', '42'],                 // avec Ans = 41
    ['Ans×Ans', '1681'],
    ['1000×1000', '1 000 000'],
    ['7÷0', 'Division par zéro'],
    ['√(−4)', 'Racine d\'un nombre négatif'],
    ['2+', 'Calcul incomplet'],
    ['1,2,3', 'Erreur de syntaxe'],
    ['(2))', 'Parenthèse en trop'],
    ['', 'Rien à calculer'],
    ['2;3', 'Erreur de syntaxe']
  ];
  return cas.map(([expr, attendu]) => {
    let obtenu;
    try {
      obtenu = formaterResultat(evaluer(expr, 41));
    } catch (e) {
      obtenu = e.message;
    }
    return { nom: expr || '(vide)', obtenu, attendu, ok: obtenu === attendu };
  });
}

// Cohérence des banques de faits d'histoire (données saisies à la main)
export function testerBanquesHistoire(banques) {
  const cas = [];
  const verif = (nom, ok, detail = '') => cas.push({ nom, obtenu: ok ? 'ok' : detail, attendu: 'ok', ok });
  for (const b of banques) {
    const noms = b.evenements.map(e => e.nom);
    verif(`${b.id} : noms d'événements uniques`, new Set(noms).size === noms.length, 'doublon');
    for (const e of b.evenements) {
      verif(`${b.id} : « ${e.nom} » sans année dans le nom`, !/\b1[89]\d\d\b|\b20\d\d\b/.test(e.nom), 'année visible');
      verif(`${b.id} : « ${e.nom} » année plausible`, Number.isInteger(e.annee) && e.annee >= 1900 && e.annee <= 2030, String(e.annee));
      if (e.fin) verif(`${b.id} : « ${e.nom} » fin après début`, e.fin > e.annee, `${e.annee}-${e.fin}`);
      if (e.mois) verif(`${b.id} : « ${e.nom} » mois valide`, Number.isInteger(e.mois) && e.mois >= 1 && e.mois <= 12, String(e.mois));
      if (e.jour) verif(`${b.id} : « ${e.nom} » jour valide`, !!e.mois && e.jour >= 1 && e.jour <= 31, String(e.jour));
      if (e.date && e.mois) {
        const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        verif(`${b.id} : « ${e.nom} » date écrite cohérente avec le mois`, e.date.includes(MOIS[e.mois - 1]), e.date);
      }
      if (e.date) verif(`${b.id} : « ${e.nom} » date écrite cohérente avec l'année`, e.date.includes(String(e.annee)), e.date);
    }
    for (const p of b.personnages || []) {
      const mots = p.nom.split(' ').filter(m => m.length > 3);
      verif(`${b.id} : description de ${p.nom} sans son nom`, !mots.some(m => p.description.includes(m)), 'nom visible');
    }
    const mots = (b.vocabulaire || []).map(v => v.mot);
    verif(`${b.id} : vocabulaire sans doublon`, new Set(mots).size === mots.length, 'doublon');
  }
  return cas;
}

// Cohérence des banques de sciences (questions saisies à la main)
export function testerBanquesSciences(banques, disciplines = ['pc', 'svt', 'techno']) {
  const cas = [];
  const verif = (nom, ok, detail = '') => cas.push({ nom, obtenu: ok ? 'ok' : detail, attendu: 'ok', ok });
  for (const b of banques) {
    verif(`${b.id} : discipline connue`, disciplines.includes(b.discipline), String(b.discipline));
    for (const q of b.questions || []) {
      const tous = [q.bonne, ...q.fausses];
      verif(`${b.id} : « ${q.q} » au moins 3 mauvaises réponses`, q.fausses.length >= 3, String(q.fausses.length));
      verif(`${b.id} : « ${q.q} » choix distincts`, new Set(tous).size === tous.length, 'doublon');
      verif(`${b.id} : « ${q.q} » niveau valide`, [1, 2, 3].includes(q.niveau || 1), String(q.niveau));
    }
    const qs = (b.questions || []).map(q => q.q);
    verif(`${b.id} : questions uniques`, new Set(qs).size === qs.length, 'doublon');
    for (const v of b.vraiFaux || []) {
      verif(`${b.id} : vrai/faux « ${v.texte} » complet`, typeof v.vrai === 'boolean' && !!v.explication, 'incomplet');
    }
    const mots = (b.vocabulaire || []).map(v => v.mot);
    verif(`${b.id} : vocabulaire sans doublon`, new Set(mots).size === mots.length, 'doublon');
    for (const v of b.vocabulaire || []) {
      verif(`${b.id} : définition de « ${v.mot} » sans le mot`, !v.definition.toLowerCase().includes(v.mot.toLowerCase()), 'mot visible');
    }
    for (const s of b.sequences || []) {
      verif(`${b.id} : séquence « ${s.titre} » sans doublon`, new Set(s.etapes).size === s.etapes.length && s.etapes.length >= 3, 'doublon ou trop courte');
    }
    for (const c of b.classements || []) {
      const items = c.groupes.flatMap(g => g.items.map(i => (typeof i === 'string' ? i : i.nom)));
      verif(`${b.id} : classement « ${c.question} » sans élément dans deux groupes`, new Set(items).size === items.length, 'doublon');
    }
  }
  return cas;
}

// Fiches « Explique-moi plus » : une section par carte du cours, dans le même ordre,
// et des filtres d'exemples et de mini-vérif qui trouvent bien des exercices.
export function testerFiches(paires) {
  const cas = [];
  const verif = (nom, ok, detail = '') => cas.push({ nom, obtenu: ok ? 'ok' : detail, attendu: 'ok', ok });
  for (const { gen, fiche } of paires) {
    verif(`${gen.id} : une section par carte`, fiche.sections.length === gen.cours.length, `${fiche.sections.length} sections, ${gen.cours.length} cartes`);
    fiche.sections.forEach((s, k) => {
      verif(`${gen.id} : section ${k + 1} « ${s.titre} » = carte`, gen.cours[k]?.titre === s.titre, gen.cours[k]?.titre || 'carte absente');
      verif(`${gen.id} : section ${k + 1} complète`, !!(s.idee && s.pourquoi && s.pieges?.length && s.recherche && s.verif?.niveaux?.length === 2), 'champ manquant');
      const rng = creerRng(1000 + k);
      const demandes = [[s.exemple.niveau, s.exemple.filtre], ...s.verif.niveaux.map(n => [n, s.verif.filtre])];
      for (const [niveau, filtre] of demandes) {
        let trouves = 0;
        for (let i = 0; i < 200; i++) {
          const exo = gen.generer(niveau, rng, tirerContexte(rng, PROFILS_TEST[i % PROFILS_TEST.length]));
          if (filtre(exo.cle, exo)) trouves++;
        }
        verif(`${gen.id} : section ${k + 1}, filtre niveau ${niveau} assez fréquent`, trouves >= 8, `${trouves}/200`);
      }
    });
  }
  return cas;
}

// Sujets rédigés (étude de document, EMC…) : structure, corrigés, cohérence avec les banques.
// analyser = analyserReponse de ui/redige.js : chaque corrigé modèle doit satisfaire ses propres indices.
// Les variantes de mots-clés sont comparées sans accents ni majuscules : on vérifie aussi qu'aucune n'est vide.
export function testerSujetsRediges(paires, analyser, n = 200) {
  const cas = [];
  const verif = (nom, ok, detail = '') => cas.push({ nom, obtenu: ok ? 'ok' : detail, attendu: 'ok', ok });
  for (const { id, module, evenements } of paires) {
    const erreurs = [];
    const cles = new Set();
    for (let i = 0; i < n; i++) {
      const rng = creerRng(1000 + i);
      let s;
      try { s = module.generer(rng, { prenom: 'Camille', de: 'de Camille', genre: 'f' }); } catch (e) { erreurs.push(`#${i} exception ${e.message}`); continue; }
      cles.add(s.cle);
      if (!s.cle || !s.questions?.length) erreurs.push(`#${i} sujet vide`);
      for (const q of s.questions || []) {
        if (!q.consigne || !q.corrige) erreurs.push(`#${i} consigne ou corrigé vide`);
        if (q.type === 'date') {
          const e = evenements.find(x => x.nom === q.evenement);
          if (!e || e.annee !== q.annee) erreurs.push(`#${i} repère incohérent : ${q.evenement}`);
          if (!String(q.date).includes(String(q.annee))) erreurs.push(`#${i} date écrite sans l'année : ${q.date}`);
        } else if (q.type === 'redige') {
          if ((q.mots || []).some(v => !v.length || v.some(x => !String(x).trim()))) erreurs.push(`#${i} mot-clé vide`);
          const indices = analyser(q.corrige.replace(/<[^>]+>/g, ''), q);
          const ko = indices.filter(x => !x.ok);
          if (ko.length) erreurs.push(`#${i} corrigé modèle refusé par ses indices (${ko.map(x => x.texte).join(' / ')}) : ${q.consigne.replace(/<[^>]+>/g, '').slice(0, 60)}`);
        } else erreurs.push(`#${i} type inconnu ${q.type}`);
      }
      if (erreurs.length > 5) break;
    }
    verif(`${id} : ${n} sujets valides`, !erreurs.length, erreurs.slice(0, 3).join(' | '));
    verif(`${id} : sujets variés`, cles.size >= Math.min(8, n / 10, module.variantes ?? Infinity), `${cles.size} sujets distincts`);
  }
  return cas;
}
