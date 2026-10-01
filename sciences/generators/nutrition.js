// SVT — Nutrition et effort physique : digestion, respiration, circulation, adaptations à l'effort.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';

// Fréquence cardiaque à partir des battements comptés sur une durée courte
function calcFrequence(rng, ctx, niveau) {
  const effort = rng.bool();
  const fc = effort ? rng.int(30, 45) * 4 : rng.int(15, 22) * 4;   // 120-180 ou 60-88 battements/min
  const duree = niveau === 1 ? 15 : rng.choix([10, 15, 20, 30]);
  if (fc * duree % 60) return null;
  const compte = fc * duree / 60;
  const k = 60 / duree;
  const err = erreursNombre(fc);
  err.ajouter(compte, `Ça, c'est le nombre de battements en ${duree} s. On veut le nombre par <strong>minute</strong> (60 s).`);
  err.ajouter(compte + 60, 'On <strong>multiplie</strong> : il y a ' + k + ' fois ' + duree + ' s dans une minute.');
  const situation = effort
    ? rng.choix([`juste après un match de handball`, `après un sprint`, `après avoir monté les escaliers en courant`, `après une séance de galop`])
    : rng.choix(['au repos, assise sur une chaise', 'au réveil', 'au calme, avant le cours']);
  return {
    cle: `fc:${fc}:${duree}`,
    enonce: `<p>${ctx.prenom} prend son pouls ${situation.replace('assise', ctx.e('assise', 'assis'))} : ${ctx.il()} compte ${compte} battements en ${duree} secondes.</p>
      <p><strong>Quelle est sa fréquence cardiaque, en battements par minute ?</strong></p>`,
    type: 'nombre',
    unite: 'batt./min',
    reponse: fc,
    etapes: [
      `1 minute = 60 s = ${k} × ${duree} s.`,
      `${compte} × ${k} = ${gras(fmt(fc))} battements par minute.`,
      effort ? 'Pendant un effort, le cœur bat plus vite pour apporter plus de dioxygène et de nutriments aux muscles.' : 'Au repos, le cœur d\'un adolescent bat en général entre 60 et 100 fois par minute.'
    ],
    erreurs: err.liste(),
    expression: `${compte} × ${k}`
  };
}

// Débit ventilatoire = fréquence respiratoire × volume d'air par mouvement
function calcVentilation(rng, ctx) {
  const effort = rng.bool();
  const f = effort ? rng.int(30, 50) : rng.int(12, 20);
  const v = effort ? rng.choix([1.5, 2, 2.5]) : rng.choix([0.4, 0.5, 0.6]);
  const D = net(f * v);
  const err = erreursNombre(D);
  err.ajouter(net(f + v), 'On <strong>multiplie</strong> le nombre de respirations par le volume d\'une respiration.');
  err.ajouter(net(f / v), 'On <strong>multiplie</strong> : volume par minute = fréquence × volume par mouvement.');
  return {
    cle: `ventil:${f}:${v}`,
    enonce: `<p>${effort ? `Pendant un effort intense, ${ctx.prenom}` : `Au repos, ${ctx.prenom}`} respire ${f} fois par minute. À chaque inspiration, ${fmt(v)} L d'air entrent dans ses poumons.</p>
      <p><strong>Quel volume d'air respire-t-${ctx.il()} en une minute, en L ?</strong></p>`,
    type: 'nombre',
    unite: 'L/min',
    reponse: D,
    etapes: [
      'Volume par minute = nombre de respirations par minute × volume d\'une respiration.',
      `${f} × ${fmt(v)} = ${gras(fmt(D))} L/min`,
      effort ? 'À l\'effort, on respire plus vite et plus profondément : plus de dioxygène entre, plus de dioxyde de carbone sort.' : 'À l\'effort, ce volume peut être multiplié par 10.'
    ],
    erreurs: err.liste(),
    expression: `${f} × ${fmt(v)}`
  };
}

// Fréquence cardiaque maximale théorique (formule usuelle : 220 − âge)
function calcFcMax(rng, ctx) {
  const age = rng.int(12, 50);
  const qui = age <= 16 ? ctx.prenom : age <= 25 ? 'Une handballeuse professionnelle' : rng.choix(['Le prof d\'EPS', 'Une cavalière', 'Un coureur de marathon']);
  const r = 220 - age;
  return {
    cle: `fcmax:${age}`,
    enonce: `<p>On estime la fréquence cardiaque maximale avec la formule : <strong>FC max = 220 − âge</strong>.</p><p>${qui} a ${age} ans. <strong>Quelle est sa fréquence cardiaque maximale théorique ?</strong></p>`,
    type: 'nombre',
    unite: 'batt./min',
    reponse: r,
    etapes: [`FC max = 220 − ${age} = ${gras(fmt(r))} battements par minute.`, 'Pendant un effort, on ne dépasse pas cette valeur : au-delà, le cœur ne peut pas accélérer davantage.'],
    erreurs: [{ test: v => v === 220 + age, message: 'On <strong>retire</strong> l\'âge à 220.' }],
    expression: `220 − ${age}`
  };
}

export const banque = {
  id: 'nutrition',
  titre: 'Nutrition et effort physique',
  discipline: 'svt',
  resume: 'Digestion, respiration, circulation sanguine, le corps pendant l\'effort.',
  essentiel: [
    'Les <strong>organes</strong> ont besoin en permanence de <strong>nutriments</strong> et de <strong>dioxygène</strong> ; ils rejettent du dioxyde de carbone et des déchets.',
    '<strong>Digestion</strong> : les aliments sont découpés en nutriments par les <strong>enzymes</strong> des sucs digestifs. Les nutriments passent dans le sang au niveau de l\'<strong>intestin grêle</strong>.',
    '<strong>Respiration</strong> : dans les <strong>alvéoles pulmonaires</strong>, le dioxygène passe dans le sang et le dioxyde de carbone en sort.',
    '<strong>Circulation</strong> : le cœur propulse le sang dans les artères ; le sang distribue nutriments et dioxygène à tous les organes, puis revient par les veines.',
    'Pendant un <strong>effort</strong>, les muscles consomment plus : le cœur bat plus vite et la respiration s\'accélère. Un entraînement régulier améliore les performances.'
  ],
  formules: [
    { nom: 'Battements par minute', formule: 'nombre compté × (60 ÷ durée du comptage en s)' },
    { nom: 'Volume d\'air par minute', formule: 'fréquence respiratoire × volume par mouvement' },
    { nom: 'Fréquence cardiaque maximale', formule: 'FC max ≈ 220 − âge' }
  ],
  vocabulaire: [
    { mot: 'Nutriment', definition: 'Petite molécule issue de la digestion, qui passe dans le sang (glucose, acides aminés…).' },
    { mot: 'Enzyme', definition: 'Molécule des sucs digestifs qui découpe les aliments en nutriments.' },
    { mot: 'Alvéole pulmonaire', definition: 'Minuscule sac au bout des bronchioles, où se font les échanges de gaz avec le sang.' },
    { mot: 'Artère', definition: 'Vaisseau qui transporte le sang du cœur vers les organes.' },
    { mot: 'Veine', definition: 'Vaisseau qui ramène le sang des organes vers le cœur.' },
    { mot: 'Capillaire', definition: 'Vaisseau sanguin très fin, au contact des cellules, où se font les échanges.' },
    { mot: 'Fréquence cardiaque', definition: 'Nombre de battements du cœur par minute.' },
    { mot: 'Microbiote intestinal', definition: 'Ensemble des micro-organismes qui vivent dans l\'intestin et participent à la digestion.' }
  ],
  questions: [
    { q: 'Où les nutriments passent-ils dans le sang ?', bonne: 'Dans l\'intestin grêle', fausses: ['Dans l\'estomac', 'Dans la bouche', 'Dans le gros intestin'], explication: 'La paroi de l\'intestin grêle est très plissée (environ 200 m² de surface d\'échange) et très riche en capillaires.', niveau: 1 },
    { q: 'Que transforme la digestion ?', bonne: 'Les aliments en nutriments', fausses: ['Les nutriments en aliments', 'Le dioxygène en dioxyde de carbone', 'Le sang en lymphe'], niveau: 1 },
    { q: 'Quel gaz passe des alvéoles pulmonaires vers le sang ?', bonne: 'Le dioxygène', fausses: ['Le dioxyde de carbone', 'Le diazote', 'La vapeur d\'eau'], explication: 'Le dioxygène entre dans le sang, le dioxyde de carbone en sort pour être expiré.', niveau: 1 },
    { q: 'Pendant un effort, pourquoi le cœur bat-il plus vite ?', bonne: 'Pour apporter plus de dioxygène et de nutriments aux muscles', fausses: ['Pour refroidir le corps', 'Pour digérer plus vite', 'Parce que le sang devient plus épais'], niveau: 2 },
    { q: 'Que produisent les muscles en consommant du glucose et du dioxygène ?', bonne: 'De l\'énergie, du dioxyde de carbone et de l\'eau', fausses: ['Du dioxygène et du glucose', 'Des anticorps', 'Des enzymes digestives'], explication: 'C\'est la respiration cellulaire : elle libère l\'énergie nécessaire à la contraction des muscles.', niveau: 3 },
    { q: 'Quel est le rôle des enzymes digestives ?', bonne: 'Découper les grosses molécules des aliments', fausses: ['Transporter le dioxygène', 'Tuer tous les microbes', 'Faire battre le cœur'], niveau: 2 },
    { q: 'Pourquoi un sportif entraîné a-t-il un cœur qui bat moins vite au repos ?', bonne: 'Son cœur envoie plus de sang à chaque battement', fausses: ['Ses muscles ne consomment rien au repos', 'Son sang ne contient plus de dioxygène', 'Il respire moins souvent'], explication: 'L\'entraînement renforce le muscle cardiaque : chaque contraction éjecte plus de sang.', niveau: 3 },
    { q: 'Quel organe pompe le sang dans tout le corps ?', bonne: 'Le cœur', fausses: ['Les poumons', 'Le foie', 'L\'estomac'], niveau: 1 },
    { q: 'Pourquoi le tabac diminue-t-il les performances sportives ?', bonne: 'Il abîme les alvéoles et réduit les échanges de gaz', fausses: ['Il augmente le dioxygène dans le sang', 'Il renforce les muscles', 'Il n\'a aucun effet'], explication: 'La fumée contient du monoxyde de carbone et des goudrons : moins de dioxygène arrive aux muscles.', niveau: 2 }
  ],
  vraiFaux: [
    { texte: 'Les nutriments sont absorbés dans l\'estomac.', vrai: false, explication: 'L\'essentiel de l\'absorption se fait dans l\'intestin grêle.' },
    { texte: 'Le sang qui sort des muscles contient plus de dioxyde de carbone que celui qui y entre.', vrai: true, explication: 'Les muscles rejettent du dioxyde de carbone dans le sang.' },
    { texte: 'Pendant un effort, la respiration ralentit.', vrai: false, explication: 'Elle s\'accélère et devient plus ample pour apporter plus de dioxygène.' },
    { texte: 'Les veines ramènent le sang vers le cœur.', vrai: true, explication: 'Les artères partent du cœur ; les veines y reviennent.' }
  ],
  sequences: [
    { titre: 'aliment', consigne: 'Remets dans l\'ordre le trajet d\'un aliment dans le tube digestif.', etapes: ['Bouche', 'Œsophage', 'Estomac', 'Intestin grêle', 'Gros intestin', 'Anus'] },
    { titre: 'air', consigne: 'Remets dans l\'ordre le trajet de l\'air inspiré.', etapes: ['Nez ou bouche', 'Trachée', 'Bronches', 'Bronchioles', 'Alvéoles pulmonaires'] },
    { titre: 'oxygene', consigne: 'Remets dans l\'ordre le trajet du dioxygène, de l\'air jusqu\'au muscle.', etapes: ['Alvéoles pulmonaires', 'Sang des capillaires du poumon', 'Cœur', 'Artères', 'Capillaires du muscle', 'Cellules musculaires'] }
  ],
  classements: [{
    question: 'À quel appareil appartient cet organe ?',
    groupes: [
      { nom: 'Digestif', items: ['L\'estomac', 'L\'intestin grêle', 'Le foie', 'L\'œsophage', 'Le pancréas'] },
      { nom: 'Respiratoire', items: ['Les poumons', 'La trachée', 'Les bronches'] },
      { nom: 'Circulatoire', items: ['Le cœur', 'L\'aorte', 'Les veines', 'Les capillaires sanguins'] }
    ]
  }],
  calculs: { frequence: calcFrequence, ventilation: calcVentilation, fcmax: calcFcMax },
  modeles: {
    1: [['calc:frequence', 3], ['classement', 2], ['qcm', 3], ['vf', 2], ['vocMot', 1], ['sequence', 1]],
    2: [['calc:frequence', 2], ['calc:ventilation', 3], ['calc:fcmax', 1], ['sequence', 2], ['qcm', 3], ['vf', 1], ['vocDef', 1]],
    3: [['calc:ventilation', 2], ['calc:frequence', 2], ['calc:fcmax', 1], ['sequence', 2], ['qcm', 4]]
  }
};

export default fabriquer(banque);
