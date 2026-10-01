// Fiche « Explique-moi plus » : acides, bases et pH. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Le pH mesure l\'acidité : en dessous de 7, la solution est acide ; à 7, neutre ; au-dessus de 7, basique.',
      pourquoi: `<p>Une solution acide contient plus d'ions <strong>H⁺</strong> que d'ions HO⁻ ; une solution basique, plus d'ions <strong>HO⁻</strong>. Le pH résume ce déséquilibre par un seul nombre.</p>
        <p>Quand on ajoute de l'eau (dilution), les ions sont plus dispersés : la solution devient moins acide (ou moins basique) et son pH <strong>se rapproche de 7</strong>, sans le dépasser.</p>`,
      pieges: [
        { faux: 'pH 2 est moins acide que pH 5.', juste: 'Plus le pH est <strong>petit</strong>, plus la solution est acide.' },
        { faux: 'En diluant beaucoup un acide, il devient basique.', juste: 'Son pH se rapproche de 7 mais ne le dépasse pas.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('dilution') },
      verif: { niveaux: [1, 2], filtre: prefixe('nature', 'dilution') },
      recherche: 'pH acide basique neutre dilution'
    },
    {
      titre: 'L\'échelle de pH',
      idee: 'Pour ranger des solutions de la plus acide à la plus basique, on les range par pH croissant.',
      pourquoi: `<p>L'échelle de pH va de 0 à 14. Le jus de citron (environ 2,5) est très acide, l'eau pure (7) est neutre, le déboucheur (environ 13,5) est très basique.</p>
        <p>Aux deux extrémités, les solutions sont <strong>corrosives</strong> : gants et lunettes.</p>`,
      pieges: [
        { faux: 'Je range du pH le plus grand au plus petit pour aller du plus acide au plus basique.', juste: 'Le plus acide a le pH le plus <strong>petit</strong> : on range par pH croissant.' },
        { faux: 'Seuls les acides sont dangereux.', juste: 'Les bases concentrées (eau de Javel, déboucheur) sont aussi <strong>corrosives</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('ordre') },
      verif: { niveaux: [2, 3], filtre: prefixe('ordre') },
      recherche: 'échelle de pH'
    },
    vocabulaire({
      pieges: [
        { faux: 'Une solution basique contient plus d\'ions H⁺.', juste: 'Basique : plus d\'ions <strong>HO⁻</strong>. Acide : plus d\'ions H⁺.' },
        { faux: 'Diluer, c\'est ajouter de l\'acide.', juste: 'Diluer, c\'est ajouter de l\'<strong>eau</strong>.' }
      ],
      recherche: 'acide base ions H+ HO-'
    })
  ]
};
