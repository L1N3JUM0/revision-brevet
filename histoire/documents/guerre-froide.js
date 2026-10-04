// Étude de document · Un monde bipolaire : la guerre froide (discours, avec leur source)
import donnees from '../donnees/guerre-froide.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'fulton',
      reperes: ['Capitulation de l\'Allemagne', 'Début de la guerre froide'],
      titre: 'Le « rideau de fer »',
      html: '<p>« De Stettin dans la Baltique jusqu\'à Trieste dans l\'Adriatique, <u>un rideau de fer est descendu</u> à travers le continent. »</p>',
      source: 'Winston Churchill, ancien Premier ministre britannique, discours à Fulton (États-Unis), 5 mars 1946.',
      prelevement: [
        { consigne: 'Relève l\'expression utilisée par Churchill pour décrire la division de l\'Europe.', mots: [['rideau de fer']], corrige: 'Churchill parle d\'un « rideau de fer » qui coupe l\'Europe.' },
        { consigne: 'Relève les deux villes qui marquent les limites de ce « rideau ».', mots: [['stettin'], ['trieste']], corrige: 'Le rideau de fer va de Stettin, sur la mer Baltique, à Trieste, sur la mer Adriatique.' }
      ],
      analyse: [
        { consigne: 'Explique ce que désigne le « rideau de fer ».', mots: [['est', 'ouest'], ['urss', 'soviétique'], ['communis'], ['frontière', 'division', 'coupe']], corrige: 'Le rideau de fer désigne la frontière qui coupe l\'Europe en deux après 1945. À l\'est, les pays sont contrôlés par l\'URSS et deviennent communistes. À l\'ouest, les démocraties sont alliées aux États-Unis.' }
      ]
    },
    {
      id: 'truman',
      reperes: ['Début de la guerre froide', 'Création de l\'OTAN'],
      titre: 'La doctrine Truman',
      html: '<p>« Je crois que les États-Unis doivent pratiquer une politique d\'<u>aide aux peuples libres</u> qui résistent à des tentatives d\'asservissement, qu\'elles soient le fait de minorités armées ou de pressions extérieures. »</p>',
      source: 'Harry Truman, président des États-Unis, discours au Congrès, 12 mars 1947.',
      prelevement: [
        { consigne: 'Relève ce que les États-Unis doivent faire selon Truman.', mots: [['aide', 'aider'], ['peuples libres']], corrige: 'Selon Truman, les États-Unis doivent aider « les peuples libres ».' },
        { consigne: 'Qui est l\'auteur de ce texte et quelle est sa fonction ?', mots: [['truman'], ['président']], corrige: 'L\'auteur est Harry Truman, président des États-Unis.' }
      ],
      analyse: [
        { consigne: 'Explique contre qui Truman veut aider les « peuples libres ».', mots: [['urss', 'soviétique'], ['communis'], ['endiguement', 'plan marshall']], corrige: 'Truman veut empêcher l\'URSS d\'étendre le communisme : c\'est la politique d\'endiguement. Les États-Unis aident les pays d\'Europe de l\'Ouest, notamment avec le plan Marshall, pour qu\'ils restent dans leur camp.' }
      ]
    },
    {
      id: 'jdanov',
      reperes: ['Début de la guerre froide', 'Création de l\'OTAN'],
      titre: 'La doctrine Jdanov',
      html: '<p>« <u>Deux camps se sont formés</u> : le camp impérialiste et antidémocratique d\'une part, le camp anti-impérialiste et démocratique d\'autre part. »</p>',
      source: 'Andreï Jdanov, dirigeant soviétique, rapport présenté à la réunion des partis communistes, septembre 1947.',
      prelevement: [
        { consigne: 'Relève combien de camps existent selon Jdanov.', mots: [['deux camps', 'deux']], corrige: 'Selon Jdanov, deux camps se sont formés.' },
        { consigne: 'Relève comment Jdanov qualifie le camp ennemi.', mots: [['impérialiste'], ['antidémocratique']], corrige: 'Jdanov qualifie le camp ennemi d\'« impérialiste et antidémocratique ».' }
      ],
      analyse: [
        { consigne: 'Explique quel camp Jdanov désigne comme « impérialiste » et pourquoi c\'est un texte de propagande.', mots: [['états-unis', 'américain'], ['urss', 'soviétique'], ['propagande'], ['démocratique']], corrige: 'Jdanov désigne les États-Unis et leurs alliés comme le camp « impérialiste ». C\'est un texte de propagande : il présente l\'URSS comme « démocratique », alors qu\'elle est un régime totalitaire. Il répond à la doctrine Truman.' }
      ]
    },
    {
      id: 'kennedy-berlin',
      reperes: ['Construction du mur de Berlin', 'Crise de Cuba'],
      titre: 'Kennedy à Berlin',
      html: '<p>« Tous les hommes libres, où qu\'ils vivent, sont des citoyens de Berlin. Et en conséquence, en tant qu\'homme libre, je suis fier de dire : <u>« Ich bin ein Berliner ! »</u> »</p>',
      source: 'John F. Kennedy, président des États-Unis, discours à Berlin-Ouest, 26 juin 1963.',
      prelevement: [
        { consigne: 'Relève la phrase en allemand prononcée par Kennedy et sa traduction.', mots: [['ich bin ein berliner'], ['berlinois']], corrige: 'Kennedy dit « Ich bin ein Berliner », c\'est-à-dire « Je suis un Berlinois ».' },
        { consigne: 'Où et quand ce discours est-il prononcé ?', mots: [['berlin'], ['1963']], corrige: 'Ce discours est prononcé à Berlin-Ouest le 26 juin 1963.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi Kennedy vient à Berlin-Ouest en 1963.', mots: [['mur'], ['1961'], ['soutien', 'soutenir'], ['liberté', 'libre']], corrige: 'Depuis 1961, Berlin-Ouest est entouré par le mur de Berlin, construit par la RDA. Kennedy vient montrer que les États-Unis soutiennent les habitants de Berlin-Ouest. Berlin devient le symbole de la liberté face au bloc communiste.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['truman', 'jdanov'], reperes: ['Début de la guerre froide', 'Création de l\'OTAN'], consigne: 'Montre qu\'en 1947, le monde se divise en deux blocs opposés.', mots: [['états-unis'], ['urss'], ['blocs', 'camps'], ['communis'], ['guerre froide'], ['1947']], corrige: 'Après 1945, les États-Unis et l\'URSS, alliés contre l\'Allemagne, deviennent rivaux. En mars 1947, Truman annonce que les États-Unis aideront les « peuples libres » contre le communisme (document 1). En septembre 1947, Jdanov répond qu\'il existe deux camps et accuse les États-Unis d\'impérialisme (document 2). Le monde se divise donc en deux blocs : c\'est le début de la guerre froide. Chaque camp défend un modèle opposé : démocratie libérale ou communisme.' }
  ]
});
