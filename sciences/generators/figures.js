// Figures SVG des sciences : graphiques, chronophotographies, schémas électriques.
// Toutes les couleurs passent par les classes CSS de .figure (thème sombre, accent de la matière).
import { svg } from '../../assets/js/core/svg.js';
import { fmt } from '../../assets/js/core/answer.js';

const r1 = x => Math.round(x * 10) / 10;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Graphique cartésien avec quadrillage léger.
 * series : [{ points: [[x, y], …], classe? }] ; titreX / titreY : légendes des axes.
 */
export function graphe({ xMin = 0, xMax, yMin = 0, yMax, pasX, pasY, titreX = '', titreY = '', series = [], repere = null }) {
  const W = 340, H = 240, g = 44, d = 14, h = 26, b = 40;
  const X = x => g + ((x - xMin) / (xMax - xMin)) * (W - g - d);
  const Y = y => H - b - ((y - yMin) / (yMax - yMin)) * (H - b - h);
  let c = '';
  for (let x = xMin; x <= xMax + 1e-9; x += pasX) {
    c += `<line class="graduation" opacity="0.35" x1="${r1(X(x))}" y1="${r1(Y(yMin))}" x2="${r1(X(x))}" y2="${r1(Y(yMax))}"/>`;
    c += `<text class="graduation-texte" x="${r1(X(x))}" y="${r1(Y(yMin) + 16)}" text-anchor="middle">${fmt(Number(x.toFixed(6)))}</text>`;
  }
  for (let y = yMin; y <= yMax + 1e-9; y += pasY) {
    c += `<line class="graduation" opacity="0.35" x1="${r1(X(xMin))}" y1="${r1(Y(y))}" x2="${r1(X(xMax))}" y2="${r1(Y(y))}"/>`;
    c += `<text class="graduation-texte" x="${r1(X(xMin) - 6)}" y="${r1(Y(y) + 4)}" text-anchor="end">${fmt(Number(y.toFixed(6)))}</text>`;
  }
  // Axes (l'axe horizontal passe par 0 s'il est dans la fenêtre)
  const y0 = yMin <= 0 && yMax >= 0 ? 0 : yMin;
  c += `<line class="trait" x1="${r1(X(xMin))}" y1="${r1(Y(y0))}" x2="${r1(X(xMax) + 6)}" y2="${r1(Y(y0))}"/>`;
  c += `<line class="trait" x1="${r1(X(xMin))}" y1="${r1(Y(yMin))}" x2="${r1(X(xMin))}" y2="${r1(Y(yMax) - 6)}"/>`;
  c += `<text class="graduation-texte" x="${W - d}" y="${H - 6}" text-anchor="end">${esc(titreX)}</text>`;
  c += `<text class="graduation-texte" x="${g - 30}" y="${h - 12}" text-anchor="start">${esc(titreY)}</text>`;
  for (const s of series) {
    const pts = s.points.map(([x, y]) => `${r1(X(x))},${r1(Y(y))}`).join(' ');
    c += `<polyline class="${s.classe || 'trait-accent'}" fill="none" stroke-linejoin="round" points="${pts}"/>`;
  }
  if (repere) {
    c += `<line class="aide" x1="${r1(X(xMin))}" y1="${r1(Y(repere.y))}" x2="${r1(X(repere.x))}" y2="${r1(Y(repere.y))}"/>`;
  }
  return svg(W, H, c, { titre: titreY && titreX ? `Graphique : ${titreY} en fonction de ${titreX}` : 'Graphique' });
}

/**
 * Chronophotographie : positions successives d'un objet, à intervalles de temps égaux.
 * positions : abscisses en « unités » (la figure s'adapte), une flèche indique le sens.
 */
export function chronophoto(positions, { legende = '' } = {}) {
  const W = 340, H = 90, g = 20, d = 20;
  const max = Math.max(...positions);
  const X = p => g + (p / max) * (W - g - d);
  let c = `<line class="graduation" x1="${g - 8}" y1="50" x2="${W - 6}" y2="50"/>`;
  positions.forEach((p, k) => {
    c += `<circle class="point-plein" cx="${r1(X(p))}" cy="50" r="6"/>`;
    c += `<text class="graduation-texte" x="${r1(X(p))}" y="74" text-anchor="middle">${k + 1}</text>`;
  });
  c += `<path class="fleche" d="M${g} 22 H${g + 50}"/><path class="fleche-pointe" d="M${g + 58} 22 l-9 -5 v10 z"/>`;
  if (legende) c += `<text class="graduation-texte" x="${W - d}" y="22" text-anchor="end">${esc(legende)}</text>`;
  return svg(W, H, c, { titre: 'Chronophotographie' });
}

// ---------- Schémas électriques ----------

// Symbole normalisé d'un dipôle, centré en (x, y), horizontal, fils de raccordement de longueur « l »
function dipole(type, x, y, l = 20) {
  const t = 'class="trait"';
  let s = '';
  switch (type) {
    case 'lampe':
      s = `<circle ${t} cx="${x}" cy="${y}" r="13"/><path ${t} d="M${x - 9} ${y - 9}L${x + 9} ${y + 9}M${x - 9} ${y + 9}L${x + 9} ${y - 9}"/>`;
      break;
    case 'resistance':
      s = `<rect ${t} x="${x - 18}" y="${y - 8}" width="36" height="16"/>`;
      break;
    case 'moteur':
      s = `<circle ${t} cx="${x}" cy="${y}" r="13"/><text class="etiquette" x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="middle" font-weight="800">M</text>`;
      break;
    case 'pile':
      s = `<line ${t} x1="${x - 4}" y1="${y - 16}" x2="${x - 4}" y2="${y + 16}"/><line class="trait" stroke-width="5" x1="${x + 5}" y1="${y - 8}" x2="${x + 5}" y2="${y + 8}"/>`;
      break;
    case 'interrupteur-ouvert':
      s = `<circle class="point-plein" cx="${x - 14}" cy="${y}" r="2.5"/><circle class="point-plein" cx="${x + 14}" cy="${y}" r="2.5"/><line ${t} x1="${x - 14}" y1="${y}" x2="${x + 12}" y2="${y - 14}"/>`;
      break;
    case 'interrupteur-ferme':
      s = `<circle class="point-plein" cx="${x - 14}" cy="${y}" r="2.5"/><circle class="point-plein" cx="${x + 14}" cy="${y}" r="2.5"/><line ${t} x1="${x - 14}" y1="${y}" x2="${x + 14}" y2="${y}"/>`;
      break;
    case 'del':
      s = `<path ${t} d="M${x - 10} ${y - 11}L${x + 8} ${y}L${x - 10} ${y + 11}Z M${x + 8} ${y - 11}V${y + 11}"/>`
        + `<path class="fleche" d="M${x + 2} ${y - 14} l7 -9 M${x + 9} ${y - 12} l7 -9"/>`;
      break;
    case 'diode':
      s = `<path ${t} d="M${x - 10} ${y - 11}L${x + 8} ${y}L${x - 10} ${y + 11}Z M${x + 8} ${y - 11}V${y + 11}"/>`;
      break;
    case 'generateur':
      s = `<circle ${t} cx="${x}" cy="${y}" r="13"/><line ${t} x1="${x}" y1="${y - 8}" x2="${x}" y2="${y + 8}"/>`;
      break;
    default:
      s = '';
  }
  // Demi-largeur du symbole : les fils partent de là
  const demi = { pile: 4, resistance: 18, del: 10, diode: 10 }[type] ?? 14;
  return `<line class="trait" x1="${x - l}" y1="${y}" x2="${x - demi}" y2="${y}"/><line class="trait" x1="${x + demi}" y1="${y}" x2="${x + l}" y2="${y}"/>` + s;
}

// Symbole seul (QCM « quel est ce dipôle ? »)
export function symbole(type) {
  return svg(160, 70, dipole(type, 80, 38, 55), { titre: 'Symbole électrique' });
}

/**
 * Circuit en série : la pile à gauche, les dipôles en haut, à droite et en bas.
 * dipoles : [{ type, nom }] (2 ou 3 éléments).
 */
export function circuitSerie(dipoles) {
  const W = 340, H = 200, x0 = 50, x1 = 290, y0 = 40, y1 = 160;
  const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
  const places = dipoles.length === 2 ? ['haut', 'bas'] : ['haut', 'droite', 'bas'];
  const occupe = p => places.includes(p);
  let d = `M${x0} ${y0}V${ym - 20} M${x0} ${ym + 20}V${y1}`;
  d += occupe('bas') ? `H${xm - 20} M${xm + 20} ${y1}H${x1}` : `H${x1}`;
  d += occupe('droite') ? `V${ym + 20} M${x1} ${ym - 20}V${y0}` : `V${y0}`;
  d += occupe('haut') ? `H${xm + 20} M${xm - 20} ${y0}H${x0}` : `H${x0}`;
  let c = `<path class="trait" d="${d}"/>`;
  c += `<g transform="rotate(-90 ${x0} ${ym})">${dipole('pile', x0, ym)}</g>`;
  c += `<text class="graduation-texte" x="${x0 - 16}" y="${ym + 16}" text-anchor="middle">+</text>`;
  const pos = { haut: { x: xm, y: y0, rot: 0 }, droite: { x: x1, y: ym, rot: 90 }, bas: { x: xm, y: y1, rot: 0 } };
  dipoles.forEach((dp, k) => {
    const p = pos[places[k]];
    c += `<g transform="rotate(${p.rot} ${p.x} ${p.y})">${dipole(dp.type, p.x, p.y)}</g>`;
    if (dp.nom) {
      const lx = p.rot ? p.x - 34 : p.x, ly = p.rot ? p.y + 5 : p.y + (p.y === y0 ? 36 : -24);
      c += `<text class="longueur" x="${lx}" y="${ly}" text-anchor="middle">${esc(dp.nom)}</text>`;
    }
  });
  return svg(W, H, c, { titre: 'Circuit en série' });
}

/**
 * Circuit avec deux branches en dérivation aux bornes de la pile.
 * branches : [{ type, nom }, { type, nom }]
 */
export function circuitDerivation(branches) {
  const W = 340, H = 220, x0 = 50, x1 = 190, x2 = 290, y0 = 40, y1 = 180;
  const ym = (y0 + y1) / 2;
  const d = `M${x0} ${y0}V${ym - 20} M${x0} ${ym + 20}V${y1}H${x2} M${x0} ${y0}H${x2}`
    + ` M${x1} ${y0}V${ym - 20} M${x1} ${ym + 20}V${y1} M${x2} ${y0}V${ym - 20} M${x2} ${ym + 20}V${y1}`;
  let c = `<path class="trait" d="${d}"/>`;
  c += `<g transform="rotate(-90 ${x0} ${ym})">${dipole('pile', x0, ym)}</g>`;
  c += `<text class="graduation-texte" x="${x0 - 16}" y="${ym + 16}" text-anchor="middle">+</text>`;
  c += `<circle class="point-plein" cx="${x1}" cy="${y0}" r="4"/><circle class="point-plein" cx="${x1}" cy="${y1}" r="4"/>`;
  [x1, x2].forEach((x, k) => {
    c += `<g transform="rotate(90 ${x} ${ym})">${dipole(branches[k].type, x, ym)}</g>`;
    if (branches[k].nom) c += `<text class="longueur" x="${x - 32}" y="${ym + 5}" text-anchor="middle">${esc(branches[k].nom)}</text>`;
  });
  return svg(W, H, c, { titre: 'Circuit avec deux branches en dérivation' });
}
