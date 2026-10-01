// Éléments communs aux fiches « Explique-moi plus » de sciences.
// Les cartes du cours sont produites par la fabrique : « L'essentiel », « Les formules »,
// les cartes propres au chapitre, puis « Le vocabulaire ». Une section par carte, même ordre.

// Lien « Pour aller plus loin » : recherche de vidéos de cours de 3e sur YouTube
export function lien(recherche) {
  return {
    texte: `Vidéos de cours : « ${recherche} »`,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${recherche} 3e cours`)}`
  };
}

// Filtres par préfixe de clé (« ohm:U:… » → ohm)
export const prefixe = (...noms) => c => noms.includes(c.split(':')[0]);

// Section « Le vocabulaire » : même méthode partout, pièges propres au chapitre
export function vocabulaire({ pieges, recherche, niveaux = [1, 2] }) {
  return {
    titre: 'Le vocabulaire',
    idee: 'Au brevet, le mot exact rapporte des points : on apprend chaque mot avec sa définition, et on s\'entraîne dans les deux sens.',
    pourquoi: `<p>Une bonne définition dit <strong>ce qu'est</strong> la chose, puis <strong>ce qui la distingue</strong> des autres. « Un neurone est une cellule (ce que c'est) qui transmet le message nerveux (ce qui la distingue). »</p>
      <p>Méthode : cache la définition et redis-la avec tes mots, puis cache le mot et retrouve-le. Les mots qui se ressemblent s'apprennent <strong>ensemble</strong>, pour ne pas les confondre.</p>`,
    pieges,
    exemple: { niveau: niveaux[0], filtre: prefixe('voc-mot', 'voc-def') },
    verif: { niveaux, filtre: prefixe('voc-mot', 'voc-def') },
    recherche
  };
}
