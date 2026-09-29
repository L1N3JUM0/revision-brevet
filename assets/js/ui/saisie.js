// Saisie d'une réponse : champ texte (avec touches ±, /, ;) ou boutons de QCM.
// Partagé par la page chapitre et le contrôle blanc.
import { esc } from './dom.js';

// HTML du champ adapté au type d'exercice. valeur : saisie à réafficher (contrôle blanc).
export function htmlSaisie(exo, valeur = '') {
  if (exo.type === 'qcm') {
    return `<div class="qcm" id="qcm">${exo.choix.map(c =>
      `<button type="button" data-valeur="${esc(c)}" class="${c === valeur ? 'choisi' : ''}">${esc(c)}</button>`).join('')}</div>`;
  }
  const clavier = exo.type === 'duree' || exo.type === 'texte-court' || exo.type === 'point' ? 'text' : 'decimal';
  const touches = [];
  if (exo.type === 'nombre' || exo.type === 'fraction') touches.push('<button type="button" data-touche="signe" aria-label="Changer le signe">±</button>');
  if (exo.type === 'fraction') touches.push('<button type="button" data-touche="/" aria-label="Barre de fraction">/</button>');
  if (exo.type === 'point') touches.push('<button type="button" data-touche=";">;</button>', '<button type="button" data-touche="-">−</button>');
  return `
    <div class="saisie">
      <input class="champ" id="champ" type="text" inputmode="${clavier}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-label="Ta réponse" placeholder="Ta réponse" value="${esc(valeur)}">
      ${exo.unite ? `<span class="unite">${esc(exo.unite)}</span>` : ''}
    </div>
    ${touches.length ? `<div class="touches">${touches.join('')}</div>` : ''}`;
}

/**
 * Branche les comportements (Entrée, touches, choix du QCM) dans « racine ».
 * onEntree : appelé quand on appuie sur Entrée dans le champ.
 * verrouille : fonction qui renvoie true quand le QCM ne doit plus changer (correction affichée).
 */
export function brancherSaisie(racine, { onEntree = () => {}, verrouille = () => false } = {}) {
  const champ = racine.querySelector('#champ');
  if (champ) {
    champ.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); onEntree(); }
    });
    racine.querySelectorAll('[data-touche]').forEach(b => {
      // pointerdown + preventDefault : le champ garde le focus (clavier iOS ouvert)
      b.addEventListener('pointerdown', e => e.preventDefault());
      b.addEventListener('click', () => {
        const t = b.dataset.touche;
        if (t === 'signe') {
          const v = champ.value.trim();
          champ.value = /^[-−]/.test(v) ? v.replace(/^[-−]\s*/, '') : '-' + v;
        } else {
          const deb = champ.selectionStart ?? champ.value.length;
          const fin = champ.selectionEnd ?? champ.value.length;
          champ.value = champ.value.slice(0, deb) + t + champ.value.slice(fin);
          champ.setSelectionRange(deb + t.length, deb + t.length);
        }
        champ.focus();
      });
    });
  }
  const qcm = racine.querySelector('#qcm');
  if (qcm) {
    qcm.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || verrouille()) return;
      qcm.querySelectorAll('button').forEach(x => x.classList.toggle('choisi', x === b));
    });
  }
}

export function lireSaisie(racine) {
  const champ = racine.querySelector('#champ');
  if (champ) return champ.value;
  const choisi = racine.querySelector('.qcm .choisi');
  return choisi ? choisi.dataset.valeur : '';
}
