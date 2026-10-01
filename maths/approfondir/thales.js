// Fiche « Explique-moi plus » du théorème de Thalès : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
import { figureCours } from '../generators/thales.js';
import { fracHtml as F } from '../../assets/js/core/answer.js';

export default {
  sections: [
    {
      titre: 'Le théorème',
      idee: 'Quand une droite parallèle à un côté coupe un triangle, elle découpe un petit triangle qui est une réduction du grand : les longueurs sont proportionnelles.',
      pourquoi: `<p>Le petit triangle AMN a <strong>la même forme</strong> que le grand triangle ABC : mêmes angles, car (MN) et (BC) sont parallèles.</p>
        <p>C'est comme une photo réduite : si AM est la moitié de AB, alors AN est aussi la moitié de AC, et MN la moitié de BC. Le même coefficient s'applique partout :</p>
        <p class="calcul">${F('AM', 'AB')} = ${F('AN', 'AC')} = ${F('MN', 'BC')}</p>`,
      figure: figureCours(false),
      pieges: [
        { faux: `${F('AM', 'MB')} = ${F('AN', 'NC')} = ${F('MN', 'BC')}`, juste: `On divise par le côté <strong>entier</strong> du grand triangle : ${F('AM', 'AB')}, pas ${F('AM', 'MB')}.` },
        { faux: `${F('AM', 'AB')} = ${F('AC', 'AN')}`, juste: 'Le petit triangle toujours en haut, le grand toujours en bas, dans chaque quotient.' }
      ],
      exemple: { niveau: 1, filtre: cle => /^longueur:simple/.test(cle) },
      verif: { niveaux: [1, 1], filtre: cle => /^longueur:simple/.test(cle) },
      recherche: 'théorème de Thalès'
    },
    {
      titre: 'La configuration papillon',
      idee: 'C\'est le même théorème quand les deux triangles sont de part et d\'autre du point A : on part toujours du point d\'intersection.',
      pourquoi: `<p>Fais faire un <strong>demi-tour</strong> au petit triangle AMN autour du point A : il vient se poser sur le grand triangle, exactement comme dans la configuration classique.</p>
        <p>Les longueurs n'ont pas changé pendant le demi-tour, donc les rapports sont les mêmes.</p>`,
      figure: figureCours(true),
      pieges: [
        { faux: 'J\'associe M avec C et N avec B.', juste: 'M et B sont sur la même droite passant par A : AM va avec AB, AN va avec AC.' },
        { faux: 'Je pars du point M ou du point B.', juste: 'Toutes les longueurs partent du point d\'intersection <strong>A</strong> (sauf MN et BC).' }
      ],
      exemple: { niveau: 2, filtre: cle => /^longueur:papillon/.test(cle) },
      verif: { niveaux: [2, 2], filtre: cle => /^longueur:papillon/.test(cle) },
      recherche: 'Thalès configuration papillon'
    },
    {
      titre: 'Calculer une longueur',
      idee: 'On écrit les trois quotients égaux, on remplace par les longueurs connues, puis on calcule avec le produit en croix.',
      pourquoi: `<p>Deux quotients égaux, c'est un tableau de proportionnalité. Si ${F('a', 'b')} = ${F('c', 'd')}, alors <strong>a × d = b × c</strong> (produit en croix).</p>
        <p>Exemple : ${F(3, 5)} = ${F('AN', 8)} donne AN × 5 = 3 × 8, donc AN = 8 × 3 ÷ 5 = 4,8.</p>`,
      pieges: [
        { faux: 'AN = 8 × 3 ÷ 2 (en divisant par MB = 2).', juste: 'On divise par <strong>AB = 5</strong>, le côté entier.' },
        { faux: 'J\'écris directement les nombres.', juste: 'Au brevet, on cite d\'abord les hypothèses : droites sécantes en A et (MN) // (BC).' }
      ],
      exemple: { niveau: 2, filtre: cle => /^longueur:/.test(cle) },
      verif: { niveaux: [1, 2], filtre: cle => /^longueur:/.test(cle) },
      recherche: 'Thalès calculer une longueur'
    },
    {
      titre: 'Parallèles ou pas ?',
      idee: 'On calcule séparément les deux quotients : s\'ils sont égaux (points dans le même ordre), les droites sont parallèles ; sinon, elles ne le sont pas.',
      pourquoi: `<p>Si les droites étaient parallèles, Thalès donnerait des quotients égaux. Donc des quotients <strong>différents</strong> prouvent qu'elles ne sont pas parallèles.</p>
        <p>Dans l'autre sens, la <strong>réciproque</strong> du théorème garantit que des quotients égaux (avec les points dans le même ordre) suffisent pour conclure au parallélisme.</p>`,
      pieges: [
        { faux: `J'écris ${F('AM', 'AB')} = ${F('AN', 'AC')} avant de calculer.`, juste: 'On calcule « d\'une part… d\'autre part… », puis on compare.' },
        { faux: 'Les droites ont l\'air parallèles sur la figure.', juste: 'Une figure ne prouve rien : seul le calcul permet de conclure.' },
        { faux: 'Je compare des valeurs arrondies.', juste: 'On compare des valeurs exactes (fractions simplifiées ou décimaux exacts).' }
      ],
      exemple: { niveau: 3, filtre: cle => /^reciproque:/.test(cle) },
      verif: { niveaux: [3, 3], filtre: cle => /^reciproque:/.test(cle) },
      recherche: 'réciproque du théorème de Thalès'
    }
  ]
};
