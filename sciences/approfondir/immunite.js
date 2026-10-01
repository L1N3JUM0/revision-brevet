// Fiche « Explique-moi plus » : microbes et immunité. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Contre un microbe, le corps réagit d\'abord vite (inflammation, phagocytose), puis de façon ciblée (anticorps, lymphocytes), et il garde une mémoire.',
      pourquoi: `<p>Les bactéries se multiplient très vite : une division toutes les 20 minutes donne 64 bactéries en 2 heures à partir d'une seule. La <strong>réaction rapide</strong> (phagocytose) limite l'invasion dès les premières heures.</p>
        <p>Les lymphocytes B fabriquent ensuite des <strong>anticorps</strong> spécifiques de ce microbe. Des lymphocytes <strong>mémoire</strong> restent : au contact suivant, la réponse est plus rapide et plus forte. C'est ce qu'utilise la vaccination.</p>`,
      pieges: [
        { faux: '2 divisions : 1 bactérie devient 4… donc 6 divisions : 12.', juste: 'Le nombre <strong>double</strong> à chaque division : 2⁶ = 64.' },
        { faux: 'Un anticorps attaque n\'importe quel microbe.', juste: 'Chaque anticorps est <strong>spécifique</strong> d\'un antigène.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('bact') },
      verif: { niveaux: [2, 3], filtre: prefixe('bact', 'seq', 'q') },
      recherche: 'réaction immunitaire anticorps phagocytose'
    },
    {
      titre: 'Se protéger',
      idee: 'Hygiène et asepsie empêchent les microbes d\'entrer ; l\'antiseptique les tue sur une plaie ; le vaccin prépare le corps ; l\'antibiotique soigne les infections bactériennes.',
      pourquoi: `<p>Un antibiotique bloque des mécanismes propres aux <strong>bactéries</strong> : les virus ne les ont pas, d'où « les antibiotiques, c'est pas automatique ».</p>
        <p>Trop d'antibiotiques sélectionnent les bactéries résistantes : elles survivent et se multiplient.</p>`,
      pieges: [
        { faux: 'Un antibiotique soigne la grippe.', juste: 'La grippe est due à un <strong>virus</strong> : l\'antibiotique est inutile.' },
        { faux: 'Le vaccin soigne une maladie en cours.', juste: 'Le vaccin <strong>prévient</strong> : il crée une mémoire avant la contamination.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('classe') },
      verif: { niveaux: [1, 2], filtre: prefixe('classe') },
      recherche: 'vaccination antibiotiques asepsie'
    },
    vocabulaire({
      pieges: [
        { faux: 'Contamination et infection, c\'est pareil.', juste: '<strong>Contamination</strong> : le microbe entre. <strong>Infection</strong> : il se multiplie.' },
        { faux: 'Antigène et anticorps, c\'est la même chose.', juste: 'L\'<strong>antigène</strong> est sur le microbe ; l\'<strong>anticorps</strong> est fabriqué par le corps pour le reconnaître.' }
      ],
      recherche: 'antigène anticorps lymphocyte'
    })
  ]
};
