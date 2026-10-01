// Service worker : le site fonctionne hors ligne après une première visite.
// Stratégie « réseau d'abord » : en ligne, on sert toujours la dernière version publiée
// (puis on met le cache à jour) ; hors ligne ou réseau trop lent, on sert le cache.
// VERSION et FICHIERS sont mis à jour par : node tests/verifier-sw.mjs --maj
// (à lancer avant chaque commit ; sans --maj, le script vérifie seulement).

const VERSION = 'dd65434f705a';
const CACHE = `revision-brevet-${VERSION}`;
const DELAI_RESEAU = 4000; // ms avant de se rabattre sur le cache

// FICHIERS-DEBUT
const FICHIERS = [
  './',
  'assets/css/base.css',
  'assets/js/core/answer.js',
  'assets/js/core/contexts.js',
  'assets/js/core/engine.js',
  'assets/js/core/gamification.js',
  'assets/js/core/hors-ligne.js',
  'assets/js/core/rng.js',
  'assets/js/core/store.js',
  'assets/js/core/svg.js',
  'assets/js/ui/animation.js',
  'assets/js/ui/approfondir.js',
  'assets/js/ui/calculatrice.js',
  'assets/js/ui/chapitre.js',
  'assets/js/ui/controle.js',
  'assets/js/ui/dom.js',
  'assets/js/ui/fx.js',
  'assets/js/ui/onboarding.js',
  'assets/js/ui/saisie.js',
  'histoire/chapitre.html',
  'histoire/chapitres.js',
  'histoire/controle.html',
  'histoire/donnees/cinquieme-republique.js',
  'histoire/donnees/decolonisation.js',
  'histoire/donnees/entre-deux-guerres.js',
  'histoire/donnees/europe.js',
  'histoire/donnees/france-occupee.js',
  'histoire/donnees/guerre-froide.js',
  'histoire/donnees/index.js',
  'histoire/donnees/monde-apres-1989.js',
  'histoire/donnees/premiere-guerre.js',
  'histoire/donnees/refonder-republique.js',
  'histoire/donnees/seconde-guerre.js',
  'histoire/donnees/societe-1950-1980.js',
  'histoire/generators/cinquieme-republique.js',
  'histoire/generators/decolonisation.js',
  'histoire/generators/entre-deux-guerres.js',
  'histoire/generators/europe.js',
  'histoire/generators/fabrique.js',
  'histoire/generators/france-occupee.js',
  'histoire/generators/guerre-froide.js',
  'histoire/generators/monde-apres-1989.js',
  'histoire/generators/premiere-guerre.js',
  'histoire/generators/refonder-republique.js',
  'histoire/generators/reperes.js',
  'histoire/generators/seconde-guerre.js',
  'histoire/generators/societe-1950-1980.js',
  'histoire/index.html',
  'index.html',
  'maths/approfondir/angles.js',
  'maths/approfondir/constructions.js',
  'maths/approfondir/conversions-durees.js',
  'maths/approfondir/conversions-longueurs.js',
  'maths/approfondir/fractions.js',
  'maths/approfondir/pythagore.js',
  'maths/approfondir/relatifs.js',
  'maths/approfondir/scratch.js',
  'maths/approfondir/thales.js',
  'maths/approfondir/vitesses.js',
  'maths/chapitre.html',
  'maths/chapitres.js',
  'maths/controle.html',
  'maths/generators/angles.js',
  'maths/generators/constructions.js',
  'maths/generators/conversions-durees.js',
  'maths/generators/conversions-longueurs.js',
  'maths/generators/fractions.js',
  'maths/generators/pythagore.js',
  'maths/generators/relatifs.js',
  'maths/generators/scratch.js',
  'maths/generators/thales.js',
  'maths/generators/vitesses.js',
  'maths/index.html',
  'sciences/approfondir/acides-bases.js',
  'sciences/approfondir/atomes.js',
  'sciences/approfondir/climat.js',
  'sciences/approfondir/commun.js',
  'sciences/approfondir/electricite.js',
  'sciences/approfondir/energie.js',
  'sciences/approfondir/evolution.js',
  'sciences/approfondir/genetique.js',
  'sciences/approfondir/immunite.js',
  'sciences/approfondir/matiere.js',
  'sciences/approfondir/mouvements-forces.js',
  'sciences/approfondir/numerique.js',
  'sciences/approfondir/nutrition.js',
  'sciences/approfondir/objets-techniques.js',
  'sciences/approfondir/signaux.js',
  'sciences/approfondir/systeme-nerveux.js',
  'sciences/approfondir/terre.js',
  'sciences/approfondir/transformations.js',
  'sciences/chapitre.html',
  'sciences/chapitres.js',
  'sciences/controle.html',
  'sciences/generators/acides-bases.js',
  'sciences/generators/atomes.js',
  'sciences/generators/climat.js',
  'sciences/generators/electricite.js',
  'sciences/generators/energie.js',
  'sciences/generators/evolution.js',
  'sciences/generators/fabrique.js',
  'sciences/generators/figures.js',
  'sciences/generators/genetique.js',
  'sciences/generators/immunite.js',
  'sciences/generators/matiere.js',
  'sciences/generators/mouvements-forces.js',
  'sciences/generators/numerique.js',
  'sciences/generators/nutrition.js',
  'sciences/generators/objets-techniques.js',
  'sciences/generators/signaux.js',
  'sciences/generators/systeme-nerveux.js',
  'sciences/generators/terre.js',
  'sciences/generators/transformations.js',
  'sciences/index.html'
];
// FICHIERS-FIN

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache: 'reload' : on contourne le cache HTTP pour précharger la version publiée
    await Promise.all(FICHIERS.map(async f => {
      try {
        const rep = await fetch(new Request(f, { cache: 'reload' }));
        if (rep.ok) await cache.put(f, rep);
      } catch { /* fichier indisponible : il sera mis en cache à la prochaine visite */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Suppression des anciens caches du site
    for (const nom of await caches.keys()) {
      if (nom.startsWith('revision-brevet-') && nom !== CACHE) await caches.delete(nom);
    }
    await self.clients.claim();
  })());
});

function avecDelai(promesse, ms) {
  return new Promise((ok, ko) => {
    const t = setTimeout(() => ko(new Error('délai dépassé')), ms);
    promesse.then(r => { clearTimeout(t); ok(r); }, e => { clearTimeout(t); ko(e); });
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  // Seulement les GET du site, hors page de tests
  if (req.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(new URL('./', location.href).pathname) || url.pathname.includes('/tests/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const sansParam = url.origin + url.pathname; // chapitre.html?c=… → chapitre.html
    try {
      const rep = await avecDelai(fetch(req, { cache: 'no-cache' }), DELAI_RESEAU);
      if (rep.ok) cache.put(sansParam, rep.clone());
      return rep;
    } catch {
      const enCache = await cache.match(sansParam) || await caches.match(req, { ignoreSearch: true });
      if (enCache) return enCache;
      if (req.mode === 'navigate') {
        const accueil = await cache.match(new URL('./index.html', location.href).href);
        if (accueil) return accueil;
      }
      return new Response('Hors ligne : cette page n\'est pas encore enregistrée.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
