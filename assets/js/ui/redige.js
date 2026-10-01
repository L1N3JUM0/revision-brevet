// Exercices à réponses rédigées, au format du DNB 2027 (voir docs/attendus-2027.md) :
// étude de document en histoire, situation pratique en EMC…
// Une question par écran, documents toujours accessibles, puis indices automatiques,
// corrigé modèle et autoévaluation par checklist. Hors statistiques et XP (autoévaluation).
//
// Sujet produit par un module « redige » (champ du registre : redige: () => import(…)) :
// export default { libelle, emoji, description, generer(rng, ctx) → sujet }
// sujet = { cle, titre, intro?, documents: [{ titre, html, source }], questions: [question] }
// question = { partie, consigne, doc?, corrige,
//   type: 'date'  → { annee, date? } : réponse courte corrigée automatiquement (l'année suffit)
//   type: 'redige' → { phrases?: [min, max|null], lignes?: n, mots?: [[variante, …], …], repere?: bool,
//                      checklist?: [texte, …] } }
import { creerRng, graineAleatoire } from '../core/rng.js';
import { profil } from '../core/store.js';
import { tirerContexte } from '../core/contexts.js';
import { $, esc } from './dom.js';
import { rebond, secousse } from './fx.js';
import { analyserReponse, verifierDate, compterPhrases } from '../core/redaction.js';

// Les 4 critères officiels de maîtrise de la langue (docs/attendus-2027.md)
export const CHECKLIST_LANGUE = [
  'Orthographe : j\'ai relu les accords (sujet-verbe, groupe nominal) et les homophones (a/à, et/est, son/sont…).',
  'Syntaxe : mes phrases sont complètes (majuscule, verbe, point), avec au moins une subordonnée ou un connecteur.',
  'Lexique : j\'ai employé le vocabulaire précis de la matière.',
  'Organisation : ma réponse suit un fil (idée, justification, conclusion) avec des connecteurs (car, donc, or, ainsi…).'
];

// Checklist de base d'une réponse rédigée (étude de document)
export const CHECKLIST_REPONSE = {
  phrase: 'J\'ai répondu par des phrases complètes.',
  vocabulaire: 'J\'ai utilisé le vocabulaire de la leçon.',
  document: 'J\'ai tiré au moins une information du document (citée entre guillemets ou reformulée).',
  repere: 'J\'ai cité un repère (une date, un personnage, un lieu).'
};


export async function ecranRedige({ app, gen, urlChap, entree }) {
  let module;
  try {
    module = (await entree.redige()).default;
  } catch (e) {
    console.error(e);
    app.innerHTML = '<div class="carte"><h2>Oups</h2><p>Le sujet n\'a pas pu se charger. Vérifie ta connexion et recharge la page.</p></div>';
    return;
  }
  const rng = creerRng(graineAleatoire());
  let sujet, q, reponses, etats;

  function nouveauSujet() {
    sujet = module.generer(rng, tirerContexte(rng, profil()));
    q = 0;
    reponses = sujet.questions.map(() => '');
    etats = sujet.questions.map(() => null); // null | { correct?, coches: [] }
    afficher();
  }

  const htmlDocuments = ouvert => (!sujet.documents?.length ? '' : `
    <details class="replie documents"${ouvert ? ' open' : ''}>
      <summary>📄 ${sujet.documents.length > 1 ? `Les ${sujet.documents.length} documents` : 'Le document'}</summary>
      ${sujet.documents.map((d, k) => `
        <section class="document">
          <h3>Document ${k + 1} : ${d.titre}</h3>
          <div class="document-corps">${d.html}</div>
          <p class="source">${d.source}</p>
        </section>`).join('')}
    </details>`);

  function afficher() {
    const question = sujet.questions[q];
    const n = sujet.questions.length;
    const etat = etats[q];
    const partiePrecedente = q > 0 ? sujet.questions[q - 1].partie : null;
    app.innerHTML = `
      <header class="barre-haut">
        <a class="btn-icone" href="${urlChap()}" aria-label="Quitter">✕</a>
        <div class="titre">${esc(module.libelle)}</div>
        <span class="doux petit">${q + 1}/${n}</span>
      </header>
      <div class="jauge"><span style="width: ${Math.round((q / n) * 100)}%"></span></div>
      ${q === 0 ? `<h2 style="margin-top: 16px;">${sujet.titre}</h2>${sujet.intro ? `<p class="doux">${sujet.intro}</p>` : ''}` : ''}
      ${htmlDocuments(q === 0)}
      <article class="carte">
        ${question.partie !== partiePrecedente || q === 0 ? `<p class="badge">${esc(question.partie)}</p>` : `<p class="doux petit">${esc(question.partie)}</p>`}
        <p class="consigne"><strong>${question.consigne}</strong></p>
        ${question.type === 'date'
          ? `<input class="champ" id="rep" type="text" inputmode="text" autocomplete="off" placeholder="Par exemple : 8 mai 1945" value="${esc(reponses[q])}" ${etat ? 'readonly' : ''}>`
          : `<textarea class="champ zone-redaction" id="rep" rows="${question.lignes ? 12 : question.phrases?.[0] >= 4 ? 8 : 4}" placeholder="Rédige ta réponse ici…" ${etat ? 'readonly' : ''}>${esc(reponses[q])}</textarea>
             <p class="doux petit" id="compteur"></p>`}
        <p class="aide-saisie" id="aide"></p>
        <div id="retour">${etat ? retourHtml(question, etat) : ''}</div>
        ${etat ? '' : `<button class="btn" id="valider">${question.type === 'date' ? 'Valider' : 'J\'ai fini : voir le corrigé'}</button>`}
      </article>
      <div class="nav-cours">
        <button class="btn btn-secondaire" id="prec" ${q === 0 ? 'disabled' : ''}>‹ Avant</button>
        ${q < n - 1 ? `<button class="btn" id="suiv" ${etat ? '' : 'disabled'}>Suivant ›</button>` : `<button class="btn" id="bilan" ${etat ? '' : 'disabled'}>Mon bilan</button>`}
      </div>`;
    const champ = $('#rep', app);
    const compteur = $('#compteur', app);
    const majCompteur = () => {
      if (!compteur) return;
      const nb = compterPhrases(champ.value), mots = champ.value.trim().split(/\s+/).filter(Boolean).length;
      compteur.textContent = `${nb} phrase${nb > 1 ? 's' : ''} · ${mots} mot${mots > 1 ? 's' : ''}${question.lignes ? ` · environ ${Math.round(mots / 10)} lignes` : ''}`;
    };
    champ.addEventListener('input', () => { reponses[q] = champ.value; majCompteur(); });
    majCompteur();
    $('#valider', app)?.addEventListener('click', valider);
    $('#prec', app).addEventListener('click', () => { q--; afficher(); });
    $('#suiv', app)?.addEventListener('click', () => { q++; afficher(); });
    $('#bilan', app)?.addEventListener('click', bilan);
    brancherChecklist();
    window.scrollTo(0, 0);
  }

  function valider() {
    const question = sujet.questions[q];
    const texte = reponses[q].trim();
    if (question.type === 'date') {
      const v = verifierDate(texte, question);
      if (!v.valide) { $('#aide', app).textContent = v.message; secousse($('#rep', app)); return; }
      etats[q] = { correct: v.correct, coches: [] };
    } else {
      if (texte.split(/\s+/).filter(Boolean).length < 3) { $('#aide', app).textContent = 'Écris au moins une phrase avant de voir le corrigé.'; secousse($('#rep', app)); return; }
      etats[q] = { coches: [], indices: analyserReponse(texte, question) };
    }
    afficher();
    const r = $('#retour .retour', app);
    if (r) (etats[q].correct === false ? secousse : rebond)(r);
  }

  function checklistDe(question) {
    if (question.type === 'date') return [];
    const base = question.checklist || [CHECKLIST_REPONSE.phrase, CHECKLIST_REPONSE.vocabulaire, CHECKLIST_REPONSE.document, ...(question.repere ? [CHECKLIST_REPONSE.repere] : [])];
    const longue = (question.phrases?.[0] || 0) >= 4 || question.lignes;
    return longue ? [...base, ...CHECKLIST_LANGUE] : base;
  }

  function retourHtml(question, etat) {
    if (question.type === 'date') {
      return `<div class="retour ${etat.correct ? 'bon' : 'faux'}">
          <div class="titre-retour">${etat.correct ? '✓ Bien vu !' : 'Pas tout à fait'}</div>
          <p>${question.corrige}</p>
        </div>`;
    }
    const liste = checklistDe(question);
    return `
      <div class="retour neutre">
        <div class="titre-retour">Indices sur ta réponse</div>
        <ul class="indices">${etat.indices.map(i => `<li class="${i.ok ? 'ok' : 'ko'}">${i.ok ? '✓' : '•'} ${i.texte}</li>`).join('')}</ul>
      </div>
      <h3>Corrigé modèle</h3>
      <div class="redaction">${question.corrige.split(/\n\n+/).map(p => `<p>${p}</p>`).join('')}</div>
      <h3>Je m'autoévalue</h3>
      <ul class="checklist">${liste.map((c, k) => `<li><label><input type="checkbox" data-coche="${k}" ${etat.coches.includes(k) ? 'checked' : ''}><span>${c}</span></label></li>`).join('')}</ul>`;
  }

  function brancherChecklist() {
    app.querySelectorAll('[data-coche]').forEach(c => c.addEventListener('change', () => {
      const k = Number(c.dataset.coche);
      const coches = etats[q].coches;
      if (c.checked && !coches.includes(k)) coches.push(k);
      if (!c.checked) etats[q].coches = coches.filter(x => x !== k);
    }));
  }

  function bilan() {
    const dates = sujet.questions.map((x, k) => [x, etats[k]]).filter(([x]) => x.type === 'date');
    const justes = dates.filter(([, e]) => e?.correct).length;
    const redigees = sujet.questions.map((x, k) => [x, etats[k]]).filter(([x]) => x.type !== 'date');
    const coches = redigees.reduce((s, [x, e]) => s + (e?.coches.length || 0), 0);
    const total = redigees.reduce((s, [x]) => s + checklistDe(x).length, 0);
    app.innerHTML = `
      <header class="barre-haut">
        <a class="btn-icone" href="${urlChap()}" aria-label="Retour">‹</a>
        <div class="titre">Mon bilan</div>
      </header>
      <section class="carte">
        <div class="stats-ligne">
          ${dates.length ? `<div><strong>${justes}/${dates.length}</strong><span>repères justes</span></div>` : ''}
          <div><strong>${redigees.length}</strong><span>réponses rédigées</span></div>
          <div><strong>${total ? Math.round((coches / total) * 100) : 0} %</strong><span>de la checklist</span></div>
        </div>
        <p class="doux">${coches === total ? 'Toutes les cases cochées : ta rédaction est au niveau du brevet.' : 'Relis les corrigés modèles : les cases non cochées te montrent quoi travailler.'}</p>
      </section>
      <button class="btn" id="autre">🔁 Un autre sujet</button>
      <a class="btn btn-secondaire" href="${urlChap()}">Retour au chapitre</a>`;
    $('#autre', app).addEventListener('click', nouveauSujet);
  }

  nouveauSujet();
}
