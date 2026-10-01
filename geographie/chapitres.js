// Registre des chapitres de géographie (programme de 3e), dans l'ordre du programme.
// charger() importe le générateur à la demande ; redige() le sujet de développement construit.

export const MATIERE = { id: 'geographie', titre: 'Géographie', emoji: '🗺️' };

export const CHAPITRES = [
  { id: 'cartes', titre: 'La carte du brevet', emoji: '📍', theme: 0, charger: () => import('./generators/cartes.js') },
  { id: 'croquis', titre: 'Le croquis : réussir sa légende', emoji: '✏️', theme: 0, charger: () => import('./generators/croquis.js') },
  { id: 'aires-urbaines', titre: 'Les aires urbaines', emoji: '🏙️', theme: 1, charger: () => import('./generators/aires-urbaines.js'), redige: () => import('./developpements/aires-urbaines.js') },
  { id: 'espaces-productifs', titre: 'Les espaces productifs', emoji: '🏭', theme: 1, charger: () => import('./generators/espaces-productifs.js') },
  { id: 'faible-densite', titre: 'Les espaces de faible densité', emoji: '🌾', theme: 1, charger: () => import('./generators/faible-densite.js'), redige: () => import('./developpements/faible-densite.js') },
  { id: 'amenager', titre: 'Aménager le territoire', emoji: '🚄', theme: 2, charger: () => import('./generators/amenager.js') },
  { id: 'outre-mer', titre: 'Les territoires ultramarins', emoji: '🏝️', theme: 2, charger: () => import('./generators/outre-mer.js'), redige: () => import('./developpements/outre-mer.js') },
  { id: 'union-europeenne', titre: 'La France et l\'Union européenne', emoji: '🇪🇺', theme: 3, charger: () => import('./generators/union-europeenne.js'), redige: () => import('./developpements/union-europeenne.js') },
  { id: 'france-monde', titre: 'La France et l\'Europe dans le monde', emoji: '🌍', theme: 3, charger: () => import('./generators/france-monde.js') }
];

export const THEMES = {
  0: 'Repères et méthode',
  1: 'Thème 1 · Dynamiques territoriales de la France contemporaine',
  2: 'Thème 2 · Pourquoi et comment aménager le territoire ?',
  3: 'Thème 3 · La France et l\'Union européenne'
};

export function trouverChapitre(id) {
  return CHAPITRES.find(c => c.id === id) || null;
}

export async function chargerTous() {
  const dispo = CHAPITRES.filter(c => c.charger);
  const mods = await Promise.all(dispo.map(c => c.charger()));
  return mods.map(m => m.default);
}

export async function chargerBanques() {
  const dispo = CHAPITRES.filter(c => c.charger);
  const mods = await Promise.all(dispo.map(c => c.charger()));
  return mods.map(m => m.banque);
}
