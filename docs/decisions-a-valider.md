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
