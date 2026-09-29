// Utilitaires de figures SVG (chaînes de caractères, insérées en HTML).
// Les couleurs passent par des variables CSS pour suivre le thème.

const NS = 'http://www.w3.org/2000/svg';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function attrs(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(' ');
}

const r2 = x => Math.round(x * 100) / 100;

// Conteneur SVG responsive
export function svg(largeur, hauteur, contenu, { titre = '', classe = 'figure' } = {}) {
  return `<svg xmlns="${NS}" viewBox="0 0 ${r2(largeur)} ${r2(hauteur)}" class="${classe}" role="img"${titre ? ` aria-label="${esc(titre)}"` : ''}>${contenu}</svg>`;
}

export function segment(A, B, opts = {}) {
  return `<line ${attrs({ x1: r2(A.x), y1: r2(A.y), x2: r2(B.x), y2: r2(B.y), class: opts.classe || 'trait', 'stroke-dasharray': opts.pointilles ? '5 4' : null })}/>`;
}

export function polygone(points, opts = {}) {
  const pts = points.map(p => `${r2(p.x)},${r2(p.y)}`).join(' ');
  return `<polygon ${attrs({ points: pts, class: opts.classe || 'trait remplissage' })}/>`;
}

export function texte(x, y, contenu, opts = {}) {
  return `<text ${attrs({ x: r2(x), y: r2(y), class: opts.classe || 'etiquette', 'text-anchor': opts.ancre || 'middle', 'dominant-baseline': 'middle' })}>${esc(contenu)}</text>`;
}

// Point nommé : petite croix + nom décalé vers l'extérieur (direction dx, dy)
export function point(P, nom, { dx = 0, dy = -1, croix = true } = {}) {
  const n = Math.hypot(dx, dy) || 1;
  const d = 14;
  const c = croix
    ? `<path class="croix" d="M${r2(P.x - 4)} ${r2(P.y - 4)}L${r2(P.x + 4)} ${r2(P.y + 4)}M${r2(P.x - 4)} ${r2(P.y + 4)}L${r2(P.x + 4)} ${r2(P.y - 4)}"/>`
    : '';
  return c + (nom ? texte(P.x + (dx / n) * d, P.y + (dy / n) * d, nom, { classe: 'nom-point' }) : '');
}

// Codage d'angle droit au sommet B de l'angle ABC
export function angleDroit(A, B, C, taille = 10) {
  const u = unitaire(B, A);
  const v = unitaire(B, C);
  const p1 = { x: B.x + u.x * taille, y: B.y + u.y * taille };
  const p2 = { x: p1.x + v.x * taille, y: p1.y + v.y * taille };
  const p3 = { x: B.x + v.x * taille, y: B.y + v.y * taille };
  return `<path class="codage" d="M${r2(p1.x)} ${r2(p1.y)}L${r2(p2.x)} ${r2(p2.y)}L${r2(p3.x)} ${r2(p3.y)}"/>`;
}

// Longueur écrite au milieu d'un segment, décalée vers l'extérieur de la figure
export function longueur(A, B, contenu, centre, decalage = 14) {
  const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  let nx = -(B.y - A.y);
  let ny = B.x - A.x;
  const n = Math.hypot(nx, ny) || 1;
  nx /= n; ny /= n;
  // On oriente la normale à l'opposé du centre de la figure
  if (centre && (M.x - centre.x) * nx + (M.y - centre.y) * ny < 0) { nx = -nx; ny = -ny; }
  return texte(M.x + nx * decalage, M.y + ny * decalage, contenu, { classe: 'longueur' });
}

function unitaire(A, B) {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const n = Math.hypot(dx, dy) || 1;
  return { x: dx / n, y: dy / n };
}

// Met à l'échelle des points (repère mathématique, y vers le haut) dans un cadre
export function ajuster(points, largeur, hauteur, marge = 30) {
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const k = Math.min(
    (largeur - 2 * marge) / (maxX - minX || 1),
    (hauteur - 2 * marge) / (maxY - minY || 1)
  );
  const ox = (largeur - (maxX - minX) * k) / 2;
  const oy = (hauteur - (maxY - minY) * k) / 2;
  return points.map(p => ({ x: ox + (p.x - minX) * k, y: hauteur - (oy + (p.y - minY) * k) }));
}

/**
 * Droite graduée de min à max, avec des points marqués et une flèche de déplacement.
 * marques : [{ valeur, nom }]; fleche : { de, a, texte }
 */
export function droiteGraduee(min, max, { marques = [], fleche = null, largeur = 340, hauteur = 90 } = {}) {
  const marge = 18;
  const y = hauteur - 32;
  const X = v => marge + ((v - min) / (max - min)) * (largeur - 2 * marge);
  let c = `<line class="trait" x1="${marge - 8}" y1="${y}" x2="${largeur - marge + 8}" y2="${y}"/>`;
  for (let v = min; v <= max; v++) {
    const grand = v === 0 || v % 5 === 0;
    c += `<line class="${v === 0 ? 'trait' : 'graduation'}" x1="${r2(X(v))}" y1="${y - (grand ? 7 : 4)}" x2="${r2(X(v))}" y2="${y + (grand ? 7 : 4)}"/>`;
    if (grand || max - min <= 12) c += texte(X(v), y + 18, v < 0 ? `−${-v}` : String(v), { classe: 'graduation-texte' });
  }
  for (const m of marques) {
    c += `<circle class="point-plein" cx="${r2(X(m.valeur))}" cy="${y}" r="4.5"/>`;
    if (m.nom) c += texte(X(m.valeur), y - 16, m.nom, { classe: 'nom-point' });
  }
  if (fleche) {
    const x1 = X(fleche.de), x2 = X(fleche.a);
    const haut = y - 36;
    const sens = x2 > x1 ? 1 : -1;
    c += `<path class="fleche" d="M${r2(x1)} ${y - 8} Q${r2((x1 + x2) / 2)} ${haut - 10} ${r2(x2)} ${y - 8}"/>`;
    c += `<path class="fleche-pointe" d="M${r2(x2)} ${y - 8} l${-8 * sens} -3 l${2 * sens} 8 z"/>`;
    if (fleche.texte) c += texte((x1 + x2) / 2, haut - 12, fleche.texte, { classe: 'longueur' });
  }
  return svg(largeur, hauteur, c, { titre: 'Droite graduée' });
}
