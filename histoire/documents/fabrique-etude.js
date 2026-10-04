// Fabrique des sujets « Étude de document » (DNB 2027, histoire, exercice 1 — voir docs/attendus-2027.md) :
// 1. Repères chronologiques (dates, corrigées automatiquement)
// 2. Prélèvement d'informations (réponses de 1 à 2 phrases rédigées)
// 3. Analyse (explication, puis question sur les deux documents en au moins 4 phrases)
// Les sujets sont tirés au hasard : documents, questions et repères changent à chaque fois.
//
// Banque de documents d'un chapitre :
// { documents: [{ id, titre, html, source, image?, reperes: [nom, nom?], prelevement: [{ consigne, mots, corrige }],
//                 analyse: [{ consigne, mots, corrige, repere? }] }],
//   syntheses: [{ docs: [id, id], reperes: [nom, nom?], consigne, mots, corrige }] }
// reperes : 1 ou 2 noms d'événements (de n'importe quelle banque d'histoire) qui situent ce jeu de documents
// (même période, même événement ou cadre immédiat). Les questions de repères sont tirées UNIQUEMENT là
// (sujet de référence 2027 : les repères demandés sont liés aux documents).
// Un document seul utilise ses propres repères ; un sujet à deux documents utilise ceux de la synthèse.
// mots : [[variante, variante…], …] — mots-clés attendus (indices automatiques, jamais une note).
// image : identifiant dans histoire/images/credits.json ; un document dont l'image n'est pas « validee » est écarté.
import { DONNEES } from '../donnees/index.js';
import { imageValidee } from '../images/images.js';

const tousEvenements = () => DONNEES.flatMap(d => d.evenements);

// Un repère associé doit être un événement daté ponctuel (ni période, ni nom qui contient déjà la date)
export const repereUtilisable = e => !!e && !e.fin && !e.nomDate;

// Événements correspondant aux noms déclarés (la banque du chapitre d'abord, puis les autres)
export function reperesDuJeu(donnees, noms = []) {
  const tous = [...donnees.evenements, ...tousEvenements()];
  return noms.map(nom => tous.find(e => e.nom === nom));
}

function questionRepere(e) {
  return {
    partie: 'Repères chronologiques',
    type: 'date',
    consigne: `Quelle est la date de cet événement : ${e.nom.charAt(0).toLowerCase() + e.nom.slice(1)} ?`,
    annee: e.annee,
    date: e.date || String(e.annee),
    corrige: `<strong>${e.date || e.annee}</strong>. ${e.explication}`,
    evenement: e.nom
  };
}

export function fabriquerEtude(donnees, banque) {
  const documents = banque.documents.filter(d => !d.image || imageValidee(d.image));
  return {
    libelle: 'Étude de document',
    documents,
    tousDocuments: banque.documents,
    syntheses: banque.syntheses || [],
    reperesDe: noms => reperesDuJeu(donnees, noms),
    // Nombre de sujets différents possibles (les repères sont fixés par le jeu de documents)
    variantes: documents.reduce((t, d) => t + d.prelevement.length * d.analyse.length, 0)
      + (banque.syntheses || []).filter(s => s.docs.every(id => documents.some(d => d.id === id)))
        .reduce((t, s) => t + s.docs.reduce((p, id) => { const d = documents.find(x => x.id === id); return p * d.prelevement.length * d.analyse.length; }, 1), 0),
    generer(rng) {
      // Un sujet à deux documents (avec question de synthèse) si possible, sinon un seul document
      const syntheses = (banque.syntheses || []).filter(s => s.docs.every(id => documents.some(d => d.id === id)));
      const synthese = syntheses.length && rng.bool(0.75) ? rng.choix(syntheses) : null;
      const docs = synthese ? synthese.docs.map(id => documents.find(d => d.id === id)) : [rng.choix(documents)];

      // Repères : ceux déclarés pour ce jeu de documents, jamais tirés ailleurs dans la banque
      const reperes = reperesDuJeu(donnees, synthese ? synthese.reperes : docs[0].reperes).filter(repereUtilisable);
      const chrono = e => e.annee * 10000 + (e.mois || 0) * 100 + (e.jour || 0);
      reperes.sort((a, b) => chrono(a) - chrono(b));

      const choisis = docs.map(d => ({ d, p: rng.int(0, d.prelevement.length - 1), a: rng.int(0, d.analyse.length - 1) }));
      const avecNum = (k, q) => (docs.length > 1 ? `<span class="doux">Document ${k + 1}</span> · ${q}` : q);
      const questions = [
        ...reperes.map(questionRepere),
        ...choisis.map(({ d, p }, k) => ({ partie: 'Prélèvement d\'informations', type: 'redige', phrases: [1, 2], doc: k, ...d.prelevement[p], consigne: avecNum(k, d.prelevement[p].consigne) })),
        ...choisis.map(({ d, a }, k) => ({ partie: 'Analyse', type: 'redige', phrases: [2, null], doc: k, ...d.analyse[a], consigne: avecNum(k, d.analyse[a].consigne) })),
        ...(synthese ? [{ partie: 'Analyse', type: 'redige', phrases: [4, null], repere: true, mots: synthese.mots, corrige: synthese.corrige, consigne: `<span class="doux">Documents 1 et 2</span> · ${synthese.consigne} Une réponse rédigée d'au moins quatre phrases est attendue.` }] : [])
      ];
      return {
        cle: `etude:${docs.map(d => d.id).join('+')}:${choisis.map(c => `${c.p}${c.a}`).join('')}:${reperes.map(r => r.annee).join(',')}`,
        titre: `${donnees.titre}`,
        idsDocuments: docs.map(d => d.id),
        intro: 'Lis les documents, puis réponds dans l\'ordre : repères, prélèvement d\'informations, analyse.',
        documents: docs.map(d => ({ titre: d.titre, html: d.html, source: d.source })),
        questions
      };
    }
  };
}
