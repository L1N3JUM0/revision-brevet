# Compte rendu de la session de nuit (1er-2 octobre 2026)

Périmètre : étape 0 (synthèse des sujets 2027), puis étape 2 (histoire-géographie et EMC). Je n'ai touché ni aux maths, ni au français, ni aux sciences.
Avant chaque push, `tests/generators.html` était entièrement vert : 159 000 exercices sur 53 générateurs, plus les tests unitaires. J'ai aussi vérifié les pages à 390 px en mode sombre, sans erreur dans la console.

## Ce qui est fait (5 commits sur `main`)

| Commit | Contenu |
|---|---|
| `docs: synthèse des attendus du DNB 2027` | `docs/attendus-2027.md` : la structure de chaque épreuve (durée, parties, barème, consignes) et les 4 critères de maîtrise de la langue. CLAUDE.md impose désormais que tout format d'exercice respecte cette synthèse. |
| `feat(histoire): étude de document au format 2027` | Nouveau mode « Étude de document » dans 10 chapitres. Ordre de l'épreuve : repères (dates), prélèvement (1 à 2 phrases), analyse, puis « Montrez que… » sur 2 documents (au moins 4 phrases). Après chaque réponse : un corrigé modèle, des indices automatiques, une checklist de réponse et une checklist « maîtrise de la langue ». Les documents sont des textes officiels et des discours célèbres, tous sourcés. |
| `feat(geographie): cartes, croquis et développement construit` | Nouvelle matière Géographie, avec 9 chapitres (3 thèmes, plus « La carte du brevet » et « Le croquis »). Cartes SVG générées à partir de données ouvertes (IGN, Natural Earth). Exercices de carte comme l'annexe : aires urbaines, fleuves, massifs, mers. Croquis : légende à compléter et emplacement d'un figuré. Développement construit d'au moins 30 lignes, avec mots imposés et plan possible, sur 4 chapitres. |
| `feat(histoire): images Commons préparées` | 11 images téléchargées depuis Wikimedia Commons, converties en WebP et créditées. Elles sont toutes **en attente** : aucune n'est affichée sur le site. Les exercices « Qui est-ce ? », « Quel symbole ? » et « Date ce document » sont prêts ; ils s'activent seuls pour chaque image validée. |
| `feat(emc): situations pratiques et entraînement` | Nouvelle matière EMC, avec 5 chapitres de questions. 7 situations pratiques au format du sujet de référence : définir, analyser, principe de la République, expliquer (au moins 4 phrases), puis texte argumenté de 8 à 10 lignes, anonyme. |

La page d'accueil a deux nouvelles cartes (Géographie, EMC). Ces deux matières ont aussi un contrôle blanc, et leurs chapitres apparaissent dans « Mes points faibles ».

## URL à tester

- Accueil : https://l1n3jum0.github.io/revision-brevet/
- Étude de document (exemple) : https://l1n3jum0.github.io/revision-brevet/histoire/chapitre.html?c=france-occupee&mode=redige
- Carte du brevet : https://l1n3jum0.github.io/revision-brevet/geographie/chapitre.html?c=cartes&mode=entrainement
- Croquis : https://l1n3jum0.github.io/revision-brevet/geographie/chapitre.html?c=croquis&mode=entrainement
- Développement construit (sujet de référence) : https://l1n3jum0.github.io/revision-brevet/geographie/chapitre.html?c=faible-densite&mode=redige
- Situation pratique d'EMC : https://l1n3jum0.github.io/revision-brevet/emc/chapitre.html?c=information&mode=redige
- Page de tests : https://l1n3jum0.github.io/revision-brevet/tests/generators.html

Si une ancienne version s'affiche, recharge une fois : le service worker passe à la nouvelle version, et l'ancien cache est supprimé.

## Points à valider en priorité

1. **Les images** (`docs/images-a-verifier.md`) : vérifie l'identification de chacune (qui, quoi, date) et sa licence. Pour en valider une : `node outils/images.mjs --valider <id>`, puis commit (lance aussi `node tests/verifier-sw.mjs --maj`). Points à regarder :
   - Pétain : photo de 1941, en couleurs. J'ai écarté une version retouchée par IA.
   - Clemenceau : photo de 1904.
   - De Gaulle président : photo de 1963.
   - Mur de Berlin : CC BY-SA, crédit obligatoire, déjà affiché sous l'image.
   - Jean Moulin : pas d'image sûre trouvée.
2. **Les citations des études de document** : elles sont toutes courtes et sourcées. Relis en priorité :
   - Mussolini 1925 ;
   - Jdanov 1947 ;
   - Bandung 1955 (traduction française usuelle) ;
   - Nehru 1947.
3. **Les choix de format** notés dans `docs/decisions-a-valider.md` (19 points). Les plus importants :
   - les indices automatiques ne sont jamais une note, et ces modes ne donnent pas d'XP (point 6) ;
   - la géographie est une matière séparée (point 10) ;
   - le croquis se fait par emplacements A à D au lieu d'un coloriage (point 13) ;
   - le compteur compte 10 mots par ligne manuscrite (point 14) ;
   - les chapitres d'EMC ont été choisis sans le texte exact du programme 2024 (point 16).
4. **La carte** : contour, fleuves et massifs sont exacts ; les tracés du croquis (diagonale des faibles densités, littoraux, frontière) sont volontairement schématiques.

## Ce qui reste

- **Histoire** :
  - études de document pour « Le monde après 1989 » ;
  - documents iconographiques (affiches, photos) dans l'étude de document, une fois les images validées.
- **Géographie** :
  - développements construits pour espaces productifs, aménagement, France dans le monde ;
  - un second sujet par chapitre pour varier.
- **EMC** :
  - une situation pratique pour « Défense et paix » ;
  - un sondage chiffré à lire (question 4 du sujet de référence) ;
  - aligner les titres sur le programme officiel.
- **Fiches « Explique-moi plus »** pour l'histoire, la géographie et l'EMC (pas commencées).
- **Hors périmètre de cette nuit** (étapes 1, 3 et 4) : maths au format 2027 (automatismes sans calculatrice), français et sciences.

## Réseau

- `commons.wikimedia.org` et `upload.wikimedia.org` fonctionnent depuis ton autorisation.
- `thumb.wikimedia.org` reste bloqué : le script prend les mêmes vignettes sur `upload.wikimedia.org`.
- `data.gouv.fr` et le serveur de l'IGN sont toujours bloqués : j'ai utilisé des copies publiques sur GitHub des mêmes données ouvertes.
