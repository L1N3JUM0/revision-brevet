// Thème 1 — Chapitre 4 : La France défaite et occupée. Régime de Vichy, collaboration, Résistance
export default {
  id: 'france-occupee',
  titre: 'La France défaite et occupée',
  theme: 1,
  resume: 'Régime de Vichy, collaboration, France libre et Résistance (1940-1944).',
  periode: [1940, 1944],
  essentiel: [
    'Vaincue en juin 1940, la France signe l\'<strong>armistice</strong> et est en partie occupée. Pétain met fin à la République : c\'est le <strong>régime de Vichy</strong> (1940-1944).',
    'Vichy <strong>collabore</strong> avec l\'Allemagne et participe à la persécution des Juifs (statut des Juifs, rafle du Vél d\'Hiv en 1942).',
    'Le <strong>18 juin 1940</strong>, de Gaulle lance un appel depuis Londres : c\'est le début de la France libre. En France, la <strong>Résistance</strong> s\'organise ; Jean Moulin l\'unifie (CNR, 1943).',
    'La France est libérée en 1944 par les Alliés, la France libre et la Résistance.'
  ],
  evenements: [
    { nom: 'Armistice franco-allemand', annee: 1940, mois: 6, jour: 22, date: '22 juin 1940', explication: 'Le maréchal Pétain fait signer l\'armistice avec l\'Allemagne : la France est coupée en une zone occupée (nord et ouest) et une zone libre (sud).' },
    { nom: 'Appel du général de Gaulle', annee: 1940, mois: 6, jour: 18, date: '18 juin 1940', repere: true, explication: 'Depuis Londres, à la radio de la BBC, de Gaulle appelle les Français à continuer le combat.' },
    { nom: 'Régime de Vichy', annee: 1940, mois: 7, jour: 10, fin: 1944, repere: true, explication: 'Le 10 juillet 1940, Pétain reçoit les pleins pouvoirs : la République est remplacée par l\'État français, un régime autoritaire qui collabore avec l\'Allemagne.' },
    { nom: 'Premier statut des Juifs', annee: 1940, mois: 10, jour: 3, date: '3 octobre 1940', explication: 'Le régime de Vichy exclut les Juifs de nombreux métiers (fonction publique, enseignement, presse…), sans que l\'Allemagne l\'ait exigé.' },
    { nom: 'Occupation de la zone libre', annee: 1942, mois: 11, jour: 11, date: 'novembre 1942', explication: 'Après le débarquement allié en Afrique du Nord, l\'armée allemande occupe toute la France.' },
    { nom: 'Rafle du Vél d\'Hiv', annee: 1942, mois: 7, jour: 16, date: '16 et 17 juillet 1942', explication: 'La police française arrête plus de 13 000 Juifs à Paris, dont plus de 4 000 enfants. Presque tous seront assassinés à Auschwitz.' },
    { nom: 'Création du Service du travail obligatoire (STO)', annee: 1943, mois: 2, jour: 16, date: 'février 1943', explication: 'Des jeunes Français sont obligés d\'aller travailler en Allemagne ; beaucoup préfèrent rejoindre les maquis.' },
    { nom: 'Création du Conseil national de la Résistance', annee: 1943, mois: 5, jour: 27, date: '27 mai 1943', explication: 'Jean Moulin réunit les principaux mouvements de résistance intérieure dans le CNR.' },
    { nom: 'Massacre d\'Oradour-sur-Glane', annee: 1944, mois: 6, jour: 10, date: '10 juin 1944', explication: 'Une division SS massacre plus de 640 habitants de ce village du Limousin.' },
    { nom: 'Débarquement en Provence', annee: 1944, mois: 8, jour: 15, date: '15 août 1944', explication: 'Les Alliés, dont l\'armée française de la Libération, débarquent sur les côtes de Provence.' },
    { nom: 'Libération de Paris', annee: 1944, mois: 8, jour: 25, date: '25 août 1944', explication: 'Paris est libéré par la Résistance et les Alliés, avec la 2e division blindée du général Leclerc.' }
  ],
  personnages: [
    { nom: 'Philippe Pétain', description: 'Maréchal, chef de l\'État français (régime de Vichy) de 1940 à 1944' },
    { nom: 'Charles de Gaulle', description: 'Général qui refuse la défaite de 1940 et dirige la France libre depuis Londres' },
    { nom: 'Jean Moulin', description: 'Envoyé du général de Gaulle, il unifie la Résistance intérieure ; arrêté en 1943, il meurt sous la torture' },
    { nom: 'Pierre Laval', description: 'Chef du gouvernement de Vichy, partisan d\'une collaboration renforcée avec l\'Allemagne' },
    { nom: 'Philippe Leclerc', description: 'Général de la France libre dont la 2e division blindée libère Paris en août 1944' }
  ],
  vocabulaire: [
    { mot: 'Collaboration', definition: 'Politique de coopération du régime de Vichy avec l\'Allemagne nazie.' },
    { mot: 'Résistance', definition: 'Action de ceux qui refusent l\'occupation et luttent contre l\'Allemagne nazie et le régime de Vichy.' },
    { mot: 'France libre', definition: 'Forces françaises qui continuent le combat aux côtés des Alliés, autour du général de Gaulle.' },
    { mot: 'Maquis', definition: 'Groupe de résistants cachés dans les forêts ou les montagnes.' },
    { mot: 'Révolution nationale', definition: 'Programme du régime de Vichy, résumé par la devise « Travail, Famille, Patrie ».' },
    { mot: 'Rafle', definition: 'Arrestation massive et soudaine d\'un groupe de personnes.' },
    { mot: 'Déportation', definition: 'Transfert forcé de personnes vers des camps de concentration ou des centres de mise à mort.' }
  ]
};
