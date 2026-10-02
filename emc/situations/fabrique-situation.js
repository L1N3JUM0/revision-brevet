// Fabrique des « situations pratiques » d'EMC (DNB 2027, sous-épreuve d'EMC — voir docs/attendus-2027.md) :
// 1. définition (1 à 2 phrases) ; 2. analyse de la situation (1 à 2 phrases) ;
// 3. principe ou valeur de la République en jeu, identifié et défini (1 à 2 phrases) ;
// 4. explication appuyée sur les documents (au moins 4 phrases) ;
// 5. texte argumenté de 8 à 10 lignes destiné aux camarades, anonyme.
// Les situations sont inventées pour l'entraînement (c'est indiqué) ; les textes officiels sont cités avec leur source.

const CHECKLIST_COURTE = [
  'J\'ai répondu par une ou deux phrases complètes.',
  'J\'ai utilisé le vocabulaire de l\'EMC (principe, valeur, droit, devoir…).'
];
const CHECKLIST_PRINCIPE = [
  'J\'ai nommé le principe ou la valeur.',
  'Je l\'ai défini en une phrase.',
  'J\'ai fait le lien avec la situation.'
];
const CHECKLIST_EXPLICATION = [
  'J\'ai écrit au moins quatre phrases.',
  'J\'ai pris des informations dans les documents.',
  'J\'ai donné deux exemples.'
];
const CHECKLIST_TEXTE = [
  'Je m\'adresse à mes camarades (tu / vous).',
  'J\'ai donné au moins deux arguments, avec des connecteurs (d\'abord, ensuite, enfin, car, donc).',
  'J\'ai proposé une attitude ou une solution concrète.',
  'Mon texte fait entre 8 et 10 lignes.',
  'Je n\'ai pas signé et je n\'ai cité aucun nom (anonymat).'
];

export function fabriquerSituations(situations) {
  return {
    libelle: 'Situation pratique',
    variantes: situations.length,
    generer(rng) {
      const s = rng.choix(situations);
      return {
        cle: `emc:${s.id}`,
        titre: `Situation pratique · ${s.titre}`,
        intro: 'Lis les documents, puis réponds dans l\'ordre. Au brevet, cette partie vaut 20 points.',
        documents: s.documents,
        questions: [
          { partie: 'Définir', type: 'redige', phrases: [1, 2], checklist: CHECKLIST_COURTE, ...s.definition },
          { partie: 'Analyser la situation', type: 'redige', phrases: [1, 2], checklist: CHECKLIST_COURTE, ...s.analyse },
          { partie: 'Les principes de la République', type: 'redige', phrases: [1, 2], checklist: CHECKLIST_PRINCIPE, ...s.principe },
          { partie: 'Expliquer', type: 'redige', phrases: [4, null], checklist: CHECKLIST_EXPLICATION, ...s.explication, consigne: `${s.explication.consigne} Réponds en au moins quatre phrases.` },
          { partie: 'Argumenter', type: 'redige', lignes: 8, checklist: CHECKLIST_TEXTE, ...s.texte, consigne: `${s.texte.consigne} Rédige un texte argumenté de 8 à 10 lignes. <span class="doux">Ne signe pas ton texte et ne cite aucun nom.</span>` }
        ]
      };
    }
  };
}

export const SITUATION_INVENTEE = 'Situation inventée pour l\'entraînement.';
