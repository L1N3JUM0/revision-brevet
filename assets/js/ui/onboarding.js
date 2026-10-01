// Onboarding du profil : prénom → accords → thèmes favoris (3 à 5) → amis (facultatif).
// Une idée par écran. Le pack Anna (prénom Anna) fournit ses thèmes : l'étape des thèmes est sautée.
import { charger, definirProfil } from '../core/store.js';
import { THEMES, packActif } from '../core/contexts.js';
import { esc } from './dom.js';

const MIN_THEMES = 3, MAX_THEMES = 5, MAX_AMIS = 6;

export function afficherOnboarding(zone, { onFin, onAnnuler = null }) {
  const p = charger().profil;
  const brouillon = {
    prenom: p.prenom || '',
    genre: p.genre || '',
    themes: (p.themes || []).filter(t => THEMES.some(x => x.id === t)),
    amis: (p.amis || []).map(a => ({ ...a }))
  };
  let etape = 0;

  const etapes = () => (packActif({ prenom: brouillon.prenom, pack: p.packUrl ? 'anna' : null }) ? ['prenom', 'genre', 'amis'] : ['prenom', 'genre', 'themes', 'amis']);

  function tete(titre) {
    const liste = etapes();
    return `<div class="onb-tete">
        ${etape > 0 || onAnnuler ? '<button type="button" class="btn-icone" id="onb-retour" aria-label="Retour">‹</button>' : '<span></span>'}
        <div class="points">${liste.map((_, k) => `<span class="${k === etape ? 'actif' : ''}"></span>`).join('')}</div>
        <span></span>
      </div>
      <h2>${titre}</h2>`;
  }

  function afficher() {
    const nom = etapes()[etape];
    if (nom === 'prenom') {
      zone.innerHTML = `${tete('Salut ! Comment tu t\'appelles ?')}
        <p class="doux">Ton prénom apparaîtra dans les exercices. Il reste sur ton téléphone.</p>
        <form id="onb-form">
          <input class="champ" id="onb-prenom" type="text" autocomplete="given-name" maxlength="30" placeholder="Ton prénom" required value="${esc(brouillon.prenom)}">
          <button class="btn" type="submit" style="margin-top: 16px;">Continuer</button>
        </form>`;
      zone.querySelector('#onb-form').addEventListener('submit', ev => {
        ev.preventDefault();
        const v = zone.querySelector('#onb-prenom').value.trim();
        if (!v) return;
        brouillon.prenom = v;
        suivant();
      });
    } else if (nom === 'genre') {
      const choix = [['f', 'Au féminin', '« Tu es prête ! »'], ['m', 'Au masculin', '« Tu es prêt ! »'], ['n', 'Peu importe', 'Les exercices parleront d\'autres personnes']];
      zone.innerHTML = `${tete('Comment on accorde les phrases ?')}
        <p class="doux">Pour les niveaux et les exercices où tu apparais.</p>
        <div class="choix-genre">${choix.map(([v, t, ex]) => `<button type="button" class="carte carte-lien${brouillon.genre === v ? ' choisi' : ''}" data-genre="${v}">
          <span class="corps"><strong>${t}</strong><span class="doux petit">${ex}</span></span></button>`).join('')}</div>`;
      zone.querySelectorAll('[data-genre]').forEach(b => b.addEventListener('click', () => {
        brouillon.genre = b.dataset.genre;
        suivant();
      }));
    } else if (nom === 'themes') {
      zone.innerHTML = `${tete('Qu\'est-ce que tu aimes ?')}
        <p class="doux">Choisis de ${MIN_THEMES} à ${MAX_THEMES} thèmes : les exercices en parleront.</p>
        <div class="puces">${THEMES.map(t => `<button type="button" class="puce${brouillon.themes.includes(t.id) ? ' actif' : ''}" data-theme="${t.id}" aria-pressed="${brouillon.themes.includes(t.id)}">${t.emoji} ${esc(t.nom)}</button>`).join('')}</div>
        <p class="doux petit centre" id="onb-compte"></p>
        <button class="btn" type="button" id="onb-suivant">Continuer</button>`;
      const maj = () => {
        const n = brouillon.themes.length;
        zone.querySelector('#onb-compte').textContent = `${n} / ${MAX_THEMES} choisi${n > 1 ? 's' : ''}${n < MIN_THEMES ? ` · encore ${MIN_THEMES - n} au moins` : ''}`;
        zone.querySelector('#onb-suivant').disabled = n < MIN_THEMES;
      };
      zone.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => {
        const id = b.dataset.theme;
        if (brouillon.themes.includes(id)) brouillon.themes = brouillon.themes.filter(x => x !== id);
        else if (brouillon.themes.length < MAX_THEMES) brouillon.themes.push(id);
        b.classList.toggle('actif', brouillon.themes.includes(id));
        b.setAttribute('aria-pressed', brouillon.themes.includes(id));
        maj();
      }));
      zone.querySelector('#onb-suivant').addEventListener('click', suivant);
      maj();
    } else {
      zone.innerHTML = `${tete('Tes amis (facultatif)')}
        <p class="doux">Leurs prénoms apparaîtront aussi dans les exercices.</p>
        <div id="onb-amis"></div>
        <button type="button" class="btn-lien" id="onb-ajouter">+ Ajouter un ami ou une amie</button>
        <button class="btn" type="button" id="onb-fin" style="margin-top: 16px;">C'est parti !</button>`;
      const liste = zone.querySelector('#onb-amis');
      const dessiner = () => {
        liste.innerHTML = brouillon.amis.map((a, i) => `<div class="ami-ligne">
            <input class="champ" type="text" maxlength="30" placeholder="Prénom" value="${esc(a.prenom)}" data-i="${i}" aria-label="Prénom">
            <div class="segments">${[['f', 'elle'], ['m', 'il']].map(([g, t]) => `<button type="button" class="segment${a.genre === g ? ' actif' : ''}" data-i="${i}" data-g="${g}">${t}</button>`).join('')}</div>
            <button type="button" class="btn-icone" data-suppr="${i}" aria-label="Retirer">✕</button>
          </div>`).join('');
        zone.querySelector('#onb-ajouter').classList.toggle('cache', brouillon.amis.length >= MAX_AMIS);
      };
      liste.addEventListener('input', e => { if (e.target.dataset.i) brouillon.amis[e.target.dataset.i].prenom = e.target.value; });
      liste.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.dataset.suppr !== undefined) brouillon.amis.splice(Number(b.dataset.suppr), 1);
        else if (b.dataset.g) brouillon.amis[b.dataset.i].genre = b.dataset.g;
        dessiner();
      });
      zone.querySelector('#onb-ajouter').addEventListener('click', () => {
        brouillon.amis.push({ prenom: '', genre: 'f' });
        dessiner();
        liste.querySelector('.ami-ligne:last-child input')?.focus();
      });
      zone.querySelector('#onb-fin').addEventListener('click', () => {
        definirProfil(brouillon);
        onFin();
      });
      dessiner();
    }
    zone.querySelector('#onb-retour')?.addEventListener('click', () => {
      if (etape > 0) { etape--; afficher(); } else onAnnuler?.();
    });
    window.scrollTo(0, 0);
  }

  function suivant() {
    etape = Math.min(etape + 1, etapes().length - 1);
    afficher();
  }

  afficher();
}
