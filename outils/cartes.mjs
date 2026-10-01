// Outil de développement (Node + curl, sans dépendance npm) : fonds de carte de la France en SVG.
//
//   node outils/cartes.mjs     télécharge les données ouvertes (mises en cache dans outils/.cache)
//                              et écrit geographie/cartes/france.js
//
// Sources (données ouvertes) :
//  - contour de la France métropolitaine : france-geojson (G. David), d'après les contours administratifs
//    de l'IGN (Admin Express), licence ouverte Etalab ;
//  - fleuves, massifs, pays voisins : Natural Earth (domaine public).
// Projection : équirectangulaire corrigée par cos(46,5°), suffisante à l'échelle de la France.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = join(RACINE, 'outils/.cache');
const GH = 'https://raw.githubusercontent.com';
const SOURCES = {
  france: `${GH}/gregoiredavid/france-geojson/master/metropole-version-simplifiee.geojson`,
  fleuves: `${GH}/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson`,
  reliefs: `${GH}/nvkelso/natural-earth-vector/master/geojson/ne_10m_geography_regions_polys.geojson`,
  pays: `${GH}/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson`
};

function charger(nom) {
  mkdirSync(CACHE, { recursive: true });
  const f = join(CACHE, `${nom}.geojson`);
  if (!existsSync(f)) execFileSync('curl', ['-sSL', '--fail', '-m', '300', '-o', f, SOURCES[nom]]);
  return JSON.parse(readFileSync(f, 'utf8'));
}

// Cadre : de la pointe de Bretagne à la Corse, des Pyrénées à la mer du Nord
const LON0 = -5.6, LON1 = 10.0, LAT0 = 51.8, LAT1 = 41.2;
const COS = Math.cos(46.5 * Math.PI / 180);
const L = 400;
const K = L / ((LON1 - LON0) * COS);
const H = Math.round((LAT0 - LAT1) * K);
const proj = ([lon, lat]) => [(lon - LON0) * COS * K, (LAT0 - lat) * K];

// Douglas-Peucker en pixels
function simplifier(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const d = dx || dy ? Math.abs(dy * x - dx * y + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy) : Math.hypot(x - a[0], y - a[1]);
    if (d > max) { max = d; idx = i; }
  }
  if (max <= tol) return [a, b];
  return [...simplifier(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplifier(pts.slice(idx), tol)];
}

const dansCadre = ([x, y], marge = 60) => x > -marge && x < L + marge && y > -marge && y < H + marge;
const r1 = v => Math.round(v * 10) / 10;

function cheminLigne(lignes, tol, ferme) {
  return lignes.map(l => simplifier(l.map(proj), tol))
    .filter(l => l.length >= 2 && l.some(p => dansCadre(p)) && (!ferme || l.length >= 3))
    .map(l => `M${l.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}${ferme ? 'Z' : ''}`).join('');
}
const anneaux = g => (g.type === 'Polygon' ? g.coordinates : g.type === 'MultiPolygon' ? g.coordinates.flat() : []);
const lignes = g => (g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []);

// --- France métropolitaine (Corse comprise)
const france = charger('france');
const contour = cheminLigne((france.features || [france]).flatMap(f => anneaux(f.geometry)), 0.5, true);

// --- Pays voisins (fond grisé)
const pays = charger('pays');
const VOISINS = ['Spain', 'Andorra', 'Italy', 'Switzerland', 'Germany', 'Belgium', 'Luxembourg', 'Netherlands', 'United Kingdom', 'Austria', 'Monaco'];
const voisins = cheminLigne(pays.features.filter(f => VOISINS.includes(f.properties.ADMIN)).flatMap(f => anneaux(f.geometry)), 0.8, true);

// --- Fleuves (les cinq grands fleuves français)
const NOMS_FLEUVES = { seine: ['Seine'], loire: ['Loire'], garonne: ['Garonne'], rhone: ['Rhône', 'Rhne'], rhin: ['Rhin', 'Rhein', 'Rhine'] };
const fl = charger('fleuves');
const fleuves = {};
for (const [id, noms] of Object.entries(NOMS_FLEUVES)) {
  const ls = fl.features.filter(f => noms.includes(f.properties.name)).flatMap(f => lignes(f.geometry))
    .filter(l => l.some(([lon, lat]) => lon > LON0 && lon < LON1 && lat > LAT1 && lat < LAT0));
  fleuves[id] = cheminLigne(ls, 0.6, false);
}

// --- Massifs
const NOMS_MASSIFS = { alpes: 'ALPS', pyrenees: 'PYRENEES', 'massif-central': 'Massif Central', jura: 'Jura', vosges: 'Vosges' };
const rel = charger('reliefs');
const massifs = {};
for (const [id, nom] of Object.entries(NOMS_MASSIFS)) {
  const f = rel.features.find(x => x.properties.NAME === nom);
  massifs[id] = cheminLigne(anneaux(f.geometry), 0.6, true);
}

const sortie = `// Fichier généré par outils/cartes.mjs : ne pas modifier à la main.
// Données : contour de la France d'après l'IGN (Admin Express, licence ouverte Etalab, via france-geojson) ;
// fleuves, massifs et pays voisins : Natural Earth (domaine public).
// Projection équirectangulaire (cos 46,5°) : x vers l'est, y vers le sud, en pixels.

export const LARGEUR = ${L};
export const HAUTEUR = ${H};

export function projeter(lon, lat) {
  return [(lon - ${LON0}) * ${COS.toFixed(6)} * ${K.toFixed(4)}, (${LAT0} - lat) * ${K.toFixed(4)}];
}

export const CONTOUR = '${contour}';

export const VOISINS = '${voisins}';

export const FLEUVES = ${JSON.stringify(fleuves, null, 2)};

export const MASSIFS = ${JSON.stringify(massifs, null, 2)};
`;
writeFileSync(join(RACINE, 'geographie/cartes/france.js'), sortie);
console.log(`france.js : ${L}×${H}, ${Math.round(sortie.length / 1024)} Ko`);
