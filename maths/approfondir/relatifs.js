// Fiche « Explique-moi plus » des nombres relatifs : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
import { droiteGraduee } from '../../assets/js/core/svg.js';

// Clés des exercices : « n1:−12 + (−9) » (calcul), « n1:plongee:-32:+:22 » (problème), « n2:… », « n3:… »
const soustraction = c => / − |:-:/.test(c);

export default {
  sections: [
    {
      titre: 'Additionner deux relatifs',
      idee: 'Même signe : on ajoute les distances à zéro et on garde le signe. Signes contraires : on soustrait les distances et on garde le signe du nombre le plus éloigné de zéro.',
      pourquoi: `<p>Sur une droite graduée, ajouter un nombre <strong>positif</strong>, c'est avancer vers la droite ; ajouter un nombre <strong>négatif</strong>, c'est reculer vers la gauche.</p>
        <p>−3 + 5 : on part de −3 et on avance de 5. On passe 0 au bout de 3 pas, il reste 2 pas : on arrive à <strong>2</strong>.</p>
        <p>Autre image : −4 + (−3), c'est une dette de 4 € plus une dette de 3 € : une dette de 7 €, donc −7.</p>`,
      figure: droiteGraduee(-6, 6, { marques: [{ valeur: -3 }, { valeur: 2 }], fleche: { de: -3, a: 2, texte: '+5' } }),
      pieges: [
        { faux: '−4 + (−3) = 7', juste: 'Deux nombres négatifs : le résultat est négatif. −4 + (−3) = <strong>−7</strong>.' },
        { faux: '−3 + 5 = −8', juste: 'Signes contraires : on soustrait les distances (5 − 3 = 2) et on garde le signe de 5. Résultat : <strong>2</strong>.' }
      ],
      exemple: { niveau: 1, filtre: c => /^n1:/.test(c) && !soustraction(c) },
      verif: { niveaux: [1, 1], filtre: c => /^n1:/.test(c) && !soustraction(c) },
      recherche: 'additionner des nombres relatifs'
    },
    {
      titre: 'Soustraire = ajouter l\'opposé',
      idee: 'Soustraire un nombre, c\'est ajouter son opposé : on change le signe du nombre qu\'on enlève, et on fait une addition.',
      pourquoi: `<p>4 − (−6), c'est la distance pour aller de −6 jusqu'à 4 sur la droite graduée : 6 pas pour arriver à 0, puis 4 pas. En tout <strong>10</strong>, comme 4 + 6.</p>
        <p>Avec des dettes : enlever une dette de 6 €, c'est comme recevoir 6 €.</p>`,
      figure: droiteGraduee(-7, 5, { marques: [{ valeur: -6 }, { valeur: 4 }], fleche: { de: -6, a: 4, texte: '10' } }),
      pieges: [
        { faux: '4 − (−6) = −2', juste: 'On ajoute l\'opposé de −6 : 4 + 6 = <strong>10</strong>.' },
        { faux: '−2 − 5 = 2 + 5 = 7', juste: 'On ne change que le signe du nombre <strong>soustrait</strong> : −2 − 5 = −2 + (−5) = <strong>−7</strong>.' }
      ],
      exemple: { niveau: 1, filtre: c => /^n1:/.test(c) && soustraction(c) },
      verif: { niveaux: [1, 1], filtre: c => /^n1:/.test(c) && soustraction(c) },
      recherche: 'soustraire des nombres relatifs'
    },
    {
      titre: 'Multiplier et diviser : les signes',
      idee: 'On multiplie (ou on divise) les distances à zéro. Même signe : résultat positif. Signes contraires : résultat négatif.',
      pourquoi: `<p>3 × (−2) = (−2) + (−2) + (−2) = <strong>−6</strong> : trois dettes de 2 €.</p>
        <p>Regarde cette suite : chaque ligne augmente de 2.</p>
        <p class="calcul">(−2) × 2 = −4<br>(−2) × 1 = −2<br>(−2) × 0 = 0<br>(−2) × (−1) = 2<br>(−2) × (−2) = 4</p>
        <p>Pour que la régularité continue, « moins par moins » doit donner un résultat <strong>positif</strong>. La division suit les mêmes règles, car diviser, c'est multiplier par l'inverse.</p>`,
      pieges: [
        { faux: '(−4) × (−5) = −20', juste: 'Même signe : le résultat est positif. (−4) × (−5) = <strong>20</strong>.' },
        { faux: '(−1) × (−2) × (−3) = 6', juste: 'Trois facteurs négatifs (un nombre impair) : le résultat est négatif, <strong>−6</strong>.' },
        { faux: '−3² = 9', juste: 'Le carré porte seulement sur 3 : −3² = −9. Avec des parenthèses : (−3)² = 9.' }
      ],
      exemple: { niveau: 2, filtre: c => /^n2:.*[×÷]/.test(c) },
      verif: { niveaux: [2, 2], filtre: c => /^n2:.*[×÷]/.test(c) },
      recherche: 'multiplier des nombres relatifs règle des signes'
    },
    {
      titre: 'Le piège : les priorités',
      idee: 'On calcule d\'abord les parenthèses, puis les multiplications et divisions, puis les additions et soustractions, de gauche à droite.',
      pourquoi: `<p>C'est une règle commune, la même dans le monde entier et dans toutes les calculatrices : sans elle, un même calcul pourrait donner deux résultats.</p>
        <p>5 + 3 × (−2) se lit « 5, plus trois fois −2 » : on calcule d'abord 3 × (−2) = −6, puis 5 + (−6) = <strong>−1</strong>.</p>`,
      pieges: [
        { faux: '5 + 3 × (−2) = 8 × (−2) = −16', juste: 'La multiplication passe avant l\'addition : 5 + (−6) = <strong>−1</strong>.' },
        { faux: '10 − 4 + 2 = 10 − 6 = 4', juste: 'Additions et soustractions se font de gauche à droite : 6 + 2 = <strong>8</strong>.' }
      ],
      exemple: { niveau: 3, filtre: c => /^n3:/.test(c) },
      verif: { niveaux: [3, 3], filtre: c => /^n3:/.test(c) },
      recherche: 'priorités opératoires nombres relatifs'
    }
  ]
};
