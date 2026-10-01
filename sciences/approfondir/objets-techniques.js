// Fiche « Explique-moi plus » : objets techniques. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Un objet technique répond à un besoin ; à l\'intérieur, une chaîne d\'information décide et une chaîne d\'énergie agit.',
      pourquoi: `<p>Un portail automatique : la cellule <strong>acquiert</strong> l'information (une voiture arrive), la carte électronique la <strong>traite</strong> (faut-il ouvrir ?), puis <strong>communique</strong> un ordre.</p>
        <p>La chaîne d'énergie exécute cet ordre : la batterie ou le secteur <strong>alimente</strong>, un relais <strong>distribue</strong>, le moteur <strong>convertit</strong> l'énergie électrique en mouvement, les engrenages <strong>transmettent</strong> ce mouvement au portail.</p>`,
      pieges: [
        { faux: 'Le moteur est un capteur.', juste: 'Le moteur est un <strong>actionneur</strong> (il agit) ; un capteur prélève une information.' },
        { faux: 'L\'écran appartient à la chaîne d\'énergie.', juste: 'Il <strong>communique</strong> une information : chaîne d\'information.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('fonction') },
      verif: { niveaux: [1, 2], filtre: prefixe('fonction', 'classe') },
      recherche: 'chaîne d\'information chaîne d\'énergie technologie'
    },
    {
      titre: 'Les formules',
      idee: 'Deux roues dentées en contact font passer le même nombre de dents par seconde : N₁ × Z₁ = N₂ × Z₂. L\'autonomie d\'une batterie vaut t = E ÷ P.',
      pourquoi: `<p>Si la roue menante a 40 dents et la roue menée 10, chaque tour de la grande fait passer 40 dents, soit 4 tours de la petite : la petite tourne <strong>4 fois plus vite</strong>.</p>
        <p>Une batterie de 60 Wh avec un moteur de 30 W : 60 ÷ 30 = <strong>2 h</strong> d'autonomie.</p>`,
      pieges: [
        { faux: 'La petite roue tourne moins vite que la grande.', juste: 'C\'est l\'inverse : la <strong>petite</strong> roue tourne plus vite.' },
        { faux: 'Autonomie = E × P', juste: 'On <strong>divise</strong> l\'énergie stockée par la puissance : t = E ÷ P.' }
      ],
      exemple: { niveau: 3, filtre: prefixe('engrenage') },
      verif: { niveaux: [2, 3], filtre: prefixe('autonomie', 'engrenage') },
      recherche: 'rapport de transmission engrenages'
    },
    vocabulaire({
      pieges: [
        { faux: 'Fonction d\'usage = une contrainte.', juste: 'La <strong>fonction d\'usage</strong> dit à quoi sert l\'objet ; une <strong>contrainte</strong> est une condition à respecter (prix, taille…).' },
        { faux: 'Le prototype est l\'objet vendu.', juste: 'Le <strong>prototype</strong> sert à tester avant la fabrication en série.' }
      ],
      recherche: 'cahier des charges fonction d\'usage'
    })
  ]
};
