// Fiche « Explique-moi plus » : climat, écosystèmes et environnement. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'L\'effet de serre est naturel ; en brûlant pétrole, charbon et gaz, les humains l\'ont renforcé, ce qui réchauffe le climat.',
      pourquoi: `<p>Le Soleil chauffe le sol, qui renvoie de la chaleur vers l'espace. Les gaz à effet de serre (vapeur d'eau, CO₂, méthane) en retiennent une partie, comme une couverture. Plus il y a de CO₂, plus la couverture est épaisse.</p>
        <p>Chaque kilomètre en voiture rejette du CO₂ : à 120 g/km, 100 km font 12 000 g = <strong>12 kg</strong>. Partager la voiture divise les émissions par personne.</p>
        <p>Dans un écosystème, les végétaux (<strong>producteurs</strong>) fabriquent la matière grâce à la lumière ; les animaux la consomment ; les décomposeurs la recyclent.</p>`,
      pieges: [
        { faux: 'L\'effet de serre est une pollution.', juste: 'Il est <strong>naturel</strong> et nécessaire ; c\'est son renforcement qui pose problème.' },
        { faux: 'Herbe → lapin → renard : le renard mange l\'herbe.', juste: 'La flèche veut dire « <strong>est mangé par</strong> » : l\'herbe est mangée par le lapin.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('trajet', 'covoit') },
      verif: { niveaux: [1, 2], filtre: prefixe('chaine', 'trajet', 'classe') },
      recherche: 'effet de serre réchauffement climatique'
    },
    vocabulaire({
      pieges: [
        { faux: 'Météo et climat, c\'est pareil.', juste: '<strong>Météo</strong> : le temps de quelques jours. <strong>Climat</strong> : la moyenne sur au moins 30 ans.' },
        { faux: 'Un décomposeur est un producteur.', juste: 'Le <strong>producteur</strong> fabrique la matière (végétal) ; le <strong>décomposeur</strong> recycle la matière morte.' }
      ],
      recherche: 'écosystème producteur décomposeur'
    })
  ]
};
