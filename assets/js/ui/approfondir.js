// Fiche « Explique-moi plus » : une fiche par chapitre, une section par carte du cours flash.
// Chargée à la demande depuis <matiere>/approfondir/<chapitre>.js (champ « approfondir » du registre).
// URL : chapitre.html?c=pythagore&mode=approfondir&carte=2#carte-2 (ouvre directement la section 2)
//
// Contenu d'une section : { idee, pourquoi (HTML), animation?: [{ texte, figure }], figure?,
//   pieges: [{ faux, juste }], exemple: { niveau, filtre(cle, exo) }, verif: { niveaux: [n, n], filtre(cle, exo) }, recherche }
// L'exemple guidé et la mini-vérif sont produits par le générateur du chapitre (jamais figés)
// et ne comptent ni dans les statistiques ni dans l'XP.
import { creerRng, graineAleatoire } from '../core/rng.js';
import { profil } from '../core/store.js';
import { tirerContexte } from '../core/contexts.js';
import { verifier, formaterReponse } from '../core/answer.js';
import { $, esc } from './dom.js';
import { rebond, secousse } from './fx.js';
import { htmlSaisie, brancherSaisie, lireSaisie } from './saisie.js';
import { brancherAnimation, htmlAnimation } from './animation.js';

const ESSAIS = 200; // essais pour trouver un exercice du bon type (filtre de la section)

// Exercice du générateur dont la clé correspond à la section (ex. /^pur:\d:hyp/)
export function exerciceFiltre(gen, niveau, rng, filtre, prof = {}) {
  let exo = null;
  for (let k = 0; k < ESSAIS; k++) {
    exo = gen.generer(niveau, rng, tirerContexte(rng, prof));
    if (!filtre || filtre(exo.cle, exo)) return exo;
  }
  return exo;
}

// Lien « Pour aller plus loin » : par défaut, recherche des vidéos d'Yvan Monka (maths).
// Une fiche peut fournir son propre lien : fiche.lien(recherche) → { texte, url } (ex. sciences).
export function lienMonka(recherche) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`Yvan Monka ${recherche}`)}`;
}
export function lienParDefaut(recherche) {
  return { texte: `Vidéos d'Yvan Monka : « ${recherche} »`, url: lienMonka(recherche) };
}

export async function ecranApprofondir({ app, gen, urlChap, entree, params }) {
  let fiche;
  try {
    fiche = (await entree.approfondir()).default;
  } catch (e) {
    console.error(e);
    app.innerHTML = '<div class="carte"><h2>Oups</h2><p>La fiche n\'a pas pu se charger. Vérifie ta connexion et recharge la page.</p></div>';
    return;
  }
  const rng = creerRng(graineAleatoire());
  const prof = profil();
  const carte = Math.min(Math.max(Number(params.get('carte')) || 0, 0), fiche.sections.length - 1);
  document.title = `Explique-moi plus · ${gen.titre}`;

  app.innerHTML = `
    <header class="barre-haut">
      <a class="btn-icone" href="${urlChap('cours')}&carte=${carte}" aria-label="Retour au cours">‹</a>
      <div class="titre">🔎 ${esc(gen.titre)}</div>
    </header>
    <nav class="sommaire" aria-label="Sommaire">
      ${fiche.sections.map((s, k) => `<a class="puce" href="#carte-${k}">${esc(gen.cours[k]?.titre || s.titre)}</a>`).join('')}
    </nav>
    ${fiche.sections.map((s, k) => `
      <section class="carte fiche" id="carte-${k}">
        <h2>${esc(gen.cours[k]?.titre || s.titre)}</h2>
        <h3>💡 L'idée en une phrase</h3>
        <p class="fiche-idee">${s.idee}</p>
        <h3>🔍 Pourquoi ça marche</h3>
        <div>${s.pourquoi}</div>
        ${s.animation ? htmlAnimation() : s.figure || ''}
        <h3>✍️ Exemple guidé</h3>
        <div class="exemple-guide" data-k="${k}"></div>
        <h3>⚠️ Les pièges</h3>
        <ul class="pieges">${s.pieges.map(p => `<li><span class="faux">✗ ${p.faux}</span><span class="juste">✓ ${p.juste}</span></li>`).join('')}</ul>
        <h3>✅ Mini-vérif</h3>
        <div class="mini-verif" data-k="${k}">
          <button type="button" class="btn" data-verif="${k}">Je vérifie (2 questions)</button>
        </div>
        <h3>▶️ Pour aller plus loin</h3>
        <a class="lien-externe" href="${(fiche.lien || lienParDefaut)(s.recherche).url}" target="_blank" rel="noopener">${esc((fiche.lien || lienParDefaut)(s.recherche).texte)} ↗</a>
        <p class="doux petit">S'ouvre sur YouTube (il faut être en ligne).</p>
        <a class="btn btn-secondaire" href="${urlChap('cours')}&carte=${k}">‹ Retour à la carte</a>
      </section>`).join('')}
    <a class="btn" href="${urlChap('entrainement')}">Je m'entraîne 🎯</a>`;

  fiche.sections.forEach((s, k) => {
    const sec = $(`#carte-${k}`, app);
    if (s.animation) brancherAnimation($('.anim', sec), s.animation);
    exempleGuide($('.exemple-guide', sec), s);
  });

  // Mini-vérif : une seule à la fois (la saisie utilise des identifiants uniques)
  let verifOuverte = null;
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-verif]');
    if (!b) return;
    const k = Number(b.dataset.verif);
    if (verifOuverte !== null && verifOuverte !== k) fermerVerif($(`.mini-verif[data-k="${verifOuverte}"]`, app), verifOuverte);
    verifOuverte = k;
    miniVerif($(`.mini-verif[data-k="${k}"]`, app), fiche.sections[k], k, () => { verifOuverte = null; });
  });

  // Défilement vers la section demandée (ancre)
  const cible = $(location.hash && /^#carte-\d+$/.test(location.hash) ? location.hash : `#carte-${carte}`, app);
  if (cible) requestAnimationFrame(() => cible.scrollIntoView({ block: 'start' }));

  // ---------- Exemple guidé : la correction se dévoile étape par étape ----------

  function exempleGuide(zone, s) {
    const exo = exerciceFiltre(gen, s.exemple.niveau, rng, s.exemple.filtre, prof);
    const etapes = [...(exo.etapes || [])];
    if (exo.redaction) etapes.push(`<strong>Rédaction modèle</strong><div class="redaction">${exo.redaction}</div>`);
    let vus = 0;
    zone.innerHTML = `
      <div class="enonce">${exo.enonce}</div>
      ${exo.figure || ''}
      <ol class="etapes"></ol>
      <div class="exemple-actions">
        <button type="button" class="btn" data-action="etape">Étape suivante (1/${etapes.length})</button>
        <button type="button" class="btn btn-secondaire" data-action="autre">🔁 Un autre exemple</button>
      </div>`;
    const liste = $('.etapes', zone);
    const btn = $('[data-action="etape"]', zone);
    btn.addEventListener('click', () => {
      liste.insertAdjacentHTML('beforeend', `<li>${etapes[vus]}</li>`);
      vus++;
      if (vus >= etapes.length) {
        btn.remove();
        liste.insertAdjacentHTML('afterend', `<p class="reponse-exemple">Réponse : <strong>${esc(formaterReponse(exo))}${exo.unite ? ' ' + esc(exo.unite) : ''}</strong></p>`);
      } else btn.textContent = `Étape suivante (${vus + 1}/${etapes.length})`;
    });
    $('[data-action="autre"]', zone).addEventListener('click', () => exempleGuide(zone, s));
  }

  // ---------- Mini-vérif : 2 questions, correction immédiate, hors statistiques ----------

  function fermerVerif(zone, k) {
    zone.innerHTML = `<button type="button" class="btn" data-verif="${k}">Je vérifie (2 questions)</button>`;
  }

  function miniVerif(zone, s, k, onFin) {
    const questions = s.verif.niveaux.map(n => exerciceFiltre(gen, n, rng, s.verif.filtre, prof));
    let q = 0, bonnes = 0;

    function poser() {
      const exo = questions[q];
      zone.innerHTML = `
        <p class="doux petit">Question ${q + 1}/${questions.length}</p>
        <div class="enonce">${exo.enonce}</div>
        ${exo.figure || ''}
        ${htmlSaisie(exo)}
        <p class="aide-saisie" id="aide"></p>
        <button type="button" class="btn" id="valider">Valider</button>
        <div id="retour-verif"></div>`;
      let fini = false;
      const valider = () => {
        if (fini) return;
        const v = verifier(exo, lireSaisie(zone));
        if (!v.valide) { $('#aide', zone).textContent = v.message; return; }
        fini = true;
        if (v.correct) bonnes++;
        $('#valider', zone).remove();
        zone.querySelectorAll('.touches button, .qcm button, .ordre button').forEach(b => { b.disabled = true; });
        const champ = $('#champ', zone);
        if (champ) { champ.readOnly = true; champ.classList.add(v.correct ? 'ok' : 'ko'); champ.blur(); }
        zone.querySelectorAll('.qcm button').forEach(b => {
          if (b.dataset.valeur === String(exo.reponse)) b.classList.add('bonne');
          else if (b.classList.contains('choisi')) b.classList.add('fausse');
        });
        const unite = exo.unite ? ` ${esc(exo.unite)}` : '';
        $('#retour-verif', zone).innerHTML = `
          <div class="retour ${v.correct ? 'bon' : 'faux'}">
            <div class="titre-retour">${v.correct ? '✓ Bien vu !' : v.presque ? 'Presque !' : 'Pas tout à fait'}</div>
            ${v.correct ? '' : `<p>La bonne réponse : <strong>${esc(formaterReponse(exo))}${unite}</strong></p>
              ${v.erreur ? `<div class="erreur-probable">💡 ${v.erreur}</div>` : ''}
              <ol class="etapes">${(exo.etapes || []).map(e => `<li>${e}</li>`).join('')}</ol>`}
          </div>
          <button type="button" class="btn" id="suite">${q + 1 < questions.length ? 'Question suivante' : 'Terminer'}</button>`;
        (v.correct ? rebond : secousse)($('.retour', zone));
        $('#suite', zone).addEventListener('click', () => {
          q++;
          if (q < questions.length) poser();
          else bilan();
        });
      };
      brancherSaisie(zone, { onEntree: valider, verrouille: () => fini });
      $('#valider', zone).addEventListener('click', valider);
    }

    function bilan() {
      const n = questions.length;
      zone.innerHTML = `
        <div class="retour ${bonnes === n ? 'bon' : 'faux'}">
          <div class="titre-retour">${bonnes}/${n} ${bonnes === n ? '— c\'est compris 🎉' : bonnes ? '— presque, relis l\'exemple guidé' : '— relis l\'idée et l\'exemple, puis réessaie'}</div>
        </div>
        <button type="button" class="btn btn-secondaire" data-verif="${k}">🔁 Deux autres questions</button>`;
      onFin();
    }

    poser();
  }
}
