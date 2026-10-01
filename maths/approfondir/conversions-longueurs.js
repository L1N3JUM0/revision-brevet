// Fiche « Explique-moi plus » des conversions de longueurs : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
import { tableau } from '../generators/conversions-longueurs.js';

export default {
  sections: [
    {
      titre: 'Le tableau de conversion',
      idee: 'Dans le tableau km, hm, dam, m, dm, cm, mm, chaque unité vaut 10 fois celle qui est juste à sa droite.',
      pourquoi: `<p>Les préfixes disent combien de mètres il y a dans l'unité : <strong>kilo</strong> = 1 000, <strong>hecto</strong> = 100, <strong>déca</strong> = 10, et dans l'autre sens <strong>déci</strong> = un dixième, <strong>centi</strong> = un centième, <strong>milli</strong> = un millième.</p>
        <p>Donc 1 m = 10 dm = 100 cm = 1 000 mm. Dans le tableau, on place le chiffre des <strong>unités</strong> dans la colonne de l'unité de départ, un chiffre par colonne, puis on lit le nombre jusqu'à la colonne d'arrivée (en ajoutant des 0 si besoin).</p>
        ${tableau(1250, 'm', 'cm')}
        <p>1,25 m : le 1 va dans la colonne m. On lit jusqu'à la colonne cm : <strong>125 cm</strong>.</p>`,
      pieges: [
        { faux: '3,5 m = 35 cm', juste: 'Il faut aller jusqu\'à la colonne cm : on ajoute un 0, 3,5 m = <strong>350 cm</strong>.' },
        { faux: 'Je place le premier chiffre dans la colonne de départ.', juste: 'C\'est le chiffre des <strong>unités</strong> (juste avant la virgule) qui va dans la colonne de départ.' }
      ],
      exemple: { niveau: 1, filtre: c => /^conv:/.test(c) },
      verif: { niveaux: [1, 1], filtre: c => /^conv:/.test(c) },
      recherche: 'convertir des longueurs tableau de conversion'
    },
    {
      titre: 'Multiplier ou diviser ?',
      idee: 'Vers une unité plus petite, on multiplie (le nombre grandit) ; vers une unité plus grande, on divise (le nombre rapetisse).',
      pourquoi: `<p>Il faut beaucoup de petites unités pour faire une grande longueur : 1 km = 1 000 m, donc 2,4 km = 2,4 × 1 000 = 2 400 m.</p>
        <p>Chaque colonne parcourue = un facteur 10. De km à m : 3 colonnes, donc × 1 000.</p>
        <p><strong>Vérification de bon sens</strong> : la même longueur s'écrit avec un nombre plus grand dans une petite unité. 450 cm, c'est 4,5 m, pas 45 000 m.</p>`,
      pieges: [
        { faux: '450 cm = 450 × 100 = 45 000 m', juste: 'Le mètre est plus grand que le cm : on <strong>divise</strong>. 450 cm = <strong>4,5 m</strong>.' },
        { faux: 'De km à m, je multiplie par 100.', juste: 'Compte les colonnes : km → hm → dam → m, 3 colonnes, donc <strong>× 1 000</strong>.' }
      ],
      exemple: { niveau: 2, filtre: c => /^conv:/.test(c) },
      verif: { niveaux: [2, 2], filtre: c => /^conv:/.test(c) },
      recherche: 'conversion de longueurs multiplier diviser'
    },
    {
      titre: 'Le piège',
      idee: 'Avant d\'additionner des longueurs, on les convertit toutes dans la même unité.',
      pourquoi: `<p>1,2 m + 45 cm, c'est comme ajouter 1,2 euro et 45 centimes : il faut d'abord parler la même langue.</p>
        <p class="calcul">1,2 m = 120 cm<br>120 cm + 45 cm = 165 cm</p>
        <p>Pour un tour de terrain rectangulaire, on additionne les <strong>quatre</strong> côtés : 2 longueurs et 2 largeurs (le périmètre).</p>`,
      pieges: [
        { faux: '1,2 m + 45 cm = 46,2', juste: 'On convertit d\'abord : 120 cm + 45 cm = <strong>165 cm</strong>.' },
        { faux: 'Un tour d\'un terrain de 40 m sur 20 m = 60 m', juste: 'Le tour, c\'est le périmètre : 2 × (40 + 20) = <strong>120 m</strong>.' }
      ],
      exemple: { niveau: 3, filtre: c => /^somme:/.test(c) },
      verif: { niveaux: [3, 3], filtre: c => /^(somme|tours):/.test(c) },
      recherche: 'additionner des longueurs unités différentes'
    }
  ]
};
