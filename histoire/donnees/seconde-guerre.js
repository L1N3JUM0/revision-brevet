// Thème 1 — Chapitre 3 : La Deuxième Guerre mondiale, une guerre d'anéantissement
export default {
  id: 'seconde-guerre',
  titre: 'La Seconde Guerre mondiale',
  theme: 1,
  resume: 'Une guerre d\'anéantissement (1939-1945) et le génocide des Juifs et des Tsiganes.',
  periode: [1939, 1946],
  essentiel: [
    'De 1939 à 1945, l\'<strong>Axe</strong> (Allemagne, Italie, Japon) affronte les <strong>Alliés</strong> (Royaume-Uni, URSS, États-Unis…).',
    'C\'est une <strong>guerre d\'anéantissement</strong> : les civils sont visés (bombardements, massacres) et représentent la majorité des quelque 60 millions de morts.',
    'Les nazis organisent le génocide des Juifs (<strong>Shoah</strong>, près de 6 millions de morts) et des Tsiganes, par balles puis dans des centres de mise à mort.',
    'L\'Allemagne capitule le <strong>8 mai 1945</strong> ; le Japon capitule après les bombardements atomiques d\'<strong>Hiroshima et Nagasaki</strong> (août 1945).'
  ],
  evenements: [
    { nom: 'Seconde Guerre mondiale', annee: 1939, fin: 1945, repere: true, explication: 'Guerre mondiale qui fait environ 60 millions de morts, en majorité des civils.' },
    { nom: 'Invasion de la Pologne par l\'Allemagne', annee: 1939, mois: 9, jour: 1, date: '1er septembre 1939', explication: 'Le Royaume-Uni et la France déclarent la guerre à l\'Allemagne le 3 septembre.' },
    { nom: 'Attaque allemande contre l\'URSS', annee: 1941, mois: 6, jour: 22, date: '22 juin 1941', explication: 'C\'est l\'opération Barbarossa : la guerre à l\'Est devient une guerre d\'anéantissement.' },
    { nom: 'Attaque japonaise de Pearl Harbor', annee: 1941, mois: 12, jour: 7, date: '7 décembre 1941', explication: 'Le Japon attaque la flotte américaine à Hawaï : les États-Unis entrent en guerre.' },
    { nom: 'Conférence de Wannsee', annee: 1942, mois: 1, jour: 20, date: '20 janvier 1942', explication: 'Des dirigeants nazis organisent la « solution finale » : l\'extermination des Juifs d\'Europe.' },
    { nom: 'Victoire soviétique à Stalingrad', annee: 1943, mois: 2, jour: 2, date: 'février 1943', explication: 'Première grande défaite de l\'armée allemande, qui recule ensuite à l\'Est.' },
    { nom: 'Débarquement en Normandie', annee: 1944, mois: 6, jour: 6, date: '6 juin 1944', explication: 'Les Alliés débarquent en Normandie et ouvrent un nouveau front à l\'Ouest.' },
    { nom: 'Capitulation de l\'Allemagne', annee: 1945, mois: 5, jour: 8, date: '8 mai 1945', repere: true, explication: 'Fin de la Seconde Guerre mondiale en Europe.' },
    { nom: 'Bombardements atomiques d\'Hiroshima et Nagasaki', annee: 1945, mois: 8, jour: 6, date: '6 et 9 août 1945', repere: true, explication: 'Les États-Unis larguent deux bombes atomiques sur le Japon, qui capitule le 2 septembre 1945.' },
    { nom: 'Fin de la Seconde Guerre mondiale (capitulation du Japon)', annee: 1945, mois: 9, jour: 2, date: '2 septembre 1945', explication: 'Le Japon signe sa capitulation : la guerre est terminée dans le monde entier.' },
    { nom: 'Procès de Nuremberg', annee: 1945, mois: 11, jour: 20, fin: 1946, explication: 'Les principaux dirigeants nazis encore vivants sont jugés ; la notion de crime contre l\'humanité est utilisée pour la première fois.' }
  ],
  personnages: [
    { nom: 'Winston Churchill', description: 'Premier ministre britannique à partir de 1940, il refuse de céder face à Hitler' },
    { nom: 'Franklin D. Roosevelt', description: 'Président des États-Unis de 1933 à sa mort en avril 1945' },
    { nom: 'Harry Truman', description: 'Président des États-Unis qui décide d\'utiliser la bombe atomique contre le Japon en 1945' },
    { nom: 'Primo Levi', description: 'Écrivain italien juif, déporté à Auschwitz, qui raconte l\'horreur des camps dans « Si c\'est un homme »' }
  ],
  vocabulaire: [
    { mot: 'Guerre d\'anéantissement', definition: 'Guerre dont le but est de détruire totalement l\'ennemi, y compris sa population civile.' },
    { mot: 'Shoah', definition: 'Génocide des Juifs d\'Europe par les nazis : près de 6 millions de morts.' },
    { mot: 'Camp de concentration', definition: 'Camp où les nazis enfermaient opposants et déportés, soumis au travail forcé et à des conditions de vie terribles.' },
    { mot: 'Centre de mise à mort', definition: 'Camp construit pour tuer, surtout dans des chambres à gaz, les Juifs et les Tsiganes déportés (par exemple Auschwitz-Birkenau).' },
    { mot: 'Einsatzgruppen', definition: 'Unités mobiles nazies qui ont fusillé plus d\'un million de Juifs à l\'Est de l\'Europe.' },
    { mot: 'Crime contre l\'humanité', definition: 'Crime très grave commis contre des civils de façon massive et organisée (meurtres, extermination, déportation…).' },
    { mot: 'Axe', definition: 'Alliance de l\'Allemagne, de l\'Italie et du Japon pendant la Seconde Guerre mondiale.' }
  ]
};
