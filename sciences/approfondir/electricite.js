// Fiche « Explique-moi plus » : circuits électriques. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';
import { circuitDerivation } from '../generators/figures.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'En série, l\'intensité est la même partout et la tension se partage ; en dérivation, la tension est la même pour chaque branche et l\'intensité se partage.',
      pourquoi: `<p>Pense à de l'eau dans des tuyaux. <strong>En série</strong>, il n'y a qu'un chemin : tout le courant passe par chaque dipôle (même intensité), et l'« élan » donné par la pile se répartit entre eux (U = U₁ + U₂).</p>
        <p><strong>En dérivation</strong>, le courant se sépare à un nœud et se rejoint à l'autre : I = I₁ + I₂. Chaque branche est branchée directement sur la pile : même tension.</p>`,
      figure: circuitDerivation([{ type: 'lampe', nom: 'D1' }, { type: 'moteur', nom: 'D2' }]),
      pieges: [
        { faux: 'En série, une lampe plus loin de la pile reçoit moins de courant.', juste: 'En série, l\'intensité est <strong>la même partout</strong>.' },
        { faux: 'En dérivation, la tension se partage entre les branches.', juste: 'En dérivation, c\'est l\'<strong>intensité</strong> qui se partage ; la tension est la même.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('noeuds') },
      verif: { niveaux: [1, 2], filtre: prefixe('additivite', 'unicite', 'noeuds', 'derivU') },
      recherche: 'lois des circuits série dérivation'
    },
    {
      titre: 'Les formules',
      idee: 'Pour une résistance, la tension est proportionnelle à l\'intensité : U = R × I (loi d\'Ohm). La puissance d\'un appareil vaut P = U × I.',
      pourquoi: `<p>Une résistance « freine » le courant : plus R est grande, plus il faut de tension pour faire passer la même intensité. Le graphique U en fonction de I est une droite qui passe par l'origine.</p>
        <p>Les unités doivent être en volts, ohms et <strong>ampères</strong> : 50 mA = 0,05 A.</p>`,
      pieges: [
        { faux: 'U = 100 Ω × 50 mA = 5 000 V', juste: 'Convertis l\'intensité en ampères : 50 mA = 0,05 A, donc U = 100 × 0,05 = <strong>5 V</strong>.' },
        { faux: 'R = U × I', juste: 'De U = R × I, on tire <strong>R = U ÷ I</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('ohm') },
      verif: { niveaux: [2, 3], filtre: prefixe('ohm', 'puiss', 'multiprise') },
      recherche: 'loi d\'Ohm puissance électrique'
    },
    vocabulaire({
      niveaux: [2, 3],
      pieges: [
        { faux: 'L\'intensité se mesure en volts.', juste: 'Intensité : <strong>ampères</strong> (ampèremètre, en série). Tension : volts (voltmètre, en dérivation).' },
        { faux: 'Électrisation et électrocution, c\'est pareil.', juste: 'L\'<strong>électrisation</strong> est le passage du courant dans le corps ; l\'électrocution est une électrisation mortelle.' }
      ],
      recherche: 'tension intensité court-circuit'
    })
  ]
};
