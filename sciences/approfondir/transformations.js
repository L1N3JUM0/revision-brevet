// Fiche « Explique-moi plus » : transformations chimiques. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Dans une transformation chimique, les atomes des réactifs se réarrangent pour former les produits : aucun atome ne disparaît, donc la masse totale se conserve.',
      pourquoi: `<p>C'est comme des briques : on démonte des constructions (les molécules de réactifs) pour en monter d'autres (les produits), avec <strong>les mêmes briques</strong>.</p>
        <p>Une équation est <strong>ajustée</strong> quand on retrouve exactement les mêmes atomes de chaque côté. On n'écrit jamais d'indices nouveaux : on ajoute des <strong>coefficients</strong> devant les formules.</p>
        <p class="calcul">CH₄ + 2 O₂ → CO₂ + 2 H₂O</p>
        <p>À gauche : 1 C, 4 H, 4 O. À droite : 1 C, 4 H, 2 + 2 = 4 O.</p>`,
      pieges: [
        { faux: 'Pour ajuster, j\'écris O₄ au lieu de 2 O₂.', juste: 'On ne change jamais une formule : on ajoute un <strong>coefficient</strong> devant.' },
        { faux: 'Lors d\'une combustion, la matière disparaît.', juste: 'Elle part sous forme de gaz (CO₂, eau) : la masse totale se conserve.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('ajuster') },
      verif: { niveaux: [2, 3], filtre: prefixe('ajuster', 'masse') },
      recherche: 'équation de réaction ajuster conservation de la masse'
    },
    {
      titre: 'Physique ou chimique ?',
      idee: 'Une transformation est chimique si de nouvelles espèces apparaissent ; si les espèces restent les mêmes, elle est physique.',
      pourquoi: `<p>Quand l'eau gèle, c'est toujours de l'eau (H₂O) : transformation <strong>physique</strong>. Quand une bougie brûle, la cire et le dioxygène disparaissent et du CO₂ et de l'eau apparaissent : transformation <strong>chimique</strong>.</p>
        <p>Indices d'une transformation chimique : un gaz se dégage, la couleur change, de la chaleur est produite, un précipité apparaît.</p>`,
      pieges: [
        { faux: 'Faire fondre du chocolat est chimique.', juste: 'C\'est un changement d\'état : <strong>physique</strong>. Le cuire longtemps, en revanche, le transforme chimiquement.' },
        { faux: 'Dissoudre du sel est chimique.', juste: 'Le sel est toujours là, dispersé dans l\'eau : <strong>physique</strong>.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('classe') },
      verif: { niveaux: [1, 1], filtre: prefixe('classe', 'lire') },
      recherche: 'transformation physique transformation chimique'
    },
    vocabulaire({
      pieges: [
        { faux: 'Le dioxygène est le combustible.', juste: 'Le dioxygène est le <strong>comburant</strong> ; le combustible, c\'est ce qui brûle (bois, gaz).' },
        { faux: 'Les produits sont à gauche de la flèche.', juste: 'Les <strong>réactifs</strong> sont à gauche, les produits à droite.' }
      ],
      recherche: 'réactifs produits combustion'
    })
  ]
};
