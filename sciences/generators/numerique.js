// Technologie — Le numérique : codage binaire, unités de stockage, débit, réseaux, algorithmes.
import { choisirSelonTheme } from '../../assets/js/core/contexts.js';
import { fmt } from '../../assets/js/core/answer.js';
import { fabriquer, gras, erreursNombre, net } from './fabrique.js';

const binaire = n => n.toString(2);

// Décomposition d'un nombre binaire en puissances de 2
function detailBinaire(b) {
  const chiffres = b.split('');
  const termes = chiffres.map((c, i) => [c, 2 ** (chiffres.length - 1 - i)]).filter(([c]) => c === '1').map(([, p]) => p);
  return termes;
}

function calcBinaire(rng, ctx, niveau) {
  const max = niveau === 1 ? 15 : niveau === 2 ? 63 : 255;
  const n = rng.int(niveau === 1 ? 2 : 8, max);
  const b = binaire(n);
  const termes = detailBinaire(b);
  if (niveau === 1 || rng.bool(0.5)) {
    const err = erreursNombre(n);
    err.ajouter(Number(b), 'Ce nombre est écrit en <strong>binaire</strong> : chaque chiffre « 1 » vaut une puissance de 2 (1, 2, 4, 8, 16…).');
    err.ajouter(b.split('').filter(c => c === '1').length, 'On ne compte pas les « 1 » : chacun a une valeur différente selon sa place.');
    return {
      cle: `bin2dec:${n}`,
      enonce: `<p>Un ordinateur code les nombres avec des 0 et des 1 (le binaire).</p><p class="calcul">${b}</p><p><strong>Quel nombre décimal ce code binaire représente-t-il ?</strong></p>`,
      type: 'nombre',
      reponse: n,
      etapes: [
        `De droite à gauche, les rangs valent 1, 2, 4, 8, 16, 32, 64, 128.`,
        `${b} = ${termes.join(' + ')} = ${gras(fmt(n))}`
      ],
      erreurs: err.liste(),
      expression: termes.join(' + ')
    };
  }
  return {
    cle: `dec2bin:${n}`,
    enonce: `<p><strong>Écris le nombre ${n} en binaire.</strong></p><p class="doux">Rangs : 128, 64, 32, 16, 8, 4, 2, 1.</p>`,
    type: 'texte-court',
    reponse: [b, b.padStart(8, '0')],
    etapes: [
      'On cherche les puissances de 2 dont la somme fait ' + n + ', en partant de la plus grande.',
      `${n} = ${termes.join(' + ')}`,
      `On écrit 1 pour chaque rang utilisé, 0 sinon : ${gras(b)}`
    ],
    erreurs: [{ test: v => String(v).replace(/\s/g, '') === b.split('').reverse().join(''), message: 'Les chiffres sont dans le mauvais sens : le rang de 1 est <strong>à droite</strong>.' }],
    donnees: { n }
  };
}

// Unités de stockage (1 Ko = 1 000 octets, 1 Mo = 1 000 Ko, 1 Go = 1 000 Mo)
// Fichiers selon les thèmes du profil (sans thème = neutre) ; fem : accord de « chacun »
const FICHIERS = [
  { nom: 'photos', taille: [2, 3, 4, 5, 8], unite: 'Mo', fem: true },
  { nom: 'morceaux de JUL en MP3', taille: [4, 5, 8, 10], unite: 'Mo', themes: ['rap'] },
  { nom: 'morceaux de musique en MP3', taille: [4, 5, 8, 10], unite: 'Mo', themes: ['musique'] },
  { nom: 'vidéos de match de handball', taille: [200, 250, 400, 500], unite: 'Mo', fem: true, themes: ['handball'] },
  { nom: 'vidéos de match', taille: [200, 250, 400, 500], unite: 'Mo', fem: true, themes: ['foot', 'basket', 'sport'] },
  { nom: 'épisodes d\'animé', taille: [200, 250, 400, 500], unite: 'Mo', themes: ['mangas'] },
  { nom: 'jeux vidéo', taille: [20, 40, 50, 80], unite: 'Go', themes: ['jeux-video'] }
];
function calcStockage(rng, ctx, niveau) {
  const f = choisirSelonTheme(rng, ctx, FICHIERS.filter(x => x.unite === 'Mo' || niveau === 3));
  const t = rng.choix(f.taille);
  if (f.unite === 'Go') {
    const disque = rng.choix([500, 1000, 2000]);
    const r = Math.floor(disque / t);
    return {
      cle: `stock:${f.nom}:${t}:${disque}`,
      enonce: `<p>${ctx.prenom} a une console avec ${fmt(disque)} Go de stockage. Chaque jeu fait ${t} Go.</p><p><strong>Combien de jeux peut-${ctx.il()} installer au maximum ?</strong></p>`,
      type: 'nombre',
      unite: 'jeux',
      reponse: r,
      etapes: [`${fmt(disque)} ÷ ${t} = ${fmt(net(disque / t))}`, Number.isInteger(disque / t) ? `On peut installer ${gras(fmt(r))} jeux.` : `Un jeu doit tenir en entier : on garde la partie entière, ${gras(fmt(r))} jeux.`],
      erreurs: [{ test: v => v === Math.ceil(disque / t) && v !== r, message: 'Le dernier jeu ne rentrerait pas en entier : on arrondit vers le bas.' }]
    };
  }
  const cle = rng.choix([8, 16, 32, 64]);
  const total = cle * 1000;
  const r = Math.floor(total / t);
  const err = erreursNombre(r);
  err.ajouter(Math.floor(cle / t), `Convertis d'abord : ${cle} Go = ${fmt(total)} Mo.`);
  err.ajouter(Math.floor(cle * 1024 / t), 'Au collège, on utilise 1 Go = 1 000 Mo.');
  return {
    cle: `stock:${f.nom}:${t}:${cle}`,
    enonce: `<p>Une clé USB de ${cle} Go est vide. Combien de ${f.nom} de ${t} Mo chacun${f.fem ? 'e' : ''} peut-on y enregistrer au maximum ?</p>`,
    type: 'nombre',
    reponse: r,
    etapes: [
      `1 Go = 1 000 Mo, donc ${cle} Go = ${fmt(total)} Mo.`,
      `${fmt(total)} ÷ ${t} = ${fmt(net(total / t))}${Number.isInteger(total / t) ? '' : ` : on garde la partie entière, ${fmt(r)}`}.`,
      `On peut enregistrer ${gras(fmt(r))} fichiers.`
    ],
    erreurs: err.liste()
  };
}

// Durée de téléchargement : attention aux bits et aux octets (1 octet = 8 bits)
function calcDebit(rng) {
  const taille = rng.choix([50, 100, 200, 400, 500, 800, 1000]);
  const debit = rng.choix([8, 10, 20, 40, 50, 80, 100, 200]);
  const t = net(taille * 8 / debit);
  if (!Number.isInteger(t * 10)) return null;
  const err = erreursNombre(t);
  err.ajouter(net(taille / debit), 'Attention : le débit est en mégaBITS par seconde. 1 octet = 8 bits, donc ' + taille + ' Mo = ' + taille * 8 + ' Mbit.');
  err.ajouter(net(taille / 8 / debit), 'On <strong>multiplie</strong> par 8 pour passer des octets aux bits.');
  return {
    cle: `debit:${taille}:${debit}`,
    enonce: `<p>On télécharge un fichier de ${fmt(taille)} Mo (mégaoctets) avec une connexion de ${debit} Mbit/s (mégabits par seconde).</p><p><strong>Combien de secondes faut-il ?</strong></p>`,
    type: 'nombre',
    unite: 's',
    reponse: t,
    etapes: [
      '1 octet = 8 bits.',
      `${fmt(taille)} Mo = ${fmt(taille)} × 8 = ${fmt(taille * 8)} Mbit.`,
      `t = ${fmt(taille * 8)} ÷ ${debit} = ${gras(fmt(t))} s`
    ],
    erreurs: err.liste(),
    expression: `${fmt(taille * 8)} ÷ ${debit}`
  };
}

// Exécuter un petit programme (comme dans Scratch)
function calcProgramme(rng, ctx, niveau) {
  const a = rng.int(0, 10);
  const n = rng.int(2, 6);
  const b = rng.int(2, 9);
  if (niveau < 3 || rng.bool(0.5)) {
    const r = a + n * b;
    const err = erreursNombre(r);
    err.ajouter(a + b, `La boucle répète l'instruction ${n} fois, pas une seule.`);
    err.ajouter(n * b, `N'oublie pas la valeur de départ : score = ${a}.`);
    return {
      cle: `prog:boucle:${a}:${n}:${b}`,
      enonce: `<p><strong>Quelle valeur affiche ce programme ?</strong></p>
        <pre class="code">score ← ${a}
répéter ${n} fois
    score ← score + ${b}
afficher score</pre>`,
      type: 'nombre',
      reponse: r,
      etapes: [`Au départ, score = ${a}.`, `La boucle ajoute ${b}, ${n} fois : ${a} + ${n} × ${b}.`, `${a} + ${n} × ${b} = ${gras(fmt(r))}`],
      erreurs: err.liste(),
      expression: `${a} + ${n} × ${b}`
    };
  }
  // Condition « si … alors … sinon »
  const seuil = rng.int(5, 15);
  const x = rng.int(1, 20);
  const p = rng.int(2, 5), m = rng.int(1, 9);
  const vrai = x > seuil;
  const r = vrai ? x * p : x - m;
  return {
    cle: `prog:si:${x}:${seuil}:${p}:${m}`,
    enonce: `<p><strong>Quelle valeur affiche ce programme ?</strong></p>
      <pre class="code">x ← ${x}
si x > ${seuil} alors
    x ← x × ${p}
sinon
    x ← x − ${m}
afficher x</pre>`,
    type: 'nombre',
    reponse: r,
    etapes: [
      `${x} > ${seuil} est ${vrai ? '<strong>vrai</strong>' : '<strong>faux</strong>'} : on exécute ${vrai ? 'la partie « alors »' : 'la partie « sinon »'}.`,
      `x = ${vrai ? `${x} × ${p}` : `${x} − ${m}`} = ${gras(fmt(r))}`
    ],
    erreurs: [{ test: v => v === (vrai ? x - m : x * p), message: `Vérifie la condition : ${x} > ${seuil} est ${vrai ? 'vrai' : 'faux'}.` }],
    expression: vrai ? `${x} × ${p}` : `${x} − ${m}`
  };
}

export const banque = {
  id: 'numerique',
  titre: 'Le numérique : binaire, réseaux, programmes',
  discipline: 'techno',
  resume: 'Codage binaire, unités de stockage, débit, réseaux et Internet, algorithmes.',
  essentiel: [
    'Un ordinateur code toutes les informations (textes, images, sons) avec des <strong>bits</strong> : 0 ou 1. <strong>1 octet = 8 bits</strong>.',
    'En binaire, chaque rang vaut une puissance de 2 : 1, 2, 4, 8, 16, 32, 64, 128. Exemple : 1011 = 8 + 2 + 1 = 11.',
    'Stockage : 1 Ko = 1 000 octets, 1 Mo = 1 000 Ko, 1 Go = 1 000 Mo. Le <strong>débit</strong> d\'une connexion s\'exprime en bits par seconde.',
    'Un <strong>réseau</strong> relie des machines. Chaque machine a une <strong>adresse IP</strong>. Le <strong>routeur</strong> (la box) fait circuler les données entre les réseaux ; Internet est un réseau de réseaux.',
    'Un <strong>algorithme</strong> est une suite d\'instructions. On y trouve des <strong>boucles</strong> (répéter), des <strong>conditions</strong> (si… alors… sinon) et des <strong>variables</strong>.'
  ],
  cartes: [{
    titre: 'Les puissances de 2',
    contenu: '<table class="tableau-conv"><tr><th>128</th><th>64</th><th>32</th><th>16</th><th>8</th><th>4</th><th>2</th><th>1</th></tr><tr><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr></table><p>10110 = 16 + 4 + 2 = <strong>22</strong>. Avec 8 bits, on code les nombres de 0 à 255.</p>'
  }],
  vocabulaire: [
    { mot: 'Bit', definition: 'Plus petite unité d\'information numérique : 0 ou 1.' },
    { mot: 'Octet', definition: 'Groupe de 8 bits.' },
    { mot: 'Adresse IP', definition: 'Numéro qui identifie une machine sur un réseau.' },
    { mot: 'Routeur', definition: 'Appareil qui achemine les données entre plusieurs réseaux (la box internet en contient un).' },
    { mot: 'Serveur', definition: 'Ordinateur qui fournit des services ou des données à d\'autres machines (les clients).' },
    { mot: 'Protocole', definition: 'Ensemble de règles qui permettent à des machines de communiquer (HTTP, TCP/IP…).' },
    { mot: 'Algorithme', definition: 'Suite finie d\'instructions qui permet de résoudre un problème.' },
    { mot: 'Variable', definition: 'Case mémoire qui porte un nom et dont la valeur peut changer pendant le programme.' },
    { mot: 'Boucle', definition: 'Instruction qui répète un bloc d\'instructions plusieurs fois.' },
    { mot: 'Débit', definition: 'Quantité de données transmises par seconde, en bits par seconde (bit/s).' }
  ],
  questions: [
    { q: 'Quelle est la différence entre Internet et le Web ?', bonne: 'Le Web est un service qui utilise le réseau Internet', fausses: ['Ce sont deux noms pour la même chose', 'Internet est un site web', 'Le Web est plus ancien qu\'Internet'], explication: 'Internet est le réseau mondial ; le Web (les pages et liens) n\'est qu\'un de ses services, comme les e-mails ou les jeux en ligne.', niveau: 2 },
    { q: 'Quel appareil relie le réseau de la maison à Internet ?', bonne: 'Le routeur (la box)', fausses: ['L\'écran', 'La souris', 'L\'imprimante'], niveau: 1 },
    { q: 'Combien de bits y a-t-il dans un octet ?', bonne: '8', fausses: ['2', '10', '1 000'], niveau: 1 },
    { q: 'Quel est le plus grand nombre que l\'on peut coder avec 8 bits ?', bonne: '255', fausses: ['256', '128', '8'], explication: '11111111 = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255. Avec 0, cela fait 256 valeurs.', niveau: 3 },
    { q: 'Quel est un bon mot de passe ?', bonne: 'Une longue phrase avec des lettres, chiffres et symboles', fausses: ['Ta date de naissance', '123456', 'Le prénom de ton chien'], niveau: 1 },
    { q: 'Qu\'est-ce qu\'un serveur ?', bonne: 'Un ordinateur qui fournit des données à d\'autres machines', fausses: ['Un câble réseau', 'Un logiciel de dessin', 'Une souris sans fil'], niveau: 2 },
    { q: 'Quelle instruction permet de répéter des actions dans un programme ?', bonne: 'Une boucle', fausses: ['Une variable', 'Une condition', 'Un capteur'], niveau: 1 },
    { q: 'Dans « si température > 25 alors allumer ventilateur », que vérifie le programme ?', bonne: 'Une condition', fausses: ['Une boucle', 'Une adresse IP', 'Un débit'], niveau: 2 },
    { q: 'Pourquoi les données sont-elles découpées en paquets sur Internet ?', bonne: 'Pour circuler plus facilement par différents chemins', fausses: ['Pour être plus lourdes', 'Pour être imprimées', 'Pour ralentir la connexion'], explication: 'Chaque paquet porte l\'adresse IP du destinataire ; les routeurs l\'aiguillent, puis les paquets sont réassemblés à l\'arrivée.', niveau: 3 }
  ],
  vraiFaux: [
    { texte: 'Une photo est stockée sous forme de 0 et de 1 dans un téléphone.', vrai: true, explication: 'Toute information numérique est codée en binaire.' },
    { texte: 'Le Web et Internet sont exactement la même chose.', vrai: false, explication: 'Le Web est un service qui fonctionne grâce au réseau Internet.' },
    { texte: 'Ce que l\'on publie sur Internet peut être très difficile à effacer.', vrai: true, explication: 'Les contenus peuvent être copiés et partagés : réfléchis avant de publier.' },
    { texte: 'Un débit de 8 Mbit/s permet de télécharger 8 Mo par seconde.', vrai: false, explication: '8 Mbit/s = 1 Mo/s, car 1 octet = 8 bits.' }
  ],
  sequences: [
    { titre: 'unites', consigne: 'Range ces unités de la plus petite à la plus grande.', aide: 'Touche les unités de la <strong>plus petite</strong> à la <strong>plus grande</strong>.', etapes: ['Bit', 'Octet', 'Kilooctet (Ko)', 'Mégaoctet (Mo)', 'Gigaoctet (Go)', 'Téraoctet (To)'] }
  ],
  calculs: { binaire: calcBinaire, stockage: calcStockage, debit: calcDebit, programme: calcProgramme },
  modeles: {
    1: [['calc:binaire', 3], ['calc:programme', 3], ['qcm', 3], ['vf', 2], ['vocMot', 1]],
    2: [['calc:binaire', 3], ['calc:stockage', 3], ['calc:programme', 2], ['sequence', 1], ['qcm', 2], ['vocDef', 1]],
    3: [['calc:binaire', 3], ['calc:debit', 3], ['calc:stockage', 2], ['calc:programme', 2], ['qcm', 2]]
  },
  controler(exo) {
    if (exo.cle.startsWith('dec2bin:')) return parseInt(exo.reponse[0], 2) === exo.donnees.n ? null : 'conversion binaire incohérente';
    return null;
  }
};

export default fabriquer(banque);
