// Fiche « Explique-moi plus » des conversions de durées : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.

export default {
  sections: [
    {
      titre: 'Les bases',
      idee: 'Les durées se comptent par paquets de 60 : 1 h = 60 min et 1 min = 60 s.',
      pourquoi: `<p>Contrairement aux longueurs, les durées ne marchent pas par 10 : il faut 60 minutes pour faire une heure.</p>
        <p>Pour transformer des minutes en heures, on cherche combien de <strong>paquets de 60</strong> on peut faire, et ce qui reste :</p>
        <p class="calcul">150 = 2 × 60 + 30<br>150 min = 2 h 30 min</p>
        <p>Dans l'autre sens, on multiplie : 3 h 15 min = 3 × 60 + 15 = 195 min.</p>`,
      pieges: [
        { faux: '150 min = 1 h 50 min', juste: 'On fait des paquets de 60, pas de 100 : 150 min = <strong>2 h 30 min</strong>.' },
        { faux: '1 h = 100 min', juste: '1 h = <strong>60 min</strong>, et 1 h = 3 600 s.' }
      ],
      exemple: { niveau: 1, filtre: c => /^(min-en-h|h-en-min):/.test(c) },
      verif: { niveaux: [1, 1], filtre: c => /^(min-en-h|h-en-min|min-en-s|s-en-min):/.test(c) },
      recherche: 'convertir des durées heures minutes'
    },
    {
      titre: 'Les heures décimales',
      idee: 'La partie après la virgule d\'une durée en heures est une fraction d\'heure : on la multiplie par 60 pour avoir des minutes.',
      pourquoi: `<p>0,5 h, c'est une demi-heure : 30 min. 0,75 h, ce sont trois quarts d'heure : 0,75 × 60 = <strong>45 min</strong>.</p>
        <p>Dans l'autre sens, une minute vaut ${'1/60'} d'heure : 36 min = 36 ÷ 60 = <strong>0,6 h</strong>.</p>
        <p>À connaître : 0,25 h = 15 min ; 0,5 h = 30 min ; 0,75 h = 45 min ; 0,1 h = 6 min.</p>`,
      pieges: [
        { faux: '1,75 h = 1 h 75 min', juste: '0,75 h = 0,75 × 60 = 45 min, donc 1,75 h = <strong>1 h 45 min</strong>.' },
        { faux: '2 h 30 min = 2,30 h', juste: '30 min = 30 ÷ 60 = 0,5 h, donc 2 h 30 min = <strong>2,5 h</strong>.' }
      ],
      exemple: { niveau: 2, filtre: c => /^(dec-en-h|h-en-dec):/.test(c) },
      verif: { niveaux: [2, 2], filtre: c => /^(dec-en-h|h-en-dec):/.test(c) },
      recherche: 'heures décimales en heures et minutes'
    },
    {
      titre: 'Durée entre deux horaires',
      idee: 'Pour calculer une durée entre deux horaires, on avance par étapes en passant par les heures pleines.',
      pourquoi: `<p>Les minutes repartent de 0 toutes les 60 : on ne peut pas toujours soustraire directement (10 − 35 ne marche pas).</p>
        <p>En sautant d'heure pleine en heure pleine, on additionne des morceaux faciles :</p>
        <p class="calcul">14 h 35 → 15 h : 25 min<br>15 h → 17 h : 2 h<br>17 h → 17 h 10 : 10 min</p>
        <p>Total : 2 h 35 min.</p>`,
      pieges: [
        { faux: '17 h 10 − 14 h 35 = 3 h 25 min', juste: 'Les minutes ne se soustraient pas comme des nombres ordinaires : on passe par 15 h, et on trouve <strong>2 h 35 min</strong>.' },
        { faux: 'Une durée de 17 h 10', juste: '17 h 10 est un <strong>horaire</strong> (une heure de la journée). Une durée s\'écrit 2 h 35 min.' }
      ],
      exemple: { niveau: 2, filtre: c => /^ecart:/.test(c) },
      verif: { niveaux: [2, 3], filtre: c => /^(ecart|probleme):/.test(c) },
      recherche: 'calculer une durée entre deux horaires'
    }
  ]
};
