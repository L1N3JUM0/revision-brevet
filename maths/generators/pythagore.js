// Générateur : théorème de Pythagore (hypoténuse, côté de l'angle droit, réciproque, contraposée).
// Les longueurs ont au plus un chiffre après la virgule : leurs carrés ont au plus deux décimales,
// ce qui permet des calculs exacts (on arrondit à 2 décimales pour effacer le bruit des flottants).
import { fmt } from '../../assets/js/core/answer.js';
import { figurePolygone, tourner } from '../../assets/js/core/svg.js';

// ---------- Outils numériques ----------

const d1 = x => Math.round(x * 10) / 10;           // arrondi au dixième
const d2 = x => Math.round(x * 100) / 100;          // nettoyage des carrés et sommes
const carre = x => d2(x * x);
const tronque3 = x => Math.floor(x * 1000 + 1e-9) / 1000;
const pas = (rng, min, max, p) => d1(min + p * rng.int(0, Math.round((max - min) / p)));

// Nom d'un segment, lettres dans l'ordre alphabétique : « AB »
const seg = (x, y) => [x, y].sort().join('');
const gras = s => `<strong>${s}</strong>`;

const NOMS = [
  ['A', 'B', 'C'], ['E', 'F', 'G'], ['R', 'S', 'T'], ['K', 'L', 'M'],
  ['I', 'J', 'K'], ['M', 'N', 'P'], ['D', 'E', 'F'], ['U', 'V', 'W']
];

const TRIPLETS = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 16, 20]];

// Erreurs probables sur une réponse numérique (tolérance d'un arrondi au dixième)
function creerErreurs(reponse) {
  const liste = [];
  return {
    ajouter(valeur, message) {
      if (!Number.isFinite(valeur) || Math.abs(valeur - reponse) <= 0.1) return;
      if (liste.some(e => Math.abs(e.valeur - valeur) < 1e-9)) return;
      liste.push({ valeur, test: v => typeof v === 'number' && Math.abs(v - valeur) <= 0.05 + 1e-9, message });
    },
    liste: () => liste.map(({ test, message }) => ({ test, message }))
  };
}

// Erreurs d'arrondi : troncature, arrondi à l'unité
function erreursArrondi(err, exact, r) {
  const t = Math.floor(exact * 10 + 1e-9) / 10;
  if (Math.abs(t - r) > 1e-9) {
    err.ajouter(t, `Attention à l'arrondi : ${fmt(tronque3(exact))}… s'arrondit à <strong>${fmt(r)}</strong>, car le chiffre des centièmes est 5 ou plus.`);
  }
  err.ajouter(Math.round(exact), 'On demande un arrondi au <strong>dixième</strong> : garde un chiffre après la virgule.');
}

// Triangle rectangle en N.droit : jambe vers N.p de longueur lp, jambe vers N.q de longueur lq
function sommetsRectangle(N, lp, lq, angle = 0, miroir = false) {
  const pts = {};
  const P = tourner({ x: miroir ? -lp : lp, y: 0 }, angle);
  const Q = tourner({ x: 0, y: lq }, angle);
  for (const n of N.noms) pts[n] = n === N.droit ? { x: 0, y: 0 } : n === N.p ? P : Q;
  return pts;
}

// Tourne la figure pour que [XY] soit presque horizontal (± quelques degrés, parfois retourné) :
// la figure est alors plus large que haute et tient mieux sur un écran de téléphone.
function orienter(rng, pts, X, Y) {
  const base = (Math.atan2(pts[Y].y - pts[X].y, pts[Y].x - pts[X].x) * 180) / Math.PI;
  const angle = -base + rng.int(-20, 20) + (rng.bool() ? 180 : 0);
  return Object.fromEntries(Object.entries(pts).map(([n, P]) => [n, tourner(P, angle)]));
}

function choisirNoms(rng) {
  const noms = rng.choix(NOMS);
  const droit = rng.choix(noms);
  const [p, q] = rng.melanger(noms.filter(x => x !== droit));
  return { noms, droit, p, q, nom: noms.join('') };
}

// ---------- Calcul de l'hypoténuse ----------

// Jambes [droit p] = a et [droit q] = b ; on cherche [pq]
function calculHypotenuse({ a, b, unite, arrondi, N }) {
  const H = seg(N.p, N.q), L1 = seg(N.droit, N.p), L2 = seg(N.droit, N.q);
  const A2 = carre(a), B2 = carre(b), S = d2(A2 + B2);
  const c = Math.sqrt(S);
  const r = arrondi ? d1(c) : c;
  const exact = Math.abs(d1(c) * d1(c) - S) < 1e-9;
  const u = unite ? ` ${unite}` : '';

  const resultat = exact
    ? `${H} = √${fmt(S)} = ${gras(fmt(d1(c)) + u)}`
    : `${H} = √${fmt(S)} ≈ ${fmt(tronque3(c))}…, donc ${H} ≈ ${gras(fmt(r) + u)} (arrondi au dixième)`;
  const etapes = [
    `L'<strong>hypoténuse</strong> est le côté en face de l'angle droit : c'est [${H}]. On <strong>additionne</strong> les carrés des deux autres côtés.`,
    `${H}² = ${L1}² + ${L2}² = ${fmt(a)}² + ${fmt(b)}² = ${fmt(A2)} + ${fmt(B2)} = ${fmt(S)}`,
    resultat,
    `💡 À la calculatrice : √(${fmt(a)}² + ${fmt(b)}²)`
  ];
  const redaction = [
    `Dans le triangle ${N.nom} rectangle en ${N.droit}, d'après le théorème de Pythagore :`,
    `${H}² = ${L1}² + ${L2}²`,
    `${H}² = ${fmt(a)}² + ${fmt(b)}²`,
    `${H}² = ${fmt(A2)} + ${fmt(B2)}`,
    `${H}² = ${fmt(S)}`,
    `${H} = √${fmt(S)}`,
    exact ? `${H} = ${fmt(d1(c))}${u}` : `${H} ≈ ${fmt(r)}${u}`
  ].join('<br>');

  const err = creerErreurs(r);
  err.ajouter(d2(a + b), 'On additionne les <strong>carrés</strong> des longueurs, pas les longueurs elles-mêmes.');
  err.ajouter(S, `Tu as oublié la <strong>racine carrée</strong> : ${H}² = ${fmt(S)}, donc ${H} = √${fmt(S)}.`);
  if (A2 !== B2) err.ajouter(Math.sqrt(Math.abs(A2 - B2)), 'L\'hypoténuse est le plus grand côté : on <strong>additionne</strong> les carrés, on ne les soustrait pas.');
  if (arrondi && !exact) erreursArrondi(err, c, r);

  return {
    reponse: r,
    tolerance: arrondi ? 0.05 : 0,
    etapes,
    redaction,
    erreurs: err.liste(),
    expression: `√(${fmt(a)}² + ${fmt(b)}²)`,
    donnees: { type: 'hyp', a, b }
  };
}

// ---------- Calcul d'un côté de l'angle droit ----------

// Hypoténuse [pq] = c, jambe connue [droit connu] = a ; on cherche [droit inconnu]
function calculCote({ c, a, unite, arrondi, N, inconnu, connu }) {
  const H = seg(N.p, N.q), Lx = seg(N.droit, inconnu), Lk = seg(N.droit, connu);
  const C2 = carre(c), A2 = carre(a), D = d2(C2 - A2);
  const b = Math.sqrt(D);
  const r = arrondi ? d1(b) : b;
  const exact = Math.abs(d1(b) * d1(b) - D) < 1e-9;
  const u = unite ? ` ${unite}` : '';

  const resultat = exact
    ? `${Lx} = √${fmt(D)} = ${gras(fmt(d1(b)) + u)}`
    : `${Lx} = √${fmt(D)} ≈ ${fmt(tronque3(b))}…, donc ${Lx} ≈ ${gras(fmt(r) + u)} (arrondi au dixième)`;
  const etapes = [
    `On cherche un côté de l'angle droit. L'hypoténuse est [${H}] : on <strong>soustrait</strong> les carrés.`,
    `${H}² = ${Lx}² + ${Lk}², donc ${Lx}² = ${H}² − ${Lk}²`,
    `${Lx}² = ${fmt(c)}² − ${fmt(a)}² = ${fmt(C2)} − ${fmt(A2)} = ${fmt(D)}`,
    resultat,
    `💡 À la calculatrice : √(${fmt(c)}² − ${fmt(a)}²)`
  ];
  const redaction = [
    `Dans le triangle ${N.nom} rectangle en ${N.droit}, d'après le théorème de Pythagore :`,
    `${H}² = ${Lx}² + ${Lk}²`,
    `${fmt(c)}² = ${Lx}² + ${fmt(a)}²`,
    `${fmt(C2)} = ${Lx}² + ${fmt(A2)}`,
    `${Lx}² = ${fmt(C2)} − ${fmt(A2)}`,
    `${Lx}² = ${fmt(D)}`,
    `${Lx} = √${fmt(D)}`,
    exact ? `${Lx} = ${fmt(d1(b))}${u}` : `${Lx} ≈ ${fmt(r)}${u}`
  ].join('<br>');

  const err = creerErreurs(r);
  err.ajouter(Math.sqrt(d2(C2 + A2)), 'Ici, on cherche un côté de l\'angle droit, plus court que l\'hypoténuse : on <strong>soustrait</strong> les carrés.');
  err.ajouter(d2(c - a), 'On soustrait les <strong>carrés</strong> des longueurs, pas les longueurs elles-mêmes.');
  err.ajouter(D, `Tu as oublié la <strong>racine carrée</strong> : ${Lx}² = ${fmt(D)}, donc ${Lx} = √${fmt(D)}.`);
  if (arrondi && !exact) erreursArrondi(err, b, r);

  return {
    reponse: r,
    tolerance: arrondi ? 0.05 : 0,
    etapes,
    redaction,
    erreurs: err.liste(),
    expression: `√(${fmt(c)}² − ${fmt(a)}²)`,
    donnees: { type: 'cote', c, a }
  };
}

// ---------- Exercices « purs » (niveaux 1 et 2) ----------

function exoPur(rng, niveau) {
  const N = choisirNoms(rng);
  const arrondi = niveau >= 2;
  const unite = rng.choix(['cm', 'cm', 'cm', 'm', 'mm']);
  const chercheHyp = rng.bool(0.55);
  let a, b, c;

  if (!arrondi) {
    // Triplet pythagoricien multiplié par un entier ou par 0,5 / 1,5 / 2,5 : résultat exact
    const t = rng.choix(TRIPLETS);
    const kMax = Math.max(1, Math.floor(60 / t[2]));
    const k = rng.bool(0.3) ? rng.choix([0.5, 1.5, 2.5]) : rng.int(1, kMax);
    [a, b] = rng.melanger([d1(t[0] * k), d1(t[1] * k)]);
    c = d1(t[2] * k);
  } else {
    const longueur = (min, max) => (rng.bool() ? rng.int(min, max) : pas(rng, min, max, 0.1));
    if (chercheHyp) {
      a = longueur(2, 15);
      b = longueur(2, 15);
    } else {
      c = longueur(6, 20);
      a = longueur(2, Math.floor(c - 1));
      if (a >= c - 0.5) a = d1(c / 2);
    }
  }

  const miroir = rng.bool();
  const u = ` ${unite}`;
  let calc, cotes, donnees, enonce;
  if (chercheHyp) {
    calc = calculHypotenuse({ a, b, unite, arrondi, N });
    cotes = { [seg(N.droit, N.p)]: fmt(a) + u, [seg(N.droit, N.q)]: fmt(b) + u, [seg(N.p, N.q)]: '?' };
    enonce = `<p>Le triangle ${N.nom} est rectangle en ${N.droit}.</p>
      <p>${seg(N.droit, N.p)} = ${fmt(a)}${u} et ${seg(N.droit, N.q)} = ${fmt(b)}${u}.</p>
      <p><strong>Calcule la longueur ${seg(N.p, N.q)}.</strong></p>`;
    donnees = [a, b];
  } else {
    // [droit q] est le côté connu, [droit p] l'inconnu
    calc = calculCote({ c, a, unite, arrondi, N, inconnu: N.p, connu: N.q });
    cotes = { [seg(N.p, N.q)]: fmt(c) + u, [seg(N.droit, N.q)]: fmt(a) + u, [seg(N.droit, N.p)]: '?' };
    enonce = `<p>Le triangle ${N.nom} est rectangle en ${N.droit}.</p>
      <p>${seg(N.p, N.q)} = ${fmt(c)}${u} et ${seg(N.droit, N.q)} = ${fmt(a)}${u}.</p>
      <p><strong>Calcule la longueur ${seg(N.droit, N.p)}.</strong></p>`;
    donnees = [c, a];
  }
  if (arrondi) enonce += '<p class="doux petit">Arrondis au dixième (un chiffre après la virgule).</p>';

  // Figure : jambe [droit p] et jambe [droit q] à leurs vraies proportions
  const lp = chercheHyp ? a : calc.reponse;
  const lq = chercheHyp ? b : a;
  const figure = figurePolygone(orienter(rng, sommetsRectangle(N, lp, lq, 0, miroir), N.p, N.q), { droit: N.droit, cotes, accent: seg(N.p, N.q) });

  return {
    cle: `pur:${niveau}:${chercheHyp ? 'hyp' : 'cote'}:${donnees.join(':')}:${unite}`,
    enonce,
    figure,
    type: 'nombre',
    unite,
    ...calc
  };
}

// ---------- Problèmes en contexte (niveaux 2 et 3) ----------

// Chaque modèle renvoie { lettres: {droit, p, q}, horiz, vert, hyp, inconnue, unite, texte, question, conclusion }
// p est au bout de la jambe horizontale, q au bout de la jambe verticale.
const PROBLEMES = [
  {
    themes: ['handball', 'sport'],
    creer(rng, ctx) {
      const y = pas(rng, 1, 8, 0.5), x = pas(rng, 6, 11, 0.5);
      return {
        lettres: { droit: 'H', p: 'P', q: 'T' }, horiz: y, vert: x, inconnue: 'hyp', unite: 'm',
        texte: `Au handball, ${ctx.prenom} tire depuis le point T. Le point H de la ligne de but est à ${fmt(x)} m de T, et le poteau P est à ${fmt(y)} m de H. La droite (TH) est perpendiculaire à la ligne de but.`,
        question: 'Quelle distance sépare T du poteau P ?',
        conclusion: v => `Le tir parcourt environ ${v} m jusqu'au poteau.`
      };
    }
  },
  {
    themes: ['chevaux'],
    creer(rng, ctx) {
      const L = rng.bool(0.4) ? rng.choix([40, 60]) : 5 * rng.int(6, 16);
      const l = 5 * rng.int(3, Math.min(8, L / 5 - 1));
      return {
        lettres: { droit: 'B', p: 'A', q: 'C' }, horiz: L, vert: l, inconnue: 'hyp', unite: 'm',
        texte: `La carrière du centre équestre est un rectangle ABCD de ${L} m sur ${l} m. ${ctx.prenom} la traverse au galop en diagonale, de A à C.`,
        question: 'Quelle distance parcourt-' + ctx.il() + ' ?',
        conclusion: v => `${ctx.prenom} parcourt environ ${v} m.`
      };
    }
  },
  {
    themes: ['rap'],
    creer(rng) {
      const h = pas(rng, 8, 15, 0.5), d = pas(rng, 4, 12, 0.5);
      return {
        lettres: { droit: 'S', p: 'A', q: 'H' }, horiz: d, vert: h, inconnue: 'hyp', unite: 'm',
        texte: `Pour le concert de JUL, un technicien tend un câble entre le sommet H d'un pylône vertical de ${fmt(h)} m et un point A du sol, situé à ${fmt(d)} m du pied S du pylône.`,
        question: 'Quelle est la longueur du câble ?',
        conclusion: v => `Le câble mesure environ ${v} m.`
      };
    }
  },
  {
    themes: ['rap'],
    creer(rng) {
      const D = pas(rng, 8, 14, 0.5);
      const w = pas(rng, Math.ceil(D * 0.7), Math.floor(D * 0.9 * 2) / 2, 0.5);
      return {
        lettres: { droit: 'B', p: 'A', q: 'C' }, horiz: w, hyp: D, inconnue: 'vert', unite: 'm',
        texte: `Sur la scène du concert de JUL, l'écran géant est un rectangle ABCD. Sa diagonale [AC] mesure ${fmt(D)} m et sa largeur AB mesure ${fmt(w)} m.`,
        question: 'Quelle est la hauteur BC de l\'écran ?',
        conclusion: v => `L'écran mesure environ ${v} m de haut.`
      };
    }
  },
  {
    themes: ['grece'],
    creer(rng) {
      const h = pas(rng, 6, 12, 0.5), d = pas(rng, 1.5, 4.5, 0.5);
      return {
        lettres: { droit: 'P', p: 'F', q: 'S' }, horiz: d, vert: h, inconnue: 'hyp', unite: 'm',
        texte: `Au port du Pirée, près d'Athènes, un voilier a un mât vertical [PS] de ${fmt(h)} m. Un câble relie le sommet S du mât à un point F du pont, à ${fmt(d)} m du pied P du mât.`,
        question: 'Quelle est la longueur du câble [FS] ?',
        conclusion: v => `Le câble mesure environ ${v} m.`
      };
    }
  },
  {
    themes: ['jeux-video'],
    creer(rng, ctx) {
      const w = pas(rng, 6.5, 7.5, 0.1), h = pas(rng, 14, 16.5, 0.1);
      return {
        lettres: { droit: 'B', p: 'A', q: 'C' }, horiz: w, vert: h, inconnue: 'hyp', unite: 'cm',
        texte: `L'écran du téléphone ${ctx.de} est un rectangle ABCD de ${fmt(w)} cm sur ${fmt(h)} cm. ${ctx.prenom} y joue à son jeu préféré.`,
        question: 'Quelle est la longueur de la diagonale [AC] de l\'écran ?',
        conclusion: v => `La diagonale mesure environ ${v} cm.`
      };
    }
  },
  {
    themes: ['mode', 'commerce'],
    creer(rng, ctx) {
      const w = 10 * rng.int(8, 20), h = 10 * rng.int(5, 15);
      return {
        lettres: { droit: 'B', p: 'A', q: 'C' }, horiz: w, vert: h, inconnue: 'hyp', unite: 'cm',
        texte: `Dans la boutique ${ctx.de}, une barre lumineuse est posée en diagonale [AC] d'une vitrine rectangulaire ABCD de ${w} cm sur ${h} cm.`,
        question: 'Quelle est la longueur de la barre lumineuse ?',
        conclusion: v => `La barre mesure environ ${v} cm.`
      };
    }
  },
  {
    themes: ['famille', 'cuisine'],
    creer(rng) {
      const L = pas(rng, 3, 8, 0.5), d = pas(rng, 0.8, Math.min(2.5, L / 2), 0.1);
      return {
        lettres: { droit: 'M', p: 'P', q: 'H' }, horiz: d, hyp: L, inconnue: 'vert', unite: 'm',
        texte: `Une échelle [HP] de ${fmt(L)} m est posée contre un mur vertical. Son pied P est à ${fmt(d)} m du pied M du mur.`,
        question: 'À quelle hauteur HM arrive le haut de l\'échelle ?',
        conclusion: v => `L'échelle arrive à environ ${v} m de haut.`
      };
    }
  },
  {
    themes: ['espace', 'voyages', 'animaux', 'records', 'sport'],
    creer(rng, ctx) {
      const L = 5 * rng.int(4, 12), d = 5 * rng.int(2, L / 5 - 1);
      return {
        lettres: { droit: 'S', p: 'E', q: 'K' }, horiz: d, hyp: L, inconnue: 'vert', unite: 'm',
        texte: `${ctx.prenom} fait voler un cerf-volant K au bout d'un fil tendu de ${L} m, tenu au niveau du sol au point E. Le cerf-volant est à la verticale d'un point S du sol, à ${d} m de E.`,
        question: 'À quelle hauteur KS vole le cerf-volant ?',
        conclusion: v => `Le cerf-volant vole à environ ${v} m de haut.`
      };
    }
  },
  {
    themes: ['voyages', 'sport', 'records'],
    creer(rng) {
      const L = 10 * rng.int(5, 15), v = rng.int(8, Math.min(30, Math.floor(L / 3)));
      return {
        lettres: { droit: 'H', p: 'A', q: 'D' }, vert: v, hyp: L, inconnue: 'horiz', unite: 'm',
        texte: `En vacances, une tyrolienne relie un point de départ D à un point d'arrivée A par un câble de ${L} m. Le départ est ${v} m plus haut que l'arrivée. H est le point au niveau de A, à la verticale de D.`,
        question: 'Quelle distance horizontale AH sépare H de l\'arrivée ?',
        conclusion: val => `La distance horizontale est d'environ ${val} m.`
      };
    }
  }
];

function exoProbleme(rng, ctx, niveau) {
  const adaptes = PROBLEMES.filter(m => m.themes.includes(ctx.theme));
  const modele = rng.choix(adaptes.length ? adaptes : PROBLEMES);
  const p = modele.creer(rng, ctx);
  const { droit, p: lp, q: lq } = p.lettres;
  const N = { noms: [lp, droit, lq], droit, p: lp, q: lq, nom: `${lp}${droit}${lq}` };
  const u = ` ${p.unite}`;
  let calc, horiz = p.horiz, vert = p.vert;
  const cotes = {};

  if (p.inconnue === 'hyp') {
    calc = calculHypotenuse({ a: horiz, b: vert, unite: p.unite, arrondi: true, N });
    Object.assign(cotes, { [seg(droit, lp)]: fmt(horiz) + u, [seg(droit, lq)]: fmt(vert) + u, [seg(lp, lq)]: '?' });
  } else if (p.inconnue === 'vert') {
    calc = calculCote({ c: p.hyp, a: horiz, unite: p.unite, arrondi: true, N, inconnu: lq, connu: lp });
    vert = Math.sqrt(carre(p.hyp) - carre(horiz));
    Object.assign(cotes, { [seg(droit, lp)]: fmt(horiz) + u, [seg(lp, lq)]: fmt(p.hyp) + u, [seg(droit, lq)]: '?' });
  } else {
    calc = calculCote({ c: p.hyp, a: vert, unite: p.unite, arrondi: true, N, inconnu: lp, connu: lq });
    horiz = Math.sqrt(carre(p.hyp) - carre(vert));
    Object.assign(cotes, { [seg(droit, lq)]: fmt(vert) + u, [seg(lp, lq)]: fmt(p.hyp) + u, [seg(droit, lp)]: '?' });
  }
  calc.etapes.push(p.conclusion(fmt(calc.reponse)));

  return {
    cle: `probleme:${modele.themes[0]}:${p.inconnue}:${p.horiz ?? ''}:${p.vert ?? ''}:${p.hyp ?? ''}`,
    enonce: `<p>${p.texte}</p><p><strong>${p.question}</strong></p>
      <p class="doux petit">Le triangle ${N.nom} est rectangle en ${droit}. Arrondis au dixième.</p>`,
    figure: figurePolygone(sommetsRectangle(N, horiz, vert), { droit, cotes, accent: seg(lp, lq) }),
    type: 'nombre',
    unite: p.unite,
    ...calc,
    donnees: { ...calc.donnees, niveau }
  };
}

// ---------- Réciproque et contraposée (niveau 3) ----------

const CONTEXTES_RECIPROQUE = {
  chevaux: ctx => ({ unite: 'm', texte: `${ctx.prenom} veut vérifier qu'un coin de la carrière est bien un angle droit. ${cap(ctx.il())} plante trois piquets et mesure le triangle` }),
  handball: ctx => ({ unite: 'm', texte: `Pour retracer le terrain de hand, l'entraîneuse ${ctx.de} vérifie un coin avec trois plots. Elle mesure le triangle` }),
  famille: ctx => ({ unite: 'cm', texte: `${ctx.prenom} fabrique une étagère pour sa chambre. Pour vérifier qu'elle est d'équerre, ${ctx.il()} mesure le triangle` }),
  mode: ctx => ({ unite: 'cm', texte: `Dans la boutique ${ctx.de}, on vérifie qu'un présentoir est bien d'équerre. On mesure le triangle` }),
  grece: () => ({ unite: 'm', texte: 'Les bâtisseurs de la Grèce antique vérifiaient les angles droits avec une corde à nœuds. Sur un chantier, on mesure le triangle' })
};

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function exoReciproque(rng, ctx) {
  const N = choisirNoms(rng);
  const contexte = rng.bool(0.4) && CONTEXTES_RECIPROQUE[ctx.theme] ? CONTEXTES_RECIPROQUE[ctx.theme](ctx) : null;
  const unite = contexte ? contexte.unite : rng.choix(['cm', 'cm', 'm']);
  const rectangle = rng.bool(0.5);

  // Côtés en dixièmes (entiers) pour des comparaisons exactes
  let a, b, c;
  const t = rng.choix(TRIPLETS.slice(0, 3));
  if (unite === 'cm' && contexte) {
    const k = rng.int(4, Math.floor(100 / t[2]));
    [a, b, c] = t.map(x => x * k * 10);
  } else if (rng.bool(0.3)) {
    const k = rng.choix([0.5, 1.5, 2.5]);
    [a, b, c] = t.map(x => Math.round(x * k * 10));
  } else {
    const k = rng.int(1, Math.max(1, Math.floor(40 / t[2])));
    [a, b, c] = t.map(x => x * k * 10);
  }
  [a, b] = rng.melanger([a, b]);
  if (!rectangle) {
    // Petite modification d'un côté : le triangle devient « presque » rectangle
    const decimal = a % 10 || b % 10 || c % 10;
    for (;;) {
      // Écart tiré à chaque essai : un écart fixe peut ne jamais convenir (3-4-5 avec ±2)
      const delta = decimal ? 5 : 10 * rng.int(1, 2);
      const quoi = rng.int(0, 2);
      const s = rng.signe() * delta;
      const na = quoi === 0 ? a + s : a, nb = quoi === 1 ? b + s : b, nc = quoi === 2 ? c + s : c;
      if (nc > Math.max(na, nb) && na > 0 && nb > 0 && na + nb > nc && na * na + nb * nb !== nc * nc) {
        [a, b, c] = [na, nb, nc];
        break;
      }
    }
  }
  [a, b, c] = [a / 10, b / 10, c / 10];

  // [droit p] = a, [droit q] = b, [pq] = c (plus grand côté)
  const V = N.droit, H = seg(N.p, N.q), L1 = seg(V, N.p), L2 = seg(V, N.q);
  const C2 = carre(c), A2 = carre(a), B2 = carre(b), S = d2(A2 + B2);
  const egal = Math.abs(C2 - S) < 1e-9;
  const u = ` ${unite}`;

  const choix = [...N.noms].sort().map(n => `Oui, rectangle en ${n}`);
  choix.push('Non, il n\'est pas rectangle');
  const reponse = egal ? `Oui, rectangle en ${V}` : choix[3];

  const mesures = rng.melanger([[L1, a], [L2, b], [H, c]]).map(([s, v]) => `${s} = ${fmt(v)}${u}`);
  const intro = contexte ? `${contexte.texte} ${N.nom} :` : `Dans le triangle ${N.nom} :`;
  const enonce = `<p>${intro}</p><p>${mesures[0]}, ${mesures[1]} et ${mesures[2]}.</p>
    <p><strong>Ce triangle est-il rectangle ?</strong></p>`;

  // Figure construite à partir des trois longueurs (sans codage d'angle droit)
  const x = (c * c + a * a - b * b) / (2 * c);
  const y = Math.sqrt(Math.max(a * a - x * x, 0));
  const sommets = {};
  for (const n of N.noms) sommets[n] = n === N.p ? { x: 0, y: 0 } : n === N.q ? { x: c, y: 0 } : { x, y };
  const tourne = orienter(rng, sommets, N.p, N.q);
  Object.assign(sommets, tourne);
  const figure = figurePolygone(sommets, { cotes: { [L1]: fmt(a) + u, [L2]: fmt(b) + u, [H]: fmt(c) + u } });

  const conclusionRecip = `D'après la <strong>réciproque</strong> du théorème de Pythagore, le triangle ${N.nom} est rectangle en ${V}.`;
  const conclusionContra = `D'après la <strong>contraposée</strong> du théorème de Pythagore, le triangle ${N.nom} n'est pas rectangle.`;
  const etapes = [
    `Le plus grand côté est [${H}]. S'il y a un angle droit, il est en face : en ${V}.`,
    `D'une part : ${H}² = ${fmt(c)}² = ${fmt(C2)}`,
    `D'autre part : ${L1}² + ${L2}² = ${fmt(a)}² + ${fmt(b)}² = ${fmt(A2)} + ${fmt(B2)} = ${fmt(S)}`,
    egal
      ? `Les deux résultats sont <strong>égaux</strong>. ${conclusionRecip}`
      : `Les deux résultats sont <strong>différents</strong> (${fmt(C2)} ≠ ${fmt(S)}). ${conclusionContra}`
  ];
  const redaction = [
    `Dans le triangle ${N.nom}, le plus grand côté est [${H}].`,
    `D'une part : ${H}² = ${fmt(c)}² = ${fmt(C2)}`,
    `D'autre part : ${L1}² + ${L2}² = ${fmt(a)}² + ${fmt(b)}² = ${fmt(A2)} + ${fmt(B2)} = ${fmt(S)}`,
    egal ? `On constate que ${H}² = ${L1}² + ${L2}².` : `On constate que ${H}² ≠ ${L1}² + ${L2}².`,
    (egal ? conclusionRecip : conclusionContra).replace(/<\/?strong>/g, '')
  ].join('<br>');

  const erreurs = egal
    ? [
      { test: v => v === choix[3], message: `Recalcule les deux carrés : ${H}² = ${fmt(C2)} et ${L1}² + ${L2}² = ${fmt(S)}. Ils sont <strong>égaux</strong> !` },
      { test: v => typeof v === 'string' && v.startsWith('Oui') && v !== reponse, message: `L'angle droit est toujours <strong>en face du plus grand côté</strong> (l'hypoténuse) : ici en ${V}.` }
    ]
    : [
      { test: v => typeof v === 'string' && v.startsWith('Oui'), message: `${H}² = ${fmt(C2)} mais ${L1}² + ${L2}² = ${fmt(S)} : ce n'est pas égal, donc le triangle n'est <strong>pas rectangle</strong> (contraposée).` }
    ];

  return {
    cle: `reciproque:${a}:${b}:${c}:${unite}`,
    enonce,
    figure,
    type: 'qcm',
    choix,
    reponse,
    etapes,
    redaction,
    erreurs,
    donnees: { type: 'reciproque', a, b, c, sommet: V }
  };
}

// ---------- Cours ----------

// Séquence de touches dessinées : touches('√', '4', 'x²', '=')
function touches(...liste) {
  return liste.map(t => `<span class="touche-calc${/^[0-9,]+$/.test(t) ? '' : ' op'}">${t}</span>`).join('');
}

function figureCours() {
  const N = { noms: ['A', 'B', 'C'], droit: 'A', p: 'B', q: 'C' };
  return figurePolygone(sommetsRectangle(N, 4, 3), {
    droit: 'A', accent: 'BC',
    cotes: { AB: 'côté', AC: 'côté', BC: 'hypoténuse' }
  });
}

// ---------- Export ----------

export default {
  id: 'pythagore',
  titre: 'Théorème de Pythagore',
  resume: 'Calculer une longueur, prouver qu\'un triangle est rectangle (ou pas).',
  niveaux: 3,
  nomsNiveaux: ['Nombres entiers', 'Arrondi au dixième', 'Réciproque, type brevet'],
  cours: [
    {
      titre: 'Le théorème',
      contenu: `<p>Dans un triangle rectangle, l'<strong>hypoténuse</strong> est le côté en face de l'angle droit. C'est le plus long.</p>
        <p><strong>Théorème de Pythagore</strong> : si ABC est rectangle en A, alors</p>
        <p class="calcul">BC² = AB² + AC²</p>`,
      figure: figureCours()
    },
    {
      titre: 'Calculer l\'hypoténuse',
      contenu: `<p>AB = 6 cm, AC = 8 cm, ABC rectangle en A. On <strong>additionne</strong> les carrés :</p>
        <div class="redaction">Dans le triangle ABC rectangle en A, d'après le théorème de Pythagore :<br>BC² = AB² + AC²<br>BC² = 6² + 8²<br>BC² = 36 + 64<br>BC² = 100<br>BC = √100 = 10 cm</div>`
    },
    {
      titre: 'Calculer un autre côté',
      contenu: `<p>BC = 13 cm (hypoténuse), AC = 5 cm. On cherche AB : on <strong>soustrait</strong> les carrés.</p>
        <div class="redaction">BC² = AB² + AC²<br>13² = AB² + 5²<br>169 = AB² + 25<br>AB² = 169 − 25 = 144<br>AB = √144 = 12 cm</div>
        <p class="piege">Piège : on soustrait les carrés, jamais les longueurs (13 − 5 = 8 est faux).</p>`
    },
    {
      titre: 'À la calculatrice',
      contenu: `<p>AB = 4 cm, AC = 7 cm. Pour BC = √(4² + 7²), tape :</p>
        <p>${touches('√', '4', 'x²', '+', '7', 'x²', ')', '=')}</p>
        <p>L'écran affiche <strong>8,062257748</strong>. La touche √ ouvre une parenthèse : pense à la fermer.</p>
        <p><strong>Arrondir au dixième</strong> : on garde un chiffre après la virgule et on regarde le suivant (les centièmes).</p>
        <ul>
          <li>0, 1, 2, 3 ou 4 → on garde : 12,6<u>4</u>9… ≈ <strong>12,6</strong></li>
          <li>5, 6, 7, 8 ou 9 → on ajoute 1 : 8,0<u>6</u>2… ≈ <strong>8,1</strong></li>
        </ul>
        <p class="doux petit">En entraînement, ta calculatrice est derrière le bouton 🧮.</p>`
    },
    {
      titre: 'Rectangle ou pas ?',
      contenu: `<p>On compare le carré du <strong>plus grand côté</strong> avec la somme des carrés des deux autres.</p>
        <ul>
          <li><strong>Égalité</strong> → le triangle est rectangle : c'est la <strong>réciproque</strong> du théorème.</li>
          <li><strong>Pas d'égalité</strong> → il n'est pas rectangle : c'est la <strong>contraposée</strong>.</li>
        </ul>
        <div class="redaction">D'une part : BC² = 10² = 100<br>D'autre part : AB² + AC² = 6² + 8² = 100<br>On constate que BC² = AB² + AC².<br>D'après la réciproque du théorème de Pythagore, ABC est rectangle en A.</div>`
    }
  ],
  generer(niveau, rng, ctx) {
    if (niveau === 1) return exoPur(rng, 1);
    if (niveau === 2) return rng.bool(0.5) ? exoPur(rng, 2) : exoProbleme(rng, ctx, 2);
    return rng.bool(0.6) ? exoReciproque(rng, ctx) : exoProbleme(rng, ctx, 3);
  },

  // Contrôle indépendant pour tests/generators.html (calcul flottant direct)
  controler(exo) {
    const d = exo.donnees;
    const tol = (exo.tolerance || 0) + 1e-9;
    if (d.type === 'hyp') {
      const c = Math.hypot(d.a, d.b);
      return Math.abs(c - exo.reponse) <= tol ? null : `hypoténuse : attendu ${c}, obtenu ${exo.reponse}`;
    }
    if (d.type === 'cote') {
      if (d.a >= d.c) return 'le côté connu est plus long que l\'hypoténuse';
      const b = Math.sqrt(d.c * d.c - d.a * d.a);
      return Math.abs(b - exo.reponse) <= tol ? null : `côté : attendu ${b}, obtenu ${exo.reponse}`;
    }
    if (d.type === 'reciproque') {
      const [x, y, z] = [d.a, d.b, d.c].sort((m, n) => m - n);
      if (z !== d.c) return 'le plus grand côté n\'est pas celui attendu';
      const rect = Math.abs(z * z - x * x - y * y) < 1e-6;
      const attendu = rect ? `Oui, rectangle en ${d.sommet}` : 'Non, il n\'est pas rectangle';
      return attendu === exo.reponse ? null : `réciproque : attendu « ${attendu} », obtenu « ${exo.reponse} »`;
    }
    return null;
  }
};
