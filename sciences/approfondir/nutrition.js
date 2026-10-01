// Fiche « Explique-moi plus » : nutrition et effort physique. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Les muscles ont besoin de nutriments et de dioxygène ; digestion, respiration et circulation travaillent ensemble pour les leur apporter.',
      pourquoi: `<p>Les aliments sont découpés en <strong>nutriments</strong> (digestion) qui passent dans le sang au niveau de l'intestin grêle. Le <strong>dioxygène</strong> passe dans le sang au niveau des alvéoles. Le cœur fait circuler ce sang jusqu'aux muscles.</p>
        <p>Pendant un effort, les muscles consomment plus : le cœur bat plus vite et on respire plus vite et plus profondément pour suivre la demande.</p>`,
      pieges: [
        { faux: 'Les nutriments passent dans le sang dans l\'estomac.', juste: 'C\'est surtout dans l\'<strong>intestin grêle</strong>.' },
        { faux: 'Les artères ramènent le sang au cœur.', juste: 'Les <strong>veines</strong> ramènent le sang au cœur ; les artères en partent.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('seq') },
      verif: { niveaux: [1, 2], filtre: prefixe('seq', 'classe', 'q') },
      recherche: 'nutrition digestion respiration circulation'
    },
    {
      titre: 'Les formules',
      idee: 'Pour passer d\'un comptage court à une valeur par minute, on multiplie par le nombre de fois que la durée tient dans 60 secondes.',
      pourquoi: `<p>20 battements en 15 s : il y a 4 fois 15 s dans une minute, donc 20 × 4 = <strong>80 battements par minute</strong>.</p>
        <p>Le volume d'air respiré par minute = nombre de respirations par minute × volume d'une respiration. 15 × 0,5 L = 7,5 L/min.</p>`,
      pieges: [
        { faux: '20 battements en 15 s : la fréquence cardiaque est 20.', juste: '20, c\'est en 15 s. Par minute : 20 × 4 = <strong>80</strong> battements.' },
        { faux: '30 battements en 20 s : 30 × 20 = 600.', juste: 'Il y a 3 fois 20 s dans une minute : 30 × 3 = <strong>90</strong>.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('fc') },
      verif: { niveaux: [2, 3], filtre: prefixe('fc', 'ventil', 'fcmax') },
      recherche: 'fréquence cardiaque effort physique'
    },
    vocabulaire({
      pieges: [
        { faux: 'Nutriment et aliment, c\'est pareil.', juste: 'L\'<strong>aliment</strong> est ce qu\'on mange ; le <strong>nutriment</strong> est la petite molécule obtenue après digestion.' },
        { faux: 'Les capillaires sont de gros vaisseaux.', juste: 'Ce sont les vaisseaux les plus <strong>fins</strong>, au contact des cellules.' }
      ],
      recherche: 'nutriments enzymes alvéoles'
    })
  ]
};
