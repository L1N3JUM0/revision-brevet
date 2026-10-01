// Étude de document · La Seconde Guerre mondiale (citations courtes et sûres, avec leur source)
import donnees from '../donnees/seconde-guerre.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'churchill-1940',
      titre: 'Churchill devant les députés britanniques',
      html: '<p>« Je n\'ai à offrir que <u>du sang, du labeur, des larmes et de la sueur</u>. »</p>',
      source: 'Winston Churchill, Premier ministre du Royaume-Uni, discours à la Chambre des communes, 13 mai 1940.',
      prelevement: [
        { consigne: 'Relève ce que Churchill promet aux Britanniques.', mots: [['sang'], ['larmes'], ['sueur']], corrige: 'Churchill ne promet que « du sang, du labeur, des larmes et de la sueur ».' },
        { consigne: 'Qui est l\'auteur de ce discours et quelle est sa fonction ?', mots: [['churchill'], ['premier ministre']], corrige: 'L\'auteur est Winston Churchill, Premier ministre du Royaume-Uni.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi Churchill annonce des sacrifices en mai 1940.', mots: [['allemagne', 'hitler', 'nazi'], ['offensive', 'attaque', 'invasion'], ['résist', 'combat']], corrige: 'En mai 1940, l\'Allemagne nazie lance son offensive à l\'ouest et avance très vite. Churchill veut préparer les Britanniques à une guerre longue et difficile. Il refuse de négocier avec Hitler et choisit de continuer le combat.' }
      ]
    },
    {
      id: 'charte-onu',
      titre: 'La Charte des Nations unies',
      html: '<p>« Nous, peuples des Nations unies, résolus à <u>préserver les générations futures du fléau de la guerre</u> qui deux fois en l\'espace d\'une vie humaine a infligé à l\'humanité d\'indicibles souffrances… »</p>',
      source: 'Préambule de la Charte des Nations unies, signée à San Francisco le 26 juin 1945.',
      prelevement: [
        { consigne: 'Relève le but de l\'ONU indiqué dans ce texte.', mots: [['préserver'], ['guerre']], corrige: 'Le but est de « préserver les générations futures du fléau de la guerre ».' },
        { consigne: 'À quelles guerres le texte fait-il allusion avec « deux fois en l\'espace d\'une vie humaine » ?', mots: [['première'], ['seconde'], ['mondiale']], corrige: 'Le texte fait allusion aux deux guerres mondiales : la Première (1914-1918) et la Seconde (1939-1945).' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi les vainqueurs créent l\'ONU en 1945.', mots: [['paix'], ['morts', 'souffrances', 'victimes'], ['sdn', 'société des nations', 'éviter']], corrige: 'La Seconde Guerre mondiale a fait plus de 60 millions de morts. Les vainqueurs veulent éviter une nouvelle guerre. Ils créent l\'ONU pour maintenir la paix et régler les conflits par la discussion, car la SDN avait échoué.' }
      ]
    },
    {
      id: 'tribunal-nuremberg',
      titre: 'Le statut du tribunal de Nuremberg',
      html: '<p>« Les <u>crimes contre l\'humanité</u> : c\'est-à-dire l\'assassinat, l\'extermination, la réduction en esclavage, la déportation, et tout autre acte inhumain commis contre toutes populations civiles, avant ou pendant la guerre, ou bien les persécutions pour des motifs politiques, raciaux ou religieux… »</p>',
      source: 'Statut du tribunal militaire international de Nuremberg, article 6c, 8 août 1945.',
      prelevement: [
        { consigne: 'Relève deux actes qui sont des crimes contre l\'humanité.', mots: [['assassinat', 'extermination', 'esclavage', 'déportation', 'persécution']], corrige: 'L\'assassinat et l\'extermination sont, par exemple, des crimes contre l\'humanité.' },
        { consigne: 'Contre qui ces crimes sont-ils commis, d\'après le texte ?', mots: [['civil']], corrige: 'Ces crimes sont commis contre des populations civiles.' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi les Alliés créent cette notion de crime contre l\'humanité en 1945.', mots: [['génocide', 'shoah', 'extermin'], ['juifs'], ['nazi'], ['juger', 'procès']], corrige: 'Pendant la guerre, les nazis ont commis des crimes de masse, dont le génocide des Juifs et des Tsiganes. Les Alliés veulent juger les responsables nazis. Ils créent pour cela la notion de crime contre l\'humanité, utilisée lors du procès de Nuremberg.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['charte-onu', 'tribunal-nuremberg'], consigne: 'Montre qu\'en 1945, les vainqueurs veulent tirer les leçons de la Seconde Guerre mondiale.', mots: [['paix'], ['onu'], ['juger', 'procès'], ['crime contre l\'humanité'], ['génocide', 'extermin']], corrige: 'En 1945, la Seconde Guerre mondiale se termine après avoir fait plus de 60 millions de morts. Pour éviter une nouvelle guerre, les vainqueurs créent l\'ONU, qui doit préserver la paix (document 1). Ils veulent aussi juger les crimes des nazis, en particulier le génocide des Juifs et des Tsiganes. Le statut du tribunal de Nuremberg définit pour cela le crime contre l\'humanité (document 2). Ainsi, ils cherchent à protéger la paix et les droits humains.' }
  ],
  reperes: []
});
