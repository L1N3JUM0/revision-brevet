// Générateur : Scratch — lire un script (aller à, s'orienter, avancer, tourner, répéter, ajouter à x/y)
// et trouver les coordonnées (ou la case) d'arrivée du lutin.
// Orientation Scratch : 90 = vers la droite, 0 = vers le haut, 180 = vers le bas, -90 = vers la gauche.
import { fmt } from '../../assets/js/core/answer.js';
import { svg } from '../../assets/js/core/svg.js';

const gras = s => `<strong>${s}</strong>`;
const PAS = [20, 30, 40, 50, 60, 80, 100];

// ---------- Simulation ----------

const DEPLACEMENT = { 0: [0, 1], 90: [1, 0], 180: [0, -1], '-90': [-1, 0] };
const normaliser = d => {
  let r = ((d % 360) + 360) % 360;
  if (r > 180) r -= 360;
  return r === -180 ? 180 : r;
};

/**
 * Exécute le programme. options : { inverserTours, uneFois, repereMaths } pour simuler les erreurs fréquentes.
 * Renvoie { x, y, dir, trace: [{ texte, x, y, dir }], chemin: [[x, y]…] }
 */
function executer(prog, options = {}) {
  const e = { x: 0, y: 0, dir: 90 };
  const trace = [];
  const chemin = [];
  const exec = (liste, profondeur) => {
    for (const ins of liste) {
      switch (ins.op) {
        case 'aller': e.x = ins.x; e.y = ins.y; chemin.push([e.x, e.y]); break;
        case 'orienter': e.dir = options.repereMaths ? normaliser(90 - ins.d) : ins.d; break;
        case 'avancer': {
          const [dx, dy] = DEPLACEMENT[normaliser(e.dir)];
          e.x += dx * ins.n; e.y += dy * ins.n;
          chemin.push([e.x, e.y]);
          break;
        }
        case 'tourner': {
          const sens = (ins.sens === 'd') !== !!options.inverserTours ? 1 : -1;
          e.dir = normaliser(e.dir + sens * ins.d);
          break;
        }
        case 'ajouterX': e.x += ins.n; chemin.push([e.x, e.y]); break;
        case 'ajouterY': e.y += ins.n; chemin.push([e.x, e.y]); break;
        case 'repeter': {
          const n = options.uneFois ? 1 : ins.n;
          for (let k = 1; k <= n; k++) {
            exec(ins.corps, profondeur + 1);
            trace.push({ texte: `Boucle : tour ${k}`, x: e.x, y: e.y, dir: e.dir, boucle: true });
          }
          continue;
        }
      }
      if (profondeur === 0) trace.push({ texte: texteInstruction(ins), x: e.x, y: e.y, dir: e.dir });
    }
  };
  exec(prog, 0);
  return { x: e.x, y: e.y, dir: e.dir, trace, chemin };
}

// Contrôle indépendant : même programme, calcul trigonométrique
function executerTrigo(prog) {
  let x = 0, y = 0, dir = 90;
  const exec = liste => {
    for (const ins of liste) {
      if (ins.op === 'aller') { x = ins.x; y = ins.y; }
      else if (ins.op === 'orienter') dir = ins.d;
      else if (ins.op === 'avancer') {
        x += ins.n * Math.sin(dir * Math.PI / 180);
        y += ins.n * Math.cos(dir * Math.PI / 180);
      } else if (ins.op === 'tourner') dir += (ins.sens === 'd' ? 1 : -1) * ins.d;
      else if (ins.op === 'ajouterX') x += ins.n;
      else if (ins.op === 'ajouterY') y += ins.n;
      else if (ins.op === 'repeter') for (let k = 0; k < ins.n; k++) exec(ins.corps);
    }
  };
  exec(prog);
  return { x: Math.round(x * 1e6) / 1e6, y: Math.round(y * 1e6) / 1e6 };
}

// ---------- Affichage des blocs ----------

const val = v => `<span class="sv">${String(v)}</span>`;

function texteInstruction(ins) {
  switch (ins.op) {
    case 'aller': return `aller à x: ${ins.x} y: ${ins.y}`;
    case 'orienter': return `s'orienter à ${ins.d}`;
    case 'avancer': return `avancer de ${ins.n}`;
    case 'tourner': return `tourner ${ins.sens === 'd' ? '↻' : '↺'} de ${ins.d} degrés`;
    case 'ajouterX': return `ajouter ${ins.n} à x`;
    case 'ajouterY': return `ajouter ${ins.n} à y`;
    default: return '';
  }
}

function bloc(ins) {
  switch (ins.op) {
    case 'aller': return `<div class="sb mvt">aller à x: ${val(ins.x)} y: ${val(ins.y)}</div>`;
    case 'orienter': return `<div class="sb mvt">s'orienter à ${val(ins.d)}</div>`;
    case 'avancer': return `<div class="sb mvt">avancer de ${val(ins.n)} pas</div>`;
    case 'tourner': return `<div class="sb mvt">tourner ${ins.sens === 'd' ? '↻' : '↺'} de ${val(ins.d)} degrés</div>`;
    case 'ajouterX': return `<div class="sb mvt">ajouter ${val(ins.n)} à x</div>`;
    case 'ajouterY': return `<div class="sb mvt">ajouter ${val(ins.n)} à y</div>`;
    case 'repeter': return `<div class="sb ctl"><div class="sb-tete">répéter ${val(ins.n)} fois</div><div class="sb-corps">${ins.corps.map(bloc).join('')}</div><div class="sb-pied"></div></div>`;
    default: return '';
  }
}

function script(prog) {
  return `<div class="scratch" role="img" aria-label="Script Scratch">
    <div class="sb evt">quand <span class="drapeau">⚑</span> est cliqué</div>
    ${prog.map(bloc).join('')}
  </div>`;
}

// ---------- Figures ----------

// Scène Scratch (480 × 360) réduite, avec quadrillage de 20 en 20 et graduations
function scene(depart, dir, chemin = null, arrivee = null) {
  const k = 0.7, W = 480 * k, H = 360 * k;
  const X = x => (x + 240) * k, Y = y => (180 - y) * k;
  let c = '';
  for (let x = -240; x <= 240; x += 20) c += `<line class="${x === 0 ? 'axe' : x % 100 === 0 ? 'grille-forte' : 'grille'}" x1="${X(x)}" y1="0" x2="${X(x)}" y2="${H}"/>`;
  for (let y = -180; y <= 180; y += 20) c += `<line class="${y === 0 ? 'axe' : y % 100 === 0 ? 'grille-forte' : 'grille'}" x1="0" y1="${Y(y)}" x2="${W}" y2="${Y(y)}"/>`;
  for (const x of [-200, -100, 100, 200]) c += `<text class="graduation-texte" x="${X(x)}" y="${Y(0) + 12}" text-anchor="middle">${x}</text>`;
  for (const y of [-100, 100]) c += `<text class="graduation-texte" x="${X(0) + 4}" y="${Y(y) + 4}">${y}</text>`;
  c += `<text class="graduation-texte" x="${W - 10}" y="${Y(0) - 5}">x</text><text class="graduation-texte" x="${X(0) + 5}" y="10">y</text>`;
  if (chemin && chemin.length > 1) {
    c += `<polyline class="trajet" points="${chemin.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')}"/>`;
  }
  c += lutin(X(depart.x), Y(depart.y), dir, 'lutin-depart');
  if (arrivee) c += `<circle class="lutin-arrivee" cx="${X(arrivee.x)}" cy="${Y(arrivee.y)}" r="6"/>`;
  return svg(W, H, c, { titre: 'Scène Scratch' });
}

// Petit triangle orienté (le lutin)
function lutin(cx, cy, dir, classe) {
  const a = dir * Math.PI / 180;
  const pts = [[0, -11], [7, 7], [-7, 7]].map(([px, py]) => {
    const x = px * Math.cos(a) - py * Math.sin(a), y = px * Math.sin(a) + py * Math.cos(a);
    return `${(cx + x).toFixed(1)},${(cy + y).toFixed(1)}`;
  });
  return `<polygon class="${classe}" points="${pts.join(' ')}"/>`;
}

// ---------- Génération des programmes ----------

function dansScene(prog) {
  const r = executer(prog);
  return r.chemin.every(([x, y]) => Math.abs(x) <= 220 && Math.abs(y) <= 160);
}

function depart(rng) {
  return { op: 'aller', x: 10 * rng.int(-15, 15), y: 10 * rng.int(-10, 10) };
}
const orienter = rng => ({ op: 'orienter', d: rng.choix([90, 0, 180, -90]) });
const avancer = rng => ({ op: 'avancer', n: rng.choix(PAS) });
const tourner = rng => ({ op: 'tourner', sens: rng.choix(['d', 'g']), d: 90 });

function programme(rng, niveau) {
  for (;;) {
    const prog = [depart(rng), orienter(rng)];
    if (niveau === 1) {
      const n = rng.int(3, 5);
      for (let k = 0; k < n; k++) prog.push(k % 2 === 0 ? avancer(rng) : tourner(rng));
    } else if (niveau === 2) {
      if (rng.bool(0.3)) prog.push(avancer(rng));
      if (rng.bool(0.7)) {
        prog.push({ op: 'repeter', n: rng.int(2, 4), corps: [avancer(rng), tourner(rng)] });
      } else {
        prog.push({ op: 'repeter', n: rng.int(2, 5), corps: [{ op: 'ajouterX', n: 10 * rng.int(-6, 6) || 30 }, { op: 'ajouterY', n: 10 * rng.int(-5, 5) || -20 }] });
      }
      if (rng.bool(0.5)) prog.push(avancer(rng));
    } else {
      const sens = rng.choix(['d', 'g']);
      const autre = sens === 'd' ? 'g' : 'd';
      const a = rng.choix([20, 30, 40]), b = rng.choix([20, 30, 40, 50]);
      prog.push({
        op: 'repeter', n: rng.int(3, 5),
        corps: [{ op: 'avancer', n: a }, { op: 'tourner', sens, d: 90 }, { op: 'avancer', n: b }, { op: 'tourner', sens: autre, d: 90 }]
      });
      if (rng.bool(0.6)) prog.push(rng.bool() ? { op: 'ajouterY', n: 10 * rng.int(-8, 8) || 40 } : tourner(rng), avancer(rng));
    }
    const r = executer(prog);
    const d0 = prog[0];
    if (dansScene(prog) && (r.x !== d0.x || r.y !== d0.y)) return prog;
  }
}

// Tableau de suivi (position après chaque instruction)
function tableauSuivi(trace, depart0) {
  const lignes = trace.map(t => `<tr${t.boucle ? ' class="boucle"' : ''}><td>${t.texte}</td><td>(${fmt(t.x)} ; ${fmt(t.y)})</td><td>${t.dir}</td></tr>`).join('');
  return `<div class="tableau-conv-cadre"><table class="suivi"><tr><th>Instruction</th><th>Position</th><th>Orient.</th></tr>${lignes}</table></div>`;
}

const NOM_DIR = { 90: 'vers la droite', 0: 'vers le haut', 180: 'vers le bas', '-90': 'vers la gauche' };

// ---------- Exercice « coordonnées d'arrivée » ----------

function exoCoordonnees(rng, niveau) {
  const prog = programme(rng, niveau);
  const r = executer(prog);
  const dep = prog[0], or = prog[1];
  const reponse = { x: r.x, y: r.y };

  const erreurs = [];
  const ajouter = (p, message) => {
    if ((p.x === r.x && p.y === r.y) || erreurs.some(e => e.x === p.x && e.y === p.y)) return;
    erreurs.push({ x: p.x, y: p.y, test: v => v && Math.abs(v.x - p.x) < 1e-9 && Math.abs(v.y - p.y) < 1e-9, message });
  };
  ajouter(executer(prog, { inverserTours: true }), '↻ tourne dans le sens des aiguilles d\'une montre (vers la droite), ↺ dans l\'autre sens.');
  if (prog.some(i => i.op === 'repeter')) ajouter(executer(prog, { uneFois: true }), 'Tu n\'as fait la boucle qu\'une fois : « répéter » refait tout son contenu plusieurs fois.');
  ajouter(executer(prog, { repereMaths: true }), 'En Scratch, l\'orientation 90 est <strong>vers la droite</strong> et 0 est <strong>vers le haut</strong>.');
  ajouter({ x: r.y, y: r.x }, 'Tu as inversé x et y : on écrit d\'abord l\'<strong>abscisse</strong> x, puis l\'ordonnée y.');

  return {
    cle: `coord:${niveau}:${JSON.stringify(prog)}`,
    enonce: `<p>Le lutin exécute ce script :</p>${script(prog)}
      <p><strong>Quelles sont les coordonnées du lutin à la fin ?</strong></p>
      <p class="doux petit">Écris (x ; y). Le triangle montre le lutin au départ, déjà orienté.</p>`,
    figure: scene({ x: dep.x, y: dep.y }, or.d),
    type: 'point',
    reponse,
    etapes: [
      `Départ : (${fmt(dep.x)} ; ${fmt(dep.y)}), orienté à ${or.d}, donc ${NOM_DIR[or.d]}.`,
      'Rappel : 90 = droite, 0 = haut, 180 = bas, −90 = gauche. ↻ = +90, ↺ = −90.',
      tableauSuivi(r.trace, dep),
      scene({ x: dep.x, y: dep.y }, or.d, r.chemin, reponse),
      `À la fin, le lutin est en ${gras(`(${fmt(r.x)} ; ${fmt(r.y)})`)}.`
    ],
    erreurs: erreurs.map(({ test, message }) => ({ test, message })),
    donnees: { type: 'coord', prog }
  };
}

// ---------- Exercice « case d'arrivée » (quadrillage A–H, 1–8) ----------

const COLONNES = 'ABCDEFGH';
const TAILLE_CASE = 40;
const centre = (col, lig) => ({ x: -140 + TAILLE_CASE * col, y: -140 + TAILLE_CASE * lig });
const nomCase = (x, y) => {
  const col = (x + 140) / TAILLE_CASE, lig = (y + 140) / TAILLE_CASE;
  if (!Number.isInteger(col) || !Number.isInteger(lig) || col < 0 || col > 7 || lig < 0 || lig > 7) return null;
  return `${COLONNES[col]}${lig + 1}`;
};

function quadrillage(depCase, dir, chemin = null, arrivee = null) {
  const t = 34, o = 22, W = o + 8 * t + 8, H = 8 * t + o + 6;
  const X = x => o + ((x + 140) / TAILLE_CASE + 0.5) * t;
  const Y = y => 6 + (7 - (y + 140) / TAILLE_CASE + 0.5) * t;
  let c = '';
  for (let i = 0; i <= 8; i++) {
    c += `<line class="grille-forte" x1="${o + i * t}" y1="6" x2="${o + i * t}" y2="${6 + 8 * t}"/>`;
    c += `<line class="grille-forte" x1="${o}" y1="${6 + i * t}" x2="${o + 8 * t}" y2="${6 + i * t}"/>`;
  }
  for (let i = 0; i < 8; i++) {
    c += `<text class="graduation-texte" x="${o + i * t + t / 2}" y="${H - 4}" text-anchor="middle">${COLONNES[i]}</text>`;
    c += `<text class="graduation-texte" x="${o - 8}" y="${6 + (7 - i) * t + t / 2 + 4}" text-anchor="middle">${i + 1}</text>`;
  }
  if (chemin && chemin.length > 1) c += `<polyline class="trajet" points="${chemin.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')}"/>`;
  c += lutin(X(depCase.x), Y(depCase.y), dir, 'lutin-depart');
  if (arrivee) c += `<circle class="lutin-arrivee" cx="${X(arrivee.x)}" cy="${Y(arrivee.y)}" r="6"/>`;
  return svg(W, H, c, { titre: 'Quadrillage' });
}

function exoCase(rng) {
  for (;;) {
    const col = rng.int(0, 7), lig = rng.int(0, 7);
    const p0 = centre(col, lig);
    const prog = [{ op: 'aller', x: p0.x, y: p0.y }, orienter(rng)];
    const sens = rng.choix(['d', 'g']);
    const pas = () => TAILLE_CASE * rng.int(1, 3);
    if (rng.bool()) {
      prog.push({ op: 'repeter', n: rng.int(2, 3), corps: [{ op: 'avancer', n: pas() }, { op: 'tourner', sens, d: 90 }] });
      prog.push({ op: 'avancer', n: pas() });
    } else {
      prog.push({ op: 'avancer', n: pas() }, { op: 'tourner', sens, d: 90 }, { op: 'avancer', n: pas() },
        { op: 'tourner', sens: rng.choix(['d', 'g']), d: 90 }, { op: 'avancer', n: pas() });
    }
    const r = executer(prog);
    if (!r.chemin.every(([x, y]) => nomCase(x, y))) continue;
    const arrivee = nomCase(r.x, r.y);
    if (arrivee === nomCase(p0.x, p0.y)) continue;

    const erreurs = [];
    const faux = (p, message) => {
      const n = nomCase(p.x, p.y);
      if (n && n !== arrivee && !erreurs.some(e => e.n === n)) erreurs.push({ n, test: v => String(v).trim().toUpperCase() === n, message });
    };
    faux(executer(prog, { inverserTours: true }), '↻ tourne vers la droite (sens des aiguilles d\'une montre), ↺ vers la gauche.');
    if (prog.some(i => i.op === 'repeter')) faux(executer(prog, { uneFois: true }), 'La boucle « répéter » doit être faite plusieurs fois.');
    faux(executer(prog, { repereMaths: true }), 'En Scratch, 90 = vers la droite et 0 = vers le haut.');

    return {
      cle: `case:${JSON.stringify(prog)}`,
      enonce: `<p>Le lutin est au centre de la case <strong>${nomCase(p0.x, p0.y)}</strong>. Une case mesure ${TAILLE_CASE} pas. Il exécute ce script :</p>${script(prog.slice(1))}
        <p><strong>Dans quelle case arrive-t-il ?</strong></p><p class="doux petit">Réponds par une lettre et un chiffre, par exemple D5.</p>`,
      figure: quadrillage(p0, prog[1].d),
      type: 'texte-court',
      reponse: arrivee,
      etapes: [
        `${TAILLE_CASE} pas = 1 case. Départ en ${nomCase(p0.x, p0.y)}, orienté ${NOM_DIR[prog[1].d]}.`,
        ...r.trace.filter(t => !t.texte.startsWith('aller')).map(t => `${t.texte} → ${nomCase(t.x, t.y) ?? 'hors du quadrillage'}${t.boucle ? '' : `, orienté ${NOM_DIR[t.dir]}`}`),
        quadrillage(p0, prog[1].d, r.chemin, { x: r.x, y: r.y }),
        `Le lutin arrive en ${gras(arrivee)}.`
      ],
      erreurs: erreurs.map(({ test, message }) => ({ test, message })),
      donnees: { type: 'case', prog }
    };
  }
}

// ---------- Export ----------

export default {
  id: 'scratch',
  titre: 'Scratch',
  resume: 'Lire un script et trouver où arrive le lutin.',
  niveaux: 3,
  nomsNiveaux: ['Sans boucle', 'Avec une boucle', 'Type brevet'],
  cours: [
    {
      titre: 'La scène et l\'orientation',
      contenu: `<p>La scène est un <strong>repère</strong> : x va de −240 à 240, y de −180 à 180. Le centre est (0 ; 0).</p>
        <ul><li><strong>90</strong> : vers la droite</li><li><strong>0</strong> : vers le haut</li><li><strong>180</strong> : vers le bas</li><li><strong>−90</strong> : vers la gauche</li></ul>`,
      figure: scene({ x: 0, y: 0 }, 90)
    },
    {
      titre: 'Les blocs de mouvement',
      contenu: `${script([{ op: 'aller', x: -60, y: 20 }, { op: 'orienter', d: 90 }, { op: 'avancer', n: 50 }, { op: 'tourner', sens: 'g', d: 90 }, { op: 'avancer', n: 30 }])}
        <p>Départ (−60 ; 20) vers la droite → avancer de 50 : (−10 ; 20) → tourner ↺ : vers le haut → avancer de 30 : <strong>(−10 ; 50)</strong>.</p>`
    },
    {
      titre: 'La boucle « répéter »',
      contenu: `${script([{ op: 'aller', x: 0, y: 0 }, { op: 'orienter', d: 0 }, { op: 'repeter', n: 4, corps: [{ op: 'avancer', n: 40 }, { op: 'tourner', sens: 'd', d: 90 }] }])}
        <p>Tout ce qui est dans la boucle est fait <strong>4 fois</strong>. Ici, le lutin trace un carré et revient à (0 ; 0).</p>
        <p class="piege">Méthode : fais un tableau avec la position et l'orientation après chaque bloc.</p>`
    }
  ],
  generer(niveau, rng) {
    if (niveau === 3 && rng.bool(0.4)) return exoCase(rng);
    return exoCoordonnees(rng, niveau);
  },

  // Contrôle indépendant : simulation trigonométrique du même programme
  controler(exo) {
    const r = executerTrigo(exo.donnees.prog);
    if (exo.donnees.type === 'coord') {
      return Math.abs(r.x - exo.reponse.x) < 1e-6 && Math.abs(r.y - exo.reponse.y) < 1e-6 ? null : `trigo (${r.x} ; ${r.y})`;
    }
    const n = nomCase(r.x, r.y);
    return n === exo.reponse ? null : `trigo : case ${n}, réponse ${exo.reponse}`;
  }
};
