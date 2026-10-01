// Rendu des cartes de France en SVG (fond généré par outils/cartes.mjs).
// carte({ fleuves, massifs, villes, etiquettes, zones, mers }) : chaque couche est optionnelle.
import { LARGEUR, HAUTEUR, projeter, CONTOUR, VOISINS, FLEUVES, MASSIFS } from './france.js';

// Aires urbaines (centre de la ville principale, en degrés)
export const VILLES = {
  paris: { nom: 'Paris', lon: 2.35, lat: 48.86 },
  lyon: { nom: 'Lyon', lon: 4.84, lat: 45.76 },
  marseille: { nom: 'Marseille', lon: 5.37, lat: 43.30 },
  toulouse: { nom: 'Toulouse', lon: 1.44, lat: 43.60 },
  lille: { nom: 'Lille', lon: 3.06, lat: 50.63 },
  bordeaux: { nom: 'Bordeaux', lon: -0.58, lat: 44.84 },
  nantes: { nom: 'Nantes', lon: -1.55, lat: 47.22 },
  nice: { nom: 'Nice', lon: 7.26, lat: 43.71 },
  strasbourg: { nom: 'Strasbourg', lon: 7.75, lat: 48.57 },
  rennes: { nom: 'Rennes', lon: -1.68, lat: 48.11 },
  montpellier: { nom: 'Montpellier', lon: 3.88, lat: 43.61 },
  grenoble: { nom: 'Grenoble', lon: 5.72, lat: 45.19 },
  rouen: { nom: 'Rouen', lon: 1.10, lat: 49.44 }
};

export const NOMS_FLEUVES = { seine: 'la Seine', loire: 'la Loire', garonne: 'la Garonne', rhone: 'le Rhône', rhin: 'le Rhin' };
export const NOMS_MASSIFS = { alpes: 'les Alpes', pyrenees: 'les Pyrénées', 'massif-central': 'le Massif central', jura: 'le Jura', vosges: 'les Vosges' };

// Mers et océans : position de l'étiquette
export const MERS = {
  manche: { nom: 'la Manche', court: 'Manche', lon: -2.4, lat: 49.95 },
  atlantique: { nom: 'l\'océan Atlantique', court: 'Océan Atlantique', lon: -3.4, lat: 45.3 },
  mediterranee: { nom: 'la mer Méditerranée', court: 'Mer Méditerranée', lon: 5.0, lat: 42.5 },
  nord: { nom: 'la mer du Nord', court: 'Mer du Nord', lon: 2.6, lat: 51.55 }
};

// Position d'une lettre sur chaque massif (pour « localiser »)
export const CENTRES_MASSIFS = {
  alpes: [6.5, 45.2], pyrenees: [0.6, 42.75], 'massif-central': [2.9, 45.3], jura: [5.85, 46.65], vosges: [6.95, 48.2]
};

export { projeter, LARGEUR, HAUTEUR };
export const ACCENT = 'var(--accent, #22c55e)';

const r1 = v => Math.round(v * 10) / 10;

/**
 * @param {object} o
 *  fleuves : { id: 'normal' | 'actif' }    massifs : { id: 'normal' | 'actif' }
 *  villes : [{ lon, lat, lettre?, actif?, taille? }]   zones : [{ d, fill, motif?, lettre?, lx?, ly? }]
 *  etiquettes : [{ lon, lat, texte }]   traits : [{ d, stroke, largeur, tirets? }]
 */
export function carte(o = {}) {
  const { fleuves = {}, massifs = {}, villes = [], zones = [], etiquettes = [], traits = [], titre = 'Carte de la France' } = o;
  const id = `c${Math.random().toString(36).slice(2, 8)}`;
  const parties = [];
  parties.push(`<defs><clipPath id="${id}"><rect width="${LARGEUR}" height="${HAUTEUR}" rx="12"/></clipPath>
    <pattern id="${id}h" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#f59e0b" stroke-width="2.2"/></pattern></defs>`);
  parties.push(`<g clip-path="url(#${id})"><rect width="${LARGEUR}" height="${HAUTEUR}" fill="#16324a"/>`);
  parties.push(`<path d="${VOISINS}" fill="#2a2d38" stroke="#3b3f4d" stroke-width="0.6"/>`);
  parties.push(`<path d="${CONTOUR}" fill="#3a3f52" stroke="#c9cdd8" stroke-width="1.1" stroke-linejoin="round"/>`);
  for (const z of zones) parties.push(`<path d="${z.d}" fill="${z.motif ? `url(#${id}h)` : z.fill}" fill-opacity="${z.motif ? 1 : z.opacite ?? 0.75}" stroke="${z.contour || 'none'}" stroke-width="1.2"/>`);
  for (const [m, etat] of Object.entries(massifs)) {
    const actif = etat === 'actif';
    parties.push(`<path d="${MASSIFS[m]}" fill="${actif ? '#f59e0b' : '#8b6b4a'}" fill-opacity="${actif ? 0.9 : 0.55}" stroke="${actif ? '#fff' : 'none'}" stroke-width="${actif ? 1.5 : 0}"/>`);
  }
  for (const [f, etat] of Object.entries(fleuves)) {
    const actif = etat === 'actif';
    parties.push(`<path d="${FLEUVES[f]}" fill="none" stroke="${actif ? '#f59e0b' : '#60a5fa'}" stroke-width="${actif ? 4 : 2}" stroke-linecap="round" stroke-linejoin="round"/>`);
  }
  for (const t of traits) parties.push(`<path d="${t.d}" fill="none" stroke="${t.stroke}" stroke-width="${t.largeur || 3}" ${t.tirets ? `stroke-dasharray="${t.tirets}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`);
  parties.push('</g>');
  // Échelle (200 km) et nord, comme sur le fond de carte du brevet
  const km200 = r1(projeter(0, 46)[1] - projeter(0, 46 + 200 / 111.2)[1]);
  parties.push(`<g fill="#c9cdd8" font-size="11" font-weight="600"><rect x="14" y="${HAUTEUR - 22}" width="${km200}" height="4" fill="#c9cdd8"/><text x="14" y="${HAUTEUR - 28}">200 km</text>
    <path d="M${LARGEUR - 22} 14l7 18h-14z" fill="#c9cdd8"/><text x="${LARGEUR - 22}" y="46" text-anchor="middle">N</text></g>`);
  for (const v of villes) {
    const [x, y] = projeter(v.lon, v.lat);
    const r = v.taille || (v.actif ? 7 : 5);
    parties.push(`<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${v.actif ? '#f59e0b' : v.fill || '#ef4444'}" stroke="#fff" stroke-width="${v.actif ? 2.5 : 1.5}"/>`);
    if (v.lettre) parties.push(etiquette(x + r + 3, y - r - 2, v.lettre, true));
  }
  for (const z of zones.filter(z => z.lettre)) parties.push(etiquette(z.lx, z.ly, z.lettre, true));
  for (const e of etiquettes) {
    const [x, y] = e.lon !== undefined ? projeter(e.lon, e.lat) : [e.x, e.y];
    parties.push(etiquette(x, y, e.texte, e.pastille));
  }
  return `<svg class="carte-geo" viewBox="0 0 ${LARGEUR} ${HAUTEUR}" role="img" aria-label="${titre}" xmlns="http://www.w3.org/2000/svg">${parties.join('')}</svg>`;
}

function etiquette(x, y, texte, pastille) {
  if (pastille) {
    return `<g><circle cx="${r1(x)}" cy="${r1(y)}" r="11" fill="#0e0e14" stroke="#fff" stroke-width="1.5"/><text x="${r1(x)}" y="${r1(y + 4.5)}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${texte}</text></g>`;
  }
  return `<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" font-size="12" font-style="italic" font-weight="600" fill="#bcd7f0" stroke="#16324a" stroke-width="3" paint-order="stroke">${texte}</text>`;
}

// Chemin SVG à partir d'une liste de points [lon, lat]
export function cheminGeo(points, ferme = true) {
  return `M${points.map(([lon, lat]) => projeter(lon, lat).map(r1).join(' ')).join('L')}${ferme ? 'Z' : ''}`;
}
