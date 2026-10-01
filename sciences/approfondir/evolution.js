// Fiche « Explique-moi plus » : biodiversité et évolution. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Les espèces se transforment au fil des générations : des mutations apparaissent au hasard, et le milieu favorise les individus les mieux adaptés.',
      pourquoi: `<p>Les mutations créent des différences entre individus. Quand le milieu change (froid, prédateur, antibiotique…), ceux qui ont un caractère avantageux survivent mieux et ont <strong>plus de descendants</strong> : leurs allèles deviennent plus fréquents. C'est la <strong>sélection naturelle</strong>.</p>
        <p>L'animal ne « décide » pas de changer : les variations existent avant, le milieu fait le tri.</p>`,
      pieges: [
        { faux: 'La girafe a allongé son cou en s\'étirant.', juste: 'Les girafes au cou plus long ont été <strong>favorisées</strong> ; les caractères acquis par l\'effort ne se transmettent pas.' },
        { faux: 'L\'humain descend du chimpanzé.', juste: 'Ils ont un <strong>ancêtre commun</strong> ; aucun ne descend de l\'autre.' }
      ],
      exemple: { niveau: 2, filtre: c => /^seq:selection/.test(c) },
      verif: { niveaux: [2, 3], filtre: prefixe('seq', 'q') },
      recherche: 'sélection naturelle évolution'
    },
    {
      titre: 'Les vertébrés',
      idee: 'On classe les animaux selon les caractères qu\'ils partagent, pas selon leur mode de vie : plus on partage de caractères, plus on est proches parents.',
      pourquoi: `<p>Le dauphin vit dans l'eau comme un poisson, mais il respire avec des poumons et il allaite ses petits : il partage ces caractères avec le cheval. Ils ont hérité ces caractères d'un <strong>ancêtre commun</strong> plus récent que celui qu'ils partagent avec les poissons.</p>`,
      pieges: [
        { faux: 'La chauve-souris est un oiseau car elle vole.', juste: 'Elle a des poils et allaite : c\'est un <strong>mammifère</strong>.' },
        { faux: 'Le dauphin est plus proche du thon que de la vache.', juste: 'Le dauphin partage bien plus de caractères avec la vache : ce sont deux <strong>mammifères</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('parente') },
      verif: { niveaux: [1, 2], filtre: prefixe('classe', 'parente') },
      recherche: 'classification des vertébrés caractères partagés'
    },
    vocabulaire({
      pieges: [
        { faux: 'Une espèce = des animaux qui se ressemblent.', juste: 'Ils doivent aussi pouvoir se reproduire entre eux avec une descendance <strong>fertile</strong> (la mule est stérile).' },
        { faux: 'Une crise biologique dure des millions d\'années.', juste: 'C\'est une disparition massive d\'espèces en <strong>peu de temps</strong> à l\'échelle géologique.' }
      ],
      recherche: 'biodiversité espèce fossile'
    })
  ]
};
