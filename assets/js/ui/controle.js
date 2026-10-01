// Contrôle blanc : sujet mélangé sur plusieurs chapitres, barème affiché, durée indicative,
// calculatrice autorisée, correction complète à la fin seulement.
import { creerRng, graineDepuisUrl, graineAleatoire } from '../core/rng.js';
import { charger, sauver, profil as profilStocke } from '../core/store.js';
import { genererExercice } from '../core/engine.js';
import { verifier, formaterReponse, fmt, lireOrdre } from '../core/answer.js';
import { enregistrerResultat } from '../core/gamification.js';
import { $, esc, fmtChrono } from './dom.js';
import { htmlSaisie, brancherSaisie, lireSaisie } from './saisie.js';
import { monterCalculatrice } from './calculatrice.js';
import { confettis } from './fx.js';

export const POINTS = { 1: 1, 2: 2, 3: 3 };           // barème par niveau de difficulté
const MINUTES_PAPIER = 12;                             // une construction sur papier

/**
 * Options selon la matière :
 *  - calculatrice : autorisée pendant l'épreuve (maths) ou non (histoire)
 *  - minutes : durée conseillée par question, selon le niveau
 *  - sansParDefaut : chapitres décochés au départ (constructions sur papier, repères déjà inclus ailleurs)
 */
export function demarrerControle({
  app, chapitres, urlMatiere,
  matiere = 'maths',
  calculatrice = true,
  minutes: MINUTES = { 1: 2, 2: 3, 3: 5 },
  sansParDefaut: PAR_DEFAUT_SANS = ['constructions']
}) {
  const dispo = chapitres.filter(c => c.charger);
  const graine = graineDepuisUrl() ?? graineAleatoire();
  const rng = creerRng(graine);
  let calc = null;

  ecranReglages();

  // ---------- 1. Réglages ----------

  function ecranReglages() {
    const derniers = (charger().controles || []).filter(c => (c.matiere || 'maths') === matiere);
    const dernier = derniers[derniers.length - 1];
    app.innerHTML = `
      <header class="barre-haut">
        <a class="btn-icone" href="${urlMatiere}" aria-label="Retour">‹</a>
        <div class="titre">📝 Contrôle blanc</div>
      </header>
      <p class="doux">Un sujet mélangé, comme le jour J. La correction complète arrive <strong>à la fin</strong>.</p>
      ${dernier ? `<p><span class="badge">Dernière note : ${fmt(dernier.note)}/20</span></p>` : ''}
      <section class="carte">
        <h2>Chapitres</h2>
        <div class="choix-chapitres">
          ${dispo.map(c => `<label class="case-chapitre"><input type="checkbox" value="${c.id}" ${PAR_DEFAUT_SANS.includes(c.id) ? '' : 'checked'}><span>${esc(c.emoji)} ${esc(c.titre)}</span></label>`).join('')}
        </div>
        <button class="btn btn-secondaire" id="tout" type="button">Tout cocher / décocher</button>
      </section>
      <section class="carte">
        <h2>Nombre de questions</h2>
        <div class="segments" role="radiogroup">
          ${[10, 15, 20].map(n => `<button type="button" class="segment${n === 15 ? ' actif' : ''}" data-n="${n}" role="radio" aria-checked="${n === 15}">${n}</button>`).join('')}
        </div>
      </section>
      <p class="aide-saisie" id="aide"></p>
      <button class="btn" id="preparer">Préparer le sujet</button>`;

    let nb = 15;
    app.querySelectorAll('.segment').forEach(b => b.addEventListener('click', () => {
      nb = Number(b.dataset.n);
      app.querySelectorAll('.segment').forEach(x => { x.classList.toggle('actif', x === b); x.setAttribute('aria-checked', x === b); });
    }));
    $('#tout', app).addEventListener('click', () => {
      const cases = [...app.querySelectorAll('.choix-chapitres input')];
      const tous = cases.every(c => c.checked);
      cases.forEach(c => { c.checked = !tous; });
    });
    $('#preparer', app).addEventListener('click', async () => {
      const ids = [...app.querySelectorAll('.choix-chapitres input:checked')].map(c => c.value);
      if (!ids.length) { $('#aide', app).textContent = 'Choisis au moins un chapitre.'; return; }
      $('#preparer', app).disabled = true;
      $('#preparer', app).textContent = 'Préparation…';
      try {
        const sujet = await preparerSujet(ids, nb);
        ecranSujet(sujet);
      } catch (e) {
        console.error(e);
        $('#aide', app).textContent = 'Le sujet n\'a pas pu être préparé. Recharge la page.';
      }
    });
  }

  // ---------- Préparation du sujet ----------

  async function preparerSujet(ids, nb) {
    const choisis = dispo.filter(c => ids.includes(c.id));
    const gens = await Promise.all(choisis.map(c => c.charger().then(m => m.default)));
    // Niveaux : environ 30 % faciles, 40 % moyens, 30 % type brevet
    const n1 = Math.round(nb * 0.3), n3 = Math.round(nb * 0.3);
    const niveaux = rng.melanger([...Array(n1).fill(1), ...Array(nb - n1 - n3).fill(2), ...Array(n3).fill(3)]);
    // Répartition équilibrée entre les chapitres
    const ordre = rng.melanger(gens.map((_, k) => k));
    const profil = profilStocke();
    const questions = niveaux.map((niveau, q) => {
      const k = ordre[q % ordre.length];
      const gen = gens[k];
      const exo = genererExercice(gen, Math.min(niveau, gen.niveaux), rng, { profil });
      return { gen, rang: k, exo, niveau: exo.niveau, points: POINTS[exo.niveau], saisie: '' };
    });
    // Comme un vrai sujet : regroupé par chapitre (exercices), dans l'ordre du programme
    questions.sort((a, b) => a.rang - b.rang || a.niveau - b.niveau);
    const total = questions.reduce((s, q) => s + q.points, 0);
    const minutes = questions.reduce((s, q) => s + (q.gen.id === 'constructions' ? MINUTES_PAPIER : MINUTES[q.niveau]), 0);
    return { questions, total, minutes, debut: null, fin: null };
  }

  // ---------- 2. Présentation du sujet ----------

  function ecranSujet(sujet) {
    const parChapitre = [];
    for (const q of sujet.questions) {
      const dernier = parChapitre[parChapitre.length - 1];
      if (dernier && dernier.gen === q.gen) { dernier.n++; dernier.points += q.points; } else parChapitre.push({ gen: q.gen, n: 1, points: q.points });
    }
    const papier = sujet.questions.some(q => q.gen.id === 'constructions');
    app.innerHTML = `
      <header class="barre-haut">
        <button class="btn-icone" id="retour" aria-label="Retour aux réglages">‹</button>
        <div class="titre">📝 Ton sujet</div>
      </header>
      <section class="carte">
        <div class="stats-ligne">
          <div><strong>${sujet.questions.length}</strong><span>questions</span></div>
          <div><strong>${sujet.total}</strong><span>points</span></div>
          <div><strong>${sujet.minutes} min</strong><span>conseillées</span></div>
        </div>
        <h3>Barème</h3>
        <table class="bareme">
          ${parChapitre.map((c, k) => `<tr><td>Exercice ${k + 1} · ${esc(c.gen.titre)}</td><td>${c.n} question${c.n > 1 ? 's' : ''}</td><td><strong>${c.points} pt${c.points > 1 ? 's' : ''}</strong></td></tr>`).join('')}
        </table>
        <p class="doux petit">Question facile : ${POINTS[1]} pt · moyenne : ${POINTS[2]} pts · type brevet : ${POINTS[3]} pts. Note ramenée sur 20.</p>
        <ul class="doux petit">
          ${calculatrice ? '<li>🧮 Calculatrice autorisée.</li>' : '<li>Pas de calculatrice : tout est dans ta tête !</li>'}
          <li>Tu peux revenir sur une question avant de terminer.</li>
          <li>Aucune correction avant la fin : comme le jour J !</li>
          ${papier ? '<li>✏️ Prépare une feuille, une règle, un compas, une équerre et un rapporteur.</li>' : ''}
        </ul>
      </section>
      <button class="btn" id="commencer">C'est parti !</button>`;
    $('#retour', app).addEventListener('click', ecranReglages);
    $('#commencer', app).addEventListener('click', () => {
      sujet.debut = Date.now();
      if (calculatrice) calc = monterCalculatrice();
      ecranQuestion(sujet, 0);
    });
  }

  // ---------- 3. Épreuve ----------

  let minuteur = null;

  function ecranQuestion(sujet, i) {
    clearInterval(minuteur);
    const q = sujet.questions[i];
    const n = sujet.questions.length;
    const numExo = numeroExercice(sujet, i);
    app.innerHTML = `
      <div class="session-tete">
        <div class="barre-haut" style="margin-bottom: 8px;">
          <button class="btn-icone" id="quitter" aria-label="Quitter le contrôle">✕</button>
          <div class="titre">Question ${i + 1}/${n}</div>
          <span class="chrono" id="chrono"></span>
        </div>
        <div class="jauge"><span style="width: ${Math.round((i / n) * 100)}%"></span></div>
        <div class="navigation-questions">${sujet.questions.map((x, k) => `<button type="button" data-q="${k}" class="${k === i ? 'courante' : ''} ${x.saisie.trim() ? 'repondue' : ''}" aria-label="Question ${k + 1}">${k + 1}</button>`).join('')}</div>
      </div>
      <section class="carte" id="carte-exo">
        <p class="doux petit"><strong>Exercice ${numExo} · ${esc(q.gen.titre)}</strong> · ${q.points} pt${q.points > 1 ? 's' : ''}</p>
        <div class="enonce">${q.exo.enonce}</div>
        ${q.exo.figure || ''}
        ${htmlSaisie(q.exo, q.saisie)}
        <div class="aide-saisie" id="aide" aria-live="polite"></div>
        <div class="nav-cours">
          <button class="btn btn-secondaire" id="prec" ${i === 0 ? 'disabled' : ''}>‹ Préc.</button>
          <button class="btn" id="suiv">${i === n - 1 ? 'Terminer' : 'Suivante ›'}</button>
        </div>
      </section>
      <div id="confirmation"></div>`;

    const memoriser = () => { q.saisie = lireSaisie(app); };
    // Une saisie non vide mais illisible est signalée avant de changer de question
    const lisible = () => {
      memoriser();
      if (!q.saisie.trim()) return true;
      const v = verifier(q.exo, q.saisie);
      if (!v.valide) { $('#aide', app).textContent = v.message; return false; }
      return true;
    };
    const aller = k => { if (lisible()) ecranQuestion(sujet, k); };
    brancherSaisie(app, { onEntree: () => $('#suiv', app).click() });
    $('#prec', app).addEventListener('click', () => aller(i - 1));
    $('#suiv', app).addEventListener('click', () => (i === n - 1 ? (lisible() && confirmer(sujet)) : aller(i + 1)));
    app.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => aller(Number(b.dataset.q))));
    $('#quitter', app).addEventListener('click', () => {
      memoriser();
      $('#confirmation', app).innerHTML = `<div class="carte"><p><strong>Quitter le contrôle ?</strong> Tes réponses seront perdues.</p>
        <a class="btn btn-secondaire" href="${urlMatiere}">Oui, quitter</a><button class="btn" id="rester">Non, je continue</button></div>`;
      $('#rester', app).addEventListener('click', () => { $('#confirmation', app).innerHTML = ''; });
      $('#confirmation', app).scrollIntoView({ behavior: 'smooth' });
    });

    const majChrono = () => {
      const ms = Date.now() - sujet.debut;
      const reste = sujet.minutes * 60000 - ms;
      const el = $('#chrono', app);
      if (!el) return;
      el.textContent = reste >= 0 ? `⏱ ${fmtChrono(reste)}` : `⏱ +${fmtChrono(-reste)}`;
      el.classList.toggle('depasse', reste < 0);
    };
    majChrono();
    minuteur = setInterval(majChrono, 1000);
    const champ = $('#champ', app);
    if (champ) champ.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function numeroExercice(sujet, i) {
    let num = 0, prec = null;
    for (let k = 0; k <= i; k++) {
      if (sujet.questions[k].gen !== prec) { num++; prec = sujet.questions[k].gen; }
    }
    return num;
  }

  function confirmer(sujet) {
    const vides = sujet.questions.filter(q => !q.saisie.trim()).length;
    const zone = $('#confirmation', app);
    zone.innerHTML = `<div class="carte">
        <p><strong>Terminer le contrôle ?</strong></p>
        <p>${vides ? `Il reste <strong>${vides} question${vides > 1 ? 's' : ''} sans réponse</strong>.` : 'Tu as répondu à toutes les questions. 👏'}</p>
        <button class="btn" id="finir">Oui, voir ma note</button>
        <button class="btn btn-secondaire" id="relire">Je relis encore</button>
      </div>`;
    $('#finir', app).addEventListener('click', () => resultats(sujet));
    $('#relire', app).addEventListener('click', () => { zone.innerHTML = ''; });
    zone.scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- 4. Résultats et correction ----------

  function resultats(sujet) {
    clearInterval(minuteur);
    sujet.fin = Date.now();
    if (calc) { calc.detruire(); calc = null; }

    let obtenus = 0, xp = 0;
    const bilan = new Map();
    for (const q of sujet.questions) {
      const v = q.saisie.trim() ? verifier(q.exo, q.saisie) : { valide: false, correct: false, vide: true };
      q.verif = v;
      q.correct = !!v.correct;
      if (q.correct) obtenus += q.points;
      xp += enregistrerResultat(q.gen.id, q.niveau, q.correct, 0).xp;
      const b = bilan.get(q.gen) || { obtenus: 0, total: 0 };
      b.total += q.points;
      if (q.correct) b.obtenus += q.points;
      bilan.set(q.gen, b);
    }
    const note = Math.round((obtenus / sujet.total) * 20 * 2) / 2;   // au demi-point
    const duree = sujet.fin - sujet.debut;
    const e = charger();
    e.controles = [...(e.controles || []), { matiere, date: new Date().toISOString().slice(0, 10), note, questions: sujet.questions.length }].slice(-10);
    sauver();
    if (note >= 15) confettis();

    const appreciation = note >= 16 ? 'Excellent, le jour J s\'annonce bien !'
      : note >= 12 ? 'Bon travail ! Regarde la correction des questions ratées.'
      : note >= 8 ? 'C\'est en bonne voie. Revois les chapitres en rouge ci-dessous.'
      : 'Pas de panique : la correction va t\'aider. Entraîne-toi sur les chapitres en rouge.';

    app.innerHTML = `
      <header class="barre-haut">
        <a class="btn-icone" href="${urlMatiere}" aria-label="Retour">‹</a>
        <div class="titre">📝 Résultats</div>
      </header>
      <section class="carte centre">
        <div class="resultat-grand">${fmt(note)}<span class="doux" style="font-size: 28px;">/20</span></div>
        <p>${appreciation}</p>
        <div class="stats-ligne">
          <div><strong>${obtenus}/${sujet.total}</strong><span>points</span></div>
          <div><strong>${fmtChrono(duree)}</strong><span>sur ${sujet.minutes} min</span></div>
          <div><strong>+${xp}</strong><span>XP</span></div>
        </div>
      </section>
      <section class="carte">
        <h2>Par chapitre</h2>
        <table class="bareme">
          ${[...bilan].map(([gen, b]) => {
            const taux = b.obtenus / b.total;
            return `<tr class="${taux >= 0.7 ? 'bien' : taux >= 0.4 ? 'moyen' : 'faible'}"><td>${esc(gen.titre)}</td><td><strong>${b.obtenus}/${b.total}</strong></td>
              <td><a href="chapitre.html?c=${encodeURIComponent(gen.id)}&mode=entrainement">S'entraîner</a></td></tr>`;
          }).join('')}
        </table>
      </section>
      <h2 style="margin-top: 20px;">Correction</h2>
      ${sujet.questions.map((q, k) => correction(q, k)).join('')}
      <a class="btn" href="controle.html">Nouveau contrôle</a>
      <a class="btn btn-secondaire" href="${urlMatiere}">Retour aux chapitres</a>`;
    window.scrollTo(0, 0);
  }

  function correction(q, k) {
    const v = q.verif;
    const statut = v.vide ? '<span class="badge">Sans réponse</span>' : q.correct ? '<span class="badge badge-ok">✓ Juste</span>' : '<span class="badge badge-ko">✗ Faux</span>';
    const unite = q.exo.unite ? ` ${esc(q.exo.unite)}` : '';
    // Pour un ordre, on réaffiche les événements dans l'ordre choisi (et pas leurs numéros)
    const indices = q.exo.type === 'ordre' ? lireOrdre(q.exo, q.saisie) : null;
    const saisieLisible = indices ? indices.map(i => q.exo.items[i]).join(' → ') : q.saisie;
    return `
      <details class="carte correction-question${q.correct ? '' : ' ouverte-par-defaut'}" ${q.correct ? '' : 'open'}>
        <summary><strong>Question ${k + 1}</strong> · ${esc(q.gen.titre)} · ${q.correct ? q.points : 0}/${q.points} pt${q.points > 1 ? 's' : ''} ${statut}</summary>
        <div class="enonce">${q.exo.enonce}</div>
        ${q.exo.figure || ''}
        <p>Ta réponse : <strong>${v.vide ? '—' : esc(saisieLisible)}</strong>${v.vide ? '' : unite}</p>
        <p>Bonne réponse : <strong>${esc(formaterReponse(q.exo))}${unite}</strong></p>
        ${v.presque ? `<div class="erreur-probable">💡 ${v.erreur}</div>` : ''}
        ${!q.correct && v.erreur && !v.presque ? `<div class="erreur-probable">💡 ${v.erreur}</div>` : ''}
        ${q.exo.etapes?.length ? `<strong>Correction</strong><ol class="etapes">${q.exo.etapes.map(e => `<li>${e}</li>`).join('')}</ol>` : ''}
        ${q.exo.redaction ? `<strong>Rédaction modèle</strong><div class="redaction">${q.exo.redaction}</div>` : ''}
      </details>`;
  }

  console.info(`[revision-brevet] graine du contrôle : ${graine} (ajoute ?seed=${graine} à l'URL pour le rejouer)`);
}
