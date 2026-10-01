// Enregistre le service worker (sw.js, à la racine du site) pour le mode hors ligne.
// Importé par store.js, donc par toutes les pages. Rien ne se passe sous Node ou sur la page de tests.
try {
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !location.pathname.includes('/tests/')) {
    const racine = new URL('../../../', import.meta.url);
    navigator.serviceWorker.register(new URL('sw.js', racine), { scope: racine.pathname }).catch(() => {
      // navigation privée, http… : le site marche quand même, en ligne seulement
    });
  }
} catch { /* environnement sans service worker */ }
