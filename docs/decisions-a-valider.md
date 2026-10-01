# Décisions prises en autonomie (à valider par Julien)

Format : **question** → choix fait / alternative.

## Session de nuit (étapes 0 et 2)

1. **Emplacement des PDF** : le message parle de `docs/sujets-2027/`, mais les fichiers sont dans `doc/sujets-2027/` (commit « upload de sujets 0 »).
   → Je les laisse où ils sont et j'écris mes documents dans `docs/`. Alternative : tout déplacer dans `docs/sujets-2027/` (un simple `git mv`).
2. **Sciences, « 2 disciplines sur 3 »** : les sujets de référence indiquent seulement « 30 min, 10 points » par discipline ; le tirage de 2 disciplines sur 3 n'y est pas écrit.
   → Dans `attendus-2027.md`, je l'indique comme l'organisation habituelle du DNB, à confirmer. Alternative : attendre le texte réglementaire 2027.
3. **Checklist « maîtrise de la langue »** : j'ai reformulé les 4 critères de la grille officielle (orthographe, syntaxe, lexique, organisation) en 4 questions d'autoévaluation adaptées à un élève. Alternative : afficher la grille officielle telle quelle, avec ses 4 niveaux.

### Étude de document (histoire)

4. **Blocage : Wikimedia Commons inaccessible** depuis l'environnement de travail (le proxy réseau répond 403 sur `commons.wikimedia.org` et `upload.wikimedia.org`).
   → Aucune image téléchargée. Le pipeline est prêt (`outils/images.mjs`, `histoire/images/credits.json`, 12 images candidates au statut `a_rechercher`) et les exercices « Qui est-ce ? / Quel symbole ? / Date ce document » restent désactivés. Pour débloquer : autoriser ces domaines dans les réglages réseau de l'environnement Claude Code, ou lancer `node outils/images.mjs --chercher` puis `--telecharger` sur ton ordinateur.
5. **Documents textuels uniquement pour l'instant** : extraits courts de textes officiels (traités, constitutions, lois, Charte de l'ONU) et de discours célèbres (Pétain, de Gaulle, Churchill, Truman, Jdanov, Kennedy, Schuman, Nehru, Simone Veil), toujours sourcés. Pour les discours encore protégés, citation courte à but pédagogique (droit de courte citation). Quand je résume un passage, c'est écrit dans la source (« articles suivants résumés »).
   → Alternative : n'utiliser que des textes officiels (domaine public).
6. **Hors statistiques et hors XP** : l'étude de document est une autoévaluation (checklist), il n'y a pas de note automatique. Seules les dates de la partie « repères » sont corrigées automatiquement (l'année suffit).
   → Alternative : donner un peu d'XP pour chaque checklist complétée.
7. **Indices automatiques** : nombre de phrases, majuscule et point, mots-clés attendus (reconnus par leur radical : « collabore » vaut « collaboration »), date citée. Ce ne sont que des indices, jamais une note.
8. **« Le monde après 1989 » et « Les repères du brevet »** n'ont pas encore d'étude de document (pas de texte court et sûr retenu). Alternative : en ajouter (résolution de l'ONU, discours de 2001…).
9. **Longueur demandée** : prélèvement en 1 à 2 phrases, analyse d'un document en au moins 2 phrases, question sur les deux documents en au moins 4 phrases (formule du sujet de référence : « Montrez que… »).

### Géographie

10. **Une matière à part** (`/geographie`), à côté de l'histoire, plutôt qu'un onglet « Histoire-géo » : même schéma que les autres matières, notes de contrôle blanc rangées séparément. Alternative : une page « Histoire-Géo-EMC » qui regroupe les trois.
11. **Fonds de carte** : contour de la France d'après l'IGN (Admin Express, licence ouverte Etalab, version simplifiée de france-geojson sur GitHub) ; fleuves, massifs et pays voisins de Natural Earth. `data.gouv.fr` et le serveur IGN étaient bloqués : j'ai utilisé ces copies publiques (même donnée, même licence). Projection simple (équirectangulaire corrigée), suffisante à cette échelle.
12. **Aires urbaines retenues** : les 4 du sujet de référence (Toulouse, Marseille, Lille, Nantes) au niveau 1 avec Paris, Lyon, Bordeaux et Strasbourg ; 13 aires au total ensuite. Pas de chiffres de population par aire (l'INSEE a changé de zonage en 2020 : « aires d'attraction des villes »), sauf « Paris : plus de 12 millions ».
13. **Croquis** : le coloriage est remplacé par « où placer ce figuré ? » (zones A à D) et « que représente le figuré n° k ? ». Les tracés (diagonale des faibles densités, littoraux attractifs, frontière dynamique) sont schématiques, comme sur un croquis de manuel.
14. **Développement construit** : un sujet par chapitre pour 4 chapitres (aires urbaines, faible densité — le sujet de référence —, outre-mer, Union européenne). Espaces productifs, aménagement et « France dans le monde » n'en ont pas encore. Le compteur estime 10 mots par ligne manuscrite (au lieu de 12 prévu au départ) : à ajuster si les copies d'Anna sont plus denses.
15. **Chiffres prudents** : « une vingtaine de pays » dans la zone euro (le nombre change), « plus de 300 millions de francophones », « environ trois emplois sur quatre dans les services ».
