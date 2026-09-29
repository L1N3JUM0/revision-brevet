// Générateur : angles et parallèles (alternes-internes, correspondants, opposés par le sommet,
// calcul d'angles, justification du parallélisme).
// Figure : deux droites (d₁) et (d₂) coupées par une sécante (t) en A (en haut) et B (en bas).
// Angles numérotés : en A, 1 = droite/haut, 2 = haut/gauche, 3 = gauche/bas, 4 = bas/droite ; en B, 5 à 8 de même.
import { svg } from '../../assets/js/core/svg.js';

const RAD = Math.PI / 180;
const gras = s => `<strong>${s}</strong>`;
const D1 = '(d<sub>1</sub>)', D2 = '(d<sub>2</sub>)';

// ---------- Relations entre les angles ----------

const sommet = k => (k <= 4 ? 'A' : 'B');
const position = k => ((k - 1) % 4) + 1;            // 1..4
const cote = k => ([1, 4].includes(position(k)) ? 'droite' : 'gauche');   // côté de la sécante
const niveauV = k => ([1, 2].includes(position(k)) ? 'haut' : 'bas');     // au-dessus ou au-dessous de sa droite
const interieur = k => (sommet(k) === 'A' ? niveauV(k) === 'bas' : niveauV(k) === 'haut');
// Angles « de type α » (1, 3, 5, 7) ou « de type 180 − α » (2, 4, 6, 8)
const typeAlpha = k => position(k) % 2 === 1;

function relation(i, j) {
  if (sommet(i) === sommet(j)) {
    if (i === j) return 'identique';
    return Math.abs(position(i) - position(j)) === 2 ? 'opposes' : 'adjacents';
  }
  if (cote(i) === cote(j) && niveauV(i) === niveauV(j)) return 'correspondants';
  if (cote(i) !== cote(j) && interieur(i) && interieur(j)) return 'alternes-internes';
  if (cote(i) !== cote(j) && !interieur(i) && !interieur(j)) return 'alternes-externes';
  return 'aucune';
}

// Plus court chemin de raisonnement entre deux angles (droites parallèles)
function chemin(i, j) {
  const utiles = ['opposes', 'adjacents', 'correspondants', 'alternes-internes'];
  const file = [[i]];
  const vus = new Set([i]);
  while (file.length) {
    const c = file.shift();
    const dernier = c[c.length - 1];
    if (dernier === j) return c;
    for (let k = 1; k <= 8; k++) {
      if (vus.has(k) || !utiles.includes(relation(dernier, k))) continue;
      vus.add(k);
      file.push([...c, k]);
    }
  }
  return null;
}

// ---------- Figure ----------

/**
 * alpha : mesure de l'angle 1 (en A) ; alphaB : mesure de l'angle 5 (en B, = alpha si parallèles).
 * marques : { k: texte } angles à dessiner avec leur étiquette.
 * Renvoie { svg, geo } ; geo sert au contrôle indépendant (directions réelles des demi-droites).
 */
function figure(alpha, alphaB, phi, marques) {
  const W = 340, H = 250;
  const s = phi + alpha;                       // direction « vers le haut » de la sécante (repère maths)
  const phi2 = s - alphaB;                     // direction de (d₂)
  const L = 92 / Math.sin(s * RAD);
  const decalage = L * Math.cos(s * RAD);          // écart horizontal entre A et B
  const A = { x: 170 + decalage / 2, y: 78 };      // A et B centrés dans le cadre
  const B = { x: A.x - decalage, y: A.y + L * Math.sin(s * RAD) };
  const vers = (P, ang, r) => ({ x: P.x + r * Math.cos(ang * RAD), y: P.y - r * Math.sin(ang * RAD) });
  const trait = (P, Q, cls = 'trait') => `<line class="${cls}" x1="${P.x.toFixed(1)}" y1="${P.y.toFixed(1)}" x2="${Q.x.toFixed(1)}" y2="${Q.y.toFixed(1)}"/>`;
  const t = (x, y, txt, cls = 'etiquette') => `<text class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle">${txt}</text>`;

  let c = '';
  // Droites prolongées sur toute la largeur
  const droite = (P, ang) => {
    const k = 190;
    return trait(vers(P, ang, -k), vers(P, ang, k));
  };
  c += droite(A, phi) + droite(B, phi2);
  c += trait(vers(A, s, 62), vers(B, s, -62));
  // Noms des droites au bord droit du cadre
  const auBord = (P, ang) => P.y - (318 - P.x) * Math.tan(ang * RAD);
  c += t(318, auBord(A, phi) - 12, 'd₁', 'nom-droite');
  c += t(318, auBord(B, phi2) - 12, 'd₂', 'nom-droite');
  const bout = vers(B, s, -58);
  c += t(bout.x + 14, bout.y, 't', 'nom-droite');

  // Demi-droites de chaque angle (repère maths) : [début, fin] dans le sens trigonométrique
  const rayons = k => {
    const f = sommet(k) === 'A' ? phi : phi2;
    return [[f, s], [s, f + 180], [f + 180, s + 180], [s + 180, f + 360]][position(k) - 1];
  };
  for (const [kTexte, etiquette] of Object.entries(marques)) {
    const k = Number(kTexte);
    const P = sommet(k) === 'A' ? A : B;
    const [a1, a2] = rayons(k);
    const r = 20;
    const p1 = vers(P, a1, r), p2 = vers(P, a2, r);
    const grand = ((a2 - a1) % 360 + 360) % 360 > 180 ? 1 : 0;
    c += `<path class="arc-angle arc-${etiquette === '?' ? 'cible' : 'donne'}" d="M${P.x.toFixed(1)} ${P.y.toFixed(1)}L${p1.x.toFixed(1)} ${p1.y.toFixed(1)}A${r} ${r} 0 ${grand} 0 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}Z"/>`;
    const lab = vers(P, (a1 + a2) / 2, 36);
    c += t(lab.x, lab.y, etiquette, 'etiquette-angle');
  }
  // Nom du point dans un secteur sans arc (de préférence un angle obtus, plus large)
  const nomPoint = (P, lettre, premier) => {
    const libres = [0, 1, 2, 3].map(p => premier + p).filter(k => !(k in marques));
    const choix = libres.sort((u, v) => {
      const [a, b] = rayons(u), [c2, d] = rayons(v);
      return (d - c2) - (b - a);
    })[0] ?? premier;
    const [a1, a2] = rayons(choix);
    const q = vers(P, (a1 + a2) / 2, 15);
    return t(q.x, q.y, lettre, 'nom-point');
  };
  c += nomPoint(A, 'A', 1) + nomPoint(B, 'B', 5);

  const geo = { phi, phi2, s };
  return { svg: svg(W, H, c, { titre: 'Deux droites coupées par une sécante' }), geo };
}

// Mesure réelle d'un angle d'après les directions de la figure (contrôle indépendant)
function mesureSurFigure(geo, k) {
  const f = sommet(k) === 'A' ? geo.phi : geo.phi2;
  const vec = a => ({ x: Math.cos(a * RAD), y: Math.sin(a * RAD) });
  const paires = [[vec(f), vec(geo.s)], [vec(geo.s), vec(f + 180)], [vec(f + 180), vec(geo.s + 180)], [vec(geo.s + 180), vec(f)]];
  const [u, v] = paires[position(k) - 1];
  return Math.acos(Math.max(-1, Math.min(1, u.x * v.x + u.y * v.y))) / RAD;
}

function mesure(k, alpha, alphaB = alpha) {
  const a = sommet(k) === 'A' ? alpha : alphaB;
  return typeAlpha(k) ? a : 180 - a;
}

function tirerAlpha(rng) {
  let a;
  do { a = rng.int(35, 145); } while (Math.abs(a - 90) < 12);
  return a;
}

const NOMS_REL = {
  'alternes-internes': 'alternes-internes',
  correspondants: 'correspondants',
  opposes: 'opposés par le sommet',
  adjacents: 'adjacents (ils forment un angle plat)'
};

// Explication de la position de deux angles
function expliquer(i, j) {
  const r = relation(i, j);
  const place = k => `${cote(k) === 'droite' ? 'à droite' : 'à gauche'} de (t), ${niveauV(k) === 'haut' ? 'au-dessus' : 'au-dessous'} de ${sommet(k) === 'A' ? D1 : D2}`;
  const base = `L'angle ${i} est ${place(i)} ; l'angle ${j} est ${place(j)}.`;
  switch (r) {
    case 'alternes-internes': return `${base} Ils sont de part et d'autre de la sécante et tous les deux <strong>entre les deux droites</strong> : ils sont <strong>alternes-internes</strong>.`;
    case 'correspondants': return `${base} Ils sont du même côté de la sécante et placés <strong>de la même façon</strong> par rapport à chaque droite : ils sont <strong>correspondants</strong>.`;
    case 'opposes': return `Les angles ${i} et ${j} ont le même sommet ${sommet(i)} et leurs côtés se prolongent : ils sont <strong>opposés par le sommet</strong>.`;
    default: return `${base} Ils ne sont ni opposés par le sommet (sommets différents), ni correspondants (pas placés de la même façon), ni alternes-internes (pas tous les deux entre les droites, ou du même côté de la sécante).`;
  }
}

// ---------- Niveau 1 : reconnaître ----------

const CHOIX_N1 = ['Alternes-internes', 'Correspondants', 'Opposés par le sommet', 'Aucun des trois'];

function paires(filtre) {
  const liste = [];
  for (let i = 1; i <= 8; i++) for (let j = i + 1; j <= 8; j++) if (filtre(relation(i, j))) liste.push([i, j]);
  return liste;
}

function exoReconnaitre(rng) {
  const cible = rng.choix(['alternes-internes', 'correspondants', 'opposes', 'aucune']);
  const [i, j] = rng.choix(paires(r => r === cible));
  const alpha = tirerAlpha(rng);
  const phi = rng.int(-10, 10);
  const { svg: fig, geo } = figure(alpha, alpha, phi, { [i]: String(i), [j]: String(j) });
  const reponse = { 'alternes-internes': CHOIX_N1[0], correspondants: CHOIX_N1[1], opposes: CHOIX_N1[2], aucune: CHOIX_N1[3] }[cible];
  const erreurs = [
    { test: v => v === CHOIX_N1[0], message: 'Alternes-internes : de part et d\'autre de la sécante <strong>et</strong> tous les deux entre les deux droites.' },
    { test: v => v === CHOIX_N1[1], message: 'Correspondants : du même côté de la sécante <strong>et</strong> placés de la même façon (tous les deux au-dessus, ou tous les deux au-dessous, de leur droite).' },
    { test: v => v === CHOIX_N1[2], message: 'Opposés par le sommet : il faut le <strong>même sommet</strong>.' },
    { test: v => v === CHOIX_N1[3], message: 'Regarde bien : ces deux angles ont une position particulière.' }
  ].filter(e => !e.test(reponse));
  return {
    cle: `reconnaitre:${i}:${j}:${alpha}:${phi}`,
    enonce: `<p>Les droites ${D1} et ${D2} sont coupées par la sécante (t).</p><p><strong>Comment sont les angles ${i} et ${j} ?</strong></p>`,
    figure: fig,
    type: 'qcm',
    choix: CHOIX_N1,
    reponse,
    etapes: [expliquer(i, j)],
    erreurs,
    donnees: { type: 'reconnaitre', i, j, relation: cible, geo }
  };
}

// ---------- Niveaux 2 et 3 : calculer un angle ----------

function phraseEtape(de, vers_, mDe, mVers) {
  const r = relation(de, vers_);
  if (r === 'opposes') return `Les angles ${de} et ${vers_} sont <strong>opposés par le sommet</strong>, donc ils ont la même mesure : angle ${vers_} = ${mVers}°.`;
  if (r === 'adjacents') return `Les angles ${de} et ${vers_} forment un <strong>angle plat</strong> (180°), donc angle ${vers_} = 180° − ${mDe}° = ${mVers}°.`;
  return `Les droites ${D1} et ${D2} sont parallèles et les angles ${de} et ${vers_} sont <strong>${NOMS_REL[r]}</strong>, donc ils ont la même mesure : angle ${vers_} = ${mVers}°.`;
}

function propriete(r) {
  if (r === 'opposes') return 'Or, deux angles opposés par le sommet ont la même mesure.';
  if (r === 'adjacents') return 'Or, deux angles qui forment un angle plat sont supplémentaires (leur somme vaut 180°).';
  return `Or, si deux droites parallèles sont coupées par une sécante, alors les angles ${NOMS_REL[r]} ont la même mesure.`;
}

function exoCalculer(rng, niveau) {
  const longueur = niveau === 2 ? 1 : 2;
  let i, j, c;
  do {
    i = rng.int(1, 8);
    j = rng.int(1, 8);
    c = i !== j ? chemin(i, j) : null;
  } while (!c || c.length - 1 !== longueur || (niveau === 2 && relation(i, j) === 'adjacents' && rng.bool(0.5)));
  const alpha = tirerAlpha(rng);
  const phi = rng.int(-10, 10);
  const mi = mesure(i, alpha), mj = mesure(j, alpha);
  const { svg: fig, geo } = figure(alpha, alpha, phi, { [i]: `${mi}°`, [j]: '?' });

  const etapes = [];
  const redaction = [`Les droites ${D1} et ${D2} sont parallèles.`];
  for (let k = 1; k < c.length; k++) {
    const [a, b] = [c[k - 1], c[k]];
    const r = relation(a, b);
    etapes.push(phraseEtape(a, b, mesure(a, alpha), mesure(b, alpha)));
    redaction.push(`Les angles ${a} et ${b} sont ${NOMS_REL[r].replace(' (ils forment un angle plat)', '')}. ${propriete(r)}`);
    redaction.push(r === 'adjacents' ? `Donc angle ${b} = 180° − ${mesure(a, alpha)}° = ${mesure(b, alpha)}°.` : `Donc angle ${b} = ${mesure(b, alpha)}°.`);
  }
  etapes[etapes.length - 1] = etapes[etapes.length - 1].replace(new RegExp(`${mj}°\\.$`), `${gras(mj + '°')}.`);

  const erreurs = [];
  if (180 - mj !== mj) {
    const egaux = mi === mj;
    erreurs.push({
      test: v => typeof v === 'number' && Math.abs(v - (180 - mj)) < 0.5,
      message: egaux
        ? 'Ces deux angles ont la <strong>même mesure</strong> : ils ne sont pas supplémentaires.'
        : 'Attention : ces deux angles ne sont pas égaux. L\'un est aigu, l\'autre obtus : leur somme fait 180°.'
    });
  }
  return {
    cle: `calculer:${niveau}:${i}:${j}:${alpha}:${phi}`,
    enonce: `<p>Les droites ${D1} et ${D2} sont <strong>parallèles</strong>. L'angle ${i} mesure ${mi}°.</p>
      <p><strong>Quelle est la mesure de l'angle ${j} ?</strong></p>`,
    figure: fig,
    type: 'nombre',
    unite: '°',
    reponse: mj,
    etapes,
    redaction: redaction.join('<br>'),
    erreurs,
    donnees: { type: 'calculer', j, geo }
  };
}

// ---------- Niveau 3 : les droites sont-elles parallèles ? ----------

function exoParallelisme(rng) {
  const rel = rng.choix(['alternes-internes', 'correspondants']);
  const [i, j] = rng.choix(paires(r => r === rel));
  const parallele = rng.bool(0.5);
  const alpha = tirerAlpha(rng);
  const alphaB = parallele ? alpha : alpha + rng.choix([-6, -5, -4, -3, 3, 4, 5, 6]);
  const phi = rng.int(-8, 8);
  const mi = mesure(i, alpha, alphaB), mj = mesure(j, alpha, alphaB);
  const { svg: fig, geo } = figure(alpha, alphaB, phi, { [i]: `${mi}°`, [j]: `${mj}°` });
  const choix = [
    'Oui : les angles alternes-internes ont la même mesure',
    'Oui : les angles correspondants ont la même mesure',
    'Non : les droites ne sont pas parallèles'
  ];
  const reponse = !parallele ? choix[2] : rel === 'alternes-internes' ? choix[0] : choix[1];
  const nom = NOMS_REL[rel];
  const conclusion = parallele
    ? [`Les angles ${i} et ${j} sont ${nom} et ont la même mesure (${mi}°).`,
      `Or, si deux droites coupées par une sécante forment des angles ${nom} de même mesure, alors ces droites sont parallèles.`,
      `Donc ${D1} et ${D2} sont parallèles.`]
    : [`Les angles ${i} et ${j} sont ${nom} mais n'ont pas la même mesure (${mi}° et ${mj}°).`,
      `Si les droites étaient parallèles, ces angles auraient la même mesure.`,
      `Donc ${D1} et ${D2} ne sont pas parallèles.`];
  const erreurs = [];
  if (parallele) {
    erreurs.push({ test: v => v === choix[2], message: `Les deux angles mesurent ${mi}° : ils sont égaux, donc les droites sont parallèles.` });
    erreurs.push({ test: v => v.startsWith('Oui') && v !== reponse, message: `La conclusion est bonne, mais pas la raison : les angles ${i} et ${j} sont <strong>${nom}</strong>.` });
  } else {
    erreurs.push({ test: v => v.startsWith('Oui'), message: `${mi}° ≠ ${mj}° : les angles ne sont pas égaux, donc les droites ne sont pas parallèles, même si elles en ont l'air.` });
  }
  return {
    cle: `parallelisme:${i}:${j}:${alpha}:${alphaB}`,
    enonce: `<p>Les droites ${D1} et ${D2} sont coupées par la sécante (t). L'angle ${i} mesure ${mi}° et l'angle ${j} mesure ${mj}°.</p>
      <p><strong>Les droites ${D1} et ${D2} sont-elles parallèles ?</strong></p>
      <p class="doux petit">La figure n'est pas forcément à l'échelle : fie-toi aux mesures.</p>`,
    figure: fig,
    type: 'qcm',
    choix,
    reponse,
    etapes: [expliquer(i, j), ...conclusion],
    redaction: conclusion.join('<br>'),
    erreurs,
    donnees: { type: 'parallelisme', i, j, geo, parallele }
  };
}

// ---------- Figures du cours ----------

function figureCours(marques) {
  return figure(60, 60, 0, marques).svg;
}

// ---------- Export ----------

export default {
  id: 'angles',
  titre: 'Angles et parallèles',
  resume: 'Alternes-internes, correspondants, calculer un angle, prouver un parallélisme.',
  niveaux: 3,
  nomsNiveaux: ['Reconnaître', 'Calculer un angle', 'Type brevet'],
  cours: [
    {
      titre: 'Alternes-internes',
      contenu: `<p>Deux droites coupées par une <strong>sécante</strong> (t). Deux angles sont <strong>alternes-internes</strong> s'ils sont :</p>
        <ul><li>de part et d'autre de la sécante ;</li><li>tous les deux <strong>entre</strong> les deux droites.</li></ul>
        <p>Ici : les angles 3 et 5.</p>`,
      figure: figureCours({ 3: '3', 5: '5' })
    },
    {
      titre: 'Correspondants',
      contenu: `<p>Deux angles sont <strong>correspondants</strong> s'ils sont du même côté de la sécante et placés <strong>de la même façon</strong> par rapport à chaque droite.</p>
        <p>Ici : les angles 1 et 5 (tous les deux à droite de (t), au-dessus de leur droite).</p>`,
      figure: figureCours({ 1: '1', 5: '5' })
    },
    {
      titre: 'La propriété',
      contenu: `<p>Si les droites sont <strong>parallèles</strong>, alors les angles alternes-internes ont la même mesure, et les angles correspondants aussi.</p>
        <p>Rappels : deux angles <strong>opposés par le sommet</strong> sont égaux ; deux angles qui forment un <strong>angle plat</strong> font 180° à eux deux.</p>
        <div class="redaction">Les droites (d₁) et (d₂) sont parallèles. Les angles 3 et 5 sont alternes-internes. Or, si deux droites parallèles sont coupées par une sécante, les angles alternes-internes ont la même mesure. Donc angle 5 = 60°.</div>`,
      figure: figureCours({ 3: '60°', 5: '?' })
    },
    {
      titre: 'Prouver que deux droites sont parallèles',
      contenu: `<p>C'est la réciproque : si deux angles <strong>alternes-internes</strong> (ou <strong>correspondants</strong>) ont la même mesure, alors les droites sont parallèles.</p>
        <p class="piege">S'ils n'ont pas la même mesure, les droites ne sont pas parallèles, même si elles en ont l'air sur le dessin.</p>`
    }
  ],
  generer(niveau, rng) {
    if (niveau === 1) return exoReconnaitre(rng);
    if (niveau === 2) return exoCalculer(rng, 2);
    return rng.bool(0.5) ? exoParallelisme(rng) : exoCalculer(rng, 3);
  },

  // Contrôle indépendant : mesures prises sur les directions réelles de la figure
  controler(exo) {
    const d = exo.donnees;
    if (d.type === 'calculer') {
      const m = mesureSurFigure(d.geo, d.j);
      return Math.abs(m - exo.reponse) < 1e-6 ? null : `angle ${d.j} mesuré ${m}°, réponse ${exo.reponse}°`;
    }
    if (d.type === 'parallelisme') {
      const par = Math.abs(d.geo.phi - d.geo.phi2) < 1e-9;
      if (par !== d.parallele) return 'parallélisme de la figure incohérent';
      const [mi, mj] = [mesureSurFigure(d.geo, d.i), mesureSurFigure(d.geo, d.j)];
      return (Math.abs(mi - mj) < 1e-6) === d.parallele ? null : `mesures ${mi} et ${mj} incohérentes`;
    }
    if (d.type === 'reconnaitre') {
      // Deux angles correspondants, alternes-internes ou opposés ont la même mesure (droites parallèles)
      const egal = Math.abs(mesureSurFigure(d.geo, d.i) - mesureSurFigure(d.geo, d.j)) < 1e-6;
      if (d.relation !== 'aucune' && !egal) return 'angles de même relation mais de mesures différentes';
      return null;
    }
    return null;
  }
};
