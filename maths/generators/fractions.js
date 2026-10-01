// Générateur : fractions (simplification, 4 opérations, priorités, fraction d'une quantité).
// Tous les calculs sont faits en fractions exactes (numérateur et dénominateur entiers).
import { choisirSelonTheme } from '../../assets/js/core/contexts.js';
import { fmt, pgcd } from '../../assets/js/core/answer.js';
import { svg } from '../../assets/js/core/svg.js';

// ---------- Fractions exactes ----------

// Fraction irréductible, dénominateur positif
function R(n, d = 1) {
  if (d === 0) throw new Error('dénominateur nul');
  if (n === 0) return { n: 0, d: 1 };
  if (d < 0) { n = -n; d = -d; }
  const g = pgcd(n, d);
  return { n: n / g, d: d / g };
}
const plus = (x, y) => R(x.n * y.d + y.n * x.d, x.d * y.d);
const moins = (x, y) => R(x.n * y.d - y.n * x.d, x.d * y.d);
const fois = (x, y) => R(x.n * y.n, x.d * y.d);
const divise = (x, y) => R(x.n * y.d, x.d * y.n);
const operer = (o, x, y) => (o === '+' ? plus(x, y) : o === '-' ? moins(x, y) : o === '*' ? fois(x, y) : divise(x, y));
const ppcm = (a, b) => (a / pgcd(a, b)) * b;
const SYMB = { '+': '+', '-': '−', '*': '×', '/': '÷' };

// ---------- Affichage ----------

// Fraction empilée. Le « / » caché rend le texte copiable et lisible par un lecteur d'écran.
// n et d peuvent être des nombres ou des chaînes (« 3 × 4 »).
function F(n, d) {
  if (typeof n === 'object') ({ n, d } = n);
  if (typeof n === 'number' && typeof d === 'number') {
    if (d === 1) return fmt(n);
    if (n < 0) return `−${F(-n, d)}`;
  }
  const f = x => (typeof x === 'number' ? fmt(x) : x);
  return `<span class="frac"><span class="num">${f(n)}</span><span class="sep">/</span><span class="den">${f(d)}</span></span>`;
}

// Version texte (« 3/4 », « −5/2 », « 2 ») : expression de contrôle pour les tests
function T(n, d) {
  if (typeof n === 'object') ({ n, d } = n);
  if (d === 1) return fmt(n);
  return `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`;
}

const gras = s => `<strong>${s}</strong>`;
const CONSIGNE = '<p class="doux petit">Donne le résultat sous forme de fraction simplifiée.</p>';

// Tire une fraction irréductible p/q avec 1 ≤ p < q (fraction plus petite que 1)
function fractionPropre(rng, denominateurs, ratioMax = 1) {
  for (;;) {
    const q = rng.choix(denominateurs);
    const p = rng.int(1, q - 1);
    if (pgcd(p, q) === 1 && p / q <= ratioMax) return { n: p, d: q };
  }
}

// Fraction p/q avec p premier avec q, p entre 1 et pMax
function fraction(rng, dMin, dMax, pMax) {
  for (;;) {
    const q = rng.int(dMin, dMax);
    const p = rng.int(1, pMax);
    if (pgcd(p, q) === 1) return { n: p, d: q };
  }
}

// ---------- Erreurs probables ----------

// Vrai si la saisie (fraction, décimal ou nombre) vaut n/d
function vaut(v, n, d) {
  if (d === 0) return false;
  if (typeof v === 'number') return Math.abs(v - n / d) < 1e-9;
  if ('decimal' in v) return Math.abs(v.decimal - n / d) < 1e-9;
  return v.n * d === n * v.d;
}

// Crée une erreur probable, sauf si la valeur fautive est égale à la bonne réponse
function erreur(n, d, correct, message) {
  if (d === 0 || !Number.isFinite(n / d)) return null;
  if (Math.abs(n / d - correct.n / correct.d) < 1e-9) return null;
  return { test: v => vaut(v, n, d), message };
}

function erreurSigne(correct) {
  if (correct.n === 0) return null;
  return erreur(-correct.n, correct.d, correct, 'Le calcul est bon, mais le <strong>signe</strong> est faux.');
}

const nettoyer = liste => liste.filter(Boolean);

// ---------- Étapes de calcul réutilisables ----------

// Lignes de simplification : « = 18/24 = 3/4 (on divise par 6) »
function lignesSimplifier(expr, x, { pre = '' } = {}) {
  const r = R(x.n, x.d);
  const lignes = [];
  if (r.d !== x.d) {
    const g = x.d / r.d;
    lignes.push(`On simplifie par ${g} (on divise le numérateur et le dénominateur par ${g}) :`);
    lignes.push(`${pre}${expr(F(r))}`);
  }
  return { lignes, resultat: r };
}

/**
 * Étapes d'une somme ou différence f1 (o) f2.
 * expr(s, seul) habille chaque ligne (utile quand la somme est dans un calcul plus grand) ;
 * seul = true quand il ne reste qu'une fraction.
 */
function etapesSomme(f1, o, f2, { pre = '', expr = s => s, premiere = true } = {}) {
  const lignes = [];
  const L = ppcm(f1.d, f2.d);
  const verbe = o === '+' ? 'additionne' : 'soustrait';
  if (premiere) lignes.push(`${pre}${expr(`${F(f1)} ${SYMB[o]} ${F(f2)}`)}`);

  let n1 = f1.n, n2 = f2.n;
  if (f1.d === f2.d) {
    lignes.push(`Même dénominateur : on garde ${f1.d} et on ${verbe} les numérateurs.`);
  } else {
    const k1 = L / f1.d, k2 = L / f2.d;
    const multiple = L === f1.d ? `${L} est un multiple de ${f2.d}` : L === f2.d ? `${L} est un multiple de ${f1.d}` : `${L} est un multiple de ${f1.d} et de ${f2.d}`;
    lignes.push(`On met au <strong>même dénominateur</strong> : ${L} (${multiple}).`);
    const conv = [];
    if (k1 > 1) conv.push(`${F(f1)} = ${F(`${f1.n} × ${k1}`, `${f1.d} × ${k1}`)} = ${F(f1.n * k1, L)}`);
    if (k2 > 1) conv.push(`${F(f2)} = ${F(`${f2.n} × ${k2}`, `${f2.d} × ${k2}`)} = ${F(f2.n * k2, L)}`);
    lignes.push(...conv);
    n1 = f1.n * k1; n2 = f2.n * k2;
    lignes.push(`${pre}${expr(`${F(n1, L)} ${SYMB[o]} ${F(n2, L)}`)}`);
  }
  const num = o === '+' ? n1 + n2 : n1 - n2;
  lignes.push(`${pre}${expr(F(`${n1} ${SYMB[o]} ${n2}`, L), true)}`);
  const brut = { n: num, d: L };
  lignes.push(`${pre}${expr(F(num, L), true)}`);
  const s = lignesSimplifier(t => expr(t, true), brut, { pre });
  lignes.push(...s.lignes);
  return { lignes, resultat: s.resultat };
}

// Étapes d'un produit f1 × f2
function etapesProduit(f1, f2, { pre = '', expr = s => s, premiere = true } = {}) {
  const lignes = [];
  if (premiere) lignes.push(`${pre}${expr(`${F(f1)} × ${F(f2)}`)}`);
  lignes.push('On multiplie les numérateurs entre eux et les dénominateurs entre eux :');
  lignes.push(`${pre}${expr(F(`${f1.n} × ${f2.n}`, `${f1.d} × ${f2.d}`), true)}`);
  const brut = { n: f1.n * f2.n, d: f1.d * f2.d };
  lignes.push(`${pre}${expr(F(brut.n, brut.d), true)}`);
  const s = lignesSimplifier(t => expr(t, true), brut, { pre });
  lignes.push(...s.lignes);
  return { lignes, resultat: s.resultat };
}

// Met en gras le résultat de la dernière ligne
function finir(lignes, nom, resultat) {
  lignes.push(`${nom} = ${gras(F(resultat))}`);
  return lignes;
}

// Retire les lignes identiques consécutives (ex. « A = 7/12 » répété quand rien n'est simplifiable).
// On garde la dernière, qui porte le résultat en gras.
function dedoublonner(lignes) {
  const sans = s => s.replace(/<\/?strong>/g, '');
  return lignes.filter((l, i) => i === lignes.length - 1 || sans(l) !== sans(lignes[i + 1]));
}

function enonceCalcul(nom, expressionHtml, consigne = 'Calcule :') {
  return `<p>${consigne}</p><p class="calcul">${nom} = ${expressionHtml}</p>${CONSIGNE}`;
}

// ---------- Niveau 1 ----------

function simplifier(rng) {
  const r = fraction(rng, 2, 10, 15);
  let k;
  do { k = rng.int(2, 9); } while (r.n * k > 120 || r.d * k > 120);
  const x = { n: r.n * k, d: r.d * k };
  const nom = rng.choix(['A', 'B', 'C']);
  const etapes = [
    'Simplifier, c\'est diviser le <strong>numérateur</strong> et le <strong>dénominateur</strong> par un même nombre.',
    `${x.n} et ${x.d} sont tous les deux dans la table de ${k} : ${x.n} = ${r.n} × ${k} et ${x.d} = ${r.d} × ${k}.`,
    `${F(x)} = ${F(`${x.n} ÷ ${k}`, `${x.d} ÷ ${k}`)} = ${gras(F(r))}`,
    r.d === 1 ? `La fraction est égale à un nombre entier.` : `On ne peut plus simplifier : la fraction est <strong>irréductible</strong>.`
  ];
  return {
    cle: `simplifier:${x.n}/${x.d}`,
    enonce: `<p>Simplifie au maximum la fraction :</p><p class="calcul">${F(x)}</p>
      <p class="doux petit">Au maximum = jusqu'à ce qu'on ne puisse plus simplifier (fraction <strong>irréductible</strong>).</p>`,
    expression: T(x.n, x.d),
    reponse: r,
    type: 'fraction',
    simplifiee: true,
    etapes,
    erreurs: nettoyer([
      erreur(x.n / k, x.d, r, 'Il faut diviser le numérateur <strong>et</strong> le dénominateur par le même nombre.'),
      erreur(x.n, x.d / k, r, 'Il faut diviser le numérateur <strong>et</strong> le dénominateur par le même nombre.'),
      erreur(x.n - k, x.d - k, r, 'Simplifier, c\'est <strong>diviser</strong> en haut et en bas, pas soustraire.')
    ])
  };
}

function memeDenominateur(rng) {
  const d = rng.int(3, 12);
  const o = rng.choix(['+', '-']);
  let a, c;
  do {
    a = rng.int(1, d + 4);
    c = rng.int(1, d + 4);
  } while (a === c || (o === '-' && a < c) || pgcd(a, d) !== 1 || pgcd(c, d) !== 1);
  const f1 = { n: a, d }, f2 = { n: c, d };
  const nom = rng.choix(['A', 'B', 'C', 'D']);
  const { lignes, resultat } = etapesSomme(f1, o, f2, { pre: `${nom} = ` });
  const somme = o === '+' ? a + c : a - c;
  return {
    cle: `meme:${a}/${d}${o}${c}/${d}`,
    enonce: enonceCalcul(nom, `${F(f1)} ${SYMB[o]} ${F(f2)}`),
    expression: `${T(f1)} ${SYMB[o]} ${T(f2)}`,
    reponse: resultat,
    type: 'fraction',
    simplifiee: true,
    etapes: dedoublonner(finir(lignes, nom, resultat)),
    erreurs: nettoyer([
      o === '+' ? erreur(somme, 2 * d, resultat, 'Le dénominateur <strong>ne change pas</strong> : on additionne seulement les numérateurs.') : null,
      erreurSigne(resultat)
    ])
  };
}

// ---------- Fraction d'une quantité (problèmes) ----------

// Chaque modèle : { themes, creer(rng, ctx) -> { f, total, unite, texte, part, reste, concl(v), conclReste(v) } }
function totalMultiple(rng, q, min, max, pas = 1) {
  const choix = [];
  for (let t = Math.ceil(min / (q * pas)) * q * pas; t <= max; t += q * pas) choix.push(t);
  return choix.length ? rng.choix(choix) : null;
}

const QUANTITES = [
  {
    themes: ['foot', 'basket'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [2, 3, 4, 5, 6]);
      const total = totalMultiple(rng, f.d, 12, 60);
      const basket = ctx.themes.find(t => t === 'foot' || t === 'basket') === 'basket';
      return {
        f, total, unite: '',
        texte: basket
          ? `Pendant la saison de basket, ${ctx.prenom} tente ${total} lancers francs. ${cap(F(f))} des lancers sont réussis.`
          : `Pendant la saison de foot, l'équipe ${ctx.de} tire ${total} fois au but. ${cap(F(f))} des tirs sont cadrés.`,
        part: basket ? 'Combien de lancers sont réussis ?' : 'Combien de tirs sont cadrés ?',
        reste: basket ? 'Combien de lancers sont ratés ?' : 'Combien de tirs ne sont pas cadrés ?',
        concl: v => (basket ? `${v} lancers sont réussis.` : `${v} tirs sont cadrés.`),
        conclReste: v => (basket ? `${v} lancers sont ratés.` : `${v} tirs ne sont pas cadrés.`)
      };
    }
  },
  {
    themes: ['mangas', 'musique', 'voitures'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [2, 3, 4, 5, 8, 10]);
      const total = totalMultiple(rng, f.d, 20, 200);
      const t = ctx.themes.find(x => ['mangas', 'musique', 'voitures'].includes(x)) || 'mangas';
      const objet = { mangas: ['mangas dans sa bibliothèque', 'des mangas sont des shōnen', 'shōnen'], musique: ['morceaux dans sa playlist', 'des morceaux sont en français', 'morceaux en français'], voitures: ['voitures miniatures dans sa collection', 'des voitures sont des modèles de course', 'modèles de course'] }[t];
      return {
        f, total, unite: '',
        texte: `${ctx.prenom} a ${total} ${objet[0]}. ${cap(F(f))} ${objet[1]}.`,
        part: `Combien y a-t-il de ${objet[2]} ?`,
        reste: 'Combien y en a-t-il d\'autres ?',
        concl: v => `Il y a ${v} ${objet[2]}.`,
        conclReste: v => `Il y en a ${v} autres.`
      };
    }
  },
  {
    themes: ['handball', 'sport'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [2, 3, 4, 5, 6]);
      const total = totalMultiple(rng, f.d, 12, 40);
      return {
        f, total, unite: '',
        texte: `Pendant un match de hand, l'équipe ${ctx.de} tire ${total} fois au but. ${cap(F(f))} des tirs finissent au fond des filets.`,
        part: 'Combien de buts l\'équipe marque-t-elle ?',
        reste: 'Combien de tirs sont ratés ?',
        concl: v => `L'équipe marque ${v} buts.`,
        conclReste: v => `${v} tirs sont ratés.`
      };
    }
  },
  {
    themes: ['rap'],
    creer(rng) {
      const f = fractionPropre(rng, [4, 5, 8, 10]);
      const total = totalMultiple(rng, f.d, 20000, 64000, 1000);
      return {
        f, total, unite: 'places',
        texte: `Pour le concert de JUL au Vélodrome de Marseille, ${fmt(total)} places sont mises en vente. ${cap(F(f))} des places partent dans la première heure.`,
        part: 'Combien de places sont vendues dans la première heure ?',
        reste: 'Combien de places restent à vendre après la première heure ?',
        concl: v => `${fmt(v)} places sont vendues dans la première heure.`,
        conclReste: v => `Il reste ${fmt(v)} places à vendre.`
      };
    }
  },
  {
    themes: ['mode', 'commerce'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [2, 3, 4, 5, 10], 0.5);
      const total = totalMultiple(rng, f.d, 20, 120);
      return {
        f, total, unite: '€',
        texte: `Dans la boutique ${ctx.de}, une veste coûte ${total} €. Pendant les soldes, son prix baisse de ${F(f)}.`,
        part: 'De combien d\'euros le prix baisse-t-il ?',
        reste: 'Quel est le nouveau prix de la veste ?',
        concl: v => `Le prix baisse de ${fmt(v)} €.`,
        conclReste: v => `La veste coûte maintenant ${fmt(v)} €.`
      };
    }
  },
  {
    themes: ['chevaux'],
    creer(rng) {
      const f = fractionPropre(rng, [3, 4, 5, 6]);
      const total = totalMultiple(rng, f.d, 12, 60);
      return {
        f, total, unite: '',
        texte: `Un centre équestre accueille ${total} équidés. ${cap(F(f))} d'entre eux sont des poneys, les autres sont des chevaux.`,
        part: 'Combien y a-t-il de poneys ?',
        reste: 'Combien y a-t-il de chevaux ?',
        concl: v => `Il y a ${v} poneys.`,
        conclReste: v => `Il y a ${v} chevaux.`
      };
    }
  },
  {
    themes: ['grece'],
    creer(rng) {
      const f = fractionPropre(rng, [3, 4, 5, 6, 8]);
      const total = totalMultiple(rng, f.d, 40, 160);
      return {
        f, total, unite: '',
        texte: `Un musée d'Athènes expose ${total} statues antiques. ${cap(F(f))} d'entre elles représentent des dieux de l'Olympe.`,
        part: 'Combien de statues représentent des dieux ?',
        reste: 'Combien de statues ne représentent pas des dieux ?',
        concl: v => `${v} statues représentent des dieux.`,
        conclReste: v => `${v} statues ne représentent pas des dieux.`
      };
    }
  },
  {
    themes: ['cuisine'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [3, 4, 5, 8]);
      const total = totalMultiple(rng, f.d, 40, 120);
      return {
        f, total, unite: '',
        texte: `Le food truck ${ctx.de} a vendu ${total} crêpes ce midi. ${cap(F(f))} étaient au chocolat.`,
        part: 'Combien de crêpes au chocolat ont été vendues ?',
        reste: 'Combien de crêpes n\'étaient pas au chocolat ?',
        concl: v => `${v} crêpes au chocolat ont été vendues.`,
        conclReste: v => `${v} crêpes n'étaient pas au chocolat.`
      };
    }
  },
  {
    themes: ['jeux-video'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [3, 4, 5, 6, 8]);
      const total = totalMultiple(rng, f.d, 24, 96);
      return {
        f, total, unite: 'niveaux',
        texte: `Un jeu vidéo compte ${total} niveaux. ${ctx.prenom} en a déjà terminé ${F(f)}.`,
        part: `Combien de niveaux ${ctx.prenom} a-t-${ctx.il()} terminés ?`,
        reste: `Combien de niveaux reste-t-il à ${ctx.prenom} ?`,
        concl: v => `${ctx.prenom} a terminé ${v} niveaux.`,
        conclReste: v => `Il lui reste ${v} niveaux.`
      };
    }
  },
  {
    themes: ['famille'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [2, 3, 4, 5], 0.75);
      const total = totalMultiple(rng, f.d, 20, 90);
      return {
        f, total, unite: '€',
        texte: `${ctx.prenom} a ${total} € d'économies. ${cap(ctx.il())} en dépense ${F(f)} pour le cadeau d'anniversaire ${ctx.deAmi}.`,
        part: 'Combien coûte le cadeau ?',
        reste: `Combien d'argent reste-t-il à ${ctx.prenom} ?`,
        concl: v => `Le cadeau coûte ${fmt(v)} €.`,
        conclReste: v => `Il reste ${fmt(v)} € à ${ctx.prenom}.`
      };
    }
  },
  {
    themes: ['voyages', 'espace', 'records', 'animaux'],
    creer(rng, ctx) {
      const f = fractionPropre(rng, [3, 4, 5, 6, 8]);
      const total = totalMultiple(rng, f.d, 120, 960, 10);
      return {
        f, total, unite: 'km',
        texte: `Pour partir en vacances en Grèce, la famille ${ctx.de} doit parcourir ${total} km en voiture jusqu'au port. Elle a déjà fait ${F(f)} du trajet.`,
        part: 'Combien de kilomètres la famille a-t-elle déjà parcourus ?',
        reste: 'Combien de kilomètres reste-t-il à parcourir ?',
        concl: v => `La famille a déjà parcouru ${fmt(v)} km.`,
        conclReste: v => `Il reste ${fmt(v)} km à parcourir.`
      };
    }
  }
];

function cap(s) {
  // Majuscule en début de phrase, en ignorant une éventuelle balise HTML
  return s.replace(/^(<[^>]+>)*([a-zà-ÿ])/, (m, b, l) => (b || '') + l.toUpperCase());
}

function quantite(rng, ctx, { reste = false } = {}) {
  const modele = choisirSelonTheme(rng, ctx, QUANTITES);
  const p = modele.creer(rng, ctx);
  const { f, total } = p;
  const unPart = total / f.d;
  const part = unPart * f.n;
  const r = reste ? total - part : part;

  const resPart = reste ? fmt(part) : gras(fmt(part));
  const etapes = f.n === 1
    ? [`Prendre ${F(f)} d'une quantité, c'est la diviser par ${f.d}.`,
      `${fmt(total)} ÷ ${f.d} = ${resPart}`]
    : [`Prendre ${F(f)} d'une quantité, c'est la diviser par ${f.d}, puis multiplier par ${f.n}.`,
      `${fmt(total)} ÷ ${f.d} × ${f.n} = ${fmt(unPart)} × ${f.n} = ${resPart}`];
  if (reste) etapes.push(`On enlève cette part du total : ${fmt(total)} − ${fmt(part)} = ${gras(fmt(r))}`);
  etapes.push(reste ? p.conclReste(fmt(r)) : p.concl(fmt(r)));

  const erreurs = [];
  const ajouter = (valeur, message) => {
    if (Number.isFinite(valeur) && Math.abs(valeur - r) > 1e-9 && !erreurs.some(e => e.valeur === valeur)) {
      erreurs.push({ valeur, test: v => Math.abs(v - valeur) < 1e-9, message });
    }
  };
  if (reste) ajouter(part, 'Tu as calculé la part. La question demande <strong>ce qui reste</strong> : il faut l\'enlever du total.');
  if (f.n > 1) ajouter(reste ? total - unPart : unPart, `Tu as trouvé ${F(1, f.d)} du total. Il faut encore <strong>multiplier par ${f.n}</strong>.`);
  ajouter(total / f.n * f.d, `Attention à l'ordre : on divise par le <strong>dénominateur</strong> (${f.d}) et on multiplie par le <strong>numérateur</strong> (${f.n}).`);

  return {
    cle: `quantite:${reste ? 'reste' : 'part'}:${modele.themes[0]}:${f.n}/${f.d}:${total}`,
    enonce: `<p>${p.texte}</p><p><strong>${reste ? p.reste : p.part}</strong></p>`,
    expression: reste ? `${fmt(total)} − ${fmt(part)}` : (f.n === 1 ? `${fmt(total)} ÷ ${f.d}` : `${fmt(total)} ÷ ${f.d} × ${f.n}`),
    reponse: r,
    type: 'nombre',
    unite: p.unite || undefined,
    etapes,
    erreurs: erreurs.map(({ test, message }) => ({ test, message }))
  };
}

// ---------- Niveau 2 ----------

function denominateursMultiples(rng) {
  const b = rng.int(2, 6);
  const k = rng.int(2, b <= 3 ? 4 : 3);
  const o = rng.choix(['+', '-']);
  let f1, f2;
  do {
    const petit = fraction(rng, b, b, b + 3);
    const grand = fraction(rng, b * k, b * k, b * k + 5);
    [f1, f2] = rng.bool() ? [petit, grand] : [grand, petit];
  } while (o === '-' && f1.n / f1.d <= f2.n / f2.d);
  const nom = rng.choix(['A', 'B', 'E', 'F']);
  const { lignes, resultat } = etapesSomme(f1, o, f2, { pre: `${nom} = ` });
  const petitN = f1.d < f2.d ? f1.n : f2.n;
  const k1 = f1.d < f2.d ? 'f1' : 'f2';
  // Erreur : on change le dénominateur sans multiplier le numérateur
  const oubli = k1 === 'f1'
    ? (o === '+' ? petitN + f2.n : petitN - f2.n)
    : (o === '+' ? f1.n + petitN : f1.n - petitN);
  return {
    cle: `multiples:${T(f1)}${o}${T(f2)}`,
    enonce: enonceCalcul(nom, `${F(f1)} ${SYMB[o]} ${F(f2)}`),
    expression: `${T(f1)} ${SYMB[o]} ${T(f2)}`,
    reponse: resultat,
    type: 'fraction',
    simplifiee: true,
    etapes: dedoublonner(finir(lignes, nom, resultat)),
    erreurs: nettoyer([
      erreur(o === '+' ? f1.n + f2.n : f1.n - f2.n, o === '+' ? f1.d + f2.d : f1.d - f2.d, resultat,
        'On n\'additionne jamais les dénominateurs ! On met d\'abord les fractions au <strong>même dénominateur</strong>.'),
      erreur(oubli, b * k, resultat,
        `Quand on multiplie le dénominateur par ${k}, il faut aussi <strong>multiplier le numérateur par ${k}</strong>.`),
      erreurSigne(resultat)
    ])
  };
}

function multiplication(rng) {
  let f1, f2;
  do {
    f1 = fraction(rng, 2, 9, 9);
    f2 = fraction(rng, 2, 9, 9);
  } while (f1.d === 1 || f2.d === 1 || (f1.n === f2.n && f1.d === f2.d));
  const nom = rng.choix(['A', 'B', 'E', 'F']);
  const { lignes, resultat } = etapesProduit(f1, f2, { pre: `${nom} = ` });
  const astuce = R(f1.n * f2.n, f1.d * f2.d).d !== f1.d * f2.d
    ? ['Astuce : on peut aussi simplifier <strong>avant</strong> de multiplier, les calculs sont plus petits.'] : [];
  return {
    cle: `produit:${T(f1)}*${T(f2)}`,
    enonce: enonceCalcul(nom, `${F(f1)} × ${F(f2)}`),
    expression: `${T(f1)} × ${T(f2)}`,
    reponse: resultat,
    type: 'fraction',
    simplifiee: true,
    etapes: dedoublonner([...finir(lignes, nom, resultat), ...astuce]),
    erreurs: nettoyer([
      erreur(f1.n * f2.d, f1.d * f2.n, resultat, 'Tu as inversé la deuxième fraction : ça, c\'est pour la <strong>division</strong>. Pour multiplier, on multiplie directement.'),
      f1.d === f2.d ? erreur(f1.n * f2.n, f1.d, resultat, 'Pour multiplier, on multiplie aussi les <strong>dénominateurs</strong> entre eux.') : null,
      erreur(f1.n * f2.d + f2.n * f1.d, f1.d * f2.d, resultat, 'Tu as fait une addition. Pour multiplier : numérateur × numérateur et dénominateur × dénominateur.')
    ])
  };
}

// ---------- Niveau 3 ----------

function denominateursQuelconques(rng) {
  let b, d;
  do {
    b = rng.int(2, 9);
    d = rng.int(2, 9);
  } while (b === d || b % d === 0 || d % b === 0 || ppcm(b, d) > 45);
  const o = rng.choix(['+', '-']);
  const f1 = fraction(rng, b, b, b + 4);
  const f2 = fraction(rng, d, d, d + 4);
  const nom = rng.choix(['A', 'B', 'C', 'D']);
  const { lignes, resultat } = etapesSomme(f1, o, f2, { pre: `${nom} = ` });
  return {
    cle: `quelconques:${T(f1)}${o}${T(f2)}`,
    enonce: enonceCalcul(nom, `${F(f1)} ${SYMB[o]} ${F(f2)}`),
    expression: `${T(f1)} ${SYMB[o]} ${T(f2)}`,
    reponse: resultat,
    type: 'fraction',
    simplifiee: true,
    etapes: dedoublonner(finir(lignes, nom, resultat)),
    erreurs: nettoyer([
      erreur(o === '+' ? f1.n + f2.n : f1.n - f2.n, o === '+' ? b + d : b - d, resultat,
        'Tu as additionné (ou soustrait) les dénominateurs. On met d\'abord les fractions au <strong>même dénominateur</strong>, puis on calcule seulement les numérateurs.'),
      erreurSigne(resultat)
    ])
  };
}

function division(rng) {
  let f1, f2;
  do {
    f1 = fraction(rng, 2, 9, 9);
    f2 = fraction(rng, 2, 9, 9);
  } while (f1.d === 1 || f2.d === 1 || (f1.n === f2.n && f1.d === f2.d));
  const nom = rng.choix(['A', 'B', 'C', 'D']);
  const inverse = { n: f2.d, d: f2.n };
  const { lignes, resultat } = etapesProduit(f1, inverse, { pre: `${nom} = ` });
  const etapes = [
    `Diviser par ${F(f2)}, c'est <strong>multiplier par son inverse</strong> ${F(inverse)} (on retourne la fraction).`,
    `${nom} = ${F(f1)} ÷ ${F(f2)}`,
    ...lignes
  ];
  return {
    cle: `division:${T(f1)}/${T(f2)}`,
    enonce: enonceCalcul(nom, `${F(f1)} ÷ ${F(f2)}`),
    expression: `${T(f1)} ÷ ${T(f2)}`,
    reponse: resultat,
    type: 'fraction',
    simplifiee: true,
    etapes: dedoublonner(finir(etapes, nom, resultat)),
    erreurs: nettoyer([
      erreur(f1.n * f2.n, f1.d * f2.d, resultat, 'Tu as multiplié sans retourner la deuxième fraction. Diviser, c\'est <strong>multiplier par l\'inverse</strong>.'),
      erreur(f1.d * f2.n, f1.n * f2.d, resultat, 'C\'est la <strong>deuxième</strong> fraction qu\'on retourne, pas la première.'),
      erreur(f1.d * f2.d, f1.n * f2.n, resultat, 'C\'est seulement la <strong>deuxième</strong> fraction qu\'on retourne.')
    ])
  };
}

// Priorités : trois modèles
function priorites(rng) {
  const petite = () => fraction(rng, 2, 6, 5);
  const nom = rng.choix(['A', 'B', 'C', 'D', 'E']);
  const modele = rng.int(1, 3);
  let f1, f2, f3, o;
  do {
    f1 = petite(); f2 = petite(); f3 = petite();
    o = rng.choix(['+', '-']);
  } while ([f1, f2, f3].some(f => f.d === 1) || ppcm(ppcm(f1.d, f2.d), f3.d) > 36
    // Dénominateur commun raisonnable pour l'étape d'addition
    || (modele === 1 && ppcm(f1.d, fois(f2, f3).d) > 36)
    || (modele !== 1 && ppcm(f1.d, f2.d) * f3.d > 108));

  const pre = `${nom} = `;
  let etapes, resultat, expression, html, fautes;

  if (modele === 1) {
    // f1 ± f2 × f3 : la multiplication d'abord
    html = `${F(f1)} ${SYMB[o]} ${F(f2)} × ${F(f3)}`;
    expression = `${T(f1)} ${SYMB[o]} ${T(f2)} × ${T(f3)}`;
    const p = etapesProduit(f2, f3, { pre, expr: s => `${F(f1)} ${SYMB[o]} ${s}`, premiere: false });
    const s = etapesSomme(f1, o, p.resultat, { pre, premiere: false });
    resultat = s.resultat;
    etapes = ['La <strong>multiplication</strong> est prioritaire : on la calcule en premier.', `${pre}${html}`,
      ...p.lignes, ...s.lignes];
    fautes = [erreur(...num(fois(operer(o, f1, f2), f3)), resultat, 'Tu as calculé de gauche à droite. La <strong>multiplication passe avant</strong> l\'addition et la soustraction.')];
  } else {
    // (f1 ± f2) × f3 ou f3 × (f1 ± f2) : la parenthèse d'abord
    const devant = modele === 3;
    const habiller = (s, seul) => {
      const g = seul ? s : `(${s})`;
      return devant ? `${F(f3)} × ${g}` : `${g} × ${F(f3)}`;
    };
    html = habiller(`${F(f1)} ${SYMB[o]} ${F(f2)}`);
    expression = devant ? `${T(f3)} × (${T(f1)} ${SYMB[o]} ${T(f2)})` : `(${T(f1)} ${SYMB[o]} ${T(f2)}) × ${T(f3)}`;
    const s = etapesSomme(f1, o, f2, { pre, expr: habiller, premiere: false });
    const p = devant
      ? etapesProduit(f3, s.resultat, { pre, premiere: true })
      : etapesProduit(s.resultat, f3, { pre, premiere: true });
    resultat = p.resultat;
    etapes = ['On calcule d\'abord la <strong>parenthèse</strong>.', `${pre}${html}`, ...s.lignes, ...p.lignes];
    const sansPar = devant ? operer(o, fois(f3, f1), f2) : operer(o, f1, fois(f2, f3));
    fautes = [erreur(...num(sansPar), resultat, 'Attention aux <strong>parenthèses</strong> : on calcule d\'abord ce qu\'il y a dedans.')];
  }
  return {
    cle: `priorites:${expression}`,
    enonce: enonceCalcul(nom, html, 'Calcule en respectant les priorités :'),
    expression,
    reponse: resultat,
    type: 'fraction',
    simplifiee: true,
    etapes: dedoublonner(finir(etapes, nom, resultat)),
    erreurs: nettoyer([...fautes, erreurSigne(resultat)])
  };
}
const num = f => [f.n, f.d];

// Problème en deux étapes : une fraction, puis une fraction du reste
const ACHATS = {
  handball: ['un maillot de hand', 'une paire de chaussures de hand'],
  mode: ['un jean', 'un sac'],
  commerce: ['une paire de baskets', 'une casquette'],
  rap: ['une place pour le concert de JUL', 'un sweat de la tournée'],
  chevaux: ['une bombe d\'équitation', 'un tapis de selle'],
  'jeux-video': ['un jeu vidéo', 'une manette'],
  cuisine: ['un livre de recettes', 'un moule à gâteau'],
  grece: ['un guide sur la mythologie grecque', 'une maquette du Parthénon'],
  foot: ['un maillot de foot', 'un ballon'],
  basket: ['un maillot de basket', 'un ballon de basket'],
  mangas: ['un coffret de mangas', 'une figurine'],
  musique: ['une place de concert', 'des écouteurs'],
  voitures: ['une maquette de voiture', 'un livre sur les voitures de course'],
  defaut: ['un livre', 'une place de cinéma']
};

function probleme(rng, ctx) {
  let f1, f2, total;
  do {
    f1 = fractionPropre(rng, [2, 3, 4, 5], 0.75);
    f2 = fractionPropre(rng, [2, 3, 4, 5], 0.75);
    total = totalMultiple(rng, f1.d * f2.d, 30, 240);
  } while (total === null);
  const [achat1, achat2] = ACHATS[ctx.themes.find(t => ACHATS[t] && (t !== 'rap' || ctx.pack === 'anna'))] || ACHATS.defaut;
  const d1 = (total / f1.d) * f1.n;
  const r1 = total - d1;
  const d2 = (r1 / f2.d) * f2.n;
  const final = r1 - d2;
  const reste1 = { n: f1.d - f1.n, d: f1.d };
  const reste2 = { n: f2.d - f2.n, d: f2.d };
  const fractionRestante = fois(reste1, reste2);
  const enFraction = rng.bool(0.5);
  const texte = `${ctx.prenom} a ${total} € d'économies. ${cap(ctx.il())} dépense ${F(f1)} de cette somme pour ${achat1}, puis ${F(f2)} <strong>du reste</strong> pour ${achat2}.`;

  if (!enFraction) {
    // « 168 ÷ 4 » quand le numérateur vaut 1, sinon « 168 ÷ 4 × 3 »
    const partDe = (q, f) => `${fmt(q)} ÷ ${f.d}${f.n > 1 ? ` × ${f.n}` : ''}`;
    const etapes = [
      `Premier achat : ${F(f1)} de ${total} €, c'est ${partDe(total, f1)} = ${fmt(d1)} €.`,
      `Il reste ${total} − ${fmt(d1)} = ${fmt(r1)} €.`,
      `Deuxième achat : ${F(f2)} du reste, c'est ${partDe(r1, f2)} = ${fmt(d2)} €.`,
      `Il reste ${fmt(r1)} − ${fmt(d2)} = ${gras(fmt(final))} €.`,
      `Vérification : ${total} × ${F(reste1)} × ${F(reste2)} = ${fmt(final)}.`
    ];
    const faux = total - d1 - (total / f2.d) * f2.n;
    return {
      cle: `probleme:euros:${T(f1)}:${T(f2)}:${total}`,
      enonce: `<p>${texte}</p><p><strong>Combien d'argent lui reste-t-il ?</strong></p>`,
      expression: `${total} × ${T(reste1)} × ${T(reste2)}`,
      reponse: final,
      type: 'nombre',
      unite: '€',
      etapes,
      erreurs: [
        [faux, 'Attention : la deuxième fraction porte sur <strong>le reste</strong>, pas sur la somme de départ.'],
        [d1 + d2, 'Tu as calculé ce qui a été <strong>dépensé</strong>. La question demande ce qui reste.'],
        [r1, 'Tu as oublié le <strong>deuxième achat</strong>.']
      ].filter(([v], i, t) => Math.abs(v - final) > 1e-9 && t.findIndex(([w]) => w === v) === i)
        .map(([v, message]) => ({ test: x => Math.abs(x - v) < 1e-9, message }))
    };
  }

  const etapes = [
    `Après le premier achat, il reste 1 − ${F(f1)} = ${F(reste1)} des économies.`,
    `Le deuxième achat prend ${F(f2)} de ce reste : il en reste donc ${F(reste2)}.`,
    `Fraction restante : ${F(reste2)} de ${F(reste1)}, c'est ${F(reste1)} × ${F(reste2)}.`,
    `${F(reste1)} × ${F(reste2)} = ${F(`${reste1.n} × ${reste2.n}`, `${reste1.d} × ${reste2.d}`)} = ${F(reste1.n * reste2.n, reste1.d * reste2.d)}`
  ];
  if (fractionRestante.d !== reste1.d * reste2.d) etapes.push(`On simplifie : ${F(reste1.n * reste2.n, reste1.d * reste2.d)} = ${F(fractionRestante)}`);
  etapes.push(`Il lui reste ${gras(F(fractionRestante))} de ses économies.`);
  etapes.push(`Vérification avec les euros : ${F(fractionRestante)} de ${total} €, c'est ${fmt(final)} €.`);
  const depense = moins({ n: 1, d: 1 }, fractionRestante);
  return {
    cle: `probleme:fraction:${T(f1)}:${T(f2)}:${total}`,
    enonce: `<p>${texte}</p><p><strong>Quelle fraction de ses économies lui reste-t-il ?</strong></p>${CONSIGNE}`,
    expression: `${T(reste1)} × ${T(reste2)}`,
    reponse: fractionRestante,
    type: 'fraction',
    simplifiee: true,
    etapes,
    erreurs: nettoyer([
      erreur(...num(moins(moins({ n: 1, d: 1 }, f1), f2)), fractionRestante, 'La deuxième fraction porte sur <strong>le reste</strong> : on multiplie les fractions restantes.'),
      erreur(depense.n, depense.d, fractionRestante, 'Tu as trouvé la fraction <strong>dépensée</strong>. La question demande ce qui reste.')
    ])
  };
}

// ---------- Figure du cours ----------

function barre(p, q) {
  const L = 300, H = 44, x0 = 20, y0 = 10;
  let c = '';
  for (let i = 0; i < q; i++) {
    c += `<rect x="${x0 + (i * L) / q}" y="${y0}" width="${L / q}" height="${H}" class="${i < p ? 'part-pleine' : 'part-vide'}"/>`;
  }
  return svg(340, 64, c, { titre: `${p} parts sur ${q}` });
}

// ---------- Export ----------

export default {
  id: 'fractions',
  titre: 'Fractions',
  resume: 'Simplifier, les 4 opérations, les priorités et les problèmes.',
  niveaux: 3,
  nomsNiveaux: ['Simplifier, même dénominateur', 'Multiples et produits', 'Type brevet'],
  cours: [
    {
      titre: 'Le vocabulaire',
      contenu: `<p>Dans ${F(3, 4)}, 3 est le <strong>numérateur</strong> (en haut) et 4 le <strong>dénominateur</strong> (en bas) : on partage en 4 et on prend 3 parts.</p>
        <p><strong>Simplifier</strong>, c'est diviser en haut et en bas par le même nombre :</p>
        <p class="calcul">${F(18, 24)} = ${F('18 ÷ 6', '24 ÷ 6')} = ${F(3, 4)}</p>
        <p>Quand on ne peut plus simplifier, la fraction est <strong>irréductible</strong>.</p>`,
      figure: barre(3, 4)
    },
    {
      titre: 'Additionner, soustraire',
      contenu: `<p>Même dénominateur : on le <strong>garde</strong> et on calcule les numérateurs.</p>
        <p class="calcul">${F(2, 7)} + ${F(3, 7)} = ${F(5, 7)}</p>
        <p>Sinon, on met d'abord au <strong>même dénominateur</strong> :</p>
        <p class="calcul">${F(1, 4)} + ${F(5, 6)}<br>= ${F(3, 12)} + ${F(10, 12)}<br>= ${F(13, 12)}</p>
        <p class="piege">❌ Jamais : ${F(1, 4)} + ${F(5, 6)} = ${F(6, 10)}</p>`
    },
    {
      titre: 'Multiplier, diviser',
      contenu: `<p><strong>Multiplier</strong> : en haut × en haut, en bas × en bas.</p>
        <p class="calcul">${F(2, 3)} × ${F(5, 7)} = ${F('2 × 5', '3 × 7')} = ${F(10, 21)}</p>
        <p><strong>Diviser</strong> par une fraction, c'est multiplier par son <strong>inverse</strong> (on la retourne).</p>
        <p class="calcul">${F(2, 3)} ÷ ${F(4, 5)}<br>= ${F(2, 3)} × ${F(5, 4)}<br>= ${F(10, 12)} = ${F(5, 6)}</p>`
    },
    {
      titre: 'Fraction d\'une quantité',
      contenu: `<p>Prendre ${F(3, 4)} de 20, c'est diviser par 4 puis multiplier par 3 :</p>
        <p class="calcul">20 ÷ 4 × 3 = 15</p>
        <p>Les <strong>priorités</strong> sont les mêmes qu'avec les nombres : parenthèses, puis × et ÷, puis + et −.</p>
        <p class="piege">Piège du brevet : « ${F(1, 4)} <strong>du reste</strong> » se calcule sur ce qui reste, pas sur le total.</p>`
    }
  ],
  generer(niveau, rng, ctx) {
    if (niveau === 1) {
      const type = rng.pondere([['simplifier', 3], ['meme', 3], ['quantite', 3]]);
      if (type === 'simplifier') return simplifier(rng);
      if (type === 'meme') return memeDenominateur(rng);
      return quantite(rng, ctx);
    }
    if (niveau === 2) {
      const type = rng.pondere([['multiples', 3], ['produit', 3], ['quantite', 2]]);
      if (type === 'multiples') return denominateursMultiples(rng);
      if (type === 'produit') return multiplication(rng);
      return quantite(rng, ctx, { reste: rng.bool(0.6) });
    }
    const type = rng.pondere([['quelconques', 3], ['division', 2], ['priorites', 3], ['probleme', 2]]);
    if (type === 'quelconques') return denominateursQuelconques(rng);
    if (type === 'division') return division(rng);
    if (type === 'priorites') return priorites(rng);
    return probleme(rng, ctx);
  }
};
