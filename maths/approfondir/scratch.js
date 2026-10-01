// Fiche « Explique-moi plus » de Scratch : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
import { scene } from '../generators/scratch.js';

const boucle = c => /"op":"repeter"/.test(c);

export default {
  sections: [
    {
      titre: 'La scène et l\'orientation',
      idee: 'La scène est un repère : x donne la position horizontale, y la position verticale, et l\'orientation se donne en degrés (90 vers la droite, 0 vers le haut).',
      pourquoi: `<p>Comme en maths, x augmente vers la <strong>droite</strong> et y vers le <strong>haut</strong>. Le centre de la scène est le point (0 ; 0).</p>
        <p>L'orientation fonctionne comme une boussole : 0 = nord (haut), 90 = est (droite), 180 = sud (bas), −90 = ouest (gauche).</p>`,
      figure: scene({ x: 0, y: 0 }, 0),
      pieges: [
        { faux: '(40 ; −20) : 40 vers le haut, 20 vers la gauche.', juste: 'Le premier nombre est <strong>x</strong> (horizontal) : 40 vers la droite, puis 20 vers le bas.' },
        { faux: 'Orientation 180 : vers la gauche.', juste: '180, c\'est vers le <strong>bas</strong>. Vers la gauche, c\'est −90.' }
      ],
      exemple: { niveau: 1, filtre: c => /^coord:1:/.test(c) },
      verif: { niveaux: [1, 1], filtre: c => /^coord:1:/.test(c) },
      recherche: 'Scratch coordonnées orientation'
    },
    {
      titre: 'Les blocs de mouvement',
      idee: 'On exécute les blocs un par un, en notant à chaque fois la position et l\'orientation du lutin.',
      pourquoi: `<p>« Avancer de 50 » change x <strong>ou</strong> y selon l'orientation : vers la droite, x augmente de 50 ; vers le bas, y diminue de 50.</p>
        <p>« Tourner » change seulement l'orientation : le lutin ne bouge pas. « Aller à x : … y : … » le place directement au point indiqué.</p>`,
      pieges: [
        { faux: '« Tourner de 90 » fait avancer le lutin.', juste: 'Tourner change seulement la <strong>direction</strong>, pas la position.' },
        { faux: '↻ et ↺, c\'est pareil.', juste: '↻ : sens des aiguilles d\'une montre (vers la droite). ↺ : sens inverse (vers la gauche).' }
      ],
      exemple: { niveau: 2, filtre: c => /^coord:2:/.test(c) },
      verif: { niveaux: [2, 2], filtre: c => /^coord:2:/.test(c) },
      recherche: 'Scratch blocs de mouvement avancer tourner'
    },
    {
      titre: 'La boucle « répéter »',
      idee: 'Tout ce qui est à l\'intérieur de « répéter n fois » est exécuté n fois de suite, dans l\'ordre ; ensuite, le programme continue.',
      pourquoi: `<p>Une boucle évite d'écrire plusieurs fois les mêmes blocs : « répéter 4 fois (avancer de 40, tourner de 90) » remplace 8 blocs.</p>
        <p>Méthode sûre : un tableau avec la position et l'orientation <strong>après chaque tour</strong> de boucle.</p>`,
      pieges: [
        { faux: 'Je fais la boucle une seule fois.', juste: 'On recommence le contenu de la boucle autant de fois que le nombre indiqué.' },
        { faux: 'Je refais aussi le bloc placé après la boucle à chaque tour.', juste: 'Seuls les blocs <strong>à l\'intérieur</strong> sont répétés ; ceux d\'après ne sont faits qu\'une fois.' }
      ],
      exemple: { niveau: 3, filtre: boucle },
      verif: { niveaux: [2, 3], filtre: boucle },
      recherche: 'Scratch boucle répéter'
    }
  ]
};
