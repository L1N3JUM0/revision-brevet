// Registre des chapitres de maths, dans l'ordre du programme.
// charger() importe le générateur à la demande ; null = chapitre pas encore disponible.

export const MATIERE = { id: 'maths', titre: 'Maths', emoji: '📐' };

export const CHAPITRES = [
  { id: 'relatifs', titre: 'Nombres relatifs', emoji: '±', charger: () => import('./generators/relatifs.js'), approfondir: () => import('./approfondir/relatifs.js') },
  { id: 'fractions', titre: 'Fractions', emoji: '½', charger: () => import('./generators/fractions.js'), approfondir: () => import('./approfondir/fractions.js') },
  { id: 'pythagore', titre: 'Théorème de Pythagore', emoji: '📐', charger: () => import('./generators/pythagore.js'), approfondir: () => import('./approfondir/pythagore.js') },
  { id: 'thales', titre: 'Théorème de Thalès', emoji: '🔺', charger: () => import('./generators/thales.js'), approfondir: () => import('./approfondir/thales.js') },
  { id: 'conversions-longueurs', titre: 'Conversions de longueurs', emoji: '📏', charger: () => import('./generators/conversions-longueurs.js'), approfondir: () => import('./approfondir/conversions-longueurs.js') },
  { id: 'conversions-durees', titre: 'Conversions de durées', emoji: '⏱️', charger: () => import('./generators/conversions-durees.js'), approfondir: () => import('./approfondir/conversions-durees.js') },
  { id: 'vitesses', titre: 'Vitesses', emoji: '🏎️', charger: () => import('./generators/vitesses.js'), approfondir: () => import('./approfondir/vitesses.js') },
  { id: 'angles', titre: 'Angles et parallèles', emoji: '∠', charger: () => import('./generators/angles.js'), approfondir: () => import('./approfondir/angles.js') },
  { id: 'scratch', titre: 'Scratch', emoji: '🐱', charger: () => import('./generators/scratch.js'), approfondir: () => import('./approfondir/scratch.js') },
  { id: 'constructions', titre: 'Constructions géométriques', emoji: '🧭', charger: () => import('./generators/constructions.js'), approfondir: () => import('./approfondir/constructions.js') }
];

export function trouverChapitre(id) {
  return CHAPITRES.find(c => c.id === id) || null;
}

// Charge tous les générateurs disponibles (tests, contrôle blanc)
export async function chargerTous() {
  const dispo = CHAPITRES.filter(c => c.charger);
  const mods = await Promise.all(dispo.map(c => c.charger()));
  return mods.map(m => m.default);
}
