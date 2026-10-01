// Outil de développement (Node, sans dépendance) : liste des fichiers du service worker.
//   node tests/verifier-sw.mjs        → vérifie que sw.js liste tous les fichiers du site et que VERSION est à jour
//   node tests/verifier-sw.mjs --maj  → réécrit la liste et VERSION (empreinte du contenu) dans sw.js
// À lancer avant chaque commit : une nouvelle VERSION force le rechargement du cache hors ligne.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXTENSIONS = /\.(html|js|css|svg|png|webmanifest|json|ico)$/;
const EXCLUS = ['.git', 'tests', 'node_modules', '.claude', 'sw.js'];

function lister(dossier) {
  const res = [];
  for (const nom of readdirSync(dossier)) {
    if (EXCLUS.includes(nom)) continue;
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) res.push(...lister(chemin));
    else if (EXTENSIONS.test(nom)) res.push(relative(RACINE, chemin).split('\\').join('/'));
  }
  return res;
}

const fichiers = lister(RACINE).sort();
const hash = createHash('sha256');
for (const f of fichiers) hash.update(f).update(readFileSync(join(RACINE, f)));
const version = hash.digest('hex').slice(0, 12);

const cheminSw = join(RACINE, 'sw.js');
const sw = readFileSync(cheminSw, 'utf8');
const liste = ['./', ...fichiers];
const bloc = `// FICHIERS-DEBUT\nconst FICHIERS = [\n${liste.map(f => `  '${f}'`).join(',\n')}\n];\n// FICHIERS-FIN`;

if (process.argv.includes('--maj')) {
  const nouveau = sw
    .replace(/\/\/ FICHIERS-DEBUT[\s\S]*\/\/ FICHIERS-FIN/, bloc)
    .replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`);
  writeFileSync(cheminSw, nouveau);
  console.log(`sw.js mis à jour : ${liste.length} fichiers, VERSION ${version}`);
} else {
  const actuels = (sw.match(/\/\/ FICHIERS-DEBUT([\s\S]*)\/\/ FICHIERS-FIN/)?.[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
  const manquants = liste.filter(f => !actuels.includes(f));
  const enTrop = actuels.filter(f => !liste.includes(f));
  const versionOk = sw.includes(`const VERSION = '${version}';`);
  if (manquants.length || enTrop.length || !versionOk) {
    if (manquants.length) console.log('Manquants :', manquants.join(', '));
    if (enTrop.length) console.log('En trop :', enTrop.join(', '));
    if (!versionOk) console.log(`VERSION périmée (attendue : ${version})`);
    console.log('→ lance : node tests/verifier-sw.mjs --maj');
    process.exit(1);
  }
  console.log(`✓ sw.js à jour : ${liste.length} fichiers, VERSION ${version}`);
}
