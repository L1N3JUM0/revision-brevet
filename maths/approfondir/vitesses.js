// Fiche « Explique-moi plus » des vitesses : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.

const calcul = c => /^(vitesse|distance|temps):/.test(c);

export default {
  sections: [
    {
      titre: 'La formule',
      idee: 'La vitesse moyenne, c\'est la distance parcourue divisée par le temps mis : v = d ÷ t.',
      pourquoi: `<p>90 km/h veut dire « 90 km en 1 heure ».</p>
        <ul>
          <li>En 2 h, on parcourt 2 fois plus : 90 × 2 = 180 km. C'est <strong>d = v × t</strong>.</li>
          <li>Pour 180 km à 90 km/h, il faut 180 ÷ 90 = 2 h. C'est <strong>t = d ÷ v</strong>.</li>
        </ul>
        <p>Les trois formules sont la même égalité, écrite de trois façons. Les unités doivent aller ensemble : km, h et km/h, ou m, s et m/s.</p>`,
      pieges: [
        { faux: 'v = t ÷ d', juste: 'C\'est la <strong>distance</strong> qu\'on divise par le temps : v = d ÷ t.' },
        { faux: '150 km en 90 min : v = 150 ÷ 90', juste: 'Pour des km/h, le temps doit être en <strong>heures</strong> : 90 min = 1,5 h, donc v = 150 ÷ 1,5 = 100 km/h.' }
      ],
      exemple: { niveau: 1, filtre: c => /^vitesse:/.test(c) },
      verif: { niveaux: [1, 1], filtre: calcul },
      recherche: 'calculer une vitesse moyenne'
    },
    {
      titre: 'Le temps en heures',
      idee: 'Avant de calculer avec des km/h, on écrit le temps en heures décimales.',
      pourquoi: `<p>Le km/h compte des kilomètres <strong>par heure</strong>. Si le temps est en heures et minutes, on le convertit :</p>
        <p class="calcul">30 min = 30 ÷ 60 h = 0,5 h<br>1 h 30 min = 1,5 h</p>
        <p>Pour une durée trouvée en heures décimales (2,25 h), on fait l'inverse : 0,25 × 60 = 15 min, donc 2 h 15 min.</p>`,
      pieges: [
        { faux: '1 h 30 min = 1,30 h', juste: '30 min = 0,5 h, donc 1 h 30 min = <strong>1,5 h</strong>.' },
        { faux: 't = 2,25 h, donc 2 h 25 min', juste: '0,25 h = 0,25 × 60 = 15 min : <strong>2 h 15 min</strong>.' }
      ],
      exemple: { niveau: 2, filtre: calcul },
      verif: { niveaux: [2, 2], filtre: calcul },
      recherche: 'vitesse temps en heures décimales'
    },
    {
      titre: 'km/h ↔ m/s',
      idee: 'Pour passer des km/h aux m/s, on divise par 3,6 ; pour passer des m/s aux km/h, on multiplie par 3,6.',
      pourquoi: `<p>1 km/h, c'est 1 000 m en 3 600 s. En une seconde, on parcourt donc 1 000 ÷ 3 600 m, c'est-à-dire 1 ÷ 3,6 m.</p>
        <p class="calcul">90 km/h = 90 ÷ 3,6 = 25 m/s</p>
        <p>Vérification de bon sens : en m/s, le nombre est <strong>plus petit</strong> qu'en km/h (un mètre est bien plus court qu'un kilomètre).</p>`,
      pieges: [
        { faux: '90 km/h = 90 × 3,6 = 324 m/s', juste: 'Vers les m/s, on <strong>divise</strong> : 90 ÷ 3,6 = 25 m/s.' },
        { faux: '90 km/h = 90 ÷ 60 m/s', juste: '1 h = 3 600 s (et pas 60) et 1 km = 1 000 m : on divise par 3,6.' }
      ],
      exemple: { niveau: 2, filtre: c => /^(kmh-ms|ms-kmh):/.test(c) },
      verif: { niveaux: [2, 2], filtre: c => /^(kmh-ms|ms-kmh):/.test(c) },
      recherche: 'convertir km/h en m/s'
    }
  ]
};
