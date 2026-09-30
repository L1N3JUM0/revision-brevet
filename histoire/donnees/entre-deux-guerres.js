// Thème 1 — Chapitre 2 : Démocraties fragilisées et expériences totalitaires dans l'Europe de l'entre-deux-guerres
export default {
  id: 'entre-deux-guerres',
  titre: 'L\'entre-deux-guerres : totalitarismes et démocraties',
  theme: 1,
  resume: 'URSS de Staline, Allemagne nazie, Italie fasciste et démocraties en crise.',
  periode: [1917, 1939],
  essentiel: [
    'En Russie, la révolution de <strong>1917</strong> met les bolcheviks au pouvoir ; <strong>Staline</strong> impose ensuite un régime totalitaire (1924-1953).',
    'En Italie (Mussolini, 1922) puis en Allemagne (<strong>Hitler, 1933</strong>), des dictatures fasciste et nazie s\'installent.',
    'Les régimes <strong>totalitaires</strong> reposent sur un parti unique, un chef adoré, la propagande et la terreur (goulag, camps de concentration).',
    'La crise de 1929 fragilise les démocraties. En France, la République résiste : le <strong>Front populaire</strong> (1936) obtient les congés payés.'
  ],
  evenements: [
    { nom: 'Révolutions russes', annee: 1917, repere: true, explication: 'En février, le tsar abdique ; en octobre, les bolcheviks de Lénine prennent le pouvoir par la force.' },
    { nom: 'Arrivée de Mussolini au pouvoir en Italie', annee: 1922, mois: 10, date: 'octobre 1922', explication: 'Après la « marche sur Rome », Mussolini devient chef du gouvernement et installe peu à peu une dictature fasciste.' },
    { nom: 'Staline au pouvoir en URSS', annee: 1924, fin: 1953, repere: true, explication: 'Après la mort de Lénine (1924), Staline impose une dictature totalitaire : collectivisation, terreur, goulag.' },
    { nom: 'Krach de Wall Street', annee: 1929, mois: 10, jour: 24, date: '24 octobre 1929', explication: 'La Bourse de New York s\'effondre : c\'est le début d\'une grave crise économique mondiale.' },
    { nom: 'Hitler au pouvoir en Allemagne', annee: 1933, mois: 1, jour: 30, fin: 1945, repere: true, explication: 'Nommé chancelier en janvier 1933, Hitler installe une dictature nazie, totalitaire et antisémite.' },
    { nom: 'Émeutes du 6 février 1934', annee: 1934, mois: 2, jour: 6, date: '6 février 1934', explication: 'Des ligues d\'extrême droite manifestent violemment à Paris contre la République.' },
    { nom: 'Lois de Nuremberg', annee: 1935, mois: 9, jour: 15, date: 'septembre 1935', explication: 'Lois antisémites qui retirent la citoyenneté allemande aux Juifs et interdisent les mariages entre Juifs et non-Juifs.' },
    { nom: 'Victoire du Front populaire', annee: 1936, mois: 5, repere: true, explication: 'La gauche gagne les élections en France ; le gouvernement de Léon Blum accorde les congés payés et la semaine de 40 heures.' },
    { nom: 'Guerre d\'Espagne', annee: 1936, mois: 7, fin: 1939, explication: 'Guerre civile entre les républicains et les nationalistes du général Franco, aidés par Hitler et Mussolini.' },
    { nom: 'Nuit de Cristal', annee: 1938, mois: 11, jour: 9, date: 'nuit du 9 au 10 novembre 1938', explication: 'Violences antisémites organisées par les nazis : synagogues incendiées, magasins juifs pillés, Juifs arrêtés et tués.' }
  ],
  personnages: [
    { nom: 'Lénine', description: 'Chef des bolcheviks, il dirige la Russie après la révolution d\'octobre 1917 et meurt en 1924' },
    { nom: 'Staline', description: 'Dirigeant de l\'URSS de 1924 à 1953, il impose une dictature totalitaire et envoie des millions de personnes au goulag' },
    { nom: 'Adolf Hitler', description: 'Chef du parti nazi, au pouvoir en Allemagne de 1933 à 1945' },
    { nom: 'Benito Mussolini', description: 'Fondateur du fascisme, au pouvoir en Italie à partir de 1922' },
    { nom: 'Léon Blum', description: 'Socialiste, chef du gouvernement du Front populaire en France en 1936' }
  ],
  vocabulaire: [
    { mot: 'Totalitarisme', definition: 'Régime où un parti unique et son chef contrôlent tout : l\'État, la société et même la vie privée, grâce à la propagande et à la terreur.' },
    { mot: 'Démocratie', definition: 'Régime où les citoyens choisissent leurs dirigeants par des élections libres et où les libertés sont garanties.' },
    { mot: 'Goulag', definition: 'Système de camps de travail forcé en URSS, où étaient envoyés les opposants et les suspects.' },
    { mot: 'Antisémitisme', definition: 'Hostilité et haine envers les Juifs.' },
    { mot: 'Culte de la personnalité', definition: 'Présentation du chef comme un héros infaillible, adoré par le peuple.' },
    { mot: 'Collectivisation', definition: 'En URSS, suppression de la propriété privée des terres, regroupées dans de grandes fermes collectives ou d\'État.' },
    { mot: 'Fascisme', definition: 'Idéologie de Mussolini : nationalisme, parti unique, culte du chef et rejet de la démocratie.' },
    { mot: 'Congés payés', definition: 'Jours de vacances payés par l\'employeur, obtenus en France en 1936 (deux semaines).' }
  ]
};
