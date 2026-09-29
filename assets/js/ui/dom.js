// Petits utilitaires d'affichage.

export const $ = (sel, racine = document) => racine.querySelector(sel);

// Échappe du texte saisi par l'utilisatrice avant de l'insérer en HTML
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Toast éphémère en haut de l'écran
export function toast(texte, duree = 2200) {
  let zone = $('.toasts');
  if (!zone) {
    zone = document.createElement('div');
    zone.className = 'toasts';
    zone.setAttribute('aria-live', 'polite');
    document.body.appendChild(zone);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = texte;
  zone.appendChild(t);
  setTimeout(() => {
    t.classList.add('sortie');
    setTimeout(() => t.remove(), 300);
  }, duree);
}

// Durée en ms -> « 1:05 »
export function fmtChrono(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
