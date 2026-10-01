// SVT — Système nerveux et santé : message nerveux, cerveau, temps de réaction, drogues, sommeil.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';

// Distance parcourue pendant le temps de réaction (vitesses en km/h qui tombent juste en m/s)
const VITESSES = [[36, 10], [54, 15], [72, 20], [90, 25], [108, 30], [126, 35]];

function calcReaction(rng, ctx, niveau) {
  const [kmh, ms] = rng.choix(niveau === 1 ? VITESSES.slice(0, 3) : VITESSES);
  const alcool = niveau === 3 && rng.bool(0.6);
  const t = alcool ? rng.choix([1.5, 2]) : rng.choix([0.5, 1]);
  const d = net(ms * t);
  const enKmh = niveau >= 2;
  const err = erreursNombre(d);
  if (enKmh) err.ajouter(net(kmh * t), `La vitesse doit être en <strong>m/s</strong> : ${kmh} km/h ÷ 3,6 = ${ms} m/s.`);
  err.ajouter(net(ms / t), 'Distance = vitesse <strong>×</strong> temps.');
  const conducteur = rng.choix(['Une conductrice', 'Un conducteur', 'Un motard', 'Un chauffeur de bus']);
  return {
    cle: `reaction:${kmh}:${t}:${niveau}`,
    enonce: `<p>${conducteur} roule à ${enKmh ? `${kmh} km/h` : `${ms} m/s (${kmh} km/h)`}. Un ballon traverse la route.</p>
      <p>${alcool ? 'Après avoir bu de l\'alcool, son' : 'Son'} temps de réaction est de ${fmt(t)} s : pendant ce temps, le véhicule continue à la même vitesse.</p>
      <p><strong>Quelle distance parcourt-il avant de commencer à freiner, en m ?</strong></p>`,
    type: 'nombre',
    unite: 'm',
    reponse: d,
    etapes: [
      'Pendant le temps de réaction, le message nerveux va de l\'œil au cerveau, puis du cerveau aux muscles de la jambe.',
      ...(enKmh ? [`${kmh} km/h ÷ 3,6 = ${ms} m/s.`] : []),
      `d = v × t = ${ms} × ${fmt(t)} = ${gras(fmt(d))} m`,
      ...(alcool ? ['L\'alcool ralentit le fonctionnement des neurones : le temps de réaction augmente, la distance parcourue aussi.'] : [])
    ],
    erreurs: err.liste(),
    expression: `${ms} × ${fmt(t)}`
  };
}

// Durée de trajet du message nerveux dans un nerf
function calcMessage(rng) {
  const v = rng.choix([20, 40, 50, 80, 100]);
  const L = rng.choix([0.5, 1, 1.2, 1.6, 2]);
  const t = net(L / v);
  const err = erreursNombre(t);
  err.ajouter(net(L * v), 'Le temps, c\'est la distance <strong>÷</strong> la vitesse.');
  err.ajouter(net(v / L), 'C\'est l\'inverse : t = <strong>d ÷ v</strong>.');
  return {
    cle: `message:${v}:${L}`,
    enonce: `<p>Un message nerveux parcourt un nerf de ${fmt(L)} m de long à la vitesse de ${v} m/s.</p><p><strong>Combien de temps met-il, en secondes ?</strong></p>`,
    type: 'nombre',
    unite: 's',
    reponse: t,
    etapes: ['Formule : <strong>t = d ÷ v</strong>.', `t = ${fmt(L)} ÷ ${v} = ${gras(fmt(t))} s`, 'C\'est très rapide : le message nerveux est de nature électrique dans les neurones.'],
    erreurs: err.liste(),
    expression: `${fmt(L)} ÷ ${v}`
  };
}

export const banque = {
  id: 'systeme-nerveux',
  titre: 'Système nerveux et santé',
  discipline: 'svt',
  resume: 'Message nerveux, rôle du cerveau, temps de réaction, effets des drogues et du sommeil.',
  essentiel: [
    'Un <strong>organe des sens</strong> (récepteur) capte une information. Un <strong>nerf sensitif</strong> transmet le message au <strong>centre nerveux</strong> (cerveau ou moelle épinière).',
    'Le centre nerveux analyse et élabore une réponse, transmise par un <strong>nerf moteur</strong> à un <strong>effecteur</strong> (un muscle).',
    'Le message nerveux circule dans les <strong>neurones</strong>. Entre deux neurones, au niveau de la <strong>synapse</strong>, il est transmis par des molécules : les neurotransmetteurs.',
    'L\'alcool, le cannabis, certains médicaments perturbent les synapses : le <strong>temps de réaction augmente</strong>, la vigilance baisse.',
    'Le <strong>sommeil</strong> (8 à 10 h par nuit à l\'adolescence) est indispensable à la mémoire et à la concentration. Les écrans le soir le retardent.'
  ],
  vocabulaire: [
    { mot: 'Neurone', definition: 'Cellule nerveuse qui transmet le message nerveux.' },
    { mot: 'Synapse', definition: 'Zone de contact entre deux neurones, où le message passe grâce à des neurotransmetteurs.' },
    { mot: 'Neurotransmetteur', definition: 'Molécule libérée dans la synapse, qui transmet le message au neurone suivant.' },
    { mot: 'Récepteur sensoriel', definition: 'Structure qui capte une information de l\'environnement (lumière, son, chaleur…).' },
    { mot: 'Nerf sensitif', definition: 'Nerf qui conduit le message d\'un organe des sens vers un centre nerveux.' },
    { mot: 'Nerf moteur', definition: 'Nerf qui conduit le message d\'un centre nerveux vers un muscle.' },
    { mot: 'Centre nerveux', definition: 'Le cerveau ou la moelle épinière, qui reçoivent et élaborent les messages.' },
    { mot: 'Effecteur', definition: 'Organe qui réalise la réponse, le plus souvent un muscle.' },
    { mot: 'Addiction', definition: 'Dépendance à une substance ou à un comportement, difficile à arrêter malgré ses effets nocifs.' }
  ],
  questions: [
    { q: 'Quel est le rôle du nerf moteur ?', bonne: 'Conduire le message du centre nerveux vers un muscle', fausses: ['Conduire le message d\'un organe des sens vers le cerveau', 'Produire des hormones', 'Capter la lumière'], niveau: 1 },
    { q: 'Quels sont les centres nerveux ?', bonne: 'Le cerveau et la moelle épinière', fausses: ['Le cœur et les poumons', 'Les nerfs et les muscles', 'Les yeux et les oreilles'], niveau: 1 },
    { q: 'Comment le message nerveux passe-t-il d\'un neurone à l\'autre ?', bonne: 'Grâce à des neurotransmetteurs libérés dans la synapse', fausses: ['Par le sang', 'Les neurones sont collés et ne font qu\'un', 'Grâce aux globules blancs'], niveau: 2 },
    { q: 'Pourquoi l\'alcool est-il dangereux au volant ?', bonne: 'Il augmente le temps de réaction', fausses: ['Il améliore les réflexes', 'Il agit seulement sur le foie', 'Il n\'a aucun effet à petite dose'], explication: 'L\'alcool perturbe le fonctionnement des synapses : on voit moins bien et on réagit plus tard.', niveau: 1 },
    { q: 'Combien d\'heures de sommeil sont recommandées à l\'adolescence ?', bonne: 'Entre 8 et 10 heures', fausses: ['Entre 4 et 5 heures', 'Exactement 6 heures', 'Plus de 14 heures'], niveau: 1 },
    { q: 'Pourquoi éviter les écrans juste avant de dormir ?', bonne: 'Leur lumière retarde l\'endormissement', fausses: ['Ils fatiguent trop les muscles', 'Ils font baisser la température', 'Ils n\'ont aucun effet'], explication: 'La lumière bleue des écrans retarde la sécrétion de mélatonine, l\'hormone qui aide à s\'endormir.', niveau: 2 },
    { q: 'Un niveau sonore trop élevé peut détruire…', bonne: 'Les cellules ciliées de l\'oreille interne', fausses: ['Les neurones de la moelle épinière', 'Les muscles de la jambe', 'Les globules rouges'], explication: 'Ces cellules ne se renouvellent pas : la perte d\'audition est définitive.', niveau: 3 },
    { q: 'Dans un réflexe (retirer la main d\'une plaque chaude), quel centre nerveux peut commander la réponse ?', bonne: 'La moelle épinière', fausses: ['Le cœur', 'Le muscle lui-même', 'L\'estomac'], explication: 'Pour un réflexe, le message ne passe pas forcément par le cerveau : la réponse est plus rapide.', niveau: 3 },
    { q: 'Le cannabis, consommé régulièrement à l\'adolescence…', bonne: 'Perturbe la mémoire et la concentration', fausses: ['Améliore les résultats scolaires', 'N\'a aucun effet sur le cerveau', 'Accélère les réflexes'], niveau: 2 }
  ],
  vraiFaux: [
    { texte: 'Le message nerveux va toujours du muscle vers le cerveau.', vrai: false, explication: 'Il va de l\'organe des sens au centre nerveux (nerf sensitif), puis du centre nerveux au muscle (nerf moteur).' },
    { texte: 'Le cerveau analyse les informations reçues des organes des sens.', vrai: true, explication: 'Il les interprète et élabore une réponse.' },
    { texte: 'La fatigue augmente le temps de réaction.', vrai: true, explication: 'Comme l\'alcool, le manque de sommeil ralentit les réponses du cerveau.' },
    { texte: 'Une synapse est un type de muscle.', vrai: false, explication: 'C\'est la zone de communication entre deux neurones.' }
  ],
  sequences: [
    { titre: 'message', consigne: 'Remets dans l\'ordre le trajet du message nerveux quand une gardienne de handball voit le ballon arriver.', etapes: ['L\'œil capte la lumière (récepteur)', 'Le nerf optique (nerf sensitif) transmet le message', 'Le cerveau analyse et décide', 'Un nerf moteur transmet l\'ordre', 'Les muscles du bras se contractent'] },
    { titre: 'chaud', consigne: 'Remets dans l\'ordre ce qui se passe quand ta main touche une plaque chaude.', etapes: ['Les récepteurs de la peau captent la chaleur', 'Un nerf sensitif conduit le message', 'La moelle épinière élabore une réponse', 'Un nerf moteur conduit le message', 'Les muscles du bras retirent la main'] }
  ],
  calculs: { reaction: calcReaction, message: calcMessage },
  modeles: {
    1: [['calc:reaction', 3], ['qcm', 3], ['vf', 2], ['vocMot', 2], ['sequence', 1]],
    2: [['calc:reaction', 3], ['calc:message', 2], ['sequence', 2], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:reaction', 3], ['calc:message', 2], ['sequence', 2], ['qcm', 4]]
  }
};

export default fabriquer(banque);
