// Lecteur d'animation étape par étape (‹ ▶ ›) : cours flash et fiches « Explique-moi plus ».

// Animation étape par étape d'une carte de cours : c.animation = [{ texte, figure }]
export function brancherAnimation(zone, etapes) {
  let k = 0;
  let minuteur = null;
  const figure = zone.querySelector('.anim-figure');
  const texte = zone.querySelector('.anim-texte');
  const compteur = zone.querySelector('.anim-compteur');
  const montrer = () => {
    figure.innerHTML = etapes[k].figure;
    texte.innerHTML = etapes[k].texte;
    compteur.textContent = `Étape ${k + 1}/${etapes.length}`;
    zone.querySelector('[data-anim="prec"]').disabled = k === 0;
    zone.querySelector('[data-anim="suiv"]').disabled = k === etapes.length - 1;
  };
  const stop = () => { clearInterval(minuteur); minuteur = null; zone.querySelector('[data-anim="lecture"]').textContent = '▶'; };
  zone.addEventListener('click', e => {
    const b = e.target.closest('[data-anim]');
    if (!b) return;
    e.stopPropagation();
    if (b.dataset.anim === 'prec' && k > 0) { stop(); k--; }
    else if (b.dataset.anim === 'suiv' && k < etapes.length - 1) { stop(); k++; }
    else if (b.dataset.anim === 'lecture') {
      if (minuteur) { stop(); return; }
      if (k === etapes.length - 1) k = 0;
      b.textContent = '⏸';
      minuteur = setInterval(() => {
        if (k < etapes.length - 1) { k++; montrer(); } else stop();
      }, 1600);
    }
    montrer();
  });
  // Les gestes de balayage dans l'animation ne changent pas de carte
  zone.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
  zone.addEventListener('touchend', e => e.stopPropagation());
  montrer();
  return stop;
}

export function htmlAnimation() {
  return `<div class="anim">
      <div class="anim-figure"></div>
      <p class="anim-texte"></p>
      <div class="anim-nav">
        <button type="button" class="btn-icone" data-anim="prec" aria-label="Étape précédente">‹</button>
        <span class="anim-compteur doux petit"></span>
        <button type="button" class="btn-icone" data-anim="lecture" aria-label="Lecture automatique">▶</button>
        <button type="button" class="btn-icone" data-anim="suiv" aria-label="Étape suivante">›</button>
      </div>
    </div>`;
}
