// Thème 1 — Chapitre 1 : Civils et militaires dans la Première Guerre mondiale
export default {
  id: 'premiere-guerre',
  titre: 'La Première Guerre mondiale',
  theme: 1,
  resume: 'Une guerre totale (1914-1918) : soldats et civils dans la guerre.',
  periode: [1914, 1919],
  essentiel: [
    'De 1914 à 1918, les <strong>Alliés</strong> (France, Royaume-Uni, Russie jusqu\'en 1917, puis États-Unis) affrontent les <strong>Empires centraux</strong> (Allemagne, Autriche-Hongrie).',
    'Après la bataille de la Marne (1914), les soldats s\'enterrent dans les <strong>tranchées</strong> : c\'est une guerre d\'usure (Verdun, la Somme, 1916).',
    'C\'est une <strong>guerre totale</strong> : les civils travaillent pour l\'effort de guerre, subissent la propagande, les privations et parfois des violences extrêmes (génocide des Arméniens).',
    'L\'armistice du <strong>11 novembre 1918</strong> arrête les combats ; le traité de Versailles (1919) impose la paix à l\'Allemagne.'
  ],
  evenements: [
    { nom: 'Assassinat de l\'archiduc François-Ferdinand à Sarajevo', annee: 1914, mois: 6, jour: 28, date: '28 juin 1914', explication: 'L\'héritier du trône d\'Autriche-Hongrie est tué par un nationaliste serbe : c\'est l\'étincelle qui déclenche la guerre.' },
    { nom: 'Première Guerre mondiale', annee: 1914, fin: 1918, repere: true, explication: 'Une guerre totale qui fait environ 10 millions de morts parmi les soldats.' },
    { nom: 'Bataille de la Marne', annee: 1914, mois: 9, date: 'septembre 1914', explication: 'Les Français et les Britanniques arrêtent l\'armée allemande qui avançait vers Paris. La guerre de mouvement laisse place à la guerre des tranchées.' },
    { nom: 'Début du génocide des Arméniens', annee: 1915, mois: 4, date: 'avril 1915', explication: 'Le gouvernement de l\'Empire ottoman organise l\'extermination des Arméniens : plus d\'un million de morts. C\'est le premier génocide du XXe siècle.' },
    { nom: 'Bataille de Verdun', annee: 1916, mois: 2, date: 'de février à décembre 1916', repere: true, explication: 'Symbole de la guerre d\'usure : plus de 300 000 soldats français et allemands y sont tués.' },
    { nom: 'Bataille de la Somme', annee: 1916, mois: 7, date: 'de juillet à novembre 1916', explication: 'Offensive franco-britannique, l\'une des plus meurtrières de la guerre : plus d\'un million de soldats tués, blessés ou disparus.' },
    { nom: 'Entrée en guerre des États-Unis', annee: 1917, mois: 4, jour: 6, date: 'avril 1917', explication: 'Les États-Unis rejoignent les Alliés et leur apportent des soldats et du matériel.' },
    { nom: 'Armistice de la Première Guerre mondiale', annee: 1918, mois: 11, jour: 11, date: '11 novembre 1918', explication: 'L\'Allemagne signe l\'armistice : les combats s\'arrêtent.' },
    { nom: 'Traité de Versailles', annee: 1919, mois: 6, jour: 28, date: '28 juin 1919', explication: 'Traité de paix imposé à l\'Allemagne, jugée responsable de la guerre : elle perd des territoires (l\'Alsace-Moselle revient à la France) et doit payer des réparations.' }
  ],
  personnages: [
    { nom: 'Georges Clemenceau', description: 'Président du Conseil à partir de 1917, surnommé « le Tigre », il mène la France jusqu\'à la victoire' },
    { nom: 'Philippe Pétain', description: 'Général qui commande l\'armée française à Verdun en 1916, surnommé ensuite « le vainqueur de Verdun »' },
    { nom: 'Guillaume II', description: 'Empereur d\'Allemagne pendant la guerre ; il abdique en novembre 1918' },
    { nom: 'Woodrow Wilson', description: 'Président des États-Unis qui fait entrer son pays en guerre en 1917 et propose de créer la Société des Nations' }
  ],
  vocabulaire: [
    { mot: 'Guerre totale', definition: 'Guerre qui mobilise toutes les ressources d\'un pays : les soldats, mais aussi les civils, l\'économie, les sciences et la propagande.' },
    { mot: 'Poilu', definition: 'Surnom donné aux soldats français de la Première Guerre mondiale.' },
    { mot: 'Tranchée', definition: 'Fossé creusé par les soldats pour se protéger des tirs ennemis.' },
    { mot: 'Guerre d\'usure', definition: 'Guerre où chaque camp cherche à épuiser l\'adversaire en hommes et en matériel.' },
    { mot: 'Génocide', definition: 'Extermination volontaire et organisée d\'un peuple, en raison de ses origines.' },
    { mot: 'Armistice', definition: 'Accord qui met fin aux combats, en attendant un traité de paix.' },
    { mot: 'Propagande', definition: 'Ensemble des moyens (affiches, journaux, radio, films…) utilisés pour influencer l\'opinion.' },
    { mot: 'Mobilisation', definition: 'Appel des hommes en âge de combattre à rejoindre l\'armée.' }
  ]
};
