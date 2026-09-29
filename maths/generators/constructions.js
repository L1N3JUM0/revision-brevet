// Générateur : constructions géométriques.
// Défi « sur papier » avec une checklist d'autocorrection (non notée), puis une mesure à faire sur
// sa propre figure (angle au degré près, longueur au millimètre près) : c'est elle qui est vérifiée,
// avec une tolérance. Les fiches méthode du cours sont animées étape par étape.
import { fmt } from '../../assets/js/core/answer.js';
import { svg } from '../../assets/js/core/svg.js';

const RAD = Math.PI / 180;
const d1 = x => Math.round(x * 10) / 10;
const gras = s => `<strong>${s}</strong>`;
const cm = x => `${fmt(x)} cm`;
const pas = (rng, min, max, p) => d1(min + p * rng.int(0, Math.round((max - min) / p)));
const dist = (P, Q) => Math.hypot(P.x - Q.x, P.y - Q.y);
const pol = (P, r, a) => ({ x: P.x + r * Math.cos(a * RAD), y: P.y + r * Math.sin(a * RAD) });
const angleDe = (P, Q) => Math.atan2(Q.y - P.y, Q.x - P.x) / RAD;
// Angle géométrique en S entre [SA) et [SB), en degrés
function angleEn(S, A, B) {
  const u = { x: A.x - S.x, y: A.y - S.y }, v = { x: B.x - S.x, y: B.y - S.y };
  return Math.acos(Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))))) / RAD;
}
// Intersection des droites (P, direction a°) et (Q, direction b°)
function intersection(P, a, Q, b) {
  const u = { x: Math.cos(a * RAD), y: Math.sin(a * RAD) }, v = { x: Math.cos(b * RAD), y: Math.sin(b * RAD) };
  const det = u.x * v.y - u.y * v.x;
  const t = ((Q.x - P.x) * v.y - (Q.y - P.y) * v.x) / det;
  return { x: P.x + t * u.x, y: P.y + t * u.y };
}

// ---------- Moteur de figures (repère en cm, y vers le haut) ----------

/**
 * Dessine une liste d'éléments : { t: 'seg'|'droite'|'arc'|'cercle'|'point'|'angle'|'droit', … }.
 * cadre : points qui doivent tenir dans l'image (l'échelle est la même pour tous les éléments).
 */
function dessiner(elements, cadre) {
  const W = 340, H = 240, M = 34;
  const xs = cadre.map(p => p.x), ys = cadre.map(p => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = Math.min((W - 2 * M) / (x1 - x0 || 1), (H - 2 * M) / (y1 - y0 || 1));
  const ox = (W - (x1 - x0) * k) / 2, oy = (H - (y1 - y0) * k) / 2;
  const X = p => ox + (p.x - x0) * k, Y = p => H - (oy + (p.y - y0) * k);
  const G = { x: xs.reduce((s, x) => s + x, 0) / xs.length, y: ys.reduce((s, y) => s + y, 0) / ys.length };
  const f = n => n.toFixed(1);
  let c = '';
  for (const e of elements) {
    const cls = e.cls || 'trait';
    if (e.t === 'seg') c += `<line class="${cls}" x1="${f(X(e.a))}" y1="${f(Y(e.a))}" x2="${f(X(e.b))}" y2="${f(Y(e.b))}"/>`;
    else if (e.t === 'droite') {
      const a = angleDe(e.a, e.b);
      const p = pol(e.a, -40, a), q = pol(e.a, 40, a);
      c += `<line class="${cls}" x1="${f(X(p))}" y1="${f(Y(p))}" x2="${f(X(q))}" y2="${f(Y(q))}"/>`;
    } else if (e.t === 'arc') {
      const p = pol(e.c, e.r, e.a1), q = pol(e.c, e.r, e.a2);
      const grand = e.a2 - e.a1 > 180 ? 1 : 0;
      c += `<path class="${cls}" d="M${f(X(p))} ${f(Y(p))}A${f(e.r * k)} ${f(e.r * k)} 0 ${grand} 0 ${f(X(q))} ${f(Y(q))}"/>`;
    } else if (e.t === 'cercle') c += `<circle class="${cls}" cx="${f(X(e.c))}" cy="${f(Y(e.c))}" r="${f(e.r * k)}"/>`;
    else if (e.t === 'angle') {
      const r = 0.9;
      const a1 = angleDe(e.s, e.a), a2 = angleDe(e.s, e.b);
      let debut = a1, fin = a2;
      if (((fin - debut) % 360 + 360) % 360 > 180) [debut, fin] = [a2, a1];
      const p = pol(e.s, r, debut), q = pol(e.s, r, fin);
      c += `<path class="arc-angle arc-donne" d="M${f(X(e.s))} ${f(Y(e.s))}L${f(X(p))} ${f(Y(p))}A${f(r * k)} ${f(r * k)} 0 0 0 ${f(X(q))} ${f(Y(q))}Z"/>`;
      if (e.texte) {
        const m = debut + (((fin - debut) % 360 + 360) % 360) / 2;
        const l = pol(e.s, r + 0.75, m);
        c += `<text class="etiquette-angle" x="${f(X(l))}" y="${f(Y(l))}" text-anchor="middle" dominant-baseline="middle">${e.texte}</text>`;
      }
    } else if (e.t === 'droit') {
      const s = 0.45;
      const u = pol({ x: 0, y: 0 }, s, angleDe(e.s, e.a)), v = pol({ x: 0, y: 0 }, s, angleDe(e.s, e.b));
      const p1 = { x: e.s.x + u.x, y: e.s.y + u.y }, p2 = { x: p1.x + v.x, y: p1.y + v.y }, p3 = { x: e.s.x + v.x, y: e.s.y + v.y };
      c += `<path class="codage" d="M${f(X(p1))} ${f(Y(p1))}L${f(X(p2))} ${f(Y(p2))}L${f(X(p3))} ${f(Y(p3))}"/>`;
    } else if (e.t === 'point') {
      c += `<circle class="point-plein" cx="${f(X(e.p))}" cy="${f(Y(e.p))}" r="3"/>`;
      const dx = e.p.x - G.x, dy = e.p.y - G.y, n = Math.hypot(dx, dy) || 1;
      const l = { x: X(e.p) + (dx / n) * 14, y: Y(e.p) - (dy / n) * 14 };
      c += `<text class="nom-point" x="${f(l.x)}" y="${f(l.y)}" text-anchor="middle" dominant-baseline="middle">${e.nom}</text>`;
    }
  }
  return svg(W, H, c, { titre: 'Construction' });
}

// Figures progressives : l'étape k montre tout ce qui précède, la nouveauté en couleur
function etapesAnimees(construction) {
  const { etapes, cadre } = construction;
  return etapes.map((etape, k) => {
    const elements = [];
    etapes.slice(0, k + 1).forEach((e, j) => e.ajout.forEach(el => {
      const nouveau = j === k && (el.t === 'seg' || el.t === 'droite') && (!el.cls || el.cls === 'trait');
      elements.push(nouveau ? { ...el, cls: 'trait nouveau' } : el);
    }));
    // Les points sont dessinés en dernier, par-dessus les traits
    elements.sort((a, b) => (a.t === 'point') - (b.t === 'point'));
    return { texte: etape.texte, figure: dessiner(elements, cadre) };
  });
}

// Petit arc de compas autour de la direction « vers »
const arcVers = (centre, r, vers, ouverture = 22) => {
  const a = angleDe(centre, vers);
  return { t: 'arc', c: centre, r, a1: a - ouverture, a2: a + ouverture, cls: 'compas' };
};

// ---------- Constructions ----------

const A0 = { x: 0, y: 0 };
const pt = (p, nom) => ({ t: 'point', p, nom });
const seg = (a, b, cls) => ({ t: 'seg', a, b, cls });

// Triangle connaissant ses trois côtés (AB = c, AC = b, BC = a)
function constructionCCC(c, b, a) {
  const A = A0, B = { x: c, y: 0 };
  const x = (c * c + b * b - a * a) / (2 * c);
  const C = { x, y: Math.sqrt(b * b - x * x) };
  return {
    A, B, C,
    cadre: [A, B, C, { x: C.x, y: C.y + 0.6 }],
    etapes: [
      { texte: `Je trace le segment [AB] de ${cm(c)} à la règle.`, ajout: [seg(A, B), pt(A, 'A'), pt(B, 'B')] },
      { texte: `Compas : pointe sur A, écartement ${cm(b)}. Je trace un arc au-dessus de [AB].`, ajout: [arcVers(A, b, C)] },
      { texte: `Pointe sur B, écartement ${cm(a)}. Je trace un deuxième arc qui coupe le premier.`, ajout: [arcVers(B, a, C)] },
      { texte: 'C est le point d\'intersection des deux arcs. Je trace [AC] et [BC], en laissant les arcs visibles.', ajout: [seg(A, C), seg(B, C), pt(C, 'C')] }
    ]
  };
}

// Triangle connaissant deux côtés et l'angle compris (AB = c, AC = b, angle A = alpha)
function constructionCAC(c, b, alpha) {
  const A = A0, B = { x: c, y: 0 }, C = pol(A, b, alpha);
  const rayon = pol(A, b + 1.2, alpha);
  return {
    A, B, C,
    cadre: [A, B, C, rayon],
    etapes: [
      { texte: `Je trace le segment [AB] de ${cm(c)}.`, ajout: [seg(A, B), pt(A, 'A'), pt(B, 'B')] },
      { texte: `Rapporteur : centre sur A, zéro sur [AB]. Je marque ${alpha}° et je trace la demi-droite.`, ajout: [seg(A, rayon, 'aide'), { t: 'angle', s: A, a: B, b: C, texte: `${alpha}°` }] },
      { texte: `Je place C sur cette demi-droite, à ${cm(b)} de A.`, ajout: [seg(A, C), pt(C, 'C')] },
      { texte: 'Je trace [BC] : le triangle est terminé.', ajout: [seg(B, C)] }
    ]
  };
}

// Triangle connaissant un côté et les deux angles adjacents (AB = c, angles A = alpha, B = beta)
function constructionACA(c, alpha, beta) {
  const A = A0, B = { x: c, y: 0 };
  const C = intersection(A, alpha, B, 180 - beta);
  const ra = pol(A, dist(A, C) + 1.2, alpha), rb = pol(B, dist(B, C) + 1.2, 180 - beta);
  return {
    A, B, C,
    cadre: [A, B, C, ra, rb],
    etapes: [
      { texte: `Je trace le segment [AB] de ${cm(c)}.`, ajout: [seg(A, B), pt(A, 'A'), pt(B, 'B')] },
      { texte: `En A, je trace au rapporteur un angle de ${alpha}°.`, ajout: [seg(A, ra, 'aide'), { t: 'angle', s: A, a: B, b: C, texte: `${alpha}°` }] },
      { texte: `En B, du même côté, je trace un angle de ${beta}°.`, ajout: [seg(B, rb, 'aide'), { t: 'angle', s: B, a: C, b: A, texte: `${beta}°` }] },
      { texte: 'C est l\'intersection des deux demi-droites. Je trace [AC] et [BC].', ajout: [seg(A, C), seg(B, C), pt(C, 'C')] }
    ]
  };
}

// Triangle rectangle en A (AB = c, AC = b)
function constructionRectangle(c, b) {
  const A = A0, B = { x: c, y: 0 }, C = { x: 0, y: b };
  return {
    A, B, C,
    cadre: [A, B, C, { x: 0, y: b + 1 }, { x: -0.8, y: 0 }],
    etapes: [
      { texte: `Je trace le segment [AB] de ${cm(c)}.`, ajout: [seg(A, B), pt(A, 'A'), pt(B, 'B')] },
      { texte: 'Avec l\'équerre, je trace la perpendiculaire à (AB) passant par A.', ajout: [{ t: 'droite', a: A, b: C, cls: 'aide' }, { t: 'droit', s: A, a: B, b: C }] },
      { texte: `Je place C sur cette perpendiculaire, à ${cm(b)} de A.`, ajout: [seg(A, C), pt(C, 'C')] },
      { texte: 'Je trace [BC] et je code l\'angle droit en A.', ajout: [seg(B, C)] }
    ]
  };
}

// Parallélogramme ABCD (AB = c, AD = e, angle DAB = alpha)
function constructionParallelogramme(c, e, alpha) {
  const A = A0, B = { x: c, y: 0 }, D = pol(A, e, alpha);
  const C = { x: B.x + D.x, y: B.y + D.y };
  return {
    A, B, C, D,
    cadre: [A, B, C, D],
    etapes: [
      { texte: `Je trace [AB] de ${cm(c)}.`, ajout: [seg(A, B), pt(A, 'A'), pt(B, 'B')] },
      { texte: `Au rapporteur, angle de ${alpha}° en A. Je place D à ${cm(e)} de A.`, ajout: [seg(A, D), { t: 'angle', s: A, a: B, b: D, texte: `${alpha}°` }, pt(D, 'D')] },
      { texte: `Les côtés opposés ont la même longueur : arc de centre B de rayon ${cm(e)}, arc de centre D de rayon ${cm(c)}.`, ajout: [arcVers(B, e, C), arcVers(D, c, C)] },
      { texte: 'C est à l\'intersection des arcs. Je trace [BC] et [DC].', ajout: [seg(B, C), seg(D, C), pt(C, 'C')] }
    ]
  };
}

// Médiatrice de [PQ] au compas : arcs de même rayon de part et d'autre
function mediatrice(P, Q) {
  const d = dist(P, Q), r = 0.7 * d;
  const M = { x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 };
  const a = angleDe(P, Q) + 90;
  const h = Math.sqrt(r * r - (d / 2) ** 2);
  const I1 = pol(M, h, a), I2 = pol(M, -h, a);
  return {
    I1, I2,
    elements: [arcVers(P, r, I1, 12), arcVers(P, r, I2, 12), arcVers(Q, r, I1, 12), arcVers(Q, r, I2, 12), { t: 'droite', a: I1, b: I2, cls: 'aide' }]
  };
}

// Cercle circonscrit à un triangle (côtés AB = c, AC = b, BC = a)
function constructionCirconscrit(c, b, a) {
  const T = constructionCCC(c, b, a);
  const { A, B, C } = T;
  const m1 = mediatrice(A, B), m2 = mediatrice(A, C);
  const O = intersection(m1.I1, angleDe(m1.I1, m1.I2), m2.I1, angleDe(m2.I1, m2.I2));
  const R = dist(O, A);
  return {
    A, B, C, O, R,
    cadre: [A, B, C, { x: O.x - R, y: O.y - R }, { x: O.x + R, y: O.y + R }],
    etapes: [
      { texte: `Je construis le triangle ABC (AB = ${cm(c)}, AC = ${cm(b)}, BC = ${cm(a)}).`, ajout: [seg(A, B), seg(A, C), seg(B, C), pt(A, 'A'), pt(B, 'B'), pt(C, 'C')] },
      { texte: 'Médiatrice de [AB] : même écartement de compas depuis A et depuis B, de part et d\'autre. Je relie les deux croisements.', ajout: m1.elements },
      { texte: 'Même chose pour la médiatrice de [AC].', ajout: m2.elements },
      { texte: 'Les médiatrices se coupent en O, le centre du cercle circonscrit. Je trace le cercle de centre O passant par A (il passe aussi par B et C).', ajout: [{ t: 'cercle', c: O, r: R, cls: 'cercle' }, pt(O, 'O')] }
    ]
  };
}

// ---------- Tirages ----------

function anglesTriangle(a, b, c) {
  const ang = (x, y, z) => Math.acos((y * y + z * z - x * x) / (2 * y * z)) / RAD;
  return [ang(a, b, c), ang(b, a, c), ang(c, a, b)]; // en A (opposé à a = BC), en B, en C
}

function tirerCCC(rng, { aigu = false } = {}) {
  for (;;) {
    const c = pas(rng, 4, 9, 0.5), b = pas(rng, 3, 8, 0.5), a = pas(rng, 3, 8, 0.5);
    if (a + b <= c || a + c <= b || b + c <= a) continue;
    const angs = anglesTriangle(a, b, c);
    if (Math.min(...angs) < 30) continue;
    if (aigu && Math.max(...angs) > 82) continue;
    if (new Set([a, b, c]).size < 3) continue;
    return { a, b, c, angs };
  }
}

// Checklist d'autocorrection (cases à cocher, non notée)
function checklist(items) {
  return `<ul class="checklist">${items.map(t => `<li><label><input type="checkbox"><span>${t}</span></label></li>`).join('')}</ul>`;
}

function erreursMesure(r, tol, autres) {
  const liste = [];
  for (const [v, message] of autres) {
    if (!Number.isFinite(v) || Math.abs(v - r) <= tol + 0.3 || liste.some(e => Math.abs(e.v - v) < tol)) continue;
    liste.push({ v, test: x => typeof x === 'number' && Math.abs(x - v) <= tol, message });
  }
  return liste.map(({ test, message }) => ({ test, message }));
}

// Assemble un exercice : défi + checklist + mesure
function exercice({ cle, consigne, construction, items, mesure, unite, exact, tol, autres, donnees }) {
  const etapes = etapesAnimees(construction);
  const r = unite === '°' ? Math.round(exact) : d1(exact);
  return {
    cle,
    enonce: `<p><strong>Défi sur papier</strong> : ${consigne}</p>
      <p class="doux petit">Coche chaque étape quand elle est faite :</p>
      ${checklist(items)}
      <p><strong>${mesure}</strong></p>
      <p class="doux petit">${unite === '°' ? 'Au degré près, avec ton rapporteur.' : 'Au millimètre près, avec ta règle (par exemple 6,4).'}</p>`,
    type: 'nombre',
    unite,
    reponse: r,
    tolerance: tol,
    etapes: [
      ...etapes.map((e, k) => `<strong>Étape ${k + 1}</strong> : ${e.texte}${e.figure}`),
      `Sur une figure exacte, on trouve ${gras(`${fmt(r)} ${unite}`)}. Une réponse entre ${fmt(d1(r - tol))} et ${fmt(d1(r + tol))} ${unite} montre que ta construction est précise.`
    ],
    erreurs: erreursMesure(r, tol, autres),
    donnees
  };
}

// ---------- Exercices ----------

function exoCCC(rng) {
  const { a, b, c, angs } = tirerCCC(rng);
  const K = constructionCCC(c, b, a);
  return exercice({
    cle: `ccc:${a}:${b}:${c}`,
    consigne: `construis le triangle ABC tel que AB = ${cm(c)}, AC = ${cm(b)} et BC = ${cm(a)}.`,
    construction: K,
    items: [`J'ai tracé [AB] de ${cm(c)}.`, `J'ai tracé un arc de centre A et de rayon ${cm(b)}.`, `J'ai tracé un arc de centre B et de rayon ${cm(a)}.`, 'J\'ai placé C à l\'intersection et tracé [AC] et [BC].', 'J\'ai laissé les arcs visibles et nommé les points.'],
    mesure: 'Mesure l\'angle BAC sur ta figure.',
    unite: '°', exact: angs[0], tol: 2,
    autres: [[angs[1], 'Tu as mesuré l\'angle en B. L\'angle BAC a son sommet en <strong>A</strong> (la lettre du milieu).'],
      [angs[2], 'Tu as mesuré l\'angle en C. L\'angle BAC a son sommet en <strong>A</strong>.'],
      [180 - angs[0], 'Tu as lu la mauvaise graduation du rapporteur : un angle aigu mesure moins de 90°.']],
    donnees: { type: 'angle', P: K, sommet: 'A', cotes: ['B', 'C'] }
  });
}

function exoRectangle(rng) {
  const c = pas(rng, 3, 8, 0.5), b = pas(rng, 3, 7, 0.5);
  const K = constructionRectangle(c, b);
  return exercice({
    cle: `rect:${c}:${b}`,
    consigne: `construis le triangle ABC rectangle en A tel que AB = ${cm(c)} et AC = ${cm(b)}.`,
    construction: K,
    items: [`J'ai tracé [AB] de ${cm(c)}.`, 'J\'ai tracé la perpendiculaire à (AB) en A avec l\'équerre.', `J'ai placé C à ${cm(b)} de A.`, 'J\'ai tracé [BC] et codé l\'angle droit.'],
    mesure: 'Mesure la longueur BC sur ta figure.',
    unite: 'cm', exact: Math.hypot(c, b), tol: 0.2,
    autres: [[c + b, 'BC n\'est pas AB + AC : mesure directement le segment [BC].']],
    donnees: { type: 'longueur', P: K, seg: ['B', 'C'] }
  });
}

function exoCAC(rng) {
  const c = pas(rng, 4, 8, 0.5), b = pas(rng, 3, 7, 0.5), alpha = 5 * rng.int(7, 23);
  const K = constructionCAC(c, b, alpha);
  const exact = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(alpha * RAD));
  const faux = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos((180 - alpha) * RAD));
  return exercice({
    cle: `cac:${c}:${b}:${alpha}`,
    consigne: `construis le triangle ABC tel que AB = ${cm(c)}, AC = ${cm(b)} et l'angle BAC mesure ${alpha}°.`,
    construction: K,
    items: [`J'ai tracé [AB] de ${cm(c)}.`, `J'ai tracé l'angle de ${alpha}° en A (centre du rapporteur sur A, zéro sur [AB]).`, `J'ai placé C à ${cm(b)} de A.`, 'J\'ai tracé [BC] et nommé les points.'],
    mesure: 'Mesure la longueur BC sur ta figure.',
    unite: 'cm', exact, tol: 0.2,
    autres: [[faux, `Ton angle en A mesure sûrement ${180 - alpha}° au lieu de ${alpha}° : attention à la graduation du rapporteur (celle qui part de 0 sur [AB]).`]],
    donnees: { type: 'longueur', P: K, seg: ['B', 'C'] }
  });
}

function exoACA(rng) {
  let c, alpha, beta;
  do { c = pas(rng, 4, 8, 0.5); alpha = 5 * rng.int(7, 16); beta = 5 * rng.int(7, 16); } while (alpha + beta > 135 || alpha === beta);
  const K = constructionACA(c, alpha, beta);
  const exact = c * Math.sin(beta * RAD) / Math.sin((alpha + beta) * RAD);
  const autre = c * Math.sin(alpha * RAD) / Math.sin((alpha + beta) * RAD);
  return exercice({
    cle: `aca:${c}:${alpha}:${beta}`,
    consigne: `construis le triangle ABC tel que AB = ${cm(c)}, l'angle BAC mesure ${alpha}° et l'angle ABC mesure ${beta}°.`,
    construction: K,
    items: [`J'ai tracé [AB] de ${cm(c)}.`, `J'ai tracé l'angle de ${alpha}° en A.`, `J'ai tracé l'angle de ${beta}° en B, du même côté de [AB].`, 'J\'ai placé C à l\'intersection et tracé les côtés.'],
    mesure: 'Mesure la longueur AC sur ta figure.',
    unite: 'cm', exact, tol: 0.2,
    autres: [[autre, 'Ça, c\'est BC. On demande AC (de A à C).']],
    donnees: { type: 'longueur', P: K, seg: ['A', 'C'] }
  });
}

function exoParallelogramme(rng) {
  const c = pas(rng, 4, 7, 0.5), e = pas(rng, 3, 5, 0.5), alpha = 5 * rng.int(8, 16);
  const K = constructionParallelogramme(c, e, alpha);
  const exact = Math.sqrt(c * c + e * e + 2 * c * e * Math.cos(alpha * RAD));
  const bd = Math.sqrt(c * c + e * e - 2 * c * e * Math.cos(alpha * RAD));
  return exercice({
    cle: `para:${c}:${e}:${alpha}`,
    consigne: `construis le parallélogramme ABCD tel que AB = ${cm(c)}, AD = ${cm(e)} et l'angle DAB mesure ${alpha}°.`,
    construction: K,
    items: [`J'ai tracé [AB] de ${cm(c)}.`, `J'ai tracé l'angle de ${alpha}° en A et placé D à ${cm(e)} de A.`, `J'ai tracé un arc de centre B de rayon ${cm(e)} et un arc de centre D de rayon ${cm(c)}.`, 'J\'ai placé C à l\'intersection et tracé [BC] et [DC].'],
    mesure: 'Mesure la diagonale AC sur ta figure.',
    unite: 'cm', exact, tol: 0.2,
    autres: [[bd, 'Tu as mesuré l\'autre diagonale, [BD]. On demande [AC].']],
    donnees: { type: 'longueur', P: K, seg: ['A', 'C'] }
  });
}

function exoCirconscrit(rng) {
  const { a, b, c } = tirerCCC(rng, { aigu: true });
  const K = constructionCirconscrit(c, b, a);
  const [angA] = anglesTriangle(a, b, c);
  const exact = a / (2 * Math.sin(angA * RAD));
  return exercice({
    cle: `circ:${a}:${b}:${c}`,
    consigne: `construis le triangle ABC tel que AB = ${cm(c)}, AC = ${cm(b)} et BC = ${cm(a)}, puis son cercle circonscrit (le cercle qui passe par A, B et C).`,
    construction: K,
    items: ['J\'ai construit le triangle au compas.', 'J\'ai tracé la médiatrice de [AB] au compas.', 'J\'ai tracé la médiatrice de [AC] (ou de [BC]).', 'J\'ai placé O, le point d\'intersection des médiatrices.', 'J\'ai tracé le cercle de centre O passant par A, B et C.'],
    mesure: 'Mesure le rayon OA du cercle.',
    unite: 'cm', exact, tol: 0.2,
    autres: [[2 * exact, 'Tu as mesuré le <strong>diamètre</strong>. Le rayon, c\'est la moitié : de O jusqu\'au cercle.']],
    donnees: { type: 'longueur', P: K, seg: ['O', 'A'] }
  });
}

// ---------- Cours : fiches méthode animées ----------

const FICHE_CCC = etapesAnimees(constructionCCC(6, 4.5, 5));
const FICHE_RECT = etapesAnimees(constructionRectangle(5, 3.5));
const FICHE_MED = (() => {
  const P = { x: 0, y: 0 }, Q = { x: 5, y: 0 };
  const m = mediatrice(P, Q);
  const base = [seg(P, Q), pt(P, 'A'), pt(Q, 'B')];
  const etapes = [
    { texte: 'On veut la médiatrice de [AB] : la droite perpendiculaire à [AB] en son milieu.', ajout: base },
    { texte: 'Compas écarté de plus de la moitié de AB. Pointe sur A : un arc au-dessus, un arc au-dessous.', ajout: m.elements.slice(0, 2) },
    { texte: 'Même écartement, pointe sur B : deux arcs qui coupent les premiers.', ajout: m.elements.slice(2, 4) },
    { texte: 'Je relie les deux points de croisement : c\'est la médiatrice.', ajout: [m.elements[4]] }
  ];
  return etapesAnimees({ etapes, cadre: [P, Q, m.I1, m.I2] });
})();

// ---------- Export ----------

export default {
  id: 'constructions',
  titre: 'Constructions géométriques',
  resume: 'Construire à la règle, au compas, à l\'équerre et au rapporteur.',
  niveaux: 3,
  nomsNiveaux: ['Triangles simples', 'Avec le rapporteur', 'Type brevet'],
  cours: [
    { titre: 'Triangle : trois côtés connus', contenu: '<p>On utilise la <strong>règle</strong> et le <strong>compas</strong>. Appuie sur ▶ ou avance étape par étape.</p>', animation: FICHE_CCC },
    { titre: 'Triangle rectangle', contenu: '<p>On utilise l\'<strong>équerre</strong> pour l\'angle droit.</p>', animation: FICHE_RECT },
    { titre: 'La médiatrice au compas', contenu: '<p>Tous les points de la médiatrice sont à la même distance de A et de B.</p>', animation: FICHE_MED },
    {
      titre: 'Les bons réflexes',
      contenu: `<ul>
          <li>Un crayon bien taillé, des traits fins.</li>
          <li>On <strong>laisse les traits de construction</strong> (arcs, demi-droites) : le correcteur doit les voir.</li>
          <li>Rapporteur : le centre sur le sommet, le zéro sur le premier côté, et on lit la graduation qui part de ce zéro.</li>
          <li>On nomme les points et on code les angles droits et les longueurs égales.</li>
        </ul>`
    }
  ],
  generer(niveau, rng) {
    if (niveau === 1) return rng.bool(0.6) ? exoCCC(rng) : exoRectangle(rng);
    if (niveau === 2) return rng.bool(0.5) ? exoCAC(rng) : exoACA(rng);
    return rng.choix([exoParallelogramme, exoCirconscrit, exoCAC, exoCCC])(rng);
  },

  // Contrôle indépendant : mesure directe sur les coordonnées de la construction
  controler(exo) {
    const d = exo.donnees;
    let m;
    if (d.type === 'angle') m = angleEn(d.P[d.sommet], d.P[d.cotes[0]], d.P[d.cotes[1]]);
    else m = dist(d.P[d.seg[0]], d.P[d.seg[1]]);
    const arrondi = exo.unite === '°' ? 0.5 : 0.05;
    return Math.abs(m - exo.reponse) <= arrondi + 1e-9 ? null : `mesure sur la figure ${m}, réponse ${exo.reponse}`;
  }
};
