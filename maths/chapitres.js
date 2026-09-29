// Registre des chapitres de maths, dans l'ordre du programme.
// charger() importe le générateur à la demande ; null = chapitre pas encore disponible.

export const MATIERE = { id: 'maths', titre: 'Maths', emoji: '📐' };

export const CHAPITRES = [
  { id: 'relatifs', titre: 'Nombres relatifs', emoji: '±', charger: () => import('./generators/relatifs.js') },
  { id: 'fractions', titre: 'Fractions', emoji: '½', charger: () => import('./generators/fractions.js') },
  { id: 'pythagore', titre: 'Théorème de Pythagore', emoji: '📐', charger: () => import('./generators/pythagore.js') },
  { id: 'thales', titre: 'Théorème de Thalès', emoji: '🔺', charger: () => import('./generators/thales.js') },
  { id: 'conversions-longueurs', titre: 'Conversions de longueurs', emoji: '📏', charger: null },
  { id: 'conversions-durees', titre: 'Conversions de durées', emoji: '⏱️', charger: null },
  { id: 'vitesses', titre: 'Vitesses', emoji: '🏎️', charger: null },
  { id: 'angles', titre: 'Angles et parallèles', emoji: '∠', charger: null },
  { id: 'scratch', titre: 'Scratch', emoji: '🐱', charger: null },
  { id: 'constructions', titre: 'Constructions géométriques', emoji: '🧭', charger: null }
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
