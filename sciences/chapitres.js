// Registre des chapitres de sciences (programme de cycle 4, épreuve de sciences du brevet),
// rangés par discipline. charger() importe le générateur à la demande ; null = bientôt.

export const MATIERE = { id: 'sciences', titre: 'Sciences', emoji: '🧪' };

export const CHAPITRES = [
  { id: 'matiere', titre: 'La matière : états et masse volumique', emoji: '🧊', theme: 'pc', charger: () => import('./generators/matiere.js'), approfondir: () => import('./approfondir/matiere.js') },
  { id: 'atomes', titre: 'Atomes, molécules et ions', emoji: '⚛️', theme: 'pc', charger: () => import('./generators/atomes.js'), approfondir: () => import('./approfondir/atomes.js') },
  { id: 'transformations', titre: 'Transformations chimiques', emoji: '🔥', theme: 'pc', charger: () => import('./generators/transformations.js'), approfondir: () => import('./approfondir/transformations.js') },
  { id: 'acides-bases', titre: 'Acides, bases et pH', emoji: '🍋', theme: 'pc', charger: () => import('./generators/acides-bases.js'), approfondir: () => import('./approfondir/acides-bases.js') },
  { id: 'mouvements-forces', titre: 'Mouvements et forces', emoji: '🏐', theme: 'pc', charger: () => import('./generators/mouvements-forces.js'), approfondir: () => import('./approfondir/mouvements-forces.js') },
  { id: 'energie', titre: 'L\'énergie et ses conversions', emoji: '⚡', theme: 'pc', charger: () => import('./generators/energie.js'), approfondir: () => import('./approfondir/energie.js') },
  { id: 'electricite', titre: 'Circuits électriques', emoji: '🔌', theme: 'pc', charger: () => import('./generators/electricite.js'), approfondir: () => import('./approfondir/electricite.js') },
  { id: 'signaux', titre: 'Lumière et son', emoji: '🔊', theme: 'pc', charger: () => import('./generators/signaux.js'), approfondir: () => import('./approfondir/signaux.js') },
  { id: 'genetique', titre: 'Génétique et hérédité', emoji: '🧬', theme: 'svt', charger: () => import('./generators/genetique.js'), approfondir: () => import('./approfondir/genetique.js') },
  { id: 'evolution', titre: 'Biodiversité et évolution', emoji: '🦕', theme: 'svt', charger: () => import('./generators/evolution.js'), approfondir: () => import('./approfondir/evolution.js') },
  { id: 'immunite', titre: 'Microbes et immunité', emoji: '🦠', theme: 'svt', charger: () => import('./generators/immunite.js'), approfondir: () => import('./approfondir/immunite.js') },
  { id: 'nutrition', titre: 'Nutrition et effort physique', emoji: '🫀', theme: 'svt', charger: () => import('./generators/nutrition.js'), approfondir: () => import('./approfondir/nutrition.js') },
  { id: 'systeme-nerveux', titre: 'Système nerveux et santé', emoji: '🧠', theme: 'svt', charger: () => import('./generators/systeme-nerveux.js'), approfondir: () => import('./approfondir/systeme-nerveux.js') },
  { id: 'terre', titre: 'La Terre : plaques, séismes et volcans', emoji: '🌋', theme: 'svt', charger: () => import('./generators/terre.js'), approfondir: () => import('./approfondir/terre.js') },
  { id: 'climat', titre: 'Climat, écosystèmes et environnement', emoji: '🌍', theme: 'svt', charger: () => import('./generators/climat.js'), approfondir: () => import('./approfondir/climat.js') },
  { id: 'objets-techniques', titre: 'Objets techniques', emoji: '⚙️', theme: 'techno', charger: () => import('./generators/objets-techniques.js'), approfondir: () => import('./approfondir/objets-techniques.js') },
  { id: 'numerique', titre: 'Le numérique : binaire, réseaux, programmes', emoji: '💻', theme: 'techno', charger: () => import('./generators/numerique.js'), approfondir: () => import('./approfondir/numerique.js') }
];

export const THEMES = {
  pc: 'Physique-Chimie',
  svt: 'SVT',
  techno: 'Technologie'
};

export function trouverChapitre(id) {
  return CHAPITRES.find(c => c.id === id) || null;
}

// Charge tous les générateurs disponibles (tests, contrôle blanc)
export async function chargerTous() {
  const dispo = CHAPITRES.filter(c => c.charger);
  const mods = await Promise.all(dispo.map(c => c.charger()));
  return mods.map(m => m.default);
}

// Banques de notions (tests de cohérence)
export async function chargerBanques() {
  const dispo = CHAPITRES.filter(c => c.charger);
  const mods = await Promise.all(dispo.map(c => c.charger()));
  return mods.map(m => m.banque);
}
