// Effets visuels courts. Tout est coupé si prefers-reduced-motion est actif.

function mouvementReduit() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function rejouer(el, classe) {
  if (!el || mouvementReduit()) return;
  el.classList.remove(classe);
  void el.offsetWidth; // relance l'animation
  el.classList.add(classe);
}

export const rebond = el => rejouer(el, 'anim-rebond');
export const secousse = el => rejouer(el, 'anim-secousse');

// Confettis légers (séries, niveaux, records)
export function confettis(nombre = 28) {
  if (mouvementReduit()) return;
  const couleurs = ['#8b5cf6', '#c4b5fd', '#34d399', '#fbbf24', '#fb7185', '#38bdf8'];
  for (let i = 0; i < nombre; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = couleurs[i % couleurs.length];
    c.style.setProperty('--dx', `${(Math.random() - 0.5) * 120}px`);
    c.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`);
    c.style.setProperty('--duree', `${700 + Math.random() * 500}ms`);
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1300);
  }
}
