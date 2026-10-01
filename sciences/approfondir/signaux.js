// Fiche « Explique-moi plus » : lumière et son. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Le son est une vibration qui a besoin de matière pour se propager ; la lumière se propage même dans le vide, et beaucoup plus vite.',
      pourquoi: `<p>Un son, ce sont des molécules qui se poussent les unes les autres : sans molécules (dans le vide), rien ne peut vibrer, donc pas de son. Dans un solide, les particules sont plus proches : le son va plus vite (environ 340 m/s dans l'air, 1 500 m/s dans l'eau).</p>
        <p>La lumière va à 300 000 km/s : pour un orage, elle arrive presque tout de suite, alors que le tonnerre met environ 3 secondes par kilomètre.</p>`,
      pieges: [
        { faux: 'On entend les explosions dans l\'espace.', juste: 'Dans le vide, pas de matière : <strong>pas de son</strong>.' },
        { faux: 'Le son va plus vite dans l\'air que dans l\'eau.', juste: 'C\'est l\'inverse : environ 1 500 m/s dans l\'eau contre 340 m/s dans l\'air.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('orage') },
      verif: { niveaux: [1, 2], filtre: prefixe('orage', 'freq', 'q', 'vf') },
      recherche: 'propagation du son et de la lumière'
    },
    {
      titre: 'Les formules',
      idee: 'Distance = vitesse × durée ; pour un écho, le signal fait l\'aller et le retour, donc on divise par 2.',
      pourquoi: `<p>Le sonar mesure le temps que met le son pour aller jusqu'au fond <strong>et revenir</strong>. En 2 s dans l'eau, le son parcourt 1 500 × 2 = 3 000 m, mais le fond n'est qu'à la moitié : 1 500 m.</p>
        <p>La fréquence f = 1 ÷ T : si un motif se répète toutes les 0,002 s, il se répète 500 fois par seconde (500 Hz).</p>`,
      pieges: [
        { faux: 'Écho après 2 s dans l\'air : la falaise est à 340 × 2 = 680 m.', juste: 'Aller-retour : on divise par 2, la falaise est à <strong>340 m</strong>.' },
        { faux: 'T = 2 ms, f = 1 ÷ 2 = 0,5 Hz.', juste: 'La période doit être en secondes : 2 ms = 0,002 s, f = <strong>500 Hz</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('echo') },
      verif: { niveaux: [2, 3], filtre: prefixe('echo', 'lumiere', 'periode') },
      recherche: 'écho sonar vitesse du son calcul'
    },
    vocabulaire({
      pieges: [
        { faux: 'Ultrason = son très fort.', juste: 'Ultrason = son très <strong>aigu</strong> (plus de 20 000 Hz). Le niveau sonore, en dB, dit s\'il est fort.' },
        { faux: 'L\'année-lumière est une durée.', juste: 'C\'est une <strong>distance</strong> : celle parcourue par la lumière en un an.' }
      ],
      recherche: 'fréquence ultrasons infrasons décibels'
    })
  ]
};
