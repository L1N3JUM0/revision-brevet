// Analyse des réponses rédigées (sans DOM) : utilisée par ui/redige.js et par les tests.
import { esc } from '../ui/dom.js';

const sansAccents = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '\'');

// Découpe en phrases : un point, un point d'exclamation ou d'interrogation suivi d'un espace ou de la fin
export function compterPhrases(texte) {
  return String(texte).trim().split(/[.!?…]+(?:\s+|$)/).map(s => s.trim()).filter(s => s.split(/\s+/).length >= 3).length;
}

export function analyserReponse(texte, q) {
  const t = String(texte || '').trim();
  const norm = sansAccents(t);
  const indices = [];
  const n = compterPhrases(t);
  if (q.phrases) {
    const [min, max] = q.phrases;
    const ok = n >= min && (!max || n <= max + 1);
    indices.push({ ok, texte: ok ? `${n} phrase${n > 1 ? 's' : ''} : c'est la longueur attendue.` : n < min ? `${n} phrase${n > 1 ? 's' : ''} : il en faut au moins ${min}.` : `${n} phrases : c'est plus long que demandé (${max} au plus).` });
  }
  if (q.lignes) {
    // Environ 10 mots par ligne manuscrite (copie d'élève)
    const lignes = Math.round(t.split(/\s+/).filter(Boolean).length / 10);
    const ok = lignes >= q.lignes;
    indices.push({ ok, texte: ok ? `Environ ${lignes} lignes : c'est la longueur attendue.` : `Environ ${lignes} lignes : il en faut au moins ${q.lignes}.` });
  }
  const debut = /^[A-ZÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ«"]/.test(t), fin = /[.!?»"]$/.test(t);
  indices.push({ ok: debut && fin, texte: debut && fin ? 'Majuscule au début, point à la fin.' : 'Pense à la majuscule au début et au point à la fin.' });
  if (q.mots?.length) {
    const motsTexte = norm.split(/[^a-z0-9'-]+/);
    // Un mot long est reconnu par son radical (« collabore » pour « collaboration »)
    const present = v => {
      const m = sansAccents(v);
      if (norm.includes(m)) return true;
      if (m.includes(' ') || m.length < 7) return false;
      const radical = m.slice(0, Math.max(5, Math.ceil(m.length * 0.6)));
      return motsTexte.some(w => w.startsWith(radical));
    };
    const trouves = q.mots.filter(variantes => variantes.some(present));
    const manquants = q.mots.filter(v => !trouves.includes(v));
    indices.push({
      ok: trouves.length >= Math.ceil(q.mots.length / 2),
      texte: `Mots-clés : ${trouves.length}/${q.mots.length}${manquants.length ? ` · pense à : ${manquants.map(v => `« ${esc(v[0])} »`).join(', ')}` : ' · tous présents'}.`
    });
  }
  if (q.repere) {
    const ok = /\b1[89]\d\d\b|\b20[0-2]\d\b/.test(t);
    indices.push({ ok, texte: ok ? 'Tu cites une date.' : 'Cite un repère : une date précise rend la réponse plus solide.' });
  }
  return indices;
}

// Une date est juste si l'année est la bonne (le jour et le mois sont un bonus)
export function verifierDate(saisie, q) {
  const s = String(saisie || '');
  const annee = s.match(/\b(\d{4})\b/);
  if (!annee) return { valide: false, message: 'Écris au moins l\'année (par exemple 1945).' };
  const correct = Number(annee[1]) === q.annee;
  return { valide: true, correct };
}

// ---------- Écran ----------

