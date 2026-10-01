// Fiche « Explique-moi plus » des fractions : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
import { fracHtml as F } from '../../assets/js/core/answer.js';
import { barre } from '../generators/fractions.js';

export default {
  sections: [
    {
      titre: 'Le vocabulaire',
      idee: 'Le dénominateur dit en combien de parts égales on partage, le numérateur combien de parts on prend. Simplifier, c\'est diviser les deux par un même nombre.',
      pourquoi: `<p>Simplifier ne change pas la quantité. ${F(18, 24)}, c'est 18 petites parts sur 24. Si on regroupe les parts par 6, on obtient 3 grosses parts sur 4 : la même longueur de barre.</p>
        <p class="calcul">${F(18, 24)} = ${F('18 ÷ 6', '24 ÷ 6')} = ${F(3, 4)}</p>
        <p>On s'arrête quand plus aucun nombre (autre que 1) ne divise à la fois le numérateur et le dénominateur : la fraction est <strong>irréductible</strong>.</p>`,
      figure: barre(3, 4),
      pieges: [
        { faux: `${F(18, 24)} = ${F(9, 24)}`, juste: 'On divise <strong>en haut et en bas</strong> par le même nombre, sinon la fraction change.' },
        { faux: `${F(18, 24)} = ${F(12, 18)} (on a enlevé 6)`, juste: 'On simplifie en <strong>divisant</strong>, jamais en soustrayant.' }
      ],
      exemple: { niveau: 1, filtre: c => /^simplifier:/.test(c) },
      verif: { niveaux: [1, 1], filtre: c => /^simplifier:/.test(c) },
      recherche: 'simplifier une fraction'
    },
    {
      titre: 'Additionner, soustraire',
      idee: 'On n\'additionne que des parts de même taille : on met au même dénominateur, puis on additionne les numérateurs et on garde le dénominateur.',
      pourquoi: `<p>${F(2, 7)} + ${F(3, 7)}, c'est 2 septièmes plus 3 septièmes : <strong>5 septièmes</strong>, comme 2 pommes + 3 pommes = 5 pommes. Le « septième » est l'unité : il ne change pas.</p>
        <p>Des quarts et des sixièmes n'ont pas la même taille. On les redécoupe en parts communes, des douzièmes : ${F(1, 4)} = ${F(3, 12)} et ${F(5, 6)} = ${F(10, 12)}. Ensuite, on peut additionner.</p>`,
      pieges: [
        { faux: `${F(1, 4)} + ${F(5, 6)} = ${F(6, 10)}`, juste: `On met au même dénominateur : ${F(3, 12)} + ${F(10, 12)} = ${F(13, 12)}.` },
        { faux: `${F(2, 7)} + ${F(3, 7)} = ${F(5, 14)}`, juste: `Le dénominateur ne s'additionne pas : ${F(5, 7)}.` }
      ],
      exemple: { niveau: 1, filtre: c => /^meme:/.test(c) },
      verif: { niveaux: [1, 2], filtre: c => /^(meme|multiples):/.test(c) },
      recherche: 'additionner des fractions'
    },
    {
      titre: 'Multiplier, diviser',
      idee: 'Pour multiplier, on multiplie les numérateurs entre eux et les dénominateurs entre eux. Diviser par une fraction, c\'est multiplier par son inverse.',
      pourquoi: `<p>${F(2, 3)} × ${F(5, 7)}, c'est prendre les deux tiers de ${F(5, 7)}. On découpe chaque septième en 3 : on obtient des 21<sup>es</sup>, et on en garde 2 × 5 = 10. Donc ${F(10, 21)}.</p>
        <p>Diviser par ${F(1, 2)}, c'est chercher combien de moitiés il y a : dans 3, il y a 6 moitiés. C'est bien 3 × 2. En général, diviser par ${F('a', 'b')} revient à multiplier par ${F('b', 'a')}.</p>`,
      pieges: [
        { faux: `${F(2, 3)} × ${F(5, 7)} : je mets d'abord au même dénominateur`, juste: 'Pour multiplier, c\'est inutile : on multiplie directement en haut et en bas.' },
        { faux: `${F(2, 3)} ÷ ${F(4, 5)} = ${F(2, 3)} × ${F(4, 5)}`, juste: `On retourne la <strong>deuxième</strong> fraction : ${F(2, 3)} × ${F(5, 4)} = ${F(10, 12)} = ${F(5, 6)}.` }
      ],
      exemple: { niveau: 2, filtre: c => /^produit:/.test(c) },
      verif: { niveaux: [2, 3], filtre: c => /^(produit|division):/.test(c) },
      recherche: 'multiplier diviser des fractions'
    },
    {
      titre: 'Fraction d\'une quantité',
      idee: 'Prendre une fraction d\'une quantité, c\'est multiplier : on divise par le dénominateur, puis on multiplie par le numérateur.',
      pourquoi: `<p>${F(3, 4)} de 20 : on partage 20 en 4 parts égales (5 chacune), et on en prend 3. On obtient 3 × 5 = <strong>15</strong>.</p>
        <p>Le mot « de » se traduit par une multiplication : ${F(3, 4)} de 20 = ${F(3, 4)} × 20.</p>`,
      pieges: [
        { faux: '« 1/4 du reste » calculé sur le total', juste: 'On calcule d\'abord ce qui <strong>reste</strong>, puis la fraction de ce reste.' },
        { faux: `${F(3, 4)} de 20 = 20 ÷ 3 × 4`, juste: 'On divise par le <strong>dénominateur</strong> (4) et on multiplie par le numérateur (3).' }
      ],
      exemple: { niveau: 2, filtre: c => /^quantite:reste/.test(c) },
      verif: { niveaux: [1, 2], filtre: c => /^quantite:/.test(c) },
      recherche: 'fraction d\'une quantité'
    }
  ]
};
