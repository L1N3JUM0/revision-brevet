// Générateur : nombres relatifs (4 opérations, priorités, parenthèses).
// Les calculs sont représentés par un petit arbre : le texte affiché, la valeur
// et la correction pas à pas en sont déduits automatiquement, donc toujours cohérents.
import { fmt } from '../../assets/js/core/answer.js';
import { droiteGraduee } from '../../assets/js/core/svg.js';

// ---------- Arbre d'expression ----------

const N = v => ({ t: 'n', v });
const op = (o, g, d) => ({ t: 'op', op: o, g, d });
const PRIO = { '+': 1, '-': 1, '*': 2, '/': 2 };
const SYMB = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function appliquer(o, a, b) {
  switch (o) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;
  }
  throw new Error('opération inconnue ' + o);
}

export function valeur(n) {
  return n.t === 'n' ? n.v : appliquer(n.op, valeur(n.g), valeur(n.d));
}

// Parenthèses nécessaires autour d'un enfant ?
function besoinPar(enfant, parent, cote) {
  if (enfant.t !== 'op') return false;
  if (cote === 'g') return PRIO[enfant.op] < PRIO[parent.op];
  return PRIO[enfant.op] <= PRIO[parent.op];
}

// Texte d'une expression. « tete » : premier terme, où un négatif s'écrit sans parenthèses.
export function texte(n, tete = true) {
  if (n.t === 'n') return n.v < 0 && !tete ? `(${fmt(n.v)})` : fmt(n.v);
  const g = besoinPar(n.g, n, 'g') ? `(${texte(n.g, true)})` : texte(n.g, tete);
  const d = besoinPar(n.d, n, 'd') ? `(${texte(n.d, true)})` : texte(n.d, false);
  return `${g} ${SYMB[n.op]} ${d}`;
}

// Une étape de calcul : on effectue toutes les opérations dont les deux termes sont des nombres
function reduire(n) {
  if (n.t === 'n') return n;
  if (n.g.t === 'n' && n.d.t === 'n') return N(appliquer(n.op, n.g.v, n.d.v));
  return op(n.op, reduire(n.g), reduire(n.d));
}

function lignesCalcul(nom, arbre) {
  const lignes = [`${nom} = ${texte(arbre)}`];
  let a = arbre;
  while (a.t !== 'n') {
    a = reduire(a);
    lignes.push(`${nom} = ${texte(a)}`);
  }
  return lignes;
}

// Erreur « calcul de gauche à droite sans respecter les priorités » (parenthèses respectées)
function gaucheDroite(n) {
  const t = aplatir(n, true);
  let acc = t[0];
  for (let i = 1; i < t.length; i += 2) acc = appliquer(t[i], acc, t[i + 1]);
  return acc;
}

// Erreur « parenthèses ignorées » (priorités respectées)
function sansParentheses(n) {
  const t = aplatir(n, false);
  // D'abord × et ÷
  const pile = [t[0]];
  for (let i = 1; i < t.length; i += 2) {
    if (t[i] === '*' || t[i] === '/') pile.push(appliquer(t[i], pile.pop(), t[i + 1]));
    else pile.push(t[i], t[i + 1]);
  }
  let acc = pile[0];
  for (let i = 1; i < pile.length; i += 2) acc = appliquer(pile[i], acc, pile[i + 1]);
  return acc;
}

// Suite [nombre, op, nombre, …]. Si garderPar, les parenthèses deviennent un seul nombre.
function aplatir(n, garderPar) {
  if (n.t === 'n') return [n.v];
  const cote = (enfant, c) =>
    garderPar && besoinPar(enfant, n, c) ? [gaucheDroite(enfant)] : aplatir(enfant, garderPar);
  return [...cote(n.g, 'g'), n.op, ...cote(n.d, 'd')];
}

function compterOps(n, ops) {
  if (n.t === 'n') return 0;
  return (ops.includes(n.op) ? 1 : 0) + compterOps(n.g, ops) + compterOps(n.d, ops);
}

// ---------- Aides ----------

const abs = Math.abs;
const egal = (a, b) => abs(a - b) < 1e-9;

// Relatif non nul entre min et max en valeur absolue, signe au hasard
function rel(rng, min, max) {
  return rng.signe() * rng.int(min, max);
}

// Phrase qui explique la somme x + y
function regleSomme(x, y) {
  if (x === 0 || y === 0) return `Ajouter 0 ne change rien.`;
  if ((x < 0) === (y < 0)) {
    return `${fmt(x)} et ${fmt(y)} ont le <strong>même signe</strong> : on additionne les distances à zéro `
      + `(${abs(x)} + ${abs(y)} = ${abs(x) + abs(y)}) et on garde le signe ${x < 0 ? '−' : '+'}.`;
  }
  if (abs(x) === abs(y)) return `${fmt(x)} et ${fmt(y)} sont <strong>opposés</strong> : leur somme vaut 0.`;
  const loin = abs(x) > abs(y) ? x : y;
  return `${fmt(x)} et ${fmt(y)} n'ont <strong>pas le même signe</strong> : on soustrait les distances à zéro `
    + `(${Math.max(abs(x), abs(y))} − ${Math.min(abs(x), abs(y))} = ${abs(abs(x) - abs(y))}) `
    + `et on garde le signe de ${fmt(loin)}, le plus éloigné de zéro.`;
}

function regleSignes(nbNegatifs) {
  return `Règle des signes : ${nbNegatifs} nombre${nbNegatifs > 1 ? 's' : ''} négatif${nbNegatifs > 1 ? 's' : ''}, `
    + `c'est un nombre ${nbNegatifs % 2 === 0 ? 'pair' : 'impair'}, donc le résultat est `
    + `<strong>${nbNegatifs % 2 === 0 ? 'positif' : 'négatif'}</strong>.`;
}

const ERREUR_SIGNE = {
  somme: 'Tu as la bonne distance à zéro, mais pas le bon signe.',
  produit: 'Le calcul est bon, mais le signe est faux : compte les nombres négatifs.',
  priorites: 'Presque ! Le résultat a le mauvais signe. Revois les signes à chaque étape.'
};

function erreurSigne(correct, message) {
  return { test: r => correct !== 0 && egal(r, -correct), message };
}

// Erreurs fréquentes pour une somme ou différence de deux relatifs : a (op) b
function erreursDeuxTermes(a, o, b) {
  const y = o === '+' ? b : -b; // on se ramène à a + y
  const correct = a + y;
  const e = [];
  if (o === '-' && !egal(a + b, correct)) {
    e.push({
      test: r => egal(r, a + b),
      message: `Soustraire un nombre, c'est <strong>ajouter son opposé</strong> : ${fmt(a)} − ${b < 0 ? `(${fmt(b)})` : fmt(b)} = ${fmt(a)} + ${y < 0 ? `(${fmt(y)})` : fmt(y)}.`
    });
  }
  if ((a < 0) !== (y < 0)) {
    e.push({
      test: r => !egal(r, correct) && abs(r) === abs(a) + abs(y),
      message: 'Les deux nombres n\'ont pas le même signe : on <strong>soustrait</strong> les distances à zéro, on ne les additionne pas.'
    });
  } else {
    e.push({
      test: r => !egal(r, correct) && abs(r) === abs(abs(a) - abs(y)),
      message: 'Les deux nombres ont le même signe : on <strong>additionne</strong> les distances à zéro.'
    });
  }
  e.push(erreurSigne(correct, ERREUR_SIGNE.somme));
  return e;
}

function enonceCalcul(nom, arbre, consigne = 'Calcule :') {
  return `<p>${consigne}</p><p class="calcul">${nom} = ${texte(arbre)}</p>`;
}

// ---------- Niveau 1 : somme ou différence de deux relatifs ----------

function niveau1Calcul(rng) {
  let a, b;
  do {
    a = rng.intSauf(-20, 20, [0]);
    b = rng.intSauf(-20, 20, [0]);
  } while (a > 0 && b > 0);
  const o = rng.choix(['+', '-']);
  const arbre = op(o, N(a), N(b));
  const nom = rng.choix(['A', 'B', 'C', 'D']);
  const y = o === '+' ? b : -b;
  const r = a + y;

  const etapes = [];
  if (o === '-') {
    etapes.push(`Soustraire, c'est <strong>ajouter l'opposé</strong> :<br>${nom} = ${texte(arbre)} = ${texte(op('+', N(a), N(y)))}`);
  } else {
    etapes.push(`${nom} = ${texte(arbre)}`);
  }
  etapes.push(regleSomme(a, y));
  etapes.push(`${nom} = <strong>${fmt(r)}</strong>`);

  return {
    cle: `n1:${texte(arbre)}`,
    enonce: enonceCalcul(nom, arbre),
    expression: texte(arbre),
    reponse: r,
    type: 'nombre',
    etapes,
    erreurs: erreursDeuxTermes(a, o, b)
  };
}

// Problèmes concrets. Chaque modèle renvoie { a, o, b, enonce, conclusion(r), unite }
const MODELES_N1 = {
  temperature: {
    themes: ['grece', 'voyages', 'sport', 'famille'],
    creer(rng, ctx) {
      if (rng.bool()) {
        const a = rng.int(-15, -2), b = rng.int(3, 18);
        return {
          a, o: '+', b, unite: '°C',
          enonce: `En hiver, au sommet du mont Olympe, il fait ${fmt(a)} °C à 6 h. À midi, la température a monté de ${b} °C.<br>Quelle température fait-il à midi ?`,
          conclusion: r => `À midi, il fait ${fmt(r)} °C.`
        };
      }
      const a = rng.int(1, 10), b = rng.int(a + 1, a + 14);
      return {
        a, o: '-', b, unite: '°C',
        enonce: `Pendant un voyage à la montagne, ${ctx.prenom} relève ${a} °C à 17 h. Dans la nuit, la température baisse de ${b} °C.<br>Quelle température fait-il dans la nuit ?`,
        conclusion: r => `Dans la nuit, il fait ${fmt(r)} °C.`
      };
    }
  },
  handball: {
    themes: ['handball', 'sport'],
    creer(rng, ctx) {
      const a = rng.intSauf(-15, 15, [0]);
      let x, y;
      do { x = rng.int(18, 34); y = rng.int(18, 34); } while (x === y || abs(x - y) > 10);
      const b = x - y;
      return {
        a, o: '+', b, unite: '',
        enonce: `Au handball, après trois matchs, la différence de buts de l'équipe ${ctx.de} est de ${fmt(a)}. Au match suivant, l'équipe ${x > y ? 'gagne' : 'perd'} ${x} à ${y}.<br>Quelle est sa nouvelle différence de buts ?`,
        avantCalcul: `Le match rapporte ${x} − ${y} = ${fmt(b)} à la différence de buts.`,
        conclusion: r => `La nouvelle différence de buts est ${fmt(r)}.`
      };
    }
  },
  boutique: {
    themes: ['mode', 'commerce'],
    creer(rng, ctx) {
      if (rng.bool()) {
        const a = -5 * rng.int(4, 60), b = 5 * rng.int(4, 80);
        return {
          a, o: '+', b, unite: '€',
          enonce: `Le compte de la boutique de vêtements ${ctx.de} affiche ${fmt(a)} €. Pendant les soldes, elle encaisse ${fmt(b)} € de ventes.<br>Quel est le nouveau solde du compte ?`,
          conclusion: r => `Le nouveau solde est ${fmt(r)} €.`
        };
      }
      const a = 5 * rng.int(4, 40), b = 5 * rng.int(Math.floor(a / 5) + 1, Math.floor(a / 5) + 50);
      return {
        a, o: '-', b, unite: '€',
        enonce: `Le compte de la boutique ${ctx.de} affiche ${fmt(a)} €. Elle paie une facture de ${fmt(b)} € à son fournisseur.<br>Quel est le nouveau solde du compte ?`,
        conclusion: r => `Le nouveau solde est ${fmt(r)} €.`
      };
    }
  },
  plongee: {
    themes: ['animaux', 'voyages', 'records'],
    creer(rng, ctx) {
      const a = -rng.int(8, 40), b = rng.int(3, abs(a) - 1);
      return {
        a, o: '+', b, unite: 'm',
        enonce: `En vacances en Grèce, ${ctx.prenom} fait de la plongée. ${ctx.il()[0].toUpperCase() + ctx.il().slice(1)} observe une tortue à ${fmt(a)} m (sous la surface), puis remonte de ${b} m.<br>À quelle position est-${ctx.il()} maintenant ?`,
        conclusion: r => `${ctx.prenom} est à ${fmt(r)} m, donc ${abs(r)} m sous la surface.`
      };
    }
  },
  histoire: {
    themes: ['grece'],
    creer(rng) {
      const n = rng.int(300, 650), k = rng.int(50, 90);
      return {
        a: -n, o: '+', b: k, unite: '',
        enonce: `Un philosophe d'Athènes est né en l'an ${fmt(-n)}, c'est-à-dire ${n} avant J.-C. Il a vécu ${k} ans.<br>En quelle année est-il mort ? (donne un nombre relatif)`,
        conclusion: r => `Il est mort en ${fmt(r)}, soit ${abs(r)} avant J.-C.`
      };
    }
  },
  mars: {
    themes: ['espace'],
    creer(rng) {
      const a = -rng.int(60, 100), b = rng.int(30, abs(a) + 20);
      return {
        a, o: '+', b, unite: '°C',
        enonce: `La nuit, sur Mars, le rover mesure ${fmt(a)} °C. Dans la journée, la température remonte de ${b} °C.<br>Quelle température mesure-t-il dans la journée ?`,
        conclusion: r => `Dans la journée, il mesure ${fmt(r)} °C.`
      };
    }
  }
};

function niveau1Probleme(rng, ctx) {
  const adaptes = Object.entries(MODELES_N1).filter(([, m]) => m.themes.includes(ctx.theme));
  const [id, modele] = adaptes.length ? rng.choix(adaptes) : rng.choix(Object.entries(MODELES_N1));
  const p = modele.creer(rng, ctx);
  const arbre = op(p.o, N(p.a), N(p.b));
  const y = p.o === '+' ? p.b : -p.b;
  const r = p.a + y;

  const etapes = [];
  if (p.avantCalcul) etapes.push(p.avantCalcul);
  etapes.push(`On traduit par un calcul : ${texte(arbre)}`);
  if (p.o === '-') etapes.push(`Soustraire, c'est ajouter l'opposé : ${texte(arbre)} = ${texte(op('+', N(p.a), N(y)))}`);
  etapes.push(regleSomme(p.a, y));
  etapes.push(`${texte(arbre)} = <strong>${fmt(r)}</strong>`);
  etapes.push(p.conclusion(r));

  return {
    cle: `n1:${id}:${p.a}:${p.o}:${p.b}`,
    enonce: `<p>${p.enonce}</p>`,
    expression: texte(arbre),
    reponse: r,
    type: 'nombre',
    unite: p.unite || undefined,
    etapes,
    erreurs: erreursDeuxTermes(p.a, p.o, p.b)
  };
}

// ---------- Niveau 2 : produits, quotients, sommes de plusieurs termes ----------

function niveau2(rng) {
  const type = rng.pondere([['produit', 3], ['quotient', 3], ['produit3', 2], ['somme', 2]]);
  const nom = rng.choix(['A', 'B', 'E', 'F']);
  let arbre, facteurs;

  if (type === 'produit') {
    do { facteurs = [rel(rng, 2, 12), rel(rng, 2, 12)]; } while (facteurs.every(x => x > 0));
    arbre = op('*', N(facteurs[0]), N(facteurs[1]));
  } else if (type === 'quotient') {
    let q, d;
    do { q = rel(rng, 2, 12); d = rel(rng, 2, 10); } while (q * d > 0 && d > 0);
    facteurs = [q * d, d];
    arbre = op('/', N(q * d), N(d));
  } else if (type === 'produit3') {
    do { facteurs = [rel(rng, 2, 6), rel(rng, 2, 6), rel(rng, 2, 6)]; } while (facteurs.every(x => x > 0));
    arbre = op('*', op('*', N(facteurs[0]), N(facteurs[1])), N(facteurs[2]));
  } else {
    const n = rng.int(3, 4);
    let termes;
    do { termes = Array.from({ length: n }, () => rel(rng, 1, 20)); } while (termes.every(x => x > 0));
    arbre = N(termes[0]);
    for (let i = 1; i < n; i++) arbre = op(rng.choix(['+', '-']), arbre, N(termes[i]));
  }

  const r = valeur(arbre);
  const etapes = [];
  const erreurs = [];
  if (type === 'somme') {
    etapes.push('On calcule de gauche à droite (soustraire, c\'est ajouter l\'opposé).');
    etapes.push(...lignesCalcul(nom, arbre));
    erreurs.push(erreurSigne(r, ERREUR_SIGNE.somme));
  } else {
    const negatifs = facteurs.filter(x => x < 0).length;
    etapes.push(regleSignes(negatifs));
    const absolu = facteurs.map(abs);
    const calculAbs = type === 'quotient' ? `${absolu[0]} ÷ ${absolu[1]} = ${abs(r)}` : `${absolu.join(' × ')} = ${abs(r)}`;
    etapes.push(`On calcule sans les signes : ${calculAbs}.`);
    etapes.push(`${nom} = ${texte(arbre)} = <strong>${fmt(r)}</strong>`);
    erreurs.push(erreurSigne(r, ERREUR_SIGNE.produit));
  }
  if (type === 'somme' && compterOps(arbre, ['-']) > 0) {
    // Erreur fréquente : toutes les soustractions transformées en additions
    const tout = aplatir(arbre, false);
    let faux = tout[0];
    for (let i = 1; i < tout.length; i += 2) faux += tout[i + 1];
    if (!egal(faux, r)) {
      erreurs.unshift({
        test: x => egal(x, faux),
        message: 'Attention aux soustractions : soustraire un nombre, c\'est ajouter son <strong>opposé</strong>.'
      });
    }
  }
  return {
    cle: `n2:${texte(arbre)}`,
    enonce: enonceCalcul(nom, arbre),
    expression: texte(arbre),
    reponse: r,
    type: 'nombre',
    etapes,
    erreurs
  };
}

// ---------- Niveau 3 : priorités opératoires et parenthèses ----------

const MODELES_N3 = [
  // a + b × c
  rng => op(rng.choix(['+', '-']), N(rel(rng, 1, 10)), op('*', N(rel(rng, 2, 9)), N(rel(rng, 2, 9)))),
  // (a ± b) × c
  rng => op('*', op(rng.choix(['+', '-']), N(rel(rng, 1, 10)), N(rel(rng, 1, 10))), N(rel(rng, 2, 9))),
  // a × b ± c × d
  rng => op(rng.choix(['+', '-']), op('*', N(rel(rng, 2, 9)), N(rel(rng, 2, 9))), op('*', N(rel(rng, 2, 9)), N(rel(rng, 2, 9)))),
  // a − b × (c ± d)
  rng => op(rng.choix(['+', '-']), N(rel(rng, 1, 10)), op('*', N(rel(rng, 2, 6)), op(rng.choix(['+', '-']), N(rel(rng, 1, 9)), N(rel(rng, 1, 9))))),
  // (a − b) ÷ c, division exacte
  rng => {
    const c = rel(rng, 2, 6), q = rel(rng, 1, 9), b = rel(rng, 1, 10);
    return op('/', op('-', N(q * c + b), N(b)), N(c));
  },
  // a + b ÷ c, division exacte
  rng => {
    const c = rel(rng, 2, 9), q = rel(rng, 2, 9);
    return op(rng.choix(['+', '-']), N(rel(rng, 1, 15)), op('/', N(q * c), N(c)));
  },
  // a − (b − c) + d
  rng => op('+', op('-', N(rel(rng, 1, 12)), op(rng.choix(['+', '-']), N(rel(rng, 1, 12)), N(rel(rng, 1, 12)))), N(rel(rng, 1, 12))),
  // a × (b − c) + d
  rng => op('+', op('*', N(rel(rng, 2, 7)), op('-', N(rel(rng, 1, 9)), N(rel(rng, 1, 9)))), N(rel(rng, 1, 15)))
];

function compterNegatifs(n) {
  if (n.t === 'n') return n.v < 0 ? 1 : 0;
  return compterNegatifs(n.g) + compterNegatifs(n.d);
}

function niveau3(rng) {
  let arbre;
  // Au moins deux négatifs pour que les signes comptent vraiment
  do { arbre = rng.choix(MODELES_N3)(rng); } while (compterNegatifs(arbre) < 2);
  const nom = rng.choix(['A', 'B', 'C', 'D', 'E']);
  const r = valeur(arbre);

  const erreurs = [];
  const gd = gaucheDroite(arbre);
  if (!egal(gd, r)) {
    erreurs.push({
      test: x => egal(x, gd),
      message: 'Tu as calculé de gauche à droite. Les <strong>multiplications et divisions passent avant</strong> les additions et soustractions.'
    });
  }
  const sp = sansParentheses(arbre);
  if (!egal(sp, r) && !egal(sp, gd)) {
    erreurs.push({
      test: x => egal(x, sp),
      message: 'Attention aux <strong>parenthèses</strong> : on calcule d\'abord ce qu\'il y a dedans. Un signe − devant une parenthèse s\'applique à tout son contenu.'
    });
  }
  erreurs.push(erreurSigne(r, ERREUR_SIGNE.priorites));

  return {
    cle: `n3:${texte(arbre)}`,
    enonce: enonceCalcul(nom, arbre, 'Calcule en respectant les priorités :'),
    expression: texte(arbre),
    reponse: r,
    type: 'nombre',
    etapes: [
      'Ordre : d\'abord les <strong>parenthèses</strong>, puis <strong>× et ÷</strong>, enfin <strong>+ et −</strong> de gauche à droite.',
      ...lignesCalcul(nom, arbre)
    ],
    erreurs
  };
}

// ---------- Export ----------

export default {
  id: 'relatifs',
  titre: 'Nombres relatifs',
  resume: 'Les 4 opérations, les signes et les priorités.',
  niveaux: 3,
  nomsNiveaux: ['Additions et soustractions', 'Multiplications et divisions', 'Priorités, type brevet'],
  cours: [
    {
      titre: 'Additionner deux relatifs',
      contenu: `<p>Un nombre <strong>relatif</strong> a un signe (+ ou −) et une <strong>distance à zéro</strong>.</p>
        <ul>
          <li><strong>Même signe</strong> : on additionne les distances, on garde le signe.<br><span class="calcul-inline">−4 + (−3) = −7</span></li>
          <li><strong>Signes différents</strong> : on soustrait les distances, on garde le signe du plus éloigné de zéro.<br><span class="calcul-inline">−3 + 5 = 2</span></li>
        </ul>`,
      figure: droiteGraduee(-6, 6, { marques: [{ valeur: -3 }, { valeur: 2 }], fleche: { de: -3, a: 2, texte: '+5' } })
    },
    {
      titre: 'Soustraire = ajouter l\'opposé',
      contenu: `<p>L'<strong>opposé</strong> d'un nombre, c'est le même nombre avec l'autre signe : l'opposé de −6 est 6.</p>
        <p>Pour soustraire, on <strong>ajoute l'opposé</strong> :</p>
        <p class="calcul">4 − (−6) = 4 + 6 = 10</p>
        <p class="calcul">−2 − 5 = −2 + (−5) = −7</p>`
    },
    {
      titre: 'Multiplier et diviser : les signes',
      contenu: `<ul>
          <li><strong>Même signe</strong> → résultat <strong>positif</strong>.<br><span class="calcul-inline">(−4) × (−5) = 20</span></li>
          <li><strong>Signes différents</strong> → résultat <strong>négatif</strong>.<br><span class="calcul-inline">−24 ÷ 6 = −4</span></li>
        </ul>
        <p>Avec plusieurs facteurs : on compte les négatifs. Nombre <strong>pair</strong> → positif, <strong>impair</strong> → négatif.</p>`
    },
    {
      titre: 'Le piège : les priorités',
      contenu: `<p>Ordre de calcul : <strong>parenthèses</strong>, puis <strong>× et ÷</strong>, puis <strong>+ et −</strong> de gauche à droite.</p>
        <p class="calcul">A = 5 + 3 × (−2)<br>A = 5 + (−6)<br>A = −1</p>
        <p class="piege">❌ Faux : 5 + 3 = 8, puis 8 × (−2) = −16.</p>
        <p>Au brevet, écris <strong>une étape par ligne</strong>, comme ci-dessus.</p>`
    }
  ],
  generer(niveau, rng, ctx) {
    if (niveau === 1) return rng.bool(0.35) ? niveau1Probleme(rng, ctx) : niveau1Calcul(rng);
    if (niveau === 2) return niveau2(rng);
    return niveau3(rng);
  }
};
