// Fiche « Explique-moi plus » : atomes, molécules et ions. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Un atome est un noyau (protons + neutrons) entouré d\'électrons ; il est neutre car il a autant d\'électrons que de protons.',
      pourquoi: `<p>Chaque proton porte une charge <strong>+</strong>, chaque électron une charge <strong>−</strong>. Avec autant de chaque, les charges s'annulent : l'atome est <strong>neutre</strong>.</p>
        <p>Si l'atome perd des électrons, il a plus de + que de − : il devient un <strong>ion positif</strong> (Na⁺). S'il en gagne, il devient un <strong>ion négatif</strong> (Cl⁻). Le noyau, lui, ne change jamais.</p>
        <p>Neutrons = A − Z (nombre de nucléons moins nombre de protons).</p>`,
      pieges: [
        { faux: 'Na⁺ a gagné un électron.', juste: 'Le « + » veut dire qu\'il en a <strong>perdu</strong> un : 10 électrons au lieu de 11.' },
        { faux: 'Neutrons = A + Z', juste: 'A compte déjà les protons et les neutrons : neutrons = <strong>A − Z</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('ion') },
      verif: { niveaux: [1, 2], filtre: prefixe('protons', 'electrons', 'neutrons', 'ion', 'formule', 'coef') },
      recherche: 'constitution de l\'atome ions'
    },
    {
      titre: 'Tests des ions',
      idee: 'On reconnaît un ion grâce à un réactif qui forme avec lui un précipité d\'une couleur caractéristique.',
      pourquoi: `<p>La soude (hydroxyde de sodium) contient des ions HO⁻ qui s'associent à certains ions métalliques pour former un solide coloré, le <strong>précipité</strong> : bleu pour Cu²⁺, vert pour Fe²⁺, orange rouille pour Fe³⁺, blanc pour Zn²⁺.</p>
        <p>Le nitrate d'argent forme avec les ions chlorure Cl⁻ un précipité blanc qui noircit à la lumière.</p>`,
      pieges: [
        { faux: 'Précipité vert : ions fer III.', juste: 'Vert : <strong>fer II</strong> (Fe²⁺). Fer III (Fe³⁺) : couleur rouille.' },
        { faux: 'Je teste les ions chlorure avec la soude.', juste: 'Les ions chlorure se testent au <strong>nitrate d\'argent</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('test') },
      verif: { niveaux: [2, 3], filtre: prefixe('test') },
      recherche: 'tests d\'identification des ions'
    },
    vocabulaire({
      pieges: [
        { faux: 'Une molécule a une charge électrique.', juste: 'Une molécule est <strong>neutre</strong>. C\'est un ion qui porte une charge.' },
        { faux: 'Cation = ion négatif.', juste: '<strong>Cation</strong> : ion positif. <strong>Anion</strong> : ion négatif.' }
      ],
      recherche: 'atome molécule ion différence'
    })
  ]
};
