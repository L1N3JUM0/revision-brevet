// Générateur : théorème de Thalès (configuration classique et papillon, réciproque, problèmes d'ombre).
// Les longueurs sont construites à partir d'un rapport k = AM/AB exact : la longueur cherchée est
// connue avant d'être cachée, et le calcul affiché (produit en croix) est vérifié contre elle.
import { choisirSelonTheme } from '../../assets/js/core/contexts.js';
import { fmt, fracHtml } from '../../assets/js/core/answer.js';
import { svg, segment, point, ajuster, tourner, angleDroit } from '../../assets/js/core/svg.js';

// ---------- Outils ----------

const d1 = x => Math.round(x * 10) / 10;
const d2 = x => Math.round(x * 100) / 100;
const d4 = x => Math.round(x * 10000) / 10000;
const gras = s => `<strong>${s}</strong>`;
const F = fracHtml;
const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);
const pas = (rng, min, max, p) => d1(min + p * rng.int(0, Math.round((max - min) / p)));

// Lettres : s = sommet commun, m et n sur les côtés, b et c au bout des côtés
const LETTRES = [
  { s: 'A', m: 'M', n: 'N', b: 'B', c: 'C' },
  { s: 'O', m: 'E', n: 'F', b: 'G', c: 'H' },
  { s: 'S', m: 'R', n: 'T', b: 'U', c: 'V' },
  { s: 'K', m: 'I', n: 'J', b: 'L', c: 'P' },
  { s: 'E', m: 'D', n: 'F', b: 'G', c: 'H' },
  { s: 'I', m: 'R', n: 'S', b: 'J', c: 'K' }
];

// Noms des six longueurs, dans l'ordre des rapports de Thalès
function noms(L) {
  return {
    petit: [L.s + L.m, L.s + L.n, L.m + L.n],   // AM, AN, MN
    grand: [L.s + L.b, L.s + L.c, L.b + L.c]    // AB, AC, BC
  };
}

// Triangle (A, B, C) valide et pas trop aplati à partir de trois longueurs
// (tous les angles ≥ 28° : figure lisible, étiquettes bien séparées)
function triangleValide(ab, ac, bc) {
  const [x, y, z] = [ab, ac, bc].sort((u, v) => u - v);
  if (x + y <= z) return false;
  const angle = (a, b, c) => Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI; // angle opposé à a
  return Math.min(angle(x, y, z), angle(y, x, z), angle(z, x, y)) >= 28;
}

// Coordonnées : A = origine, B sur l'axe, C d'après les trois longueurs
function coordonnees(ab, ac, bc, k, papillon) {
  const x = (ab * ab + ac * ac - bc * bc) / (2 * ab);
  const y = Math.sqrt(Math.max(ac * ac - x * x, 0));
  const B = { x: ab, y: 0 }, C = { x, y };
  const s = papillon ? -k : k;
  return { S: { x: 0, y: 0 }, B, C, M: { x: B.x * s, y: 0 }, N: { x: C.x * s, y: C.y * s } };
}

// ---------- Figure ----------

function unit(v) {
  const n = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / n, y: v.y / n };
}

/**
 * Figure de Thalès. P : { S, M, N, B, C } (repère mathématique), L : lettres.
 * extra : { droits: [[X, sommet, Y]…] } pour les problèmes d'ombre.
 */
function figure(rng, P, L, { papillon, droits = [], tourne = true } = {}) {
  const cles = ['S', 'M', 'N', 'B', 'C'];
  let pts = cles.map(k => P[k]);
  if (tourne) {
    const angle = rng.int(-25, 25) + (rng.bool() ? 180 : 0);
    const miroir = rng.bool() ? -1 : 1;
    pts = pts.map(p => tourner({ x: p.x, y: p.y * miroir }, angle));
  }
  const Q = Object.fromEntries(ajuster(pts, 340, 240, 34).map((p, i) => [cles[i], p]));
  const G = { x: (Q.S.x + Q.B.x + Q.C.x) / 3, y: (Q.S.y + Q.B.y + Q.C.y) / 3 };

  let c = '';
  if (papillon) {
    c += segment(Q.M, Q.B) + segment(Q.N, Q.C);
  } else {
    c += segment(Q.S, Q.B) + segment(Q.S, Q.C);
  }
  c += segment(Q.B, Q.C, { classe: 'trait trait-accent' });
  c += segment(Q.M, Q.N, { classe: 'trait trait-accent' });
  for (const [x, som, y] of droits) c += angleDroit(Q[x], Q[som], Q[y], 9);

  // Direction des étiquettes
  const uB = unit({ x: Q.B.x - Q.S.x, y: Q.B.y - Q.S.y });
  const uC = unit({ x: Q.C.x - Q.S.x, y: Q.C.y - Q.S.y });
  const dir = {};
  if (papillon) {
    const bis = unit({ x: uB.x + uC.x, y: uB.y + uC.y });
    dir.S = { x: -bis.y, y: bis.x };
  } else {
    dir.S = { x: -(uB.x + uC.x), y: -(uB.y + uC.y) };
  }
  const exterieur = (X, cote, oppose) => {
    // perpendiculaire au côté, du côté opposé au point « oppose »
    let n = { x: -cote.y, y: cote.x };
    if ((Q[oppose].x - Q[X].x) * n.x + (Q[oppose].y - Q[X].y) * n.y > 0) n = { x: -n.x, y: -n.y };
    return n;
  };
  if (papillon) {
    dir.M = { x: Q.M.x - Q.S.x, y: Q.M.y - Q.S.y };
    dir.N = { x: Q.N.x - Q.S.x, y: Q.N.y - Q.S.y };
  } else {
    dir.M = exterieur('M', uB, 'C');
    dir.N = exterieur('N', uC, 'B');
  }
  dir.B = { x: Q.B.x - G.x, y: Q.B.y - G.y };
  dir.C = { x: Q.C.x - G.x, y: Q.C.y - G.y };
  for (const k of cles) c += point(Q[k], L[k.toLowerCase()], { dx: dir[k].x, dy: dir[k].y, croix: false });
  return svg(340, 240, c, { titre: 'Figure de Thalès' });
}

// ---------- Rédaction ----------

// Phrase d'hypothèses attendue au brevet (valable en configuration classique et papillon)
function hypotheses(L) {
  return [
    `Les droites (${L.b}${L.m}) et (${L.c}${L.n}) sont sécantes en ${L.s}.`,
    `Les droites (${L.m}${L.n}) et (${L.b}${L.c}) sont parallèles.`
  ];
}

function egaliteThales(nm) {
  return `${F(nm.petit[0], nm.grand[0])} = ${F(nm.petit[1], nm.grand[1])} = ${F(nm.petit[2], nm.grand[2])}`;
}

// Égalité où les longueurs connues sont remplacées par leurs valeurs
function egaliteRemplacee(nm, connues) {
  const v = nom => (nom in connues ? fmt(connues[nom]) : nom);
  return [0, 1, 2].map(i => F(v(nm.petit[i]), v(nm.grand[i]))).join(' = ');
}

// ---------- Calcul d'une longueur (niveaux 1 et 2) ----------

function exoLongueur(rng, niveau) {
  const L = rng.choix(LETTRES);
  const nm = noms(L);
  const unite = rng.choix(['cm', 'cm', 'cm', 'm']);
  const u = ` ${unite}`;

  // Variante : 'simple', 'papillon', 'reste-donne' (MB au lieu de AB), 'reste-demande' (on demande NC)
  const variante = niveau === 1 ? 'simple' : rng.pondere([['papillon', 3], ['reste-donne', 2], ['reste-demande', 2], ['simple', 1]]);
  const papillon = variante === 'papillon';

  // Rapport k = p/q et longueurs AB, AC, BC multiples de q (demi-unités au niveau 2)
  let p, q, base;
  for (;;) {
    q = rng.int(2, 5);
    p = papillon ? rng.int(1, 2 * q - 1) : rng.int(1, q - 1);
    if (pgcd(p, q) !== 1 || p === q) continue;
    const pasBase = niveau === 1 ? 1 : rng.choix([0.5, 1]);
    base = [0, 1, 2].map(() => pas(rng, 1, niveau === 1 ? 6 : 8, pasBase));
    // Trois longueurs différentes : évite une réponse égale à une donnée (AN = AM)
    if (triangleValide(...base) && new Set(base).size === 3) break;
  }
  const grand = base.map(x => d2(x * q));          // AB, AC, BC
  const petit = base.map(x => d2(x * p));          // AM, AN, MN
  const k = p / q;
  const valeur = {};
  nm.grand.forEach((n, i) => { valeur[n] = grand[i]; });
  nm.petit.forEach((n, i) => { valeur[n] = petit[i]; });

  // Rapport connu : paire i ; longueur cherchée : dans la paire j
  let i, j, cherchePetit;
  if (variante === 'reste-demande') {
    // On demande N C (= AC − AN) : rapport sur la paire AM/AB, on cherche AN, puis on soustrait
    i = 0; j = 1; cherchePetit = true;
  } else {
    i = rng.int(0, 2);
    do { j = rng.int(0, 2); } while (j === i);
    cherchePetit = rng.bool(0.6);
    if (variante === 'reste-donne') { i = 0; j = rng.choix([1, 2]); }
  }
  const inconnue = cherchePetit ? nm.petit[j] : nm.grand[j];
  const partenaire = cherchePetit ? nm.grand[j] : nm.petit[j];
  const [pi, gi] = [nm.petit[i], nm.grand[i]];
  const r = valeur[inconnue];

  // Produit en croix
  const calcul = cherchePetit
    ? [valeur[partenaire], valeur[pi], valeur[gi]]   // AN = AC × AM ÷ AB
    : [valeur[partenaire], valeur[gi], valeur[pi]];  // AC = AN × AB ÷ AM
  const verif = d2(calcul[0] * calcul[1] / calcul[2]);
  if (Math.abs(verif - r) > 1e-9) throw new Error('Thalès : produit en croix incohérent');
  const expressionCalcul = `${fmt(calcul[0])} × ${fmt(calcul[1])} ÷ ${fmt(calcul[2])}`;

  // Données de l'énoncé
  const connues = { [pi]: valeur[pi], [gi]: valeur[gi], [partenaire]: valeur[partenaire] };
  const mb = L.m + L.b, nc = L.n + L.c;
  let mesures;
  const etapes = [];
  if (variante === 'reste-donne') {
    const reste = d2(valeur[gi] - valeur[pi]);  // MB
    mesures = [`${pi} = ${fmt(valeur[pi])}${u}`, `${mb} = ${fmt(reste)}${u}`, `${partenaire} = ${fmt(valeur[partenaire])}${u}`];
    etapes.push(`${L.m} est sur [${L.s}${L.b}], donc ${gi} = ${pi} + ${mb} = ${fmt(valeur[pi])} + ${fmt(reste)} = ${fmt(valeur[gi])}${u}.`);
  } else {
    mesures = [`${pi} = ${fmt(valeur[pi])}${u}`, `${gi} = ${fmt(valeur[gi])}${u}`, `${partenaire} = ${fmt(valeur[partenaire])}${u}`];
  }
  mesures = rng.melanger(mesures);

  const question = variante === 'reste-demande' ? nc : inconnue;
  const reponse = variante === 'reste-demande' ? d2(valeur[nm.grand[1]] - r) : r;

  etapes.push(papillon
    ? `Configuration « papillon » : les droites se croisent en ${L.s} et (${L.m}${L.n}) // (${L.b}${L.c}). On applique le théorème de Thalès.`
    : `(${L.m}${L.n}) // (${L.b}${L.c}) : on applique le théorème de Thalès.`);
  etapes.push(egaliteThales(nm));
  etapes.push(`On remplace les longueurs connues : ${egaliteRemplacee(nm, connues)}`);
  etapes.push(`On utilise ${F(pi, gi)} = ${F(cherchePetit ? inconnue : partenaire, cherchePetit ? partenaire : inconnue)}. Produit en croix :`);
  etapes.push(`${inconnue} = ${expressionCalcul} = ${variante === 'reste-demande' ? fmt(r) : gras(fmt(r))}${u}`);
  if (variante === 'reste-demande') {
    etapes.push(`${L.n} est sur [${L.s}${L.c}], donc ${nc} = ${nm.grand[1]} − ${inconnue} = ${fmt(valeur[nm.grand[1]])} − ${fmt(r)} = ${gras(fmt(reponse))}${u}`);
  }

  const redaction = [
    ...(variante === 'reste-donne'
      ? [`${L.m} ∈ [${L.s}${L.b}], donc ${gi} = ${pi} + ${mb} = ${fmt(valeur[pi])} + ${fmt(d2(valeur[gi] - valeur[pi]))} = ${fmt(valeur[gi])}${u}`]
      : []),
    ...hypotheses(L),
    `D'après le théorème de Thalès :`,
    egaliteThales(nm),
    egaliteRemplacee(nm, connues),
    `${inconnue} = ${expressionCalcul}`,
    `${inconnue} = ${fmt(r)}${u}`
  ];
  if (variante === 'reste-demande') redaction.push(`${nc} = ${fmt(valeur[nm.grand[1]])} − ${fmt(r)} = ${fmt(reponse)}${u}`);

  // Erreurs probables
  const erreurs = [];
  const ajouter = (v, message) => {
    if (!Number.isFinite(v) || Math.abs(v - reponse) < 0.01 || erreurs.some(e => Math.abs(e.v - v) < 1e-9)) return;
    erreurs.push({ v, test: x => typeof x === 'number' && Math.abs(x - v) <= 0.01, message });
  };
  const inverse = d2(calcul[0] * calcul[2] / calcul[1]);
  ajouter(variante === 'reste-demande' ? d2(valeur[nm.grand[1]] - inverse) : inverse,
    'Tu as inversé le rapport. Garde le même sens partout : petit côté en haut, grand côté en bas.');
  if (variante === 'reste-donne') {
    const faux = cherchePetit
      ? d2(valeur[partenaire] * valeur[pi] / (valeur[gi] - valeur[pi]))
      : d2(valeur[partenaire] * (valeur[gi] - valeur[pi]) / valeur[pi]);
    ajouter(faux, `Attention : dans le rapport, on utilise ${gi} (tout le côté), pas ${mb}. Calcule d'abord ${gi} = ${pi} + ${mb}.`);
  }
  if (variante === 'reste-demande') {
    ajouter(r, `Tu as trouvé ${inconnue}. La question demande ${nc} = ${nm.grand[1]} − ${inconnue}.`);
  }

  const P = coordonnees(grand[0], grand[1], grand[2], k, papillon);
  return {
    cle: `longueur:${variante}:${L.s}:${grand.join(',')}:${p}/${q}:${inconnue}`,
    enonce: `<p>Sur la figure, les droites (${L.m}${L.n}) et (${L.b}${L.c}) sont parallèles.</p>
      <p>${mesures.join(' ; ')}.</p>
      <p><strong>Calcule la longueur ${question}.</strong></p>
      <p class="doux petit">La figure n'est pas forcément à l'échelle.</p>`,
    figure: figure(rng, P, L, { papillon }),
    type: 'nombre',
    unite,
    reponse,
    tolerance: 0,
    etapes,
    redaction: redaction.join('<br>'),
    erreurs: erreurs.map(({ test, message }) => ({ test, message })),
    expression: variante === 'reste-demande' ? `${fmt(valeur[nm.grand[1]])} − ${fmt(r)}` : expressionCalcul,
    donnees: { type: 'longueur', P, L, cible: variante === 'reste-demande' ? [L.n, L.c] : inconnue.split('') }
  };
}

// ---------- Réciproque (niveau 3) ----------

const RAPPORTS = [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8];
const RAPPORTS_PAPILLON = [0.4, 0.5, 0.6, 0.75, 0.8, 1.2, 1.25, 1.5];

function exoReciproque(rng) {
  const L = rng.choix(LETTRES);
  const nm = noms(L);
  const papillon = rng.bool(0.4);
  const parallele = rng.bool(0.5);
  const unite = rng.choix(['cm', 'cm', 'm']);
  const u = ` ${unite}`;

  let r1, r2, ab, ac, bc;
  for (;;) {
    r1 = rng.choix(papillon ? RAPPORTS_PAPILLON : RAPPORTS);
    r2 = parallele ? r1 : d2(r1 + rng.choix([-0.1, -0.05, 0.05, 0.1]));
    if (r2 <= 0 || (!papillon && r2 >= 1)) continue;
    ab = rng.choix([4, 5, 6, 8, 10, 12, 15, 20]);
    ac = rng.choix([4, 5, 6, 8, 10, 12, 15, 20].filter(x => x !== ab));
    bc = rng.int(Math.ceil(Math.abs(ab - ac)) + 2, ab + ac - 2);
    // AM et AN doivent avoir au plus deux décimales
    const am = ab * r1, an = ac * r2;
    if (Math.abs(am - d2(am)) < 1e-9 && Math.abs(an - d2(an)) < 1e-9 && triangleValide(ab, ac, bc)) break;
  }
  const am = d2(ab * r1), an = d2(ac * r2);
  const q1 = d4(am / ab), q2 = d4(an / ac);
  const egal = Math.abs(am * ac - an * ab) < 1e-9;

  const [AM, AN] = [nm.petit[0], nm.petit[1]];
  const [AB, AC] = [nm.grand[0], nm.grand[1]];
  const choix = [
    `Oui, (${L.m}${L.n}) et (${L.b}${L.c}) sont parallèles`,
    `Non, elles ne sont pas parallèles`
  ];
  const reponse = egal ? choix[0] : choix[1];

  const mesures = rng.melanger([`${AM} = ${fmt(am)}${u}`, `${AB} = ${fmt(ab)}${u}`, `${AN} = ${fmt(an)}${u}`, `${AC} = ${fmt(ac)}${u}`]);
  const ordre = papillon
    ? `Les points ${L.m}, ${L.s}, ${L.b} d'une part et ${L.n}, ${L.s}, ${L.c} d'autre part sont alignés dans le même ordre.`
    : `Les points ${L.s}, ${L.m}, ${L.b} d'une part et ${L.s}, ${L.n}, ${L.c} d'autre part sont alignés dans le même ordre.`;
  const conclusion = egal
    ? `D'après la <strong>réciproque</strong> du théorème de Thalès, les droites (${L.m}${L.n}) et (${L.b}${L.c}) sont parallèles.`
    : `Si les droites étaient parallèles, ces quotients seraient égaux (théorème de Thalès). Donc les droites (${L.m}${L.n}) et (${L.b}${L.c}) ne sont <strong>pas parallèles</strong>.`;
  const lignes = [
    `D'une part : ${F(AM, AB)} = ${F(am, ab)} = ${fmt(q1)}`,
    `D'autre part : ${F(AN, AC)} = ${F(an, ac)} = ${fmt(q2)}`,
    ordre,
    egal ? `On constate que ${F(AM, AB)} = ${F(AN, AC)}.` : `On constate que ${F(AM, AB)} ≠ ${F(AN, AC)}.`,
    conclusion
  ];

  const P = coordonnees(ab, ac, bc, 0, papillon);
  // Position réelle de M et N (rapports r1 et r2, éventuellement différents)
  const s = papillon ? -1 : 1;
  P.M = { x: P.B.x * r1 * s, y: 0 };
  P.N = { x: P.C.x * r2 * s, y: P.C.y * r2 * s };

  return {
    cle: `reciproque:${papillon ? 'p' : 'c'}:${am}/${ab}:${an}/${ac}`,
    enonce: `<p>Sur la figure, les points ${L.s}, ${L.m}, ${L.b} sont alignés, ainsi que les points ${L.s}, ${L.n}, ${L.c}${papillon ? ` (${L.s} est entre ${L.m} et ${L.b}, et entre ${L.n} et ${L.c})` : ''}.</p>
      <p>${mesures.join(' ; ')}.</p>
      <p><strong>Les droites (${L.m}${L.n}) et (${L.b}${L.c}) sont-elles parallèles ?</strong></p>`,
    figure: figure(rng, P, L, { papillon }),
    type: 'qcm',
    choix,
    reponse,
    etapes: [
      `On compare les quotients ${F(AM, AB)} et ${F(AN, AC)}.`,
      ...lignes
    ],
    redaction: lignes.map(l => l.replace(/<\/?strong>/g, '')).join('<br>'),
    erreurs: egal
      ? [{ test: v => v === choix[1], message: `Calcule les deux quotients : ${fmt(q1)} et ${fmt(q2)}. Ils sont <strong>égaux</strong>, donc les droites sont parallèles (réciproque).` }]
      : [{ test: v => v === choix[0], message: `Les quotients ne sont pas égaux (${fmt(q1)} et ${fmt(q2)}) : les droites ne sont pas parallèles. Des droites qui « ont l'air » parallèles ne le sont pas forcément.` }],
    donnees: { type: 'reciproque', P, L, egal }
  };
}

// ---------- Problèmes d'ombre (niveaux 2 et 3) ----------

const OMBRES = [
  { themes: ['foot'], objet: 'le mât d\'éclairage du stade', court: 'le mât', h: [15, 30], texte: ctx => `Au stade, ${ctx.prenom} veut connaître la hauteur d'un mât d'éclairage.` },
  { themes: ['basket', 'sport'], objet: 'le lampadaire du terrain', court: 'le lampadaire', h: [5, 9], texte: ctx => `Sur le terrain de basket du quartier, ${ctx.prenom} veut connaître la hauteur d'un lampadaire.` },
  { themes: ['musique'], objet: 'le pylône de la scène', court: 'le pylône', h: [12, 25], texte: () => 'Avant un concert, un technicien veut connaître la hauteur du pylône de la scène.' },
  { themes: ['voitures'], objet: 'le portique d\'arrivée du circuit', court: 'le portique', h: [6, 12], texte: ctx => `Sur un circuit automobile, ${ctx.prenom} veut connaître la hauteur du portique d'arrivée.` },
  { themes: ['mangas'], objet: 'la statue géante du parc', court: 'la statue', h: [10, 20], texte: ctx => `Dans un parc à thème manga, ${ctx.prenom} veut connaître la hauteur d'une statue géante de robot.` },
  { themes: ['grece'], objet: 'la pyramide de Khéops', court: 'la pyramide', h: [140, 146], texte: ctx => `On raconte que Thalès a mesuré la hauteur de la pyramide de Khéops grâce aux ombres. ${ctx.prenom} refait l'expérience en maquette géante :` },
  { themes: ['grece'], objet: 'la colonne du temple', court: 'la colonne', h: [8, 12], texte: ctx => `En visite à Athènes, ${ctx.prenom} veut connaître la hauteur d'une colonne du temple.` },
  { themes: ['rap'], objet: 'le pylône de la scène', court: 'le pylône', h: [12, 25], texte: () => 'Avant le concert de JUL, un technicien veut connaître la hauteur du pylône de la scène.' },
  { themes: ['chevaux', 'animaux'], objet: 'le grand chêne du pré', court: 'le chêne', h: [10, 22], texte: ctx => `Au centre équestre, ${ctx.prenom} veut connaître la hauteur du grand chêne du pré.` },
  { themes: ['handball', 'sport'], objet: 'le mât du drapeau du gymnase', court: 'le mât', h: [6, 12], texte: ctx => `Devant le gymnase, ${ctx.prenom} veut connaître la hauteur du mât du drapeau.` },
  { themes: ['espace'], objet: 'la fusée sur son pas de tir', court: 'la fusée', h: [40, 70], texte: () => 'Sur une base de lancement, on veut estimer la hauteur d\'une fusée sur son pas de tir.' },
  { themes: ['famille', 'voyages', 'cuisine', 'mode', 'commerce', 'jeux-video', 'records'], objet: 'l\'arbre du jardin', court: 'l\'arbre', h: [5, 15], texte: ctx => `${ctx.prenom} veut connaître la hauteur de l'arbre du jardin.` }
];

function exoOmbre(rng, ctx) {
  const m = choisirSelonTheme(rng, ctx, OMBRES);
  const h = pas(rng, 1, 2, 0.1);             // bâton
  const s = pas(rng, 0.8, 3, 0.1);           // ombre du bâton
  const cible = rng.int(m.h[0], m.h[1]);
  const S = d1(cible * s / h);               // ombre de l'objet
  const H = h * S / s;
  const r = d1(H);
  const exact = Math.abs(H - r) < 1e-9;
  const L = { s: 'A', m: 'M', n: 'N', b: 'B', c: 'C' };

  const connues = { AM: s, AB: S, MN: h };
  const nm = noms(L);
  const expressionCalcul = `${fmt(S)} × ${fmt(h)} ÷ ${fmt(s)}`;
  const etapes = [
    `Le bâton [MN] et ${m.court} [BC] sont verticaux, donc parallèles. Les points A, M, B et A, N, C sont alignés : on applique le théorème de Thalès.`,
    `${egaliteThales(nm)}, donc ${egaliteRemplacee(nm, connues)}`,
    `On utilise ${F('AM', 'AB')} = ${F('MN', 'BC')}. Produit en croix :`,
    exact
      ? `BC = ${expressionCalcul} = ${gras(fmt(r))} m`
      : `BC = ${expressionCalcul} ≈ ${fmt(Math.floor(H * 1000) / 1000)}…, donc BC ≈ ${gras(fmt(r))} m (arrondi au dixième)`
  ];
  const redaction = [
    'Les droites (BM) et (CN) sont sécantes en A.',
    'Les droites (MN) et (BC) sont parallèles (toutes les deux verticales).',
    'D\'après le théorème de Thalès :',
    egaliteThales(nm),
    egaliteRemplacee(nm, connues),
    `BC = ${expressionCalcul}`,
    exact ? `BC = ${fmt(r)} m` : `BC ≈ ${fmt(r)} m`
  ];

  const erreurs = [];
  const faux = d1(s * h / S);
  if (Math.abs(faux - r) > 0.1) erreurs.push({ test: x => typeof x === 'number' && Math.abs(x - faux) <= 0.05, message: 'Tu as inversé le rapport : l\'objet est beaucoup plus grand que le bâton, sa hauteur doit l\'être aussi.' });
  const faux2 = d1(S * s / h);
  if (Math.abs(faux2 - r) > 0.1 && Math.abs(faux2 - faux) > 0.1) erreurs.push({ test: x => typeof x === 'number' && Math.abs(x - faux2) <= 0.05, message: 'Vérifie le produit en croix : BC = AB × MN ÷ AM.' });

  // Figure : sol horizontal, bâton et objet verticaux
  const P = { S: { x: 0, y: 0 }, M: { x: s, y: 0 }, N: { x: s, y: h }, B: { x: S, y: 0 }, C: { x: S, y: H } };
  return {
    cle: `ombre:${m.court}:${h}:${s}:${S}`,
    enonce: `<p>${m.texte(ctx)}</p>
      <p>Un bâton vertical [MN] de ${fmt(h)} m a une ombre [AM] de ${fmt(s)} m. Au même moment, l'ombre [AB] de ${m.objet} mesure ${fmt(S)} m. Les rayons du soleil passent par A, N et C.</p>
      <p><strong>Quelle est la hauteur BC de ${m.court} ?</strong></p>
      <p class="doux petit">Arrondis au dixième si besoin.</p>`,
    figure: figure(rng, P, L, { droits: [['S', 'M', 'N'], ['S', 'B', 'C']], tourne: false }),
    type: 'nombre',
    unite: 'm',
    reponse: r,
    tolerance: exact ? 0 : 0.05,
    etapes,
    redaction: redaction.join('<br>'),
    erreurs,
    expression: expressionCalcul,
    donnees: { type: 'longueur', P, L, cible: ['B', 'C'] }
  };
}

// ---------- Figure du cours ----------

export function figureCours(papillon) {
  const L = LETTRES[0];
  const P = coordonnees(6, 5, 5.5, papillon ? 0.6 : 0.5, papillon);
  return figure({ int: () => 0, bool: () => false }, P, L, { papillon, tourne: false });
}

// ---------- Export ----------

export default {
  id: 'thales',
  titre: 'Théorème de Thalès',
  resume: 'Calculer une longueur avec des parallèles, prouver un parallélisme.',
  niveaux: 3,
  nomsNiveaux: ['Configuration simple', 'Papillon et étapes', 'Réciproque, type brevet'],
  cours: [
    {
      titre: 'Le théorème',
      contenu: `<p>Si M est sur [AB], N sur [AC] et si (MN) et (BC) sont <strong>parallèles</strong>, alors les longueurs sont proportionnelles :</p>
        <p class="calcul">${F('AM', 'AB')} = ${F('AN', 'AC')} = ${F('MN', 'BC')}</p>
        <p>En haut, le petit triangle AMN. En bas, le grand triangle ABC.</p>`,
      figure: figureCours(false)
    },
    {
      titre: 'La configuration papillon',
      contenu: `<p>Les droites (BM) et (CN) se croisent en A, avec (MN) // (BC). C'est la même égalité :</p>
        <p class="calcul">${F('AM', 'AB')} = ${F('AN', 'AC')} = ${F('MN', 'BC')}</p>
        <p>Toujours en partant du point d'intersection A.</p>`,
      figure: figureCours(true)
    },
    {
      titre: 'Calculer une longueur',
      contenu: `<p>AM = 3, AB = 5, AC = 8. On cherche AN.</p>
        <div class="redaction">Les droites (BM) et (CN) sont sécantes en A.<br>Les droites (MN) et (BC) sont parallèles.<br>D'après le théorème de Thalès :<br>${F('AM', 'AB')} = ${F('AN', 'AC')} = ${F('MN', 'BC')}<br>${F(3, 5)} = ${F('AN', 8)} = ${F('MN', 'BC')}<br>AN = 8 × 3 ÷ 5 = 4,8</div>
        <p class="piege">Piège : on divise par AB (tout le côté), pas par MB.</p>`
    },
    {
      titre: 'Parallèles ou pas ?',
      contenu: `<p>On calcule ${F('AM', 'AB')} et ${F('AN', 'AC')} séparément.</p>
        <ul>
          <li><strong>Égaux</strong> (et points dans le même ordre) → parallèles : c'est la <strong>réciproque</strong>.</li>
          <li><strong>Différents</strong> → pas parallèles.</li>
        </ul>
        <div class="redaction">D'une part : ${F('AM', 'AB')} = ${F(3, 7.5)} = 0,4<br>D'autre part : ${F('AN', 'AC')} = ${F(4, 10)} = 0,4<br>Les points A, M, B et A, N, C sont alignés dans le même ordre.<br>D'après la réciproque du théorème de Thalès, (MN) // (BC).</div>`
    }
  ],
  generer(niveau, rng, ctx) {
    if (niveau === 1) return exoLongueur(rng, 1);
    if (niveau === 2) return rng.bool(0.8) ? exoLongueur(rng, 2) : exoOmbre(rng, ctx);
    return rng.bool(0.6) ? exoReciproque(rng) : (rng.bool(0.5) ? exoOmbre(rng, ctx) : exoLongueur(rng, 2));
  },

  // Contrôle indépendant : mesure directe sur les coordonnées de la figure
  controler(exo) {
    const d = exo.donnees;
    const cle = lettre => Object.keys(d.L).find(k => d.L[k] === lettre).toUpperCase();
    const pt = lettre => d.P[cle(lettre)];
    if (d.type === 'longueur') {
      const [X, Y] = d.cible.map(pt);
      const mesure = Math.hypot(X.x - Y.x, X.y - Y.y);
      return Math.abs(mesure - exo.reponse) <= (exo.tolerance || 0) + 1e-6 ? null : `longueur mesurée ${mesure}, réponse ${exo.reponse}`;
    }
    if (d.type === 'reciproque') {
      const { M, N, B, C } = d.P;
      const vect = (M.x - N.x) * (B.y - C.y) - (M.y - N.y) * (B.x - C.x);
      const par = Math.abs(vect) < 1e-6;
      return par === d.egal ? null : `parallélisme mesuré ${par}, attendu ${d.egal}`;
    }
    return null;
  }
};
