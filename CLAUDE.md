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
  cours: [ /* 2 à 5 cartes : { titre, contenu (HTML court), figure? } */ ],
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
- **Contexte** : `ctx` fournit un contexte (prénom, thème) tiré de `contexts.js`. Répartition : environ 70 % des énoncés sur les centres d'intérêt, 30 % neutres ou d'autres thèmes pour varier. Utiliser `ctx.de` (« d'Anna », « de Louise ») plutôt que `de ${ctx.prenom}`.

### Calculatrice (`assets/js/ui/calculatrice.js`)

- `monterCalculatrice()` ajoute un bouton 🧮 flottant et un panneau en bas de l'écran (bottom-sheet). Renvoie `{ ouvrir, fermer, detruire }`.
- **Disponible** en entraînement et en contrôle blanc (à appeler dans l'écran de session). **Masquée** en défi chrono et en cours flash.
- Touches : chiffres, virgule, + − × ÷, parenthèses, x², √, C, ⌫, Ans, =. Touches de 52 px (≥ 48 px), thème sombre, virgule française, 3 derniers calculs affichés (touchables pour réutiliser le résultat).
- Comme une calculatrice de collège : **√ ouvre une parenthèse**, les parenthèses non fermées sont fermées à la fin, multiplication implicite (`2(3+1)`), après `=` un opérateur continue avec `Ans`.
- **Aucun `eval`** : `evaluer(texte, ans)` est un petit parseur récursif (priorités : parenthèses, ² et √, signe, × ÷, + −). Erreurs lisibles : division par zéro, racine d'un négatif, calcul incomplet.
- Historique et `Ans` gardés dans le store (`calculatrice: { historique, ans }`).
- Au clavier (ordinateur), les touches sont captées seulement quand le panneau est ouvert et qu'aucun champ n'a le focus ; Entrée calcule sans passer à la question suivante.
- Tests du parseur dans `tests/generators.html` (`testerCalculatrice`).

## Banque de contextes (`contexts.js`)

- **Prénoms** : Anna, Louise, Léona, Soléa, Ayline, Basile, Maud, Julien. Remplacer « Anna » par le prénom saisi sur le profil si ce n'est pas Anna (les copines utiliseront le site).
- **Thèmes centraux** : handball (terrain 40 × 20 m, but 3 × 2 m, zone des 6 m, ailière), JUL et le rap (concerts, trajets, streams, ventes d'albums), mode (soldes, boutique, remises, marges), commerce (prix, bénéfices, stock), chevaux (galop, carrière, obstacles, clôtures), Grèce et mythologie grecque (Athènes, Parthénon, dieux, Thalès et Pythagore eux-mêmes), famille et amies.
- **Thèmes de respiration** : espace, sport en général, jeux vidéo, cuisine et food truck, voyages, records, animaux.
- Les données doivent rester réalistes (vitesses, distances, prix plausibles).
- Aucun contenu moqueur envers une personne réelle. JUL et les personnalités publiques uniquement dans des situations neutres (concert, trajet, statistiques).

## Modes de session

1. **Cours flash** : 2 à 4 cartes par chapitre (la notion, un exemple, le piège classique, la rédaction modèle).
2. **Entraînement** : exercices infinis, la difficulté monte après 3 bonnes réponses d'affilée et redescend après 2 erreurs.
3. **Défi chrono** : 10 questions, timer visible, record personnel sauvegardé.
4. **Contrôle blanc** : sujet mélangé sur plusieurs chapitres, durée indicative (par exemple 1 h), barème affiché, correction complète à la fin seulement. L'utilisatrice choisit les chapitres inclus.

## Gamification

- **XP** par bonne réponse, avec un bonus de série et de niveau de difficulté.
- **Niveaux mythologiques** : Mortelle → Héroïne → Nymphe → Muse → Hermès → Athéna → Zeus (seuils à calibrer).
- **Série de jours** consécutifs de révision (flamme).
- **Badges** par chapitre (chapitre maîtrisé = 10 bonnes réponses au niveau 3).
- Messages de feedback variés (au moins 15 pour les bonnes réponses, 10 pour les erreurs), encourageants, jamais culpabilisants.
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

## Qualité et tests

- `tests/generators.html` génère **1 000 exercices par générateur et par niveau** et vérifie que la réponse est définie et finie, sans NaN ni division par zéro, que les nombres restent dans des bornes raisonnables, que les fractions affichées sont correctes et que la vérification accepte la bonne réponse.
- Vérifier chaque calcul mathématique : **une erreur dans une correction est le pire bug possible** sur ce site.
- Tester sur une largeur de 390 px et en mode sombre avant chaque commit.

## Conventions

- Code et noms de fichiers en français ou en anglais, mais cohérents. Commentaires en français.
- Messages de commit en français, courts : `feat(maths): générateur Thalès papillon`, `fix(engine): virgule décimale`.
- Pas de refactorisation large sans demander à Julien.
- Après chaque tâche : résumer ce qui a été fait, ce qui reste, et l'URL à tester.

## Déploiement

- GitHub Pages sur `main` (racine). Un `git push` suffit à publier.
- Vérifier que les chemins sont **relatifs**, puisque le site est servi sous `/revision-brevet/`.

## Roadmap

1. Maths V1 (ci-dessus)
2. Physique-Chimie, SVT, Techno
3. Histoire-Géo et EMC (repères chronologiques, frise, cartes)
4. Français (grammaire, conjugaison, figures de style, dictée)
5. Brevet blanc multi-matières
