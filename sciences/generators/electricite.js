// Physique-Chimie — Électricité : circuits série et dérivation, loi d'Ohm, puissance, sécurité.
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net, arrondi } from './fabrique.js';
import { circuitSerie, circuitDerivation, symbole } from './figures.js';

const RESISTANCES = [10, 20, 22, 47, 50, 100, 150, 200, 220, 330, 470, 1000];

// ---------- Loi d'Ohm ----------

function calcOhm(rng, ctx, niveau) {
  // I en mA, choisie pour que U ait au plus deux décimales
  let R, ImA, U;
  do {
    R = rng.choix(RESISTANCES);
    ImA = rng.choix([5, 10, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300]);
    U = net(R * ImA / 1000);
  } while (U > 24 || U < 0.5 || Math.abs(U - arrondi(U, 2)) > 1e-9);
  const I = net(ImA / 1000);
  const quoi = niveau === 1 ? 'U' : niveau === 2 ? rng.choix(['U', 'R']) : rng.choix(['R', 'I', 'U']);
  const intensite = niveau === 1 ? `${fmt(I)} A` : `${fmt(ImA)} mA`;
  const convI = niveau === 1 ? [] : [`On convertit l'intensité en ampères : ${fmt(ImA)} mA = ${fmt(I)} A.`];
  if (quoi === 'U') {
    const err = erreursNombre(U);
    err.ajouter(net(R * ImA), `L'intensité doit être en <strong>ampères</strong> : ${fmt(ImA)} mA = ${fmt(I)} A.`);
    err.ajouter(net(R / I), 'Loi d\'Ohm : U = R × I. On <strong>multiplie</strong>.');
    return {
      cle: `ohm:U:${R}:${ImA}:${niveau}`,
      enonce: `<p>Une résistance R = ${fmt(R)} Ω est traversée par un courant d'intensité I = ${intensite}.</p><p><strong>Quelle est la tension U à ses bornes, en volts ?</strong></p>`,
      type: 'nombre',
      unite: 'V',
      reponse: U,
      etapes: ['Loi d\'Ohm : <strong>U = R × I</strong> (R en Ω, I en A → U en V).', ...convI, `U = ${fmt(R)} × ${fmt(I)} = ${gras(fmt(U))} V`],
      erreurs: err.liste(),
      expression: `${fmt(R)} × ${fmt(I)}`
    };
  }
  if (quoi === 'R') {
    const err = erreursNombre(R);
    err.ajouter(net(U / ImA), `L'intensité doit être en <strong>ampères</strong> : ${fmt(ImA)} mA = ${fmt(I)} A.`);
    err.ajouter(net(U * I), 'De U = R × I, on tire R = U ÷ I : on <strong>divise</strong>.');
    return {
      cle: `ohm:R:${R}:${ImA}`,
      enonce: `<p>On mesure une tension U = ${fmt(U)} V aux bornes d'une résistance et une intensité I = ${fmt(ImA)} mA.</p><p><strong>Quelle est la valeur de la résistance, en ohms (Ω) ?</strong></p>`,
      type: 'nombre',
      unite: 'Ω',
      reponse: R,
      etapes: ['Loi d\'Ohm : U = R × I, donc <strong>R = U ÷ I</strong>.', ...convI, `R = ${fmt(U)} ÷ ${fmt(I)} = ${gras(fmt(R))} Ω`],
      erreurs: err.liste(),
      expression: `${fmt(U)} ÷ ${fmt(I)}`
    };
  }
  const err = erreursNombre(ImA);
  err.ajouter(I, `${fmt(I)}, c'est l'intensité en <strong>ampères</strong>. On la demande en mA : × 1 000.`);
  err.ajouter(net(U * R), 'De U = R × I, on tire I = U ÷ R : on <strong>divise</strong>.');
  return {
    cle: `ohm:I:${R}:${ImA}`,
    enonce: `<p>On applique une tension U = ${fmt(U)} V aux bornes d'une résistance R = ${fmt(R)} Ω.</p><p><strong>Quelle est l'intensité du courant, en milliampères (mA) ?</strong></p>`,
    type: 'nombre',
    unite: 'mA',
    reponse: ImA,
    etapes: ['Loi d\'Ohm : U = R × I, donc <strong>I = U ÷ R</strong>.', `I = ${fmt(U)} ÷ ${fmt(R)} = ${fmt(I)} A.`, `${fmt(I)} A = ${fmt(I)} × 1000 mA = ${gras(fmt(ImA))} mA`],
    erreurs: err.liste(),
    expression: `${fmt(I)} × 1000`
  };
}

// ---------- Lois des circuits ----------

const DIPOLES = ['lampe', 'moteur', 'resistance', 'del'];
const NOMS = { lampe: 'lampe', moteur: 'moteur', resistance: 'résistance', del: 'DEL' };

// Loi d'additivité des tensions (série) ou d'unicité de l'intensité
function calcSerie(rng) {
  const n = rng.choix([2, 3]);
  const types = Array.from({ length: n }, () => rng.choix(DIPOLES));
  if (rng.bool(0.3)) {
    const I = rng.choix([0.1, 0.12, 0.15, 0.2, 0.25, 0.3]);
    const k = rng.int(2, n);
    const err = erreursNombre(I);
    err.ajouter(net(I * n), 'En série, l\'intensité ne s\'additionne pas : elle est <strong>la même partout</strong>.');
    err.ajouter(net(I / n), 'Le courant ne se partage pas : en série, il n\'y a qu\'un seul chemin.');
    return {
      cle: `unicite:${types.join(',')}:${I}:${k}`,
      enonce: `<p>Dans ce circuit en série, l'intensité qui traverse le dipôle D1 est I₁ = ${fmt(I)} A.</p><p><strong>Quelle est l'intensité I${k === 2 ? '₂' : '₃'} qui traverse le dipôle D${k}, en A ?</strong></p>`,
      figure: circuitSerie(types.map((type, j) => ({ type, nom: `D${j + 1}` }))),
      type: 'nombre',
      unite: 'A',
      reponse: I,
      etapes: ['Dans un circuit en série, il n\'y a qu\'une boucle : <strong>l\'intensité est la même en tout point</strong>.', `I${k === 2 ? '₂' : '₃'} = I₁ = ${gras(fmt(I))} A`],
      erreurs: err.liste()
    };
  }
  // Tensions aux bornes des récepteurs (au dixième), la pile fournit la somme
  let tensions;
  do { tensions = types.map(() => rng.int(5, 60) / 10); } while (net(tensions.reduce((a, b) => a + b, 0)) > 12);
  const Ug = net(tensions.reduce((a, b) => a + b, 0));
  const cache = rng.int(0, n - 1);
  const connues = tensions.filter((_, j) => j !== cache);
  const r = tensions[cache];
  const err = erreursNombre(r);
  err.ajouter(Ug, 'Ça, c\'est la tension de la pile. Elle se <strong>partage</strong> entre les récepteurs.');
  err.ajouter(net(Ug + connues.reduce((a, b) => a + b, 0)), 'On <strong>soustrait</strong> les tensions connues à celle de la pile.');
  const nom = j => `U${['₁', '₂', '₃'][j]}`;
  const expression = `${fmt(Ug)} − ${connues.map(fmt).join(' − ')}`;
  return {
    cle: `additivite:${types.join(',')}:${tensions.join(',')}:${cache}`,
    enonce: `<p>La pile délivre une tension de ${fmt(Ug)} V. ${tensions.map((u, j) => (j === cache ? '' : `${nom(j)} = ${fmt(u)} V aux bornes de D${j + 1}.`)).join(' ')}</p>
      <p><strong>Quelle est la tension ${nom(cache)} aux bornes de D${cache + 1}, en V ?</strong></p>`,
    figure: circuitSerie(types.map((type, j) => ({ type, nom: `D${j + 1}` }))),
    type: 'nombre',
    unite: 'V',
    reponse: r,
    etapes: [
      'En série, la tension de la pile est égale à la <strong>somme</strong> des tensions aux bornes des récepteurs (loi d\'additivité).',
      `${fmt(Ug)} = ${tensions.map((u, j) => (j === cache ? nom(j) : fmt(u))).join(' + ')}`,
      `${nom(cache)} = ${expression} = ${gras(fmt(r))} V`
    ],
    erreurs: err.liste(),
    expression
  };
}

// Dérivation : loi des nœuds, ou même tension aux bornes des branches
function calcDerivation(rng) {
  const types = [rng.choix(DIPOLES), rng.choix(DIPOLES)];
  const figure = circuitDerivation(types.map((type, j) => ({ type, nom: `D${j + 1}` })));
  if (rng.bool(0.35)) {
    const U = rng.choix([4.5, 6, 9, 12]);
    const err = erreursNombre(U);
    err.ajouter(net(U / 2), 'En dérivation, la tension ne se partage pas : chaque branche reçoit <strong>la même tension</strong>.');
    return {
      cle: `derivU:${types.join(',')}:${U}`,
      enonce: `<p>Les dipôles D1 et D2 sont branchés en dérivation sur une pile de ${fmt(U)} V.</p><p><strong>Quelle est la tension aux bornes de D2, en V ?</strong></p>`,
      figure,
      type: 'nombre',
      unite: 'V',
      reponse: U,
      etapes: ['Des dipôles en dérivation ont <strong>la même tension</strong> à leurs bornes.', `D2 est branché directement aux bornes de la pile : U₂ = ${gras(fmt(U))} V`],
      erreurs: err.liste()
    };
  }
  const I1 = rng.int(5, 40) / 100, I2 = rng.int(5, 40) / 100;
  const I = net(I1 + I2);
  if (rng.bool()) {
    const err = erreursNombre(I);
    err.ajouter(net(Math.abs(I1 - I2)), 'Le courant de la branche principale est la <strong>somme</strong> des courants des branches.');
    return {
      cle: `noeuds:I:${I1}:${I2}`,
      enonce: `<p>L'intensité dans la branche de D1 est I₁ = ${fmt(I1)} A, et dans celle de D2, I₂ = ${fmt(I2)} A.</p><p><strong>Quelle est l'intensité I débitée par la pile, en A ?</strong></p>`,
      figure,
      type: 'nombre',
      unite: 'A',
      reponse: I,
      etapes: ['Loi des nœuds : l\'intensité dans la branche principale est égale à la <strong>somme</strong> des intensités dans les branches dérivées.', `I = ${fmt(I1)} + ${fmt(I2)} = ${gras(fmt(I))} A`],
      erreurs: err.liste(),
      expression: `${fmt(I1)} + ${fmt(I2)}`
    };
  }
  const err = erreursNombre(I2);
  err.ajouter(net(I + I1), 'On <strong>soustrait</strong> : I₂ = I − I₁.');
  err.ajouter(I, 'La pile débite le courant total, qui se <strong>partage</strong> entre les deux branches.');
  return {
    cle: `noeuds:I2:${I1}:${I2}`,
    enonce: `<p>La pile débite un courant I = ${fmt(I)} A. Dans la branche de D1, I₁ = ${fmt(I1)} A.</p><p><strong>Quelle est l'intensité I₂ dans la branche de D2, en A ?</strong></p>`,
    figure,
    type: 'nombre',
    unite: 'A',
    reponse: I2,
    etapes: ['Loi des nœuds : I = I₁ + I₂, donc <strong>I₂ = I − I₁</strong>.', `I₂ = ${fmt(I)} − ${fmt(I1)} = ${gras(fmt(I2))} A`],
    erreurs: err.liste(),
    expression: `${fmt(I)} − ${fmt(I1)}`
  };
}

// ---------- Puissance ----------

const APPAREILS = [
  { nom: 'Une bouilloire', P: 2000 },
  { nom: 'Un grille-pain', P: 900 },
  { nom: 'Un sèche-cheveux', P: 1500 },
  { nom: 'Un four', P: 2500 },
  { nom: 'Un aspirateur', P: 800 },
  { nom: 'Un micro-ondes', P: 1200 },
  { nom: 'Un fer à repasser', P: 2200 },
  { nom: 'Un radiateur', P: 1500 }
];

function calcPuissance(rng, ctx, niveau) {
  if (niveau === 1 || rng.bool(0.4)) {
    // P = U × I avec une intensité simple
    const U = rng.choix([230, 12, 6, 4.5]);
    const I = U === 230 ? rng.choix([2, 3, 4, 5, 6, 8, 10]) : rng.choix([0.2, 0.25, 0.3, 0.5, 1, 1.5, 2]);
    const P = net(U * I);
    const err = erreursNombre(P);
    err.ajouter(net(U / I), 'Puissance : P = U × I. On <strong>multiplie</strong>.');
    err.ajouter(net(U + I), 'Puissance : P = U <strong>×</strong> I.');
    return {
      cle: `puiss:P:${U}:${I}`,
      enonce: `<p>Un appareil fonctionne sous une tension de ${fmt(U)} V. Il est traversé par un courant de ${fmt(I)} A.</p><p><strong>Quelle est sa puissance, en watts ?</strong></p>`,
      type: 'nombre',
      unite: 'W',
      reponse: P,
      etapes: ['Formule : <strong>P = U × I</strong> (U en V, I en A → P en W).', `P = ${fmt(U)} × ${fmt(I)} = ${gras(fmt(P))} W`],
      erreurs: err.liste(),
      expression: `${fmt(U)} × ${fmt(I)}`
    };
  }
  if (niveau === 3 && rng.bool(0.6)) {
    // Multiprise : le disjoncteur (16 A) va-t-il couper ?
    const n = rng.int(2, 3);
    const app = rng.melanger(APPAREILS).slice(0, n);
    const Ptot = app.reduce((s, a) => s + a.P, 0);
    const I = Ptot / 230;
    const coupe = I > 16;
    return {
      cle: `multiprise:${app.map(a => a.nom).sort().join('|')}`,
      enonce: `<p>${ctx.prenom} branche sur la même prise (230 V, protégée par un disjoncteur de 16 A) : ${app.map(a => `${a.nom.toLowerCase()} de ${fmt(a.P)} W`).join(', ')}.</p>
        <p><strong>Le disjoncteur va-t-il couper le courant ?</strong></p>`,
      type: 'qcm',
      choix: ['Oui', 'Non'],
      reponse: coupe ? 'Oui' : 'Non',
      etapes: [
        `Puissance totale : ${app.map(a => fmt(a.P)).join(' + ')} = ${fmt(Ptot)} W.`,
        `Intensité : I = P ÷ U = ${fmt(Ptot)} ÷ 230 ≈ ${fmt(arrondi(I, 1))} A.`,
        coupe ? `${fmt(arrondi(I, 1))} A &gt; 16 A : le disjoncteur ${gras('coupe')} le courant pour éviter une surchauffe des fils.` : `${fmt(arrondi(I, 1))} A &lt; 16 A : ${gras('pas de coupure')}.`
      ],
      erreurs: [],
      donnees: { Ptot }
    };
  }
  // I = P ÷ U, arrondi au dixième
  const a = rng.choix(APPAREILS);
  const I = a.P / 230;
  const r = arrondi(I, 1);
  const err = erreursNombre(r, 0.05);
  err.ajouter(arrondi(a.P * 230, 1), 'De P = U × I, on tire I = P ÷ U : on <strong>divise</strong>.');
  err.ajouter(arrondi(230 / a.P, 2), 'C\'est l\'inverse : I = <strong>P ÷ U</strong>.');
  return {
    cle: `puiss:I:${a.nom}`,
    enonce: `<p>${a.nom} de ${fmt(a.P)} W est branché${a.nom.startsWith('Une') ? 'e' : ''} sur le secteur (230 V).</p><p><strong>Quelle est l'intensité du courant qui ${a.nom.startsWith('Une') ? 'la' : 'le'} traverse, en A ?</strong> (arrondis au dixième)</p>`,
    type: 'nombre',
    unite: 'A',
    tolerance: 0.05,
    reponse: r,
    etapes: ['P = U × I, donc <strong>I = P ÷ U</strong>.', `I = ${fmt(a.P)} ÷ 230 ≈ ${fmt(arrondi(I, 3))} ≈ ${gras(fmt(r))} A`],
    erreurs: err.liste(),
    expression: `${fmt(a.P)} ÷ 230`
  };
}

// Reconnaître un symbole
const SYMBOLES = [
  { type: 'lampe', nom: 'Lampe', de: 'de la lampe' },
  { type: 'resistance', nom: 'Résistance', de: 'de la résistance' },
  { type: 'moteur', nom: 'Moteur', de: 'du moteur' },
  { type: 'pile', nom: 'Pile', de: 'de la pile (le grand trait est la borne +)' },
  { type: 'interrupteur-ouvert', nom: 'Interrupteur ouvert', de: 'de l\'interrupteur ouvert : le courant ne passe pas' },
  { type: 'interrupteur-ferme', nom: 'Interrupteur fermé', de: 'de l\'interrupteur fermé : le courant passe' },
  { type: 'del', nom: 'DEL (diode électroluminescente)', de: 'de la DEL : une diode avec deux flèches pour la lumière émise' },
  { type: 'diode', nom: 'Diode', de: 'de la diode : elle ne laisse passer le courant que dans un sens' },
  { type: 'generateur', nom: 'Générateur', de: 'du générateur' }
];
function calcSymbole(rng) {
  const s = rng.choix(SYMBOLES);
  // Les distracteurs « proches » sont privilégiés (DEL/diode, interrupteurs, lampe/moteur)
  const proches = { del: ['diode'], diode: ['del'], 'interrupteur-ouvert': ['interrupteur-ferme'], 'interrupteur-ferme': ['interrupteur-ouvert'], lampe: ['moteur', 'generateur'], moteur: ['lampe', 'generateur'], generateur: ['moteur', 'lampe'] }[s.type] || [];
  const autres = [...proches.map(t => SYMBOLES.find(x => x.type === t)), ...rng.melanger(SYMBOLES.filter(x => x !== s && !proches.includes(x.type)))].slice(0, 3);
  return {
    cle: `symbole:${s.type}`,
    enonce: '<p><strong>Quel dipôle est représenté par ce symbole ?</strong></p>',
    figure: symbole(s.type),
    type: 'qcm',
    choix: rng.melanger([s.nom, ...autres.map(x => x.nom)]),
    reponse: s.nom,
    etapes: [`C'est le symbole normalisé ${s.de}.`],
    erreurs: []
  };
}

export const banque = {
  id: 'electricite',
  titre: 'Circuits électriques',
  discipline: 'pc',
  resume: 'Série et dérivation, loi d\'Ohm, puissance électrique, sécurité.',
  essentiel: [
    '<strong>En série</strong> (une seule boucle) : l\'intensité est la même partout ; la tension de la pile se partage (U = U₁ + U₂). Si une lampe grille, tout s\'éteint.',
    '<strong>En dérivation</strong> (plusieurs branches) : la tension est la même aux bornes de chaque branche ; l\'intensité principale est la somme des intensités des branches (loi des nœuds).',
    'L\'<strong>ampèremètre</strong> se branche en série et mesure l\'intensité (A). Le <strong>voltmètre</strong> se branche en dérivation et mesure la tension (V).',
    'Loi d\'Ohm pour une résistance : <strong>U = R × I</strong>. Puissance d\'un appareil : <strong>P = U × I</strong>.',
    'Le secteur (230 V) est dangereux. Le <strong>disjoncteur</strong> ou le fusible coupe le courant en cas de surintensité ; la <strong>prise de terre</strong> protège des électrocutions.'
  ],
  formules: [
    { nom: 'Loi d\'Ohm', formule: 'U = R × I', unites: 'U en volts (V), R en ohms (Ω), I en ampères (A) · 1 A = 1 000 mA' },
    { nom: 'Puissance', formule: 'P = U × I', unites: 'P en watts (W)' },
    { nom: 'Série', formule: 'I = I₁ = I₂ · U = U₁ + U₂' },
    { nom: 'Dérivation', formule: 'U = U₁ = U₂ · I = I₁ + I₂' }
  ],
  vocabulaire: [
    { mot: 'Dipôle', definition: 'Composant électrique qui possède deux bornes (lampe, pile, moteur…).' },
    { mot: 'Court-circuit', definition: 'Liaison directe entre deux bornes par un fil sans résistance : l\'intensité devient très grande et peut provoquer un incendie.' },
    { mot: 'Conducteur', definition: 'Matériau qui laisse passer le courant électrique, comme les métaux.' },
    { mot: 'Isolant', definition: 'Matériau qui ne laisse pas passer le courant, comme le plastique ou le verre.' },
    { mot: 'Intensité', definition: 'Grandeur qui mesure le débit du courant électrique, en ampères (A).' },
    { mot: 'Tension', definition: 'Grandeur électrique mesurée entre deux points d\'un circuit, en volts (V).' },
    { mot: 'Disjoncteur', definition: 'Appareil qui coupe automatiquement le courant en cas de surintensité ou de court-circuit.' },
    { mot: 'Électrisation', definition: 'Passage du courant électrique dans le corps humain ; s\'il entraîne la mort, on parle d\'électrocution.' }
  ],
  questions: [
    { q: 'Comment branche-t-on un voltmètre ?', bonne: 'En dérivation', fausses: ['En série', 'À la place de la pile', 'Sans le relier au circuit'], explication: 'Le voltmètre mesure une tension entre deux points : ses bornes se branchent de part et d\'autre du dipôle.', niveau: 1 },
    { q: 'Comment branche-t-on un ampèremètre ?', bonne: 'En série', fausses: ['En dérivation', 'Aux bornes de la pile seule', 'Sans le relier au circuit'], explication: 'Le courant doit traverser l\'ampèremètre pour être mesuré.', niveau: 1 },
    { q: 'Dans une maison, les lampes sont branchées…', bonne: 'En dérivation', fausses: ['En série', 'Une seule à la fois', 'Sans interrupteur'], explication: 'En dérivation, chaque lampe reçoit 230 V et fonctionne même si une autre est éteinte ou grillée.', niveau: 2 },
    { q: 'Deux lampes sont en série. L\'une grille. L\'autre…', bonne: 'S\'éteint', fausses: ['Brille plus fort', 'Continue de briller normalement', 'Grille aussi forcément'], explication: 'En série, il n\'y a qu\'une boucle : si elle est coupée, le courant ne circule plus.', niveau: 2 },
    { q: 'Quelle est l\'unité de la résistance ?', bonne: 'L\'ohm (Ω)', fausses: ['Le volt (V)', 'L\'ampère (A)', 'Le watt (W)'], niveau: 1 },
    { q: 'Que se passe-t-il lors d\'un court-circuit d\'une pile ?', bonne: 'L\'intensité devient très grande et la pile chauffe', fausses: ['Le courant s\'arrête', 'La tension double', 'Rien de particulier'], explication: 'Le courant passe par le fil sans résistance : l\'intensité est très grande, les fils et la pile chauffent.', niveau: 3 },
    { q: 'À quoi sert la prise de terre ?', bonne: 'À évacuer le courant en cas de défaut, pour protéger les personnes', fausses: ['À augmenter la tension', 'À économiser l\'énergie', 'À faire fonctionner les lampes'], niveau: 3 },
    { q: 'Quelle est la tension du secteur en France ?', bonne: '230 V', fausses: ['12 V', '110 V', '4,5 V'], niveau: 1 },
    { q: 'Pourquoi ne faut-il pas brancher trop d\'appareils puissants sur une même multiprise ?', bonne: 'L\'intensité totale peut faire chauffer les fils', fausses: ['La tension devient trop faible', 'Les appareils consomment moins', 'Le compteur s\'arrête'], explication: 'Les intensités s\'additionnent (dérivation) : une trop forte intensité fait chauffer les câbles, risque d\'incendie.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Dans un circuit en série, l\'intensité est la même en tout point.', vrai: true, explication: 'C\'est la loi d\'unicité de l\'intensité.' },
    { texte: 'En dérivation, la tension se partage entre les branches.', vrai: false, explication: 'En dérivation, chaque branche a <strong>la même tension</strong>. C\'est l\'intensité qui se partage.' },
    { texte: 'Le corps humain est conducteur d\'électricité.', vrai: true, explication: 'C\'est pour cela que le courant du secteur est dangereux, surtout avec les mains mouillées.' },
    { texte: 'Un voltmètre se branche en série.', vrai: false, explication: 'Il se branche en dérivation, aux bornes du dipôle.' }
  ],
  classements: [{
    question: 'Conducteur ou isolant ?',
    groupes: [
      { nom: 'Conducteur', items: ['Le cuivre', 'L\'aluminium', 'Le fer', 'L\'eau salée', 'La mine de crayon (graphite)', 'Le corps humain'] },
      { nom: 'Isolant', items: ['Le plastique', 'Le verre', 'Le bois sec', 'Le caoutchouc', 'L\'air sec', 'La céramique'] }
    ]
  }],
  calculs: { ohm: calcOhm, serie: calcSerie, derivation: calcDerivation, puissance: calcPuissance, symbole: calcSymbole },
  modeles: {
    1: [['calc:ohm', 3], ['calc:serie', 2], ['calc:symbole', 3], ['calc:puissance', 2], ['classement', 2], ['qcm', 2], ['vf', 1]],
    2: [['calc:ohm', 3], ['calc:serie', 2], ['calc:derivation', 3], ['calc:puissance', 2], ['qcm', 2], ['vf', 1], ['vocMot', 1]],
    3: [['calc:ohm', 3], ['calc:derivation', 2], ['calc:serie', 2], ['calc:puissance', 3], ['qcm', 2], ['vocDef', 1]]
  },
  controler(exo) {
    if (exo.cle.startsWith('multiprise:')) return (exo.donnees.Ptot / 230 > 16) === (exo.reponse === 'Oui') ? null : 'disjoncteur incohérent';
    return null;
  }
};

export default fabriquer(banque);
