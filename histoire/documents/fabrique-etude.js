// Fabrique des sujets « Étude de document » (DNB 2027, histoire, exercice 1 — voir docs/attendus-2027.md) :
// 1. Repères chronologiques (dates, corrigées automatiquement)
// 2. Prélèvement d'informations (réponses de 1 à 2 phrases rédigées)
// 3. Analyse (explication, puis question sur les deux documents en au moins 4 phrases)
// Les sujets sont tirés au hasard : documents, questions et repères changent à chaque fois.
//
// Banque de documents d'un chapitre :
// { documents: [{ id, titre, html, source, image?, prelevement: [{ consigne, mots, corrige }],
//                 analyse: [{ consigne, mots, corrige, repere? }] }],
//   syntheses: [{ docs: [id, id], consigne, mots, corrige }],
//   reperes?: [noms d'événements d'autres chapitres à proposer aussi] }
// mots : [[variante, variante…], …] — mots-clés attendus (indices automatiques, jamais une note).
// image : identifiant dans histoire/images/credits.json ; un document dont l'image n'est pas « validee » est écarté.
import { DONNEES } from '../donnees/index.js';
import { imageValidee } from '../images/images.js';

const tousEvenements = () => DONNEES.flatMap(d => d.evenements);

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
    generer(rng) {
      // Un sujet à deux documents (avec question de synthèse) si possible, sinon un seul document
      const syntheses = (banque.syntheses || []).filter(s => s.docs.every(id => documents.some(d => d.id === id)));
      const synthese = syntheses.length && rng.bool(0.75) ? rng.choix(syntheses) : null;
      const docs = synthese ? synthese.docs.map(id => documents.find(d => d.id === id)) : [rng.choix(documents)];

      // Repères : deux dates, de préférence des repères du brevet du chapitre (et des repères liés)
      const candidats = [...donnees.evenements, ...tousEvenements().filter(e => (banque.reperes || []).includes(e.nom))]
        .filter(e => !e.fin && !e.nomDate);
      const prioritaires = candidats.filter(e => e.repere);
      const reperes = [];
      for (const e of rng.melanger([...rng.melanger(prioritaires), ...rng.melanger(candidats)])) {
        if (reperes.length === 2) break;
        if (!reperes.some(r => r.nom === e.nom || r.annee === e.annee)) reperes.push(e);
      }
      reperes.sort((a, b) => a.annee - b.annee);

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
        intro: 'Lis les documents, puis réponds dans l\'ordre : repères, prélèvement d\'informations, analyse.',
        documents: docs.map(d => ({ titre: d.titre, html: d.html, source: d.source })),
        questions
      };
    }
  };
}
