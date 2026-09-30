// Toutes les banques de faits d'histoire, dans l'ordre du programme.
// La fabrique s'en sert pour les intrus, les distracteurs et le chapitre « Repères du brevet ».
import premiereGuerre from './premiere-guerre.js';
import entreDeuxGuerres from './entre-deux-guerres.js';
import secondeGuerre from './seconde-guerre.js';
import franceOccupee from './france-occupee.js';
import decolonisation from './decolonisation.js';
import guerreFroide from './guerre-froide.js';
import europe from './europe.js';
import mondeApres1989 from './monde-apres-1989.js';

export const DONNEES = [
  premiereGuerre, entreDeuxGuerres, secondeGuerre, franceOccupee,
  decolonisation, guerreFroide, europe, mondeApres1989
];
