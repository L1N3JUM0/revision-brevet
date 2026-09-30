// Thème 2 — Chapitre 2 : Un monde bipolaire au temps de la guerre froide
export default {
  id: 'guerre-froide',
  titre: 'Un monde bipolaire : la guerre froide',
  theme: 2,
  resume: 'États-Unis contre URSS (1947-1991) : blocs, crises et fin de la guerre froide.',
  periode: [1947, 1991],
  essentiel: [
    'De 1947 à 1991, les États-Unis et l\'URSS, deux <strong>superpuissances</strong>, s\'opposent sans se faire directement la guerre : c\'est la <strong>guerre froide</strong>.',
    'Le monde est <strong>bipolaire</strong> : le bloc de l\'Ouest (démocraties libérales, capitalisme) face au bloc de l\'Est (régimes communistes).',
    '<strong>Berlin</strong> en est le symbole : blocus (1948-1949), construction du mur (1961), chute du mur (1989).',
    'Des crises font craindre une guerre nucléaire (Cuba, 1962). La guerre froide se termine avec la disparition de l\'URSS en <strong>1991</strong>.'
  ],
  evenements: [
    { nom: 'Début de la guerre froide', annee: 1947, repere: true, explication: 'Avec la doctrine Truman et le plan Marshall d\'un côté, la réponse soviétique de l\'autre, le monde se divise en deux blocs.' },
    { nom: 'Blocus de Berlin', annee: 1948, fin: 1949, mois: 6, explication: 'L\'URSS bloque les accès terrestres à Berlin-Ouest ; les Américains ravitaillent la ville par un pont aérien.' },
    { nom: 'Création de l\'OTAN', annee: 1949, mois: 4, jour: 4, date: '4 avril 1949', explication: 'Alliance militaire des pays occidentaux autour des États-Unis.' },
    { nom: 'Proclamation de la République populaire de Chine', annee: 1949, mois: 10, jour: 1, date: '1er octobre 1949', explication: 'Victorieux de la guerre civile, le communiste Mao Zedong prend le pouvoir en Chine.' },
    { nom: 'Guerre de Corée', annee: 1950, fin: 1953, mois: 6, explication: 'La Corée du Nord communiste attaque la Corée du Sud, soutenue par les États-Unis et l\'ONU.' },
    { nom: 'Pacte de Varsovie', annee: 1955, mois: 5, jour: 14, date: '14 mai 1955', explication: 'Alliance militaire de l\'URSS et des démocraties populaires d\'Europe de l\'Est.' },
    { nom: 'Construction du mur de Berlin', annee: 1961, mois: 8, jour: 13, date: '13 août 1961', repere: true, explication: 'La RDA construit un mur pour empêcher ses habitants de fuir vers Berlin-Ouest.' },
    { nom: 'Crise de Cuba', annee: 1962, mois: 10, date: 'octobre 1962', explication: 'L\'installation de missiles soviétiques à Cuba provoque la crise la plus grave de la guerre froide : le monde frôle la guerre nucléaire.' },
    { nom: 'Chute de Saïgon', annee: 1975, mois: 4, jour: 30, date: '30 avril 1975', explication: 'Les communistes vietnamiens prennent Saïgon : c\'est la fin de la guerre du Vietnam, un échec pour les États-Unis.' },
    { nom: 'Chute du mur de Berlin', annee: 1989, mois: 11, jour: 9, date: '9 novembre 1989', repere: true, explication: 'Le mur est ouvert : c\'est le symbole de l\'effondrement des régimes communistes en Europe de l\'Est.' },
    { nom: 'Réunification de l\'Allemagne', annee: 1990, mois: 10, jour: 3, date: '3 octobre 1990', explication: 'La RDA et la RFA forment à nouveau un seul État.' },
    { nom: 'Fin de l\'URSS', annee: 1991, mois: 12, date: 'décembre 1991', repere: true, explication: 'L\'URSS disparaît et laisse place à quinze États indépendants, dont la Russie : la guerre froide est terminée.' }
  ],
  personnages: [
    { nom: 'Harry Truman', description: 'Président des États-Unis qui lance en 1947 la politique d\'endiguement du communisme' },
    { nom: 'John F. Kennedy', description: 'Président des États-Unis pendant la crise de Cuba en 1962, assassiné en 1963' },
    { nom: 'Nikita Khrouchtchev', description: 'Dirigeant de l\'URSS au moment de la construction du mur de Berlin et de la crise de Cuba' },
    { nom: 'Mikhaïl Gorbatchev', description: 'Dernier dirigeant de l\'URSS, il engage des réformes à partir de 1985' },
    { nom: 'Mao Zedong', description: 'Chef communiste qui proclame la République populaire de Chine en 1949' }
  ],
  vocabulaire: [
    { mot: 'Guerre froide', definition: 'Affrontement entre les États-Unis et l\'URSS de 1947 à 1991, sans guerre directe entre eux.' },
    { mot: 'Bloc', definition: 'Ensemble de pays alliés autour d\'une superpuissance (bloc de l\'Ouest, bloc de l\'Est).' },
    { mot: 'Rideau de fer', definition: 'Frontière qui sépare l\'Europe de l\'Ouest de l\'Europe de l\'Est communiste.' },
    { mot: 'Superpuissance', definition: 'État qui domine le monde par sa puissance militaire, économique et culturelle.' },
    { mot: 'Endiguement', definition: 'Politique américaine visant à empêcher l\'extension du communisme dans le monde.' },
    { mot: 'Dissuasion nucléaire', definition: 'Posséder l\'arme nucléaire pour décourager un adversaire d\'attaquer.' },
    { mot: 'Démocratie populaire', definition: 'Nom donné aux régimes communistes d\'Europe de l\'Est contrôlés par l\'URSS.' },
    { mot: 'Course aux armements', definition: 'Compétition entre les deux blocs pour posséder les armes les plus nombreuses et les plus puissantes.' }
  ]
};
