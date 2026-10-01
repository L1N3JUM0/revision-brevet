// Outil de développement (Node + curl + ImageMagick, sans dépendance npm) : images d'histoire.
//
//   node outils/images.mjs --chercher            propose des fichiers Commons pour les images « a_rechercher »
//   node outils/images.mjs --telecharger         télécharge les images dont le champ « commons » est rempli,
//                                                vérifie la licence, convertit en WebP (800 px max, < 120 Ko)
//                                                et passe leur statut à « en_attente »
//   node outils/images.mjs --valider <id>        marque une image vérifiée par Julien : statut « validee »
//   node outils/images.mjs                       régénère seulement images.js et docs/images-a-verifier.md
//
// Source unique : Wikimedia Commons. Licences acceptées : domaine public, CC0, CC BY, CC BY-SA.
// credits.json est la source de vérité ; histoire/images/images.js en est une copie lisible par le site.
import { readFileSync, writeFileSync, existsSync, statSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER = join(RACINE, 'histoire/images');
const CREDITS = join(DOSSIER, 'credits.json');
const API = 'https://commons.wikimedia.org/w/api.php';
const TAILLE_MAX = 120 * 1024;
const LICENCES = [/^public domain/i, /^pd/i, /^cc0/i, /^cc by(-sa)? \d/i, /^cc-by(-sa)?-\d/i];

const lire = () => JSON.parse(readFileSync(CREDITS, 'utf8'));
const ecrire = d => writeFileSync(CREDITS, JSON.stringify(d, null, 2) + '\n');
const curl = (url, sortie) => execFileSync('curl', ['-sSL', '--fail', '-m', '60', '-A', 'revision-brevet/1.0 (outil de dev)', ...(sortie ? ['-o', sortie] : []), url], { maxBuffer: 50e6 }).toString();
const api = params => JSON.parse(curl(`${API}?${new URLSearchParams({ format: 'json', ...params })}`));
const texte = html => String(html || '').replace(/<[^>]+>/g, '').trim();

function infos(titre) {
  const r = api({ action: 'query', titles: titre.startsWith('File:') ? titre : `File:${titre}`, prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1600' });
  const page = Object.values(r.query.pages)[0];
  const ii = page.imageinfo?.[0];
  if (!ii) throw new Error(`fichier introuvable : ${titre}`);
  const m = ii.extmetadata || {};
  return {
    url: ii.descriptionurl,
    telechargement: ii.thumburl || ii.url,
    licence: texte(m.LicenseShortName?.value),
    auteur: texte(m.Artist?.value) || 'inconnu',
    date: texte(m.DateTimeOriginal?.value) || null
  };
}

function chercher(d) {
  for (const im of d.images.filter(x => x.statut === 'a_rechercher')) {
    console.log(`\n## ${im.id} — ${im.attendu}`);
    try {
      const r = api({ action: 'query', list: 'search', srnamespace: '6', srlimit: '5', srsearch: im.recherche });
      for (const s of r.query.search) {
        let lic = '?';
        try { lic = infos(s.title).licence; } catch { /* ignoré */ }
        console.log(`  ${s.title}  [${lic}]`);
      }
    } catch (e) {
      console.log(`  ✗ recherche impossible : ${e.message.split('\n')[0]}`);
    }
  }
  console.log('\nCopie le titre choisi dans le champ « commons » de credits.json, puis lance --telecharger.');
}

function convertir(source, cible) {
  // Qualité décroissante jusqu'à passer sous 120 Ko
  for (const q of [80, 72, 64, 56, 48, 40]) {
    execFileSync('convert', [source, '-auto-orient', '-strip', '-resize', '800x800>', '-quality', String(q), cible]);
    if (statSync(cible).size < TAILLE_MAX) return q;
  }
  throw new Error('impossible de descendre sous 120 Ko');
}

function telecharger(d) {
  for (const im of d.images.filter(x => x.commons && x.statut === 'a_rechercher')) {
    try {
      const i = infos(im.commons);
      if (!LICENCES.some(re => re.test(i.licence))) throw new Error(`licence refusée : ${i.licence}`);
      const brut = join(DOSSIER, `${im.id}.source`);
      curl(i.telechargement, brut);
      const q = convertir(brut, join(DOSSIER, `${im.id}.webp`));
      unlinkSync(brut);
      Object.assign(im, { fichier: `${im.id}.webp`, licence: i.licence, auteur: i.auteur, date: i.date, url: i.url, statut: 'en_attente' });
      console.log(`✓ ${im.id} : ${i.licence}, qualité ${q}, ${Math.round(statSync(join(DOSSIER, im.fichier)).size / 1024)} Ko`);
    } catch (e) {
      console.log(`✗ ${im.id} : ${e.message.split('\n')[0]}`);
    }
  }
}

// Copie JS de credits.json (le site et les tests la lisent sans import JSON)
function genererModule(d) {
  const lignes = d.images.map(im => `  ${JSON.stringify(im)}`).join(',\n');
  writeFileSync(join(DOSSIER, 'images.js'), `// Fichier généré par outils/images.mjs à partir de credits.json : ne pas modifier à la main.
// Une image n'est affichée sur le site que si son statut est « validee » (vérifiée par Julien).
export const IMAGES = [
${lignes}
];

export function imageValidee(id) {
  const im = IMAGES.find(x => x.id === id);
  return !!(im && im.statut === 'validee' && im.fichier);
}

export function imagesValidees(chapitre) {
  return IMAGES.filter(x => x.statut === 'validee' && x.fichier && (!chapitre || x.chapitre === chapitre));
}

// Légende de crédit affichée sous chaque image
export function credit(im) {
  return \`\${im.auteur || 'Auteur inconnu'}\${im.date ? \`, \${im.date}\` : ''} · \${im.licence} · Wikimedia Commons\`;
}
`);
}

function genererListe(d) {
  const lignes = d.images.map(im => `| ${im.id} | ${im.fichier || '—'} | ${im.attendu} | ${im.date || '?'} | ${im.licence || '?'} | ${im.url || '—'} | ${im.statut} |`);
  writeFileSync(join(RACINE, 'docs/images-a-verifier.md'), `# Images d'histoire à vérifier

Généré par \`node outils/images.mjs\` à partir de \`histoire/images/credits.json\`.
Une image n'apparaît sur le site qu'après validation (\`node outils/images.mjs --valider <id>\`).
Les exercices « Qui est-ce ? », « Quel symbole ? » et « Date ce document » ne sont produits qu'avec des images validées.

| id | fichier | identification attendue (qui / quoi) | date | licence | URL source | statut |
|---|---|---|---|---|---|---|
${lignes.join('\n')}

Statuts : **a_rechercher** (fichier Commons pas encore choisi), **en_attente** (téléchargée, à vérifier), **validee**, **refusee**.
`);
}

const d = lire();
const args = process.argv.slice(2);
if (args[0] === '--chercher') chercher(d);
if (args[0] === '--telecharger') telecharger(d);
if (args[0] === '--valider') {
  const im = d.images.find(x => x.id === args[1]);
  if (!im || !im.fichier || !existsSync(join(DOSSIER, im.fichier))) { console.log('image introuvable ou pas encore téléchargée'); process.exit(1); }
  im.statut = 'validee';
  console.log(`✓ ${im.id} validée`);
}
ecrire(d);
genererModule(d);
genererListe(d);
console.log(`${d.images.length} images · ${d.images.filter(x => x.statut === 'validee').length} validée(s) · images.js et docs/images-a-verifier.md à jour`);
