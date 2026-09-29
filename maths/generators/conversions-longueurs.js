// Générateur : conversions de longueurs (mm → km), avec tableau de conversion dans la correction.
// Chaque longueur est d'abord un nombre entier de millimètres : les conversions sont exactes.
import { fmt } from '../../assets/js/core/answer.js';

const UNITES = ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'];
const idx = u => UNITES.indexOf(u);
const gras = s => `<strong>${s}</strong>`;

// Nombre de millimètres -> valeur dans l'unité u (exacte, sans bruit de flottant)
function versUnite(mm, u) {
  return Number((mm / 10 ** (6 - idx(u))).toFixed(8));
}
// Valeur dans l'unité u -> millimètres (entier)
function versMm(v, u) {
  return Math.round(v * 10 ** (6 - idx(u)));
}

// Nombre de décimales d'une valeur
function decimales(x) {
  const s = String(x);
  return s.includes('.') ? s.split('.')[1].length : 0;
}

// ---------- Tableau de conversion ----------

/**
 * Tableau km … mm : les chiffres de la longueur (en mm) sont placés à partir de la colonne mm.
 * La colonne de l'unité de départ est encadrée, celle d'arrivée est colorée et porte la virgule.
 */
function tableau(mm, depart, arrivee) {
  const chiffres = String(mm).split('');
  const nbColonnes = Math.max(7, chiffres.length);
  const decal = nbColonnes - 7; // colonnes sans nom à gauche de km (très grandes longueurs)
  const entetes = [...Array(decal).fill(''), ...UNITES];
  const cases = Array(nbColonnes).fill('');
  chiffres.forEach((c, k) => { cases[nbColonnes - chiffres.length + k] = c; });
  // Zéros à gauche jusqu'à la colonne de l'unité la plus grande des deux
  const gauche = decal + Math.min(idx(depart), idx(arrivee));
  for (let k = gauche; k < nbColonnes; k++) if (cases[k] === '') cases[k] = '0';

  const col = u => decal + idx(u);
  const th = entetes.map((e, k) => `<th class="${k === col(arrivee) ? 'cible' : ''}${k === col(depart) ? ' depart' : ''}">${e}</th>`).join('');
  const td = cases.map((c, k) => `<td class="${k === col(arrivee) ? 'cible' : ''}${k === col(depart) ? ' depart' : ''}">${c}</td>`).join('');
  return `<div class="tableau-conv-cadre"><table class="tableau-conv"><tr>${th}</tr><tr>${td}</tr></table></div>`;
}

// Étapes communes d'une conversion simple
function etapesConversion(v, depart, arrivee) {
  const mm = versMm(v, depart);
  const r = versUnite(mm, arrivee);
  const n = idx(arrivee) - idx(depart);
  const facteur = 10 ** Math.abs(n);
  const op = n > 0 ? '×' : '÷';
  const sens = n > 0
    ? `L'unité est plus petite, donc le nombre devient plus grand : on <strong>multiplie par ${fmt(facteur)}</strong>`
    : `L'unité est plus grande, donc le nombre devient plus petit : on <strong>divise par ${fmt(facteur)}</strong>`;
  const expression = `${fmt(v)} ${op} ${fmt(facteur)}`;
  return {
    r,
    expression,
    etapes: [
      `De ${depart} à ${arrivee}, il y a ${Math.abs(n)} rang${Math.abs(n) > 1 ? 's' : ''}. ${sens}.`,
      `Dans le tableau, le chiffre des unités de ${fmt(v)} va dans la colonne <strong>${depart}</strong> (encadrée). On lit le nombre avec la virgule juste après la colonne <strong>${arrivee}</strong> (colorée) :`,
      tableau(mm, depart, arrivee),
      `${expression} = ${fmt(r)}, donc ${fmt(v)} ${depart} = ${gras(fmt(r))} ${arrivee}`
    ],
    n,
    facteur
  };
}

function erreursConversion(v, n, facteur, r, depart, arrivee) {
  const liste = [];
  const ajouter = (x, message) => {
    x = Number(x.toFixed(8));
    if (x !== r && !liste.some(e => e.x === x)) liste.push({ x, test: val => typeof val === 'number' && Math.abs(val - x) < 1e-9, message });
  };
  ajouter(n > 0 ? v / facteur : v * facteur,
    `Mauvais sens : ${n > 0 ? `le ${arrivee} est plus petit que le ${depart}, il en faut <strong>plus</strong>` : `le ${arrivee} est plus grand que le ${depart}, il en faut <strong>moins</strong>`}.`);
  const rangs = Math.abs(n);
  for (const autre of [rangs - 1, rangs + 1]) {
    if (autre < 0) continue;
    ajouter(n > 0 ? v * 10 ** autre : v / 10 ** autre,
      `Compte bien les rangs : entre ${depart} et ${arrivee}, il y en a <strong>${rangs}</strong>, donc on ${n > 0 ? 'multiplie' : 'divise'} par ${fmt(facteur)}.`);
  }
  return liste.map(({ test, message }) => ({ test, message }));
}

// ---------- Conversion simple (niveaux 1 et 2) ----------

function exoConversion(rng, niveau) {
  let depart, arrivee, v, r, mm;
  for (;;) {
    depart = rng.choix(UNITES);
    arrivee = rng.choix(UNITES);
    const ecart = Math.abs(idx(depart) - idx(arrivee));
    if (ecart === 0 || (niveau === 1 && ecart > 3) || (niveau === 2 && ecart < 2)) continue;
    // Valeur : entier ou décimal selon le niveau
    const forme = niveau === 1 ? rng.choix(['entier', 'entier', 'dixieme']) : rng.choix(['entier', 'dixieme', 'centieme', 'millieme']);
    const brut = rng.int(1, forme === 'entier' ? 999 : 9999);
    const div = { entier: 1, dixieme: 10, centieme: 100, millieme: 1000 }[forme];
    v = Number((brut / div).toFixed(3));
    mm = versMm(v, depart);
    if (Math.abs(mm - v * 10 ** (6 - idx(depart))) > 1e-6) continue; // plus fin que le mm
    r = versUnite(mm, arrivee);
    if (decimales(r) > 6 || r >= 1e6) continue; // pas de nombres démesurés
    if (niveau === 1 && decimales(r) > 3) continue;
    break;
  }
  const c = etapesConversion(v, depart, arrivee);
  return {
    cle: `conv:${v}:${depart}:${arrivee}`,
    enonce: `<p>Convertis :</p><p class="calcul">${fmt(v)} ${depart} = … ${arrivee}</p>`,
    type: 'nombre',
    unite: arrivee,
    reponse: r,
    etapes: c.etapes,
    erreurs: erreursConversion(v, c.n, c.facteur, r, depart, arrivee),
    expression: c.expression,
    donnees: { mm, arrivee }
  };
}

// ---------- Problèmes (niveau 3) ----------

// Plusieurs longueurs dans des unités différentes, à additionner dans une unité imposée
const SOMMES = [
  {
    themes: ['mode', 'commerce'], cible: 'cm', plage: [200, 1500], unites: ['m', 'cm', 'dm'],
    texte: (ctx, t) => `Pour une robe, ${ctx.prenom} achète trois coupons de tissu : ${t[0]}, ${t[1]} et ${t[2]}.`,
    question: ctx => `Quelle longueur de tissu a-t-${ctx.il()} en tout, en cm ?`,
    concl: r => `Il y a ${r} cm de tissu en tout.`
  },
  {
    themes: ['famille'], cible: 'cm', plage: [300, 1500], unites: ['m', 'dm', 'mm'],
    texte: (ctx, t) => `Pour emballer les cadeaux d'anniversaire ${ctx.deAmi}, ${ctx.prenom} utilise trois rubans : ${t[0]}, ${t[1]} et ${t[2]}.`,
    question: () => 'Quelle longueur de ruban a-t-il fallu en tout, en cm ?',
    concl: r => `Il a fallu ${r} cm de ruban.`
  },
  {
    themes: ['handball', 'sport', 'records'], cible: 'm', plage: [200000, 1500000], unites: ['km', 'm', 'dam'],
    texte: (ctx, t) => `À l'entraînement de hand, l'équipe ${ctx.de} fait un relais en trois parties : ${t[0]}, ${t[1]} puis ${t[2]}.`,
    question: () => 'Quelle distance totale l\'équipe a-t-elle parcourue, en m ?',
    concl: r => `L'équipe a parcouru ${r} m.`
  },
  {
    themes: ['chevaux'], cible: 'm', plage: [5000, 40000], unites: ['hm', 'm', 'dm'],
    texte: (ctx, t) => `Au centre équestre, ${ctx.prenom} répare la clôture du paddock en trois morceaux : ${t[0]}, ${t[1]} et ${t[2]}.`,
    question: ctx => `Quelle longueur de clôture a-t-${ctx.il()} réparée, en m ?`,
    concl: r => `${r} m de clôture ont été réparés.`
  },
  {
    themes: ['voyages', 'grece', 'animaux', 'espace'], cible: 'km', plage: [500000, 5000000], unites: ['km', 'm', 'hm'],
    texte: (ctx, t) => `En randonnée près de Delphes, la famille ${ctx.de} marche ${t[0]}, puis ${t[1]}, puis encore ${t[2]}.`,
    question: () => 'Quelle distance la famille a-t-elle parcourue en tout, en km ?',
    concl: r => `La famille a parcouru ${r} km.`
  },
  {
    themes: ['rap', 'jeux-video'], cible: 'm', plage: [5000, 50000], unites: ['m', 'dm', 'cm'],
    texte: (ctx, t) => `Pour la scène du concert de JUL, les techniciens déroulent trois câbles : ${t[0]}, ${t[1]} et ${t[2]}.`,
    question: () => 'Quelle longueur de câble ont-ils déroulée, en m ?',
    concl: r => `Ils ont déroulé ${r} m de câble.`
  },
  {
    themes: ['cuisine'], cible: 'm', plage: [2000, 10000], unites: ['m', 'cm', 'dm'],
    texte: (ctx, t) => `Pour décorer son food truck, ${ctx.prenom} accroche trois guirlandes lumineuses : ${t[0]}, ${t[1]} et ${t[2]}.`,
    question: () => 'Quelle longueur de guirlande faut-il en tout, en m ?',
    concl: r => `Il faut ${r} m de guirlande.`
  }
];

function exoSomme(rng, ctx) {
  const adaptes = SOMMES.filter(m => m.themes.includes(ctx.theme));
  const m = rng.choix(adaptes.length ? adaptes : SOMMES);
  const [min, max] = m.plage; // ordre de grandeur réaliste de chaque terme, en mm
  let termes;
  for (;;) {
    // Chaque terme : un nombre de mm « rond » dans son unité (au plus 2 décimales affichées)
    termes = rng.melanger(m.unites).map(u => {
      const pas = Math.max(1, 10 ** (6 - idx(u)) / 100);
      const mm = Math.round(rng.int(min, max) / pas) * pas;
      return { u, mm: Math.max(pas, mm) };
    });
    if (termes.every(t => decimales(versUnite(t.mm, t.u)) <= 2 && decimales(versUnite(t.mm, m.cible)) <= 3)) break;
  }
  const valeurs = termes.map(t => versUnite(t.mm, t.u));
  const convertis = termes.map(t => versUnite(t.mm, m.cible));
  const totalMm = termes.reduce((s, t) => s + t.mm, 0);
  const r = versUnite(totalMm, m.cible);
  const affiche = termes.map((t, k) => `${fmt(valeurs[k])} ${t.u}`);

  const etapes = [
    `On ne peut additionner que des longueurs <strong>dans la même unité</strong> : on convertit tout en ${m.cible}.`,
    ...termes.map((t, k) => t.u === m.cible
      ? `${fmt(valeurs[k])} ${t.u} : déjà en ${m.cible}.`
      : `${fmt(valeurs[k])} ${t.u} = ${fmt(convertis[k])} ${m.cible} (${idx(m.cible) > idx(t.u) ? '×' : '÷'} ${fmt(10 ** Math.abs(idx(m.cible) - idx(t.u)))})`),
    `${convertis.map(fmt).join(' + ')} = ${gras(fmt(r))} ${m.cible}`,
    m.concl(fmt(r))
  ];
  const brut = Number(valeurs.reduce((s, x) => s + x, 0).toFixed(8));
  const erreurs = brut !== r ? [{
    test: x => typeof x === 'number' && Math.abs(x - brut) < 1e-9,
    message: 'Tu as additionné les nombres sans les convertir. Il faut d\'abord tout mettre <strong>dans la même unité</strong>.'
  }] : [];

  return {
    cle: `somme:${m.cible}:${termes.map(t => t.mm + t.u).join('+')}`,
    enonce: `<p>${m.texte(ctx, affiche)}</p><p><strong>${m.question(ctx)}</strong></p>`,
    type: 'nombre',
    unite: m.cible,
    reponse: r,
    etapes,
    erreurs,
    expression: convertis.map(fmt).join(' + '),
    donnees: { mm: totalMm, arrivee: m.cible }
  };
}

// Tours d'un terrain rectangulaire, résultat en km
const TERRAINS = [
  { themes: ['handball', 'sport'], nom: 'du terrain de handball', L: 40, l: 20, qui: ctx => `À l'échauffement, ${ctx.prenom} fait` },
  { themes: ['chevaux'], nom: 'de la carrière', L: 60, l: 20, qui: ctx => `Au trot, ${ctx.prenom} et son cheval font` },
  { themes: ['chevaux', 'animaux'], nom: 'du paddock', L: 45, l: 30, qui: ctx => `${ctx.prenom} promène le poney et fait` },
  { themes: ['famille', 'records', 'voyages'], nom: 'du parc', L: 250, l: 120, qui: ctx => `Le dimanche, ${ctx.prenom} court et fait` }
];

function exoTours(rng, ctx) {
  const adaptes = TERRAINS.filter(t => t.themes.includes(ctx.theme));
  const t = rng.choix(adaptes.length ? adaptes : TERRAINS);
  const n = rng.int(3, t.L > 100 ? 6 : 15);
  const perimetre = 2 * (t.L + t.l);
  const totalM = n * perimetre;
  const r = versUnite(totalM * 1000, 'km');
  const c = etapesConversion(totalM, 'm', 'km');
  return {
    cle: `tours:${t.nom}:${n}`,
    enonce: `<p>${t.qui(ctx)} ${n} fois le tour ${t.nom}, un rectangle de ${t.L} m sur ${t.l} m.</p>
      <p><strong>Quelle distance parcourt-${ctx.il()}, en km ?</strong></p>`,
    type: 'nombre',
    unite: 'km',
    reponse: r,
    etapes: [
      `Un tour = le périmètre du rectangle : 2 × (${t.L} + ${t.l}) = ${perimetre} m.`,
      `${n} tours : ${n} × ${perimetre} = ${fmt(totalM)} m.`,
      ...c.etapes
    ],
    erreurs: [
      ...erreursConversion(totalM, c.n, c.facteur, r, 'm', 'km'),
      ...(n * (t.L + t.l) / 1000 !== r ? [{
        test: x => typeof x === 'number' && Math.abs(x - n * (t.L + t.l) / 1000) < 1e-9,
        message: `Le tour du rectangle, c'est son <strong>périmètre</strong> : 2 × (${t.L} + ${t.l}), pas ${t.L} + ${t.l}.`
      }] : [])
    ],
    expression: c.expression,
    donnees: { mm: totalM * 1000, arrivee: 'km' }
  };
}

// ---------- Export ----------

export default {
  id: 'conversions-longueurs',
  titre: 'Conversions de longueurs',
  resume: 'Du millimètre au kilomètre, avec le tableau de conversion.',
  niveaux: 3,
  nomsNiveaux: ['Unités proches', 'Toutes les unités', 'Problèmes'],
  cours: [
    {
      titre: 'Le tableau de conversion',
      contenu: `<p>Chaque unité vaut <strong>10 fois</strong> celle qui est à sa droite.</p>
        ${tableau(3500, 'm', 'cm')}
        <p>3,5 m : le 3 (chiffre des unités) va dans la colonne <strong>m</strong>. On lit en cm avec la virgule après la colonne cm : <strong>350 cm</strong>.</p>`
    },
    {
      titre: 'Multiplier ou diviser ?',
      contenu: `<ul>
          <li>Vers une unité <strong>plus petite</strong> (vers la droite) : on <strong>multiplie</strong>. 2,4 km = 2,4 × 1 000 = 2 400 m.</li>
          <li>Vers une unité <strong>plus grande</strong> (vers la gauche) : on <strong>divise</strong>. 450 cm = 450 ÷ 100 = 4,5 m.</li>
        </ul>
        <p>Chaque rang = × 10 ou ÷ 10. De m à mm : 3 rangs, donc × 1 000.</p>`
    },
    {
      titre: 'Le piège',
      contenu: `<p>On n'additionne que des longueurs <strong>dans la même unité</strong>.</p>
        <p class="calcul">1,2 m + 45 cm<br>= 120 cm + 45 cm<br>= 165 cm</p>
        <p class="piege">❌ 1,2 + 45 = 46,2 ne veut rien dire.</p>
        <p>Retiens les préfixes : <strong>kilo</strong> = 1 000, <strong>hecto</strong> = 100, <strong>déca</strong> = 10, <strong>déci</strong> = 1/10, <strong>centi</strong> = 1/100, <strong>milli</strong> = 1/1 000.</p>`
    }
  ],
  generer(niveau, rng, ctx) {
    if (niveau <= 2) return exoConversion(rng, niveau);
    return rng.bool(0.55) ? exoSomme(rng, ctx) : exoTours(rng, ctx);
  },

  // Contrôle indépendant : la réponse, reconvertie en mm, doit redonner la longueur de départ
  controler(exo) {
    const { mm, arrivee } = exo.donnees;
    const retour = exo.reponse * 10 ** (6 - UNITES.indexOf(arrivee));
    return Math.abs(retour - mm) < 1e-6 ? null : `reconversion : ${retour} mm au lieu de ${mm} mm`;
  }
};

