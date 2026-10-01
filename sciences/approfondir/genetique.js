// Fiche « Explique-moi plus » : génétique et hérédité. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Les chromosomes vont par paires : un de la mère, un du père. Les gamètes n\'en ont qu\'un de chaque paire, et la fécondation reforme les paires.',
      pourquoi: `<p>Chez l'être humain : 46 chromosomes = 23 paires. Si les gamètes en avaient 46, l'enfant en aurait 92 ! La <strong>méiose</strong> divise donc par deux : 23 dans l'ovule, 23 dans le spermatozoïde, et la <strong>fécondation</strong> donne 23 + 23 = 46.</p>
        <p>La <strong>mitose</strong>, elle, copie la cellule à l'identique (croissance, réparation) : même nombre de chromosomes.</p>
        <p>Pour un gène, chaque enfant reçoit un allèle de chaque parent. Un allèle <strong>dominant</strong> s'exprime dès qu'il est présent ; un allèle <strong>récessif</strong> seulement s'il est en double.</p>`,
      pieges: [
        { faux: 'Après une mitose, chaque cellule a 23 chromosomes.', juste: 'La mitose donne des cellules <strong>identiques</strong> : 46. C\'est la méiose qui donne 23.' },
        { faux: 'Allèles A et O : groupe AO.', juste: 'O est récessif : avec A et O, le groupe est <strong>A</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('chromo') },
      verif: { niveaux: [2, 3], filtre: prefixe('chromo', 'groupe') },
      recherche: 'chromosomes méiose fécondation'
    },
    {
      titre: 'Du plus petit au plus grand',
      idee: 'Le gène est un morceau d\'ADN ; l\'ADN forme les chromosomes ; les chromosomes sont dans le noyau de chaque cellule.',
      pourquoi: `<p>C'est comme une bibliothèque : le <strong>noyau</strong> est la bibliothèque, chaque <strong>chromosome</strong> un livre, l'<strong>ADN</strong> le texte du livre, et un <strong>gène</strong> une recette dans ce texte.</p>
        <p>Toutes les cellules du corps ont la même bibliothèque : elles viennent toutes de la cellule-œuf par mitoses successives.</p>`,
      pieges: [
        { faux: 'Un chromosome est plus petit qu\'un gène.', juste: 'Un gène est une <strong>portion</strong> d\'un chromosome.' },
        { faux: 'Les cellules de la peau et du cœur ont des gènes différents.', juste: 'Elles ont les <strong>mêmes</strong> gènes, mais n\'utilisent pas les mêmes.' }
      ],
      exemple: { niveau: 2, filtre: c => /^seq:taille/.test(c) },
      verif: { niveaux: [2, 3], filtre: prefixe('seq') },
      recherche: 'ADN gène chromosome noyau'
    },
    vocabulaire({
      pieges: [
        { faux: 'Gène et allèle, c\'est pareil.', juste: 'Le <strong>gène</strong> est l\'emplacement (groupe sanguin) ; l\'<strong>allèle</strong> en est une version (A, B ou O).' },
        { faux: 'Mitose et méiose, c\'est la même division.', juste: '<strong>Mitose</strong> : 2 cellules identiques. <strong>Méiose</strong> : les gamètes, avec la moitié des chromosomes.' }
      ],
      recherche: 'gène allèle mitose méiose'
    })
  ]
};
