# CLAUDE.md — revision-brevet

## Contexte

Site de révision du programme de 3ème (objectif : brevet), conçu pour Anna et partageable avec ses amies.
Julien (le père, développeur autodidacte) définit les besoins dans une conversation séparée, puis te transmet des consignes. Tu codes, tu testes, tu déploies.

- Repo : `https://github.com/L1N3JUM0/revision-brevet`
- Site : `https://l1n3jum0.github.io/revision-brevet/` (GitHub Pages, branche `main`, racine)
- Matières prévues : Maths (en cours), puis Histoire-Géo, Français, Sciences (SVT, Physique-Chimie, Techno)
- Langue : **tout le contenu visible est en français**

## Principes non négociables

1. **Exercices générés, jamais figés** : chaque exercice est produit par un générateur à partir de paramètres aléatoires. Deux sessions ne doivent pas donner les mêmes énoncés.
2. **Langage simple** : phrases courtes, tutoiement, zéro jargon inutile. Le vocabulaire officiel attendu au brevet (hypoténuse, réciproque, proportionnalité…) est utilisé, mais expliqué la première fois.
3. **Présentation aérée** : une idée par écran, peu de texte, beaucoup d'espace, des figures.
4. **Fun sans lourdeur** : contextes tirés des centres d'intérêt, feedback positif et varié, gamification légère. Jamais infantilisant.
5. **Correction pédagogique** : chaque erreur affiche la correction pas à pas et, si possible, l'erreur probable (« tu as additionné les dénominateurs »).
6. **Rédaction type brevet** : pour les exercices de démonstration (Pythagore, Thalès, angles…), montrer la rédaction modèle attendue par un prof.

## Stack et contraintes techniques

- **HTML / CSS / JavaScript vanilla**, modules ES natifs (`<script type="module">`). Aucun build, aucun framework, aucun npm en production.
- Aucune dépendance externe obligatoire. Si une bibliothèque devient vraiment nécessaire, la vendoriser dans `/lib` et le signaler à Julien.
- **Aucune clé d'API dans le code** : le site est public. Aucun appel à une API d'IA depuis le front. Si de la génération par IA est un jour nécessaire, elle passera par un proxy séparé (hors de ce repo, à décider avec Julien).
- Persistance : `localStorage` uniquement (progression, XP, records, prénom), toujours encapsulé dans `try/catch` avec des valeurs par défaut.
- Figures géométriques en **SVG généré dynamiquement** (échelle cohérente, codage des angles droits, noms des points).
- Confidentialité : aucun nom de famille, aucune photo, aucune donnée personnelle. `<meta name="robots" content="noindex, nofollow">` sur toutes les pages.
- Compatible Safari iOS en priorité, puis Chrome Android et desktop.

## Arborescence cible

```
/
├── index.html                 # accueil : choix de la matière, profil, XP
├── CLAUDE.md
├── assets/
│   ├── css/base.css           # design system commun
│   └── js/
│       ├── core/
│       │   ├── rng.js         # aléatoire (graine optionnelle pour reproduire un bug)
│       │   ├── store.js       # localStorage : progression, XP, anti-doublon
│       │   ├── engine.js      # déroulé d'une session (modes, score, feedback)
│       │   ├── answer.js      # saisie et vérification des réponses
│       │   ├── contexts.js    # banque de contextes et de prénoms
│       │   ├── gamification.js# XP, niveaux, badges, séries
│       │   └── svg.js         # utilitaires de figures
│       └── ui/                # composants (clavier, cartes, toasts…)
├── maths/
│   ├── index.html             # liste des chapitres
│   ├── chapitre.html          # page générique : ?c=pythagore&mode=entrainement
│   └── generators/            # un fichier par chapitre
│       ├── pythagore.js
│       ├── thales.js
│       └── …
└── tests/
    └── generators.html        # test de masse des générateurs
```

Les autres matières suivront le même schéma (`/histoire`, `/francais`, `/sciences`).

## Design system

- **Mobile-first, optimisé iPhone** : largeur de référence 390 px, `viewport-fit=cover`, respect des `safe-area-inset`.
- **Thème sombre** par défaut, contrastes forts, typographie grasse et lisible (police système : `-apple-system, "SF Pro", "Segoe UI", Roboto, sans-serif`).
- Zones tactiles d'au moins **48 px**, boutons pleine largeur pour les actions principales.
- Une couleur d'accent par matière (Maths : violet ou turquoise, à proposer), cohérente sur toutes les pages.
- Animations courtes (moins de 300 ms) : bonne réponse (petit rebond ou confettis légers), mauvaise réponse (secousse discrète). Respecter `prefers-reduced-motion`.
- Barre de progression et score toujours visibles pendant une session.

## Moteur d'exercices

### Contrat d'un générateur

Chaque chapitre exporte un objet de ce type :

```js
export default {
  id: 'pythagore',
  titre: 'Théorème de Pythagore',
  niveaux: 3,                       // 1 = facile, 3 = type brevet
  resume: 'Calculer une longueur…',  // sous-titre sur la page du chapitre
  nomsNiveaux: ['…', '…', '…'],
  cours: [ /* 2 à 5 cartes : { titre, contenu (HTML court), figure?, animation? } */ ],
  // animation : [{ texte, figure }] → lecteur étape par étape (‹ ▶ ›) dans le cours flash (fiches méthode)
  generer(niveau, rng, ctx) {
    return {
      cle,          // chaîne unique décrivant les paramètres (anti-doublon)
      enonce,       // HTML court, contextualisé
      figure,       // SVG optionnel
      reponse,      // valeur attendue ({ n, d } pour une fraction, texte du choix pour un QCM)
      type,         // 'nombre' | 'fraction' | 'qcm' | 'duree' | 'point' | 'texte-court'
      tolerance,    // pour les arrondis (ex. 0.05)
      simplifiee,   // fraction : forme irréductible exigée (sinon « Presque ! »)
      unite,        // 'cm', 'km/h'… affichée à côté du champ
      choix,        // pour les QCM
      etapes,       // correction pas à pas (tableau de chaînes HTML)
      redaction,    // rédaction modèle type brevet (optionnelle, repliable même si la réponse est juste)
      erreurs,      // [{ test: (rep) => bool, message }] erreurs fréquentes détectées
      expression,   // texte du calcul affiché (« √(6² + 8²) »), recalculé par les tests
      donnees       // paramètres bruts pour controler()
    };
  },
  controler(exo) { /* optionnel : second calcul indépendant, renvoie un message d'erreur ou null */ }
};
```

Les chapitres sont déclarés dans `maths/chapitres.js` (`charger: () => import(…)`, `null` = bientôt).

### Règles

- **Anti-doublon** : garder en mémoire les 200 dernières `cle` par chapitre. Régénérer si une clé déjà vue sort (au maximum 20 essais).
- **Nombres « propres »** : les valeurs doivent donner des calculs faisables (triplets pythagoriciens au niveau 1, arrondi au dixième ensuite, fractions simplifiables sans nombres énormes).
- **Saisie** : accepter la virgule **et** le point, les espaces, les fractions `3/4`, les nombres négatifs. `inputmode="decimal"` sur iOS. Pour les fractions, accepter toute forme équivalente, mais demander la forme simplifiée quand l'énoncé l'exige.
- **Vérification** des arrondis avec tolérance. Pour les durées, accepter `1h45`, `1 h 45 min` et `105 min` selon ce qui est demandé.
- **Contexte** : `ctx` fournit un contexte tiré de `contexts.js` à partir du profil (prénom, genre, thèmes, amis, pack). Répartition : environ 70 % des énoncés sur les thèmes favoris, 30 % sur des thèmes neutres. Utiliser `ctx.de` (« d'Anna », « de Louise ») plutôt que `de ${ctx.prenom}`.
- **Choisir un énoncé selon le thème** : toujours `choisirSelonTheme(rng, ctx, liste)` (jamais `filter(… ctx.theme)`). Repli : thème tiré → autres favoris → énoncés neutres (sans `themes` ou thème neutre). Les éléments portant un thème réservé (`rap`, donc JUL) ne sortent que dans le pack Anna ; `permis(ctx, liste)` donne la liste autorisée.

### Contrôle blanc (`maths/controle.html`, `assets/js/ui/controle.js`)

- Réglages : chapitres (tous cochés sauf Constructions, qui demande papier et instruments), 10, 15 ou 20 questions.
- Sujet : environ 30 % faciles, 40 % moyennes, 30 % type brevet, réparties entre les chapitres et regroupées par chapitre (« Exercice 1 · Fractions »). Barème affiché : 1, 2 ou 3 points selon le niveau, note ramenée sur 20 (au demi-point). Durée conseillée : 2, 3 ou 5 min par question (12 min pour une construction).
- Épreuve : une question par écran, navigation libre entre les questions, timer indicatif (dépassement en rouge, sans arrêt forcé), calculatrice. Aucune correction avant la fin.
- Résultats : note, bilan par chapitre avec lien vers l'entraînement, correction complète (étapes, rédaction modèle, erreur probable). Les réponses comptent dans les statistiques et l'XP. Les 10 dernières notes sont gardées (`controles` dans le store).
- La saisie (champ, touches ±, /, QCM, ordre) est partagée avec la page chapitre : `assets/js/ui/saisie.js`.
- Options par matière : `matiere` (les notes sont rangées par matière), `calculatrice` (maths : oui, histoire : non), `minutes` (durée conseillée par niveau), `sansParDefaut` (chapitres décochés au départ). Pages : `maths/controle.html`, `histoire/controle.html`.

### Calculatrice (`assets/js/ui/calculatrice.js`)

- `monterCalculatrice()` ajoute un bouton 🧮 flottant et un panneau en bas de l'écran (bottom-sheet). Renvoie `{ ouvrir, fermer, detruire }`.
- **Disponible** en entraînement et en contrôle blanc (à appeler dans l'écran de session). **Masquée** en défi chrono et en cours flash.
- Touches : chiffres, virgule, + − × ÷, parenthèses, x², √, C, ⌫, Ans, =. Touches de 52 px (≥ 48 px), thème sombre, virgule française, 3 derniers calculs affichés (touchables pour réutiliser le résultat).
- Comme une calculatrice de collège : **√ ouvre une parenthèse**, les parenthèses non fermées sont fermées à la fin, multiplication implicite (`2(3+1)`), après `=` un opérateur continue avec `Ans`.
- **Aucun `eval`** : `evaluer(texte, ans)` est un petit parseur récursif (priorités : parenthèses, ² et √, signe, × ÷, + −). Erreurs lisibles : division par zéro, racine d'un négatif, calcul incomplet.
- Historique et `Ans` gardés dans le store (`calculatrice: { historique, ans }`).
- Au clavier (ordinateur), les touches sont captées seulement quand le panneau est ouvert et qu'aucun champ n'a le focus ; Entrée calcule sans passer à la question suivante.
- Tests du parseur dans `tests/generators.html` (`testerCalculatrice`).

## Profils et contextes (`contexts.js`, `store.js`, `ui/onboarding.js`)

- **Profil** (`store.profil`) : `{ prenom, genre: 'f' | 'm' | 'n', themes: [3 à 5 ids], amis: [{ prenom, genre }], pack: 'anna' | null, packUrl? }`. `profil()` renvoie le profil normalisé, `profilComplet()` dit si l'onboarding est fini, `definirProfil()` l'enregistre.
- **Onboarding** (accueil, puis bouton ✏️) : prénom → accords (féminin, masculin, peu importe) → thèmes (3 à 5) → amis (facultatif, avec elle/il). Une idée par écran.
- **Thèmes** (`THEMES`) : handball, foot, basket, sport, chevaux, animaux, musique, mangas, jeux vidéo, mode, commerce, voitures, cuisine, voyages, Grèce et mythologie, espace, records, famille et amis. Neutres (`THEMES_NEUTRES`) : espace, sport, jeux vidéo, cuisine, voyages, records, animaux.
- **Pack Anna** : activé si le prénom est Anna ou avec `?profil=anna`. Prénoms Louise, Léona, Soléa, Ayline, Basile, Maud, Julien ; thèmes handball, rap (JUL), mode, commerce, chevaux, Grèce, famille. Sinon : prénoms mixtes (Camille, Sacha, Inès, Hugo…) et amis du profil.
- **Genre « peu importe »** : le prénom du profil n'apparaît jamais à la 3e personne dans un énoncé (on prend un autre prénom). Pas de point médian dans les exercices.
- **Migration** : `lire()` garde toute la progression (XP, flamme, stats, records, badges, contrôles). Un ancien profil « Anna » passe en pack Anna (genre f) sans repasser par l'onboarding. Ne jamais changer `version: 1` sans migration.
- Les données doivent rester réalistes (vitesses, distances, prix plausibles). Aucun contenu moqueur envers une personne réelle. JUL et les personnalités publiques uniquement dans des situations neutres, et seulement dans le pack Anna.
- Sciences : pas de thème écrit en dur dans les banques ; les décors (sport, musique…) passent par `choisirSelonTheme`. Les faits scientifiques restent (chromosomes du cheval, séismes en Grèce).

## Modes de session

1. **Cours flash** : 2 à 4 cartes par chapitre (la notion, un exemple, le piège classique, la rédaction modèle).
2. **Entraînement** : exercices infinis, la difficulté monte après 3 bonnes réponses d'affilée et redescend après 2 erreurs.
3. **Défi chrono** : 10 questions, timer visible, record personnel sauvegardé.
4. **Contrôle blanc** : sujet mélangé sur plusieurs chapitres, durée indicative (par exemple 1 h), barème affiché, correction complète à la fin seulement. L'utilisatrice choisit les chapitres inclus.

## Gamification

- **XP** par bonne réponse, avec un bonus de série et de niveau de difficulté.
- **Niveaux mythologiques** : Mortelle/Mortel → Héroïne/Héros → Oracle → Argonaute → Hermès → Athéna → Zeus, accordés au genre du profil (« peu importe » → Mortel, Héros). `nomNiveau(niveau, genre)`.
- **Série de jours** consécutifs de révision (flamme).
- **Badges** par chapitre (chapitre maîtrisé = 10 bonnes réponses au niveau 3).
- Messages de feedback variés (au moins 15 pour les bonnes réponses, 10 pour les erreurs), encourageants, jamais culpabilisants, et épicènes (aucun accord au féminin ou au masculin).
- Écran « Mes points faibles » : les chapitres avec le plus faible taux de réussite.

## Programme Maths — V1 (priorité : contrôle du vendredi 2 octobre 2026)

À livrer en premier, dans cet ordre :

1. **Moteur commun** + page d'accueil + page chapitre générique.
2. **Nombres relatifs** : les quatre opérations, priorités opératoires, expressions avec parenthèses.
3. **Fractions** : addition, soustraction (même dénominateur, puis dénominateurs multiples l'un de l'autre, puis quelconques), multiplication, division, simplification, priorités, problèmes « fraction d'une quantité ».
4. **Pythagore** : calcul de l'hypoténuse, calcul d'un côté de l'angle droit, arrondi au dixième. Niveau 3 : réciproque et contraposée (le triangle est-il rectangle ?). Figure SVG et rédaction modèle obligatoires.
5. **Thalès** : configuration classique et configuration papillon, calcul de longueurs, figure SVG, rédaction modèle (« Les droites (BC) et (MN) sont parallèles… »). Niveau 3 : réciproque.
6. **Conversions de longueurs** : de mm à km, avec un tableau de conversion affiché dans la correction.
7. **Conversions de durées** : h/min/s, heures décimales ↔ h et min (1,75 h = 1 h 45 min), calcul de durées entre deux horaires.
8. **Vitesses** : v = d/t et ses variantes, conversions km/h ↔ m/s, problèmes de trajets.
9. **Angles et parallèles** : identifier des angles alternes-internes ou correspondants sur une figure SVG, calculer un angle, justifier le parallélisme de deux droites.
10. **Scratch** : afficher un script de blocs (avancer, tourner, répéter, aller à x/y) et demander la case ou les coordonnées d'arrivée du lutin sur un quadrillage ou un repère.
11. **Constructions géométriques** : fiches méthode animées étape par étape, défi « sur papier » et autocorrection par checklist (non vérifiable automatiquement).
12. **Contrôle blanc** couvrant tous les chapitres ci-dessus.

Les points 1 à 8 et 12 sont prioritaires avant jeudi soir. Les points 9 à 11 peuvent suivre.

## Histoire (programme de 3e)

- Structure : `histoire/donnees/<chapitre>.js` (banques de faits), `histoire/generators/fabrique.js` (modèles de questions), `histoire/generators/<chapitre>.js` (une ligne : `fabriquer(donnees)`), `histoire/chapitres.js` (registre, avec les thèmes), `histoire/index.html`, `histoire/chapitre.html` (sans calculatrice).
- Banque d'un chapitre : `{ id, titre, theme, resume, periode: [début, fin], essentiel: [...], evenements: [{ nom, annee, fin?, mois?, jour?, date?, explication, repere? }], personnages: [{ nom, description }], vocabulaire: [{ mot, definition }] }`. Les descriptions de personnages ne contiennent jamais le nom.
- **Exactitude avant tout** : n'ajouter que des faits sûrs, avec des chiffres arrondis prudents (« plus de 640 habitants »). `mois` et `jour` seulement quand la date est certaine : ils servent à ordonner deux événements de la même année.
- Modèles de questions : date (QCM ou à taper), avant/après, remettre dans l'ordre (type `ordre`), placer sur une frise à zones A–D, personnage, vocabulaire (dans les deux sens), intrus (événement d'un autre chapitre), durée entre deux événements. Le cours flash est construit automatiquement (essentiel, dates, personnages, vocabulaire).
- Chapitre transversal « Les repères du brevet » : tous les événements marqués `repere: true`.
- Type de réponse `ordre` : `exo.items` (libellés dans l'ordre affiché) et `exo.reponse` (indices dans l'ordre chronologique). On touche les éléments dans l'ordre (UI dans `ui/saisie.js`).

## Sciences (Physique-Chimie, SVT, Technologie)

- Structure : `sciences/chapitres.js` (registre, `theme` : `pc`, `svt`, `techno`), `sciences/index.html`, `sciences/chapitre.html` et `sciences/controle.html` (calculatrice autorisée, comme au brevet).
- Un fichier par chapitre dans `sciences/generators/` : il exporte `banque` (notions) et `default` = `fabriquer(banque)` (`generators/fabrique.js`).
- Banque : `{ id, titre, discipline, resume, essentiel, formules?, cartes?, vocabulaire, questions: [{ q, bonne, fausses (≥ 3), explication?, niveau, figure?, pieges? }], vraiFaux: [{ texte, vrai, explication }], sequences: [{ titre, consigne, aide?, etapes }], classements: [{ question, groupes: [{ nom, items, explication? }] }], calculs: { nom: (rng, ctx, niveau) => exo | null }, modeles: { 1: [['calc:nom', poids], ['qcm', poids]…] }, controler? }`.
- Les calculs (masse volumique, loi d'Ohm, E = P × t, poids, écho, chromosomes, binaire…) sont générés avec `expression` recalculée par les tests ; les questions de connaissances sont tirées au hasard avec des distracteurs mélangés.
- Figures : `generators/figures.js` (graphiques, chronophotographies, schémas électriques normalisés).
- Type `ordre` : `exo.consigneOrdre` remplace la consigne par défaut (« du plus ancien au plus récent »).
- Exactitude : valeurs usuelles des manuels (g = 9,8 N/kg, son 340 m/s, lumière 300 000 km/s), données réalistes associées à chaque situation (vitesses des plaques, puissances des appareils).

## « Explique-moi plus » (fiches détaillées)

- Bouton sur chaque carte du cours flash, si le registre du chapitre a `approfondir: () => import('./approfondir/<chapitre>.js')`. Ouvre `chapitre.html?c=…&mode=approfondir&carte=k#carte-k` (défilement vers la section k).
- Une fiche par chapitre (`<matiere>/approfondir/<chapitre>.js`), **une section par carte, dans le même ordre et avec le même titre**. Section : `{ titre, idee, pourquoi (HTML), animation? | figure?, pieges: [{ faux, juste }], exemple: { niveau, filtre(cle, exo) }, verif: { niveaux: [n, n], filtre(cle, exo) }, recherche }`.
- Affichage (`ui/approfondir.js`) : l'idée en une phrase, pourquoi ça marche, exemple guidé (généré par le générateur du chapitre, étape par étape, bouton « Un autre exemple »), pièges, mini-vérif de 2 questions (hors statistiques et XP), lien de recherche vers les vidéos d'Yvan Monka.
- Fait : tous les chapitres de maths (format validé par Julien). Les filtres reçoivent `(cle, exo)` : `exo.donnees` permet de distinguer des cas que la clé ne dit pas (ex. angles alternes-internes ou correspondants).
- Les aides de figures des générateurs utilisées dans les fiches sont exportées (`figureCours`, `barre`, `tableau`, `scene`, `script`).

## Hors ligne (`sw.js`)

- Service worker à la racine, enregistré par `core/hors-ligne.js` (importé par `store.js`). « Réseau d'abord » avec délai de 4 s, sinon cache ; tout le site est préchargé à l'installation.
- Cache versionné `revision-brevet-<VERSION>` ; les anciens caches sont supprimés à l'activation (`skipWaiting` + `clients.claim`).
- **Avant chaque commit** : `node tests/verifier-sw.mjs --maj` (liste des fichiers et VERSION = empreinte du contenu). Sans `--maj`, le script vérifie seulement.

## Qualité et tests

- `tests/generators.html` génère **1 000 exercices par générateur et par niveau**, avec plusieurs profils (pack Anna, « peu importe », nouveaux thèmes : JUL interdit hors pack, prénom « peu importe » interdit dans les énoncés), et vérifie que la réponse est définie et finie, sans NaN ni division par zéro, que les nombres restent dans des bornes raisonnables, que les fractions affichées sont correctes et que la vérification accepte la bonne réponse.
- Vérifier chaque calcul mathématique : **une erreur dans une correction est le pire bug possible** sur ce site.
- Tester sur une largeur de 390 px et en mode sombre avant chaque commit.
- `tests/generators.html` vérifie aussi les fiches « Explique-moi plus » (une section par carte, filtres d'exemples efficaces).

## Conventions

- Code et noms de fichiers en français ou en anglais, mais cohérents. Commentaires en français.
- Messages de commit en français, courts : `feat(maths): générateur Thalès papillon`, `fix(engine): virgule décimale`.
- Pas de refactorisation large sans demander à Julien.
- Après chaque tâche : résumer ce qui a été fait, ce qui reste, et l'URL à tester.

## Déploiement

- GitHub Pages sur `main` (racine). Un `git push` suffit à publier, après `node tests/verifier-sw.mjs --maj` et une page de tests entièrement verte.
- Vérifier que les chemins sont **relatifs**, puisque le site est servi sous `/revision-brevet/`.

## Roadmap

1. Maths V1 (ci-dessus)
2. Physique-Chimie, SVT, Techno
3. Histoire-Géo et EMC (repères chronologiques, frise, cartes)
4. Français (grammaire, conjugaison, figures de style, dictée)
5. Brevet blanc multi-matières
