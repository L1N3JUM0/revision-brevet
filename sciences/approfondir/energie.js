// Fiche « Explique-moi plus » : l'énergie et ses conversions. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'L\'énergie ne se crée pas et ne disparaît pas : elle se convertit d\'une forme en une autre, avec toujours une partie « perdue » en chaleur.',
      pourquoi: `<p>Un convertisseur reçoit une forme d'énergie et en fournit une autre : une lampe reçoit de l'énergie <strong>électrique</strong> et fournit de l'énergie <strong>lumineuse</strong>… mais elle chauffe aussi : une partie part en énergie <strong>thermique</strong>.</p>
        <p>On le représente par une chaîne énergétique : énergie reçue → [convertisseur] → énergie utile (+ pertes).</p>`,
      pieges: [
        { faux: 'Un panneau solaire fabrique de l\'énergie.', juste: 'Il <strong>convertit</strong> l\'énergie lumineuse en énergie électrique.' },
        { faux: 'Le moteur électrique fournit de l\'énergie électrique.', juste: 'Il <strong>reçoit</strong> de l\'énergie électrique et fournit de l\'énergie mécanique.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('conv') },
      verif: { niveaux: [1, 2], filtre: prefixe('conv', 'classe') },
      recherche: 'conversion d\'énergie chaîne énergétique'
    },
    {
      titre: 'Les formules',
      idee: 'L\'énergie consommée par un appareil est sa puissance multipliée par la durée : E = P × t ; l\'énergie d\'un objet en mouvement est Ec = ½ × m × v².',
      pourquoi: `<p>Une puissance, c'est de l'énergie <strong>par seconde</strong>. Un appareil de 2 000 W qui marche 3 fois plus longtemps consomme 3 fois plus : d'où E = P × t.</p>
        <p>Les unités vont ensemble : W et s donnent des joules ; W et h donnent des Wh (1 kWh = 1 000 Wh).</p>
        <p>Dans Ec = ½ m v², la vitesse est <strong>au carré</strong> : à vitesse double, l'énergie est multipliée par 4. C'est pour cela qu'un choc à 100 km/h est bien plus grave qu'à 50 km/h.</p>`,
      pieges: [
        { faux: '2 000 W pendant 3 min : E = 2 000 × 3 = 6 000 J.', juste: 'En joules, le temps doit être en <strong>secondes</strong> : 3 min = 180 s, E = 360 000 J.' },
        { faux: 'Ec = ½ × 1 000 × 20 = 10 000 J.', juste: 'N\'oublie pas le carré : ½ × 1 000 × 20² = <strong>200 000 J</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('kwh', 'cout', 'wh') },
      verif: { niveaux: [2, 3], filtre: prefixe('kwh', 'cout', 'joules', 'ec') },
      recherche: 'énergie puissance E = P × t énergie cinétique'
    },
    vocabulaire({
      pieges: [
        { faux: 'Le watt est une unité d\'énergie.', juste: 'Le watt mesure une <strong>puissance</strong> ; l\'énergie se mesure en joules ou en kWh.' },
        { faux: 'Le nucléaire est une énergie renouvelable.', juste: 'L\'uranium est extrait de mines : <strong>non renouvelable</strong> (même s\'il émet peu de CO₂).' }
      ],
      recherche: 'énergie renouvelable puissance joule'
    })
  ]
};
