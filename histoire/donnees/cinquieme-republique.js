// Thème 3 — Chapitre 2 : La Ve République, de la République gaullienne à l'alternance et à la cohabitation
export default {
  id: 'cinquieme-republique',
  titre: 'La Ve République',
  theme: 3,
  resume: 'De Gaulle, le suffrage universel direct, l\'alternance et la cohabitation.',
  periode: [1958, 2000],
  essentiel: [
    'En <strong>1958</strong>, en pleine guerre d\'Algérie, de Gaulle revient au pouvoir et fonde la <strong>Ve République</strong> : le pouvoir exécutif est renforcé.',
    'Depuis <strong>1962</strong>, le président de la République est élu au <strong>suffrage universel direct</strong>.',
    'Après de Gaulle (1959-1969), la Ve République connaît l\'<strong>alternance</strong> en 1981 avec l\'élection du socialiste François Mitterrand.',
    'En 1986, la <strong>cohabitation</strong> montre que les institutions fonctionnent même quand le président et le Premier ministre s\'opposent.'
  ],
  evenements: [
    { nom: 'Retour au pouvoir du général de Gaulle', annee: 1958, mois: 6, jour: 1, date: '1er juin 1958', explication: 'En pleine crise de la guerre d\'Algérie, de Gaulle est appelé à la tête du gouvernement.' },
    { nom: 'Fondation de la Ve République', annee: 1958, mois: 10, jour: 4, date: '4 octobre 1958', repere: true, explication: 'La nouvelle Constitution, adoptée par référendum, renforce le pouvoir exécutif, surtout celui du président.' },
    { nom: 'Élection du président au suffrage universel direct', annee: 1962, mois: 10, jour: 28, date: '28 octobre 1962', repere: true, explication: 'Par référendum, les Français décident d\'élire eux-mêmes le président de la République.' },
    { nom: 'Première élection présidentielle au suffrage universel direct', annee: 1965, mois: 12, date: 'décembre 1965', explication: 'De Gaulle est réélu au second tour face à François Mitterrand.' },
    { nom: 'Mai 68', annee: 1968, mois: 5, nomDate: true, date: 'mai 1968', explication: 'Une révolte étudiante puis une grève générale contestent l\'autorité et le pouvoir gaulliste.' },
    { nom: 'Démission du président de Gaulle', annee: 1969, mois: 4, jour: 28, date: '28 avril 1969', explication: 'Après l\'échec d\'un référendum, de Gaulle quitte le pouvoir.' },
    { nom: 'Élection de Valéry Giscard d\'Estaing', annee: 1974, mois: 5, jour: 19, date: '19 mai 1974', explication: 'Le candidat de centre droit devient président de la République.' },
    { nom: 'Alternance : élection de François Mitterrand', annee: 1981, mois: 5, jour: 10, date: '10 mai 1981', repere: true, explication: 'Pour la première fois sous la Ve République, la gauche arrive au pouvoir : c\'est l\'alternance.' },
    { nom: 'Abolition de la peine de mort', annee: 1981, mois: 10, jour: 9, date: '9 octobre 1981', explication: 'La loi défendue par Robert Badinter abolit la peine de mort en France.' },
    { nom: 'Première cohabitation', annee: 1986, mois: 3, date: 'mars 1986', explication: 'Après la victoire de la droite aux élections législatives, le président socialiste nomme Jacques Chirac Premier ministre.' },
    { nom: 'Élection de Jacques Chirac', annee: 1995, mois: 5, jour: 7, date: '7 mai 1995', explication: 'Le maire de Paris, ancien Premier ministre, devient président de la République.' },
    { nom: 'Adoption du quinquennat', annee: 2000, mois: 9, jour: 24, date: '24 septembre 2000', explication: 'Par référendum, la durée du mandat présidentiel passe de 7 à 5 ans.' }
  ],
  personnages: [
    { nom: 'Charles de Gaulle', description: 'Fondateur de la Ve République et président de 1959 à 1969' },
    { nom: 'Georges Pompidou', description: 'Président de la République de 1969 à sa mort en 1974' },
    { nom: 'Valéry Giscard d\'Estaing', description: 'Président de 1974 à 1981, qui abaisse l\'âge de la majorité à 18 ans' },
    { nom: 'François Mitterrand', description: 'Premier président socialiste de la Ve République, de 1981 à 1995' },
    { nom: 'Jacques Chirac', description: 'Premier ministre de la première cohabitation (1986-1988), puis président de 1995 à 2007' },
    { nom: 'Robert Badinter', description: 'Ministre de la Justice qui fait voter l\'abolition de la peine de mort en 1981' }
  ],
  vocabulaire: [
    { mot: 'Ve République', definition: 'Régime politique fondé en 1958, qui donne un rôle central au président de la République.' },
    { mot: 'Alternance', definition: 'Changement de majorité politique au pouvoir, à la suite d\'élections.' },
    { mot: 'Cohabitation', definition: 'Situation où le président et le Premier ministre appartiennent à des camps politiques opposés.' },
    { mot: 'Suffrage universel direct', definition: 'Les citoyens élisent eux-mêmes leur représentant, sans intermédiaire.' },
    { mot: 'Pouvoir exécutif', definition: 'Pouvoir d\'appliquer les lois et de gouverner (président, gouvernement).' },
    { mot: 'Pouvoir législatif', definition: 'Pouvoir de voter les lois (Assemblée nationale et Sénat).' },
    { mot: 'Septennat', definition: 'Mandat de sept ans : durée du mandat présidentiel jusqu\'en 2002.' },
    { mot: 'Quinquennat', definition: 'Mandat de cinq ans : durée du mandat présidentiel depuis 2002.' }
  ]
};
