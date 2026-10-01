// Registre des chapitres d'histoire (programme de 3e), dans l'ordre du programme.
// charger() importe le générateur à la demande ; null = chapitre pas encore disponible.

export const MATIERE = { id: 'histoire', titre: 'Histoire', emoji: '🏛️' };

export const CHAPITRES = [
  { id: 'reperes', titre: 'Les repères du brevet', emoji: '📅', theme: 0, charger: () => import('./generators/reperes.js') },
  { id: 'premiere-guerre', titre: 'La Première Guerre mondiale', emoji: '⚔️', theme: 1, charger: () => import('./generators/premiere-guerre.js'), redige: () => import('./documents/premiere-guerre.js') },
  { id: 'entre-deux-guerres', titre: 'L\'entre-deux-guerres : totalitarismes et démocraties', emoji: '🗳️', theme: 1, charger: () => import('./generators/entre-deux-guerres.js'), redige: () => import('./documents/entre-deux-guerres.js') },
  { id: 'seconde-guerre', titre: 'La Seconde Guerre mondiale', emoji: '🌍', theme: 1, charger: () => import('./generators/seconde-guerre.js'), redige: () => import('./documents/seconde-guerre.js') },
  { id: 'france-occupee', titre: 'La France défaite et occupée', emoji: '🇫🇷', theme: 1, charger: () => import('./generators/france-occupee.js'), redige: () => import('./documents/france-occupee.js') },
  { id: 'decolonisation', titre: 'Indépendances et nouveaux États', emoji: '🕊️', theme: 2, charger: () => import('./generators/decolonisation.js'), redige: () => import('./documents/decolonisation.js') },
  { id: 'guerre-froide', titre: 'Un monde bipolaire : la guerre froide', emoji: '🧱', theme: 2, charger: () => import('./generators/guerre-froide.js'), redige: () => import('./documents/guerre-froide.js') },
  { id: 'europe', titre: 'Le projet européen', emoji: '🇪🇺', theme: 2, charger: () => import('./generators/europe.js'), redige: () => import('./documents/europe.js') },
  { id: 'monde-apres-1989', titre: 'Le monde après 1989', emoji: '🌐', theme: 2, charger: () => import('./generators/monde-apres-1989.js') },
  { id: 'refonder-republique', titre: '1944-1947 : refonder la République', emoji: '🏛️', theme: 3, charger: () => import('./generators/refonder-republique.js'), redige: () => import('./documents/refonder-republique.js') },
  { id: 'cinquieme-republique', titre: 'La Ve République', emoji: '🗳️', theme: 3, charger: () => import('./generators/cinquieme-republique.js'), redige: () => import('./documents/cinquieme-republique.js') },
  { id: 'societe-1950-1980', titre: 'Femmes et hommes dans la société (1950-1980)', emoji: '👩‍👩‍👧', theme: 3, charger: () => import('./generators/societe-1950-1980.js'), redige: () => import('./documents/societe-1950-1980.js') }
];

export const THEMES = {
  0: 'Réviser',
  1: 'Thème 1 · L\'Europe, théâtre des guerres totales (1914-1945)',
  2: 'Thème 2 · Le monde depuis 1945',
  3: 'Thème 3 · Une République repensée'
};

export function trouverChapitre(id) {
  return CHAPITRES.find(c => c.id === id) || null;
}

export async function chargerTous() {
  const dispo = CHAPITRES.filter(c => c.charger);
  const mods = await Promise.all(dispo.map(c => c.charger()));
  return mods.map(m => m.default);
}
