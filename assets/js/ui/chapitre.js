// Page chapitre générique : choix du mode, cours flash, entraînement, défi chrono.
// URL : chapitre.html?c=relatifs&mode=cours|entrainement|chrono[&seed=42]
import { creerRng, graineDepuisUrl, graineAleatoire } from '../core/rng.js';
import { chapitre as statsChapitre } from '../core/store.js';
import { Session, QUESTIONS_CHRONO, BONNES_POUR_MONTER } from '../core/engine.js';
import { formaterReponse } from '../core/answer.js';
import { $, esc, toast, fmtChrono } from './dom.js';
import { rebond, secousse, confettis } from './fx.js';
import { flammeActuelle } from '../core/gamification.js';
import { monterCalculatrice } from './calculatrice.js';
import { htmlSaisie, brancherSaisie, lireSaisie } from './saisie.js';
import { brancherAnimation, htmlAnimation } from './animation.js';

const NOMS_NIVEAUX = ['Facile', 'Moyen', 'Type brevet'];

// redige : { libelle, emoji, description } du mode « exercice rédigé » de la matière (étude de document, situation pratique…)
export async function demarrerChapitre({ app, trouverChapitre, urlMatiere, nomMatiere, calculatrice = true, redige = null }) {
  const params = new URLSearchParams(location.search);
  const id = params.get('c');
  const mode = params.get('mode');
  const entree = id ? trouverChapitre(id) : null;

  if (!entree || !entree.charger) {
    app.innerHTML = `
      <header class="barre-haut"><a class="btn-icone" href="${urlMatiere}" aria-label="Retour">‹</a><div class="titre">${esc(nomMatiere)}</div></header>
      <div class="carte"><h2>Chapitre introuvable</h2><p class="doux">Ce chapitre n'existe pas encore.</p>
      <a class="btn" href="${urlMatiere}">Voir les chapitres</a></div>`;
    return;
  }

  let gen;
  try {
    gen = (await entree.charger()).default;
  } catch (e) {
    app.innerHTML = `<div class="carte"><h2>Oups</h2><p>Le chapitre n'a pas pu se charger. Vérifie ta connexion et recharge la page.</p></div>`;
    console.error(e);
    return;
  }
  document.title = `${gen.titre} — Révision brevet`;

  const graine = graineDepuisUrl() ?? graineAleatoire();
  const rng = creerRng(graine);
  const urlChap = m => `chapitre.html?c=${encodeURIComponent(gen.id)}${m ? `&mode=${m}` : ''}`;
  const ctx = { app, gen, rng, urlChap, urlMatiere, graine, calculatrice, entree, params, redige: entree.redige ? redige : null };

  if (mode === 'cours') ecranCours(ctx);
  else if (mode === 'approfondir' && entree.approfondir) (await import('./approfondir.js')).ecranApprofondir(ctx);
  else if (mode === 'redige' && entree.redige) (await import('./redige.js')).ecranRedige(ctx);
  else if (mode === 'entrainement' || mode === 'chrono') ecranSession(ctx, mode);
  else ecranModes(ctx);
}

// ---------- Choix du mode ----------

function ecranModes({ app, gen, urlChap, urlMatiere, redige }) {
  const st = statsChapitre(gen.id);
  const record = st.record
    ? `Record : ${st.record.score}/${QUESTIONS_CHRONO} en ${fmtChrono(st.record.temps)}`
    : 'Pas encore de record';
  const taux = st.total ? `${Math.round((st.bonnes / st.total) * 100)} % de réussite` : 'Pas encore commencé';

  app.innerHTML = `
    <header class="barre-haut">
      <a class="btn-icone" href="${urlMatiere}" aria-label="Retour aux chapitres">‹</a>
      <div class="titre">${esc(gen.titre)}</div>
    </header>
    <p class="doux">${esc(gen.resume || '')}</p>
    <p><span class="badge">${taux}</span> <span class="badge">Niveau ${st.niveau} · ${NOMS_NIVEAUX[st.niveau - 1] || ''}</span></p>
    <div class="modes">
      <a class="carte carte-lien" href="${urlChap('cours')}">
        <span class="pastille">💡</span>
        <span class="corps"><strong>Cours flash</strong><span class="doux petit">${gen.cours.length} cartes pour revoir l'essentiel</span></span>
        <span class="chevron">›</span>
      </a>
      <a class="carte carte-lien" href="${urlChap('entrainement')}">
        <span class="pastille">🎯</span>
        <span class="corps"><strong>Entraînement</strong><span class="doux petit">Exercices sans fin, la difficulté s'adapte</span></span>
        <span class="chevron">›</span>
      </a>
      <a class="carte carte-lien" href="${urlChap('chrono')}">
        <span class="pastille">⏱️</span>
        <span class="corps"><strong>Défi chrono</strong><span class="doux petit">${QUESTIONS_CHRONO} questions · ${record}</span></span>
        <span class="chevron">›</span>
      </a>
      ${redige ? `<a class="carte carte-lien" href="${urlChap('redige')}">
        <span class="pastille">${esc(redige.emoji)}</span>
        <span class="corps"><strong>${esc(redige.libelle)}</strong><span class="doux petit">${esc(redige.description)}</span></span>
        <span class="chevron">›</span>
      </a>` : ''}
    </div>`;
}

// ---------- Cours flash ----------

function ecranCours({ app, gen, urlChap, entree, params }) {
  const n = gen.cours.length;
  let i = Math.min(Math.max(Number(params.get('carte')) || 0, 0), n - 1);
  let arreterAnimation = null;

  function afficher() {
    if (arreterAnimation) arreterAnimation();
    arreterAnimation = null;
    const c = gen.cours[i];
    app.innerHTML = `
      <header class="barre-haut">
        <a class="btn-icone" href="${urlChap()}" aria-label="Retour">‹</a>
        <div class="titre">Cours flash</div>
        <span class="doux petit">${i + 1}/${n}</span>
      </header>
      <article class="carte cours-carte">
        <h2>${c.titre}</h2>
        <div>${c.contenu}</div>
        ${c.animation ? htmlAnimation() : c.figure || ''}
        ${entree.approfondir ? `<a class="btn btn-secondaire btn-plus" href="${urlChap('approfondir')}&carte=${i}#carte-${i}">🔎 Explique-moi plus</a>` : ''}
      </article>
      <div class="points">${gen.cours.map((_, k) => `<span class="${k === i ? 'actif' : ''}"></span>`).join('')}</div>
      <div class="nav-cours">
        <button class="btn btn-secondaire" id="prec" ${i === 0 ? 'disabled' : ''}>‹ Avant</button>
        ${i < n - 1
          ? '<button class="btn" id="suiv">Suivant ›</button>'
          : `<a class="btn" href="${urlChap('entrainement')}">Je m'entraîne 🎯</a>`}
      </div>`;
    $('#prec', app).addEventListener('click', () => { i--; afficher(); });
    $('#suiv', app)?.addEventListener('click', () => { i++; afficher(); });
    if (c.animation) arreterAnimation = brancherAnimation($('.anim', app), c.animation);
    window.scrollTo(0, 0);
  }

  // Balayage gauche / droite entre les cartes
  let x0 = null;
  app.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  app.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (dx < -60 && i < n - 1) { i++; afficher(); }
    else if (dx > 60 && i > 0) { i--; afficher(); }
  });

  afficher();
}

// ---------- Entraînement et défi chrono ----------

function ecranSession({ app, gen, rng, urlChap, graine, calculatrice }, mode) {
  const session = new Session({ generateur: gen, mode, rng });
  const chrono = mode === 'chrono';
  let minuteur = null;
  let enAttente = false; // true quand le retour est affiché (attente de « Suivant »)

  app.innerHTML = `
    <div class="session-tete">
      <div class="barre-haut" style="margin-bottom: 8px;">
        <a class="btn-icone" href="${urlChap()}" aria-label="Quitter">✕</a>
        <div class="titre">${esc(gen.titre)}</div>
        ${chrono ? '' : '<button class="btn-icone" id="btn-fin" style="font-size: 15px; font-weight: 800;">Fin</button>'}
      </div>
      <div class="jauge"><span id="jauge"></span></div>
      <div class="session-infos">
        <span class="badge" id="info-niveau"></span>
        <span class="score" id="info-score"></span>
        <span id="info-serie"></span>
        <span class="espace"></span>
        ${chrono ? '<span class="chrono" id="info-chrono">0:00</span>' : ''}
      </div>
    </div>
    <div id="zone"></div>`;

  const zone = $('#zone', app);

  function majTete() {
    const exo = session.exo;
    const niv = exo ? exo.niveau : session.niveau;
    $('#info-niveau', app).textContent = `Niveau ${niv} · ${NOMS_NIVEAUX[niv - 1] || ''}`;
    $('#info-score', app).textContent = `✓ ${session.bonnes}/${session.index}`;
    $('#info-serie', app).textContent = session.serie >= 2 ? `🔥 ${session.serie}` : '';
    const progression = chrono
      ? session.index / QUESTIONS_CHRONO
      : session.niveau >= gen.niveaux ? 1 : session.bonnesAuNiveau / BONNES_POUR_MONTER;
    $('#jauge', app).style.width = `${Math.round(progression * 100)}%`;
  }

  function majChrono() {
    const el = $('#info-chrono', app);
    if (el) el.textContent = fmtChrono(session.temps());
  }

  function question() {
    const exo = session.suivant();
    enAttente = false;
    majTete();
    const numero = chrono ? `<span class="doux petit">Question ${session.index + 1}/${QUESTIONS_CHRONO}</span>` : '';
    zone.innerHTML = `
      <section class="carte" id="carte-exo">
        ${numero}
        <div class="enonce">${exo.enonce}</div>
        ${exo.figure || ''}
        ${htmlSaisie(exo)}
        <div class="aide-saisie" id="aide" aria-live="polite"></div>
        <button class="btn" id="valider">Valider</button>
      </section>
      <div id="retour"></div>`;
    brancherSaisie(zone, { onEntree: valider, verrouille: () => enAttente });
    $('#valider', zone).addEventListener('click', valider);
    const champ = $('#champ', zone);
    if (champ) champ.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function valider() {
    if (enAttente) return;
    const exo = session.exo;
    const res = session.repondre(lireSaisie(zone));
    const aide = $('#aide', zone);
    if (!res.verif.valide) {
      aide.textContent = res.verif.message;
      secousse($('#champ', zone) || $('#qcm', zone) || $('#ordre', zone));
      return;
    }
    enAttente = true;
    aide.textContent = '';
    const champ = $('#champ', zone);
    if (champ) {
      champ.readOnly = true;
      champ.classList.add(res.correct ? 'ok' : 'ko');
      champ.blur(); // referme le clavier pour laisser voir la correction
    }
    zone.querySelectorAll('.touches button, .qcm button, .ordre button, #ordre-effacer').forEach(b => { b.disabled = true; });
    // QCM : la bonne réponse en vert, le mauvais choix en rouge
    zone.querySelectorAll('.qcm button').forEach(b => {
      if (b.dataset.valeur === String(exo.reponse)) b.classList.add('bonne');
      else if (b.classList.contains('choisi')) b.classList.add('fausse');
    });
    $('#valider', zone).remove();
    majTete();

    const carte = $('#carte-exo', zone);
    if (res.correct) rebond(carte); else secousse(carte);
    afficherRetour(exo, res);
    evenements(res);
  }

  function afficherRetour(exo, res) {
    const retour = $('#retour', zone);
    const dernier = res.terminee;
    const libelleSuivant = dernier ? 'Voir mon résultat' : 'Question suivante';
    let html;
    if (res.correct) {
      html = `
        <div class="retour bon">
          <div class="titre-retour">✓ ${esc(res.message)}</div>
          <div class="xp">+${res.xp} XP</div>
          ${exo.redaction ? `<details class="replie"><summary>Voir la rédaction modèle</summary><div class="redaction">${exo.redaction}</div></details>` : ''}
        </div>`;
    } else {
      const unite = exo.unite ? ` ${esc(exo.unite)}` : '';
      html = `
        <div class="retour faux">
          <div class="titre-retour">${res.verif.presque ? 'Presque !' : esc(res.message)}</div>
          <p>La bonne réponse : <strong>${esc(formaterReponse(exo))}${unite}</strong></p>
          ${res.verif.erreur ? `<div class="erreur-probable">💡 ${res.verif.erreur}</div>` : ''}
          ${exo.etapes?.length ? `<strong>Correction</strong><ol class="etapes">${exo.etapes.map(e => `<li>${e}</li>`).join('')}</ol>` : ''}
          ${exo.redaction ? `<strong>Rédaction modèle</strong><div class="redaction">${exo.redaction}</div>` : ''}
        </div>`;
    }
    retour.innerHTML = `${html}<button class="btn" id="suivant">${libelleSuivant}</button>`;
    const btn = $('#suivant', retour);
    btn.addEventListener('click', () => (dernier ? fin() : question()));
    // Entrée pour continuer (ordinateur). Branché au tour suivant, sinon la touche
    // Entrée qui vient de valider passerait aussi à la question suivante.
    setTimeout(() => {
      document.addEventListener('keydown', function entree(e) {
        if (e.key !== 'Enter') return;
        document.removeEventListener('keydown', entree);
        if (!enAttente || !btn.isConnected) return;
        e.preventDefault();
        btn.click();
      });
    }, 0);
    requestAnimationFrame(() => {
      (res.correct ? btn : retour).scrollIntoView({ behavior: 'smooth', block: res.correct ? 'center' : 'start' });
    });
  }

  function evenements(res) {
    if (res.changementNiveau === 'monte') toast(`Niveau ${session.niveau} débloqué 💪`);
    if (res.changementNiveau === 'descend') toast(`On repasse au niveau ${session.niveau} pour consolider`);
    if (res.serieMessage) toast(`🔥 ${res.serieMessage}`);
    if (res.gam.niveauMonte) {
      toast(`${res.gam.nouveauNiveau.emoji} Tu deviens ${res.gam.nouveauNiveau.nom} !`, 3000);
      confettis();
    }
    if (res.gam.badge) {
      toast(`🏅 Chapitre maîtrisé : ${gen.titre} !`, 3000);
      confettis();
    }
    if (res.gam.flammeAllumee) {
      const j = flammeActuelle();
      toast(j > 1 ? `🔥 ${j} jours de révision d'affilée !` : '🔥 Flamme allumée : reviens demain pour la garder !');
    }
    if (res.serieMessage && res.serie % 5 === 0) confettis(16);
  }

  function fin() {
    clearInterval(minuteur);
    const { record } = session.terminer();
    const total = session.index;
    const taux = total ? Math.round((session.bonnes / total) * 100) : 0;
    let titre = 'Bien joué !';
    if (chrono) titre = record ? 'Nouveau record ! 🏆' : 'Défi terminé';
    else if (total === 0) titre = 'À bientôt !';
    if (record) confettis();

    const st = statsChapitre(gen.id);
    zone.innerHTML = `
      <section class="carte centre">
        <h2>${titre}</h2>
        <div class="resultat-grand">${session.bonnes}/${total}</div>
        <div class="stats-ligne">
          <div><strong>${chrono ? fmtChrono(session.temps()) : `${taux} %`}</strong><span>${chrono ? 'temps' : 'réussite'}</span></div>
          <div><strong>${session.meilleureSerie}</strong><span>meilleure série</span></div>
          <div><strong>+${session.xpGagne}</strong><span>XP</span></div>
        </div>
        ${chrono && st.record ? `<p class="doux">Record : ${st.record.score}/${QUESTIONS_CHRONO} en ${fmtChrono(st.record.temps)}</p>` : ''}
      </section>
      <a class="btn" href="${urlChap(mode)}">${chrono ? 'Rejouer le défi' : 'Continuer à m\'entraîner'}</a>
      <a class="btn btn-secondaire" href="${urlChap()}">Retour au chapitre</a>`;
    $('#jauge', app).style.width = chrono ? '100%' : $('#jauge', app).style.width;
    $('#btn-fin', app)?.remove();
    window.scrollTo(0, 0);
  }

  $('#btn-fin', app)?.addEventListener('click', fin);
  if (chrono) minuteur = setInterval(majChrono, 250);
  else if (calculatrice) monterCalculatrice(); // autorisée en entraînement (maths), masquée en défi chrono
  console.info(`[revision-brevet] graine de la session : ${graine} (ajoute &seed=${graine} à l'URL pour la rejouer)`);
  question();
}
