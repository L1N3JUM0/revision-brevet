// Étude de document · La Première Guerre mondiale (textes officiels et chanson de soldats, avec leur source)
import donnees from '../donnees/premiere-guerre.js';
import { fabriquerEtude } from './fabrique-etude.js';

export default fabriquerEtude(donnees, {
  documents: [
    {
      id: 'mobilisation',
      titre: 'L\'ordre de mobilisation générale',
      html: '<p>« Par décret du Président de la République, la mobilisation des armées de terre et de mer est ordonnée, ainsi que la réquisition des animaux, voitures, harnais, nécessaires au complément de ces armées.</p><p>Le premier jour de la mobilisation est le <u>dimanche deux août 1914</u>. »</p>',
      source: 'Affiche placardée dans toutes les communes de France, 1<sup>er</sup> août 1914.',
      prelevement: [
        { consigne: 'Relève la date du premier jour de la mobilisation.', mots: [['2 août', 'deux août'], ['1914']], corrige: 'Le premier jour de la mobilisation est le dimanche 2 août 1914.' },
        { consigne: 'Qui décide la mobilisation, d\'après le document ?', mots: [['président'], ['décret']], corrige: 'La mobilisation est décidée par un décret du président de la République.' },
        { consigne: 'Relève ce qui est réquisitionné en plus des soldats.', mots: [['animaux'], ['voitures'], ['harnais']], corrige: 'L\'État réquisitionne aussi des animaux, des voitures et des harnais pour l\'armée.' }
      ],
      analyse: [
        { consigne: 'Explique ce qu\'est une mobilisation générale et pourquoi elle est décidée en août 1914.', mots: [['soldat', 'homme'], ['armée'], ['guerre'], ['allemagne']], corrige: 'La mobilisation générale appelle tous les hommes en âge de combattre à rejoindre l\'armée. Elle est décidée en août 1914 car la guerre éclate entre la France et l\'Allemagne, après l\'assassinat de l\'archiduc François-Ferdinand à Sarajevo et le jeu des alliances.' },
        { consigne: 'Montre que ce document annonce une guerre qui touche toute la société.', mots: [['tous', 'toute'], ['réquisition', 'réquisitionn'], ['civil', 'population', 'société']], corrige: 'L\'affiche est placardée dans toutes les communes : tous les hommes mobilisables sont concernés. L\'État réquisitionne aussi des animaux et des voitures, donc les biens des civils. La guerre ne concerne pas seulement les soldats mais toute la population.' }
      ]
    },
    {
      id: 'versailles',
      titre: 'Le traité de Versailles',
      html: '<p>« Article 231. Les Gouvernements alliés et associés déclarent et l\'Allemagne reconnaît que l\'Allemagne et ses alliés sont <u>responsables</u>, pour les avoir causés, de toutes les pertes et de tous les dommages subis par les Gouvernements alliés et associés et leurs nationaux en conséquence de la guerre, qui leur a été imposée par l\'agression de l\'Allemagne et de ses alliés. »</p>',
      source: 'Traité de Versailles, signé le 28 juin 1919.',
      prelevement: [
        { consigne: 'Qui est désigné comme responsable de la guerre ?', mots: [['allemagne'], ['alliés']], corrige: 'L\'Allemagne et ses alliés sont désignés comme responsables de la guerre.' },
        { consigne: 'Relève le mot qui montre comment la guerre a commencé selon le traité.', mots: [['agression']], corrige: 'Selon le traité, la guerre a été imposée par « l\'agression de l\'Allemagne et de ses alliés ».' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi les Allemands parlent d\'un « diktat » (une paix imposée).', mots: [['responsable'], ['réparations', 'payer'], ['imposé', 'négoci']], corrige: 'L\'Allemagne n\'a pas pu négocier le traité : elle doit l\'accepter. Elle est déclarée seule responsable de la guerre et doit payer de lourdes réparations. Beaucoup d\'Allemands vivent ce traité comme une humiliation.' },
        { consigne: 'Montre que ce traité prépare des tensions pour l\'avenir.', mots: [['humiliation', 'humili'], ['réparations', 'payer'], ['hitler', 'nazi', 'revanche']], corrige: 'Le traité humilie l\'Allemagne, déclarée responsable de la guerre et obligée de payer des réparations. Ce ressentiment est utilisé ensuite par les nazis : Hitler promet de détruire le « diktat ». Le traité nourrit donc l\'esprit de revanche.' }
      ]
    },
    {
      id: 'craonne',
      titre: 'La chanson de Craonne',
      html: '<p>« Adieu la vie, adieu l\'amour,<br>Adieu toutes les femmes.<br>C\'est bien fini, c\'est pour toujours,<br>De cette guerre <u>infâme</u>.<br>C\'est à Craonne, sur le plateau,<br>Qu\'on doit laisser sa peau<br>Car nous sommes tous condamnés,<br>Nous sommes les sacrifiés. »</p>',
      source: 'Refrain de la <em>Chanson de Craonne</em>, chanson anonyme de soldats français, 1917. Elle fut interdite par l\'armée.',
      prelevement: [
        { consigne: 'Relève comment les soldats qualifient la guerre.', mots: [['infâme', 'infame']], corrige: 'Les soldats qualifient la guerre d\'« infâme ».' },
        { consigne: 'Relève comment les soldats se voient eux-mêmes.', mots: [['condamnés'], ['sacrifiés']], corrige: 'Les soldats se voient comme des « condamnés » et des « sacrifiés ».' }
      ],
      analyse: [
        { consigne: 'Explique pourquoi cette chanson a été interdite par l\'armée en 1917.', mots: [['mutinerie', 'mutin'], ['refus', 'refuse'], ['moral']], corrige: 'En 1917, après l\'échec de l\'offensive du Chemin des Dames, des soldats se mutinent : ils refusent de monter à l\'assaut. Cette chanson exprime leur colère et leur désespoir. L\'armée l\'interdit car elle risque de briser le moral des troupes.' },
        { consigne: 'Montre que ce document témoigne de la violence de masse vécue par les soldats.', mots: [['mort', 'peau', 'mourir'], ['condamnés', 'sacrifiés'], ['tranchée', 'front']], corrige: 'Les soldats savent qu\'ils vont mourir : ils doivent « laisser leur peau » sur le plateau de Craonne. Ils se sentent « condamnés » et « sacrifiés ». Sur le front, les assauts font des milliers de morts en quelques jours.' }
      ]
    }
  ],
  syntheses: [
    { docs: ['mobilisation', 'craonne'], consigne: 'Montre que la Première Guerre mondiale est une guerre totale qui fait subir une violence de masse aux soldats.', mots: [['mobilisation', 'mobilisé'], ['réquisition'], ['mort', 'sacrifiés'], ['1914'], ['totale']], corrige: 'La Première Guerre mondiale (1914-1918) est une guerre totale. Dès le 2 août 1914, tous les hommes mobilisables sont appelés et l\'État réquisitionne les biens des civils (document 1). Les soldats subissent une violence de masse : dans les tranchées, ils vivent dans la peur de la mort. En 1917, la chanson de Craonne montre qu\'ils se sentent « condamnés » et « sacrifiés » (document 2). Certains se mutinent pour refuser des attaques inutiles.' }
  ],
  reperes: []
});
