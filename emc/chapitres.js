// Registre des chapitres d'EMC (3e : « Faire vivre la démocratie »).
// charger() : entraînement (questions) ; redige() : situation pratique au format du brevet.

export const MATIERE = { id: 'emc', titre: 'EMC', emoji: '⚖️' };

export const CHAPITRES = [
  { id: 'principes', titre: 'Valeurs et principes de la République', emoji: '🇫🇷', theme: 1, charger: () => import('./generators/principes.js'), redige: () => import('./situations/principes.js') },
  { id: 'citoyennete', titre: 'Être citoyen', emoji: '🗳️', theme: 1, charger: () => import('./generators/citoyennete.js'), redige: () => import('./situations/citoyennete.js') },
  { id: 'democratie', titre: 'Faire vivre la démocratie', emoji: '🏛️', theme: 2, charger: () => import('./generators/democratie.js'), redige: () => import('./situations/droits.js') },
  { id: 'information', titre: 'S\'informer, exercer son esprit critique', emoji: '📰', theme: 2, charger: () => import('./generators/information.js'), redige: () => import('./situations/information.js') },
  { id: 'defense', titre: 'La défense et la paix', emoji: '🕊️', theme: 3, charger: () => import('./generators/defense.js') }
];

export const THEMES = {
  1: 'Être citoyen dans la République',
  2: 'Faire vivre la démocratie',
  3: 'Défendre la paix'
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
