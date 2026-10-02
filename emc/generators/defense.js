// EMC · La défense et la paix
import { fabriquer } from '../../sciences/generators/fabrique.js';

export const banque = {
  id: 'defense',
  titre: 'La défense et la paix',
  discipline: 'emc',
  resume: 'Défense nationale, engagement, rôle de la France dans le monde.',
  essentiel: [
    'La <strong>défense nationale</strong> protège le territoire, la population et les intérêts de la France. Elle repose sur l\'armée, mais aussi sur chaque citoyen (défense globale).',
    'Le <strong>président de la République est le chef des armées</strong> (article 15 de la Constitution). La France possède la <strong>dissuasion nucléaire</strong>.',
    'Le service militaire obligatoire est suspendu depuis 1997. Les jeunes se font recenser à 16 ans et participent à la <strong>JDC</strong>.',
    'L\'armée intervient en France (plan Vigipirate, opération Sentinelle, secours lors des catastrophes) et à l\'étranger, souvent avec l\'ONU, l\'Union européenne ou l\'OTAN.',
    'La France est membre permanent du <strong>Conseil de sécurité de l\'ONU</strong> et participe à des opérations de maintien de la paix (casques bleus).'
  ],
  vocabulaire: [
    { mot: 'Défense nationale', definition: 'Ensemble des moyens qui protègent le territoire, la population et les intérêts d\'un pays.' },
    { mot: 'Dissuasion nucléaire', definition: 'Possession de l\'arme atomique pour décourager un ennemi d\'attaquer.' },
    { mot: 'Casque bleu', definition: 'Soldat placé sous l\'autorité de l\'ONU pour maintenir la paix.' },
    { mot: 'OTAN', definition: 'Alliance militaire entre les États-Unis, le Canada et de nombreux pays européens, créée en 1949.' },
    { mot: 'Opération Sentinelle', definition: 'Déploiement de militaires sur le territoire national pour protéger la population contre le terrorisme.' },
    { mot: 'Réserviste', definition: 'Citoyen volontaire qui consacre une partie de son temps à l\'armée ou à la gendarmerie.' }
  ],
  questions: [
    { q: 'Qui est le chef des armées en France ?', bonne: 'Le président de la République', fausses: ['Le Premier ministre', 'Le ministre de l\'Intérieur', 'Le président du Sénat'], niveau: 1 },
    { q: 'Depuis quand le service militaire obligatoire est-il suspendu ?', bonne: '1997', fausses: ['1945', '1962', '2015'], niveau: 2 },
    { q: 'Quelle journée tous les jeunes doivent-ils accomplir ?', bonne: 'La Journée défense et citoyenneté (JDC)', fausses: ['La journée de l\'Europe', 'La journée du patrimoine', 'La journée de la laïcité'], niveau: 1 },
    { q: 'Qu\'est-ce que la dissuasion nucléaire ?', bonne: 'Posséder l\'arme atomique pour décourager toute attaque', fausses: ['Interdire l\'énergie nucléaire', 'Utiliser l\'arme atomique chaque année', 'Vendre des centrales nucléaires'], niveau: 2 },
    { q: 'Comment appelle-t-on les soldats de l\'ONU ?', bonne: 'Les casques bleus', fausses: ['Les bérets verts', 'Les gendarmes', 'Les réservistes'], niveau: 1 },
    { q: 'Quelle opération déploie des militaires en France contre le terrorisme ?', bonne: 'L\'opération Sentinelle', fausses: ['L\'opération Overlord', 'Le plan Marshall', 'La JDC'], niveau: 2 },
    { q: 'Dans quel organe de l\'ONU la France a-t-elle un siège permanent ?', bonne: 'Le Conseil de sécurité', fausses: ['L\'Assemblée générale seulement', 'La Commission européenne', 'Le Conseil de l\'Europe'], niveau: 2 },
    { q: 'Quelle alliance militaire réunit les États-Unis et de nombreux pays européens ?', bonne: 'L\'OTAN', fausses: ['L\'ONU', 'L\'UNESCO', 'Le pacte de Varsovie'], niveau: 2 },
    { q: 'Comment un civil peut-il participer à la défense ?', bonne: 'En devenant réserviste ou en s\'engageant dans la sécurité civile', fausses: ['En refusant la JDC', 'En publiant des secrets militaires', 'En ne votant pas'], niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'L\'armée française intervient aussi lors de catastrophes naturelles en France.', vrai: true, explication: 'Elle aide les secours lors d\'inondations, d\'incendies ou de tempêtes.' },
    { texte: 'Le service militaire est encore obligatoire en France.', vrai: false, explication: 'Il est suspendu depuis 1997 ; le recensement et la JDC restent obligatoires.' },
    { texte: 'La défense ne concerne que les militaires.', vrai: false, explication: 'La défense est globale : elle concerne aussi les citoyens, l\'économie et la protection des réseaux.' }
  ]
};

export default fabriquer(banque);
