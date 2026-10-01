// Fabrique des sujets « Développement construit » (DNB 2027, géographie, exercice 2 — docs/attendus-2027.md) :
// 1. une définition courte (1 à 2 phrases) pour vérifier la notion clé ;
// 2. le développement construit d'au moins 30 lignes, avec la liste de mots à utiliser (comme le sujet de référence).
// Banque : { sujets: [{ id, consigne, motsAide: [..], plan: [..], mots, corrige }], definitions: [{ mot, mots, corrige }] }

const CHECKLIST_DEFINITION = [
  'J\'ai écrit une phrase complète (« Un … est … »).',
  'Ma définition est précise : elle ne se contente pas d\'un exemple.'
];
const CHECKLIST_DEVELOPPEMENT = [
  'Mon introduction présente le sujet et pose une question.',
  'J\'ai fait un paragraphe par idée, avec un alinéa.',
  'J\'ai utilisé les mots imposés et je les ai expliqués.',
  'J\'ai donné des exemples précis (lieux, aménagements, chiffres).',
  'Ma conclusion répond à la consigne.'
];

export function fabriquerDeveloppement(titre, banque) {
  return {
    libelle: 'Développement construit',
    variantes: banque.sujets.length * banque.definitions.length,
    generer(rng) {
      const s = rng.choix(banque.sujets);
      const d = rng.choix(banque.definitions);
      return {
        cle: `dev:${s.id}:${d.mot}`,
        titre,
        intro: 'Au brevet, le développement construit vaut 18 points : une introduction, deux ou trois paragraphes organisés, une conclusion.',
        documents: [],
        questions: [
          { partie: 'Le vocabulaire', type: 'redige', phrases: [1, 2], mots: d.mots, corrige: d.corrige, consigne: `Définis : « ${d.mot} ».`, checklist: CHECKLIST_DEFINITION },
          {
            partie: 'Développement construit',
            type: 'redige',
            lignes: 30,
            checklist: CHECKLIST_DEVELOPPEMENT,
            mots: s.mots,
            corrige: s.corrige,
            consigne: `${s.consigne} Rédige un développement construit d'au moins 30 lignes.<br><span class="doux petit">Mots à utiliser : ${s.motsAide.join(', ')}.</span><details class="replie"><summary>Un plan possible</summary><ol>${s.plan.map(p => `<li>${p}</li>`).join('')}</ol></details>`
          }
        ]
      };
    }
  };
}
