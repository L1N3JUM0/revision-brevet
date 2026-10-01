// Fiche « Explique-moi plus » du théorème de Pythagore : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
import { svg, polygone, segment, texte, angleDroit } from '../../assets/js/core/svg.js';

// ---------- Animation : les carrés construits sur un triangle 3-4-5 ----------
// Angle droit en C, CA = 4 (horizontal), CB = 3 (vertical). Chaque petit carré vaut 1.
const U = 18;
const C = { x: 0, y: 0 }, A = { x: 4 * U, y: 0 }, B = { x: 0, y: -3 * U };
const N = { x: 3 * U, y: -4 * U };                 // côté du carré sur [AB], vers l'extérieur
const plus = (P, Q, k = 1) => ({ x: P.x + k * Q.x, y: P.y + k * Q.y });
const moins = (P, Q) => ({ x: P.x - Q.x, y: P.y - Q.y });
const decal = P => ({ x: P.x + 3 * U + 12, y: P.y + 7 * U + 12 }); // recadrage dans le SVG

// Carré quadrillé : sommet O, vecteurs de côté u et v, n graduations
function carre(O, u, v, n) {
  let c = polygone([O, plus(O, u), plus(plus(O, u), v), plus(O, v)].map(decal), { classe: 'trait remplissage' });
  for (let k = 1; k < n; k++) {
    c += segment(decal(plus(O, u, k / n)), decal(plus(plus(O, u, k / n), v)), { classe: 'aide' });
    c += segment(decal(plus(O, v, k / n)), decal(plus(plus(O, v, k / n), u)), { classe: 'aide' });
  }
  return c;
}

function figureCarres(etape) {
  let c = '';
  if (etape >= 1) c += carre(C, moins(B, C), { x: -3 * U, y: 0 }, 3);
  if (etape >= 2) c += carre(C, moins(A, C), { x: 0, y: 4 * U }, 4);
  if (etape >= 3) c += carre(A, moins(B, A), N, 5);
  c += polygone([A, B, C].map(decal), { classe: 'trait' });
  c += angleDroit(decal(A), decal(C), decal(B), 9);
  c += texte(decal(C).x + 2 * U, decal(C).y - 10, '4', { classe: 'longueur' });
  c += texte(decal(C).x + 10, decal(C).y - 1.5 * U, '3', { classe: 'longueur' });
  c += texte(decal({ x: 2 * U, y: -1.5 * U }).x - 8, decal({ x: 2 * U, y: -1.5 * U }).y + 8, '5', { classe: 'longueur' });
  if (etape >= 1) c += texte(decal(C).x - 1.5 * U, decal(C).y - 1.5 * U, '9', { classe: 'nom-point' });
  if (etape >= 2) c += texte(decal(C).x + 2 * U, decal(C).y + 2 * U, '16', { classe: 'nom-point' });
  if (etape >= 3) c += texte(decal({ x: 3.5 * U, y: -3.5 * U }).x, decal({ x: 3.5 * U, y: -3.5 * U }).y, '25', { classe: 'nom-point' });
  return svg(10 * U + 24, 11 * U + 24, c, { titre: 'Carrés construits sur les côtés d\'un triangle rectangle' });
}

const ANIMATION = [
  { texte: 'Un triangle rectangle : les côtés de l\'angle droit mesurent 3 et 4, l\'hypoténuse mesure 5.', figure: figureCarres(0) },
  { texte: 'On construit un carré sur le côté 3 : il contient 3 × 3 = <strong>9</strong> petits carrés.', figure: figureCarres(1) },
  { texte: 'Un carré sur le côté 4 : 4 × 4 = <strong>16</strong> petits carrés.', figure: figureCarres(2) },
  { texte: 'Sur l\'hypoténuse : 5 × 5 = <strong>25</strong> petits carrés. Et 9 + 16 = 25 ! L\'aire du grand carré est la somme des deux autres : c\'est le théorème.', figure: figureCarres(3) }
];

export default {
  sections: [
    {
      titre: 'Le théorème',
      idee: 'Dans un triangle rectangle, le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés.',
      pourquoi: `<p>« Le carré d'une longueur », c'est l'<strong>aire</strong> du carré construit sur ce côté.</p>
        <p>Le théorème dit que les deux petits carrés, ensemble, ont exactement la même aire que le grand. Regarde avec un triangle 3-4-5 :</p>`,
      animation: ANIMATION,
      pieges: [
        { faux: 'L\'hypoténuse, c\'est le côté du bas.', juste: 'L\'hypoténuse est en face de l\'angle droit : c\'est toujours le plus long côté.' },
        { faux: 'J\'utilise Pythagore dans n\'importe quel triangle.', juste: 'Le théorème ne marche que dans un triangle <strong>rectangle</strong>.' }
      ],
      exemple: { niveau: 1, filtre: cle => /^pur:1:hyp/.test(cle) },
      verif: { niveaux: [1, 1], filtre: cle => /^pur:1:/.test(cle) },
      recherche: 'théorème de Pythagore'
    },
    {
      titre: 'Calculer l\'hypoténuse',
      idee: 'On additionne les carrés des deux côtés de l\'angle droit, puis on prend la racine carrée du résultat.',
      pourquoi: `<p>L'égalité BC² = AB² + AC² donne la valeur de <strong>BC²</strong>, pas celle de BC.</p>
        <p>BC est le nombre positif dont le carré vaut BC² : c'est sa <strong>racine carrée</strong>. Si BC² = 100, alors BC = √100 = 10, car 10 × 10 = 100.</p>`,
      pieges: [
        { faux: 'BC² = 100, donc BC = 100.', juste: 'Il faut prendre la racine : BC = √100 = 10.' },
        { faux: 'BC = 6 + 8 = 14.', juste: 'On additionne les <strong>carrés</strong> : 6² + 8² = 36 + 64 = 100, puis BC = 10.' }
      ],
      exemple: { niveau: 1, filtre: cle => /^pur:1:hyp/.test(cle) },
      verif: { niveaux: [1, 2], filtre: cle => /^pur:\d:hyp/.test(cle) },
      recherche: 'calculer l\'hypoténuse Pythagore'
    },
    {
      titre: 'Calculer un autre côté',
      idee: 'On part du carré de l\'hypoténuse et on lui retire le carré du côté connu, puis on prend la racine carrée.',
      pourquoi: `<p>C'est la même égalité, « retournée ». Si BC² = AB² + AC², alors <strong>AB² = BC² − AC²</strong>.</p>
        <p>Comme pour 10 = 6 + 4, on peut écrire 6 = 10 − 4 : quand on connaît le total et une partie, on soustrait.</p>`,
      pieges: [
        { faux: 'AB = 13 − 5 = 8.', juste: 'On soustrait les <strong>carrés</strong> : 13² − 5² = 169 − 25 = 144, donc AB = 12.' },
        { faux: 'AB² = 5² − 13².', juste: 'On part toujours du carré de l\'<strong>hypoténuse</strong> (le plus grand) : sinon on obtient un nombre négatif.' }
      ],
      exemple: { niveau: 1, filtre: cle => /^pur:1:cote/.test(cle) },
      verif: { niveaux: [1, 2], filtre: cle => /^pur:\d:cote/.test(cle) },
      recherche: 'Pythagore calculer un côté de l\'angle droit'
    },
    {
      titre: 'À la calculatrice',
      idee: 'Quand la racine ne « tombe pas juste », la calculatrice donne une valeur approchée : on l\'arrondit comme demandé et on écrit ≈.',
      pourquoi: `<p>√65 n'est pas un nombre décimal : il a une infinité de chiffres après la virgule (8,062257748…). La calculatrice en affiche seulement quelques-uns.</p>
        <p>On garde le nombre de chiffres demandé et on regarde le chiffre <strong>suivant</strong> pour savoir s'il faut arrondir au-dessus.</p>`,
      pieges: [
        { faux: '8,062… arrondi au dixième donne 8,0.', juste: 'Le chiffre des centièmes est 6 (5 ou plus) : on arrondit à <strong>8,1</strong>.' },
        { faux: 'BC = 8,1 cm.', juste: 'C\'est une valeur arrondie : on écrit <strong>BC ≈ 8,1 cm</strong>.' }
      ],
      exemple: { niveau: 2, filtre: cle => /^pur:2:/.test(cle) },
      verif: { niveaux: [2, 2], filtre: cle => /^pur:2:/.test(cle) },
      recherche: 'Pythagore arrondir calculatrice'
    },
    {
      titre: 'Rectangle ou pas ?',
      idee: 'On compare le carré du plus grand côté avec la somme des carrés des deux autres : s\'ils sont égaux, le triangle est rectangle ; sinon, il ne l\'est pas.',
      pourquoi: `<p>La <strong>réciproque</strong> du théorème dit : si l'égalité est vraie, alors le triangle est rectangle.</p>
        <p>La <strong>contraposée</strong> dit : si l'égalité est fausse, le triangle ne peut pas être rectangle (sinon, Pythagore donnerait l'égalité).</p>
        <p>C'est pour cela qu'on calcule les deux membres <strong>séparément</strong> avant de conclure.</p>`,
      pieges: [
        { faux: 'J\'écris BC² = AB² + AC² dès le début.', juste: 'On ne sait pas encore si c\'est vrai : on écrit « d\'une part… d\'autre part… », puis on compare.' },
        { faux: 'Je compare le carré de n\'importe quel côté.', juste: 'On prend le carré du <strong>plus grand</strong> côté : c\'est le seul qui peut être l\'hypoténuse.' }
      ],
      exemple: { niveau: 3, filtre: cle => /^reciproque:/.test(cle) },
      verif: { niveaux: [3, 3], filtre: cle => /^reciproque:/.test(cle) },
      recherche: 'réciproque du théorème de Pythagore'
    }
  ]
};
