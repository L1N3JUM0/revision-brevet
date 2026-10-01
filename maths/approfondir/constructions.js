// Fiche « Explique-moi plus » des constructions géométriques : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
// Les exemples et la mini-vérif sont des constructions sur papier : on mesure ensuite un angle ou une longueur.

export default {
  sections: [
    {
      titre: 'Triangle : trois côtés connus',
      idee: 'On trace un côté à la règle, puis on reporte les deux autres longueurs au compas depuis ses extrémités : le troisième sommet est au croisement des arcs.',
      pourquoi: `<p>Si AC = 7 cm, le point C est à 7 cm de A : il se trouve sur le <strong>cercle</strong> de centre A et de rayon 7 cm.</p>
        <p>Si BC = 5 cm, C est aussi sur le cercle de centre B et de rayon 5 cm. Il est donc à l'<strong>intersection</strong> des deux cercles : c'est pour ça qu'il suffit de tracer deux arcs.</p>`,
      pieges: [
        { faux: 'J\'efface les arcs à la fin.', juste: 'On <strong>laisse les arcs</strong> : ils prouvent que la construction est juste.' },
        { faux: 'Mes arcs ne se croisent pas.', juste: 'Trace des arcs assez longs, de part et d\'autre de l\'endroit prévu pour le sommet.' }
      ],
      exemple: { niveau: 1, filtre: c => /^ccc:/.test(c) },
      verif: { niveaux: [1, 1], filtre: c => /^ccc:/.test(c) },
      recherche: 'construire un triangle connaissant les trois côtés'
    },
    {
      titre: 'Triangle rectangle',
      idee: 'On trace l\'angle droit avec l\'équerre, puis on reporte les longueurs connues à la règle (ou au compas pour l\'hypoténuse).',
      pourquoi: `<p>L'équerre garantit un angle de 90° exactement, ce qu'un tracé « à l'œil » ne garantit pas.</p>
        <p>Si on connaît l'hypoténuse, on la reporte au compas depuis l'autre sommet : le troisième point est là où l'arc coupe le côté perpendiculaire.</p>`,
      pieges: [
        { faux: 'Je trace l\'angle droit à vue.', juste: 'On utilise toujours l\'<strong>équerre</strong>, et on code l\'angle droit par un petit carré.' },
        { faux: 'Je mesure à partir du bord de la règle.', juste: 'On mesure à partir de la graduation <strong>0</strong>.' }
      ],
      exemple: { niveau: 1, filtre: c => /^rect:/.test(c) },
      verif: { niveaux: [1, 1], filtre: c => /^rect:/.test(c) },
      recherche: 'construire un triangle rectangle équerre'
    },
    {
      titre: 'La médiatrice au compas',
      idee: 'La médiatrice de [AB] est la droite perpendiculaire à [AB] qui passe par son milieu : tous ses points sont à la même distance de A et de B.',
      pourquoi: `<p>Deux arcs de <strong>même rayon</strong>, centrés en A et en B, se croisent en deux points. Chacun est à la même distance de A et de B : ils sont donc sur la médiatrice.</p>
        <p>Deux points suffisent pour tracer une droite. Le centre du cercle circonscrit à un triangle est au croisement des médiatrices : il est à la même distance des trois sommets.</p>`,
      pieges: [
        { faux: 'Je change l\'écartement du compas entre les deux arcs.', juste: 'Le rayon doit être le <strong>même</strong> pour les deux arcs.' },
        { faux: 'Mes arcs ne se coupent pas.', juste: 'Prends un rayon plus grand que la moitié de AB.' }
      ],
      exemple: { niveau: 3, filtre: c => /^circ:/.test(c) },
      verif: { niveaux: [3, 3], filtre: c => /^circ:/.test(c) },
      recherche: 'construire la médiatrice au compas'
    },
    {
      titre: 'Les bons réflexes',
      idee: 'Une construction réussie se lit sur la feuille : traits fins, traits de construction visibles, points nommés et codages.',
      pourquoi: `<p>Le correcteur ne voit que ta feuille : les arcs montrent que tu as utilisé le compas, les codages montrent les angles droits et les longueurs égales.</p>
        <p>Avec le rapporteur : le centre sur le sommet, le 0 sur le premier côté, et on lit la graduation qui part de ce 0.</p>`,
      pieges: [
        { faux: 'Je lis 130° au lieu de 50°.', juste: 'On lit la graduation qui part du <strong>0</strong> placé sur le côté. Un angle aigu mesure moins de 90°.' },
        { faux: 'Le centre du rapporteur est à côté du sommet.', juste: 'Le centre doit être <strong>exactement</strong> sur le sommet de l\'angle.' }
      ],
      exemple: { niveau: 2, filtre: c => /^(cac|aca):/.test(c) },
      verif: { niveaux: [2, 2], filtre: c => /^(cac|aca):/.test(c) },
      recherche: 'utiliser un rapporteur construire un angle'
    }
  ]
};
