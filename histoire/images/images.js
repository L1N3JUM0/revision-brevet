// Fichier généré par outils/images.mjs à partir de credits.json : ne pas modifier à la main.
// Une image n'est affichée sur le site que si son statut est « validee » (vérifiée par Julien).
export const IMAGES = [
  {"id":"de-gaulle-londres","chapitre":"france-occupee","exercice":"qui","reponse":"Charles de Gaulle","distracteurs":["Philippe Pétain","Jean Moulin","Pierre Laval"],"recherche":"Charles de Gaulle 1942 portrait London","attendu":"Portrait du général de Gaulle pendant la guerre (1940-1944)","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"petain-portrait","chapitre":"france-occupee","exercice":"qui","reponse":"Philippe Pétain","distracteurs":["Charles de Gaulle","Georges Clemenceau","Jean Moulin"],"recherche":"Philippe Pétain portrait 1941","attendu":"Portrait officiel du maréchal Pétain, chef de l'État français","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"jean-moulin","chapitre":"france-occupee","exercice":"qui","reponse":"Jean Moulin","distracteurs":["Charles de Gaulle","Pierre Laval","Philippe Leclerc de Hauteclocque"],"recherche":"Jean Moulin écharpe photographie","attendu":"Photographie de Jean Moulin (écharpe et chapeau), années 1930","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"croix-de-lorraine","chapitre":"france-occupee","exercice":"symbole","reponse":"La croix de Lorraine, symbole de la France libre","distracteurs":["La francisque, symbole du régime de Vichy","La croix gammée, symbole du nazisme","La faucille et le marteau, symbole du communisme"],"recherche":"Flag of Free France 1940-1944","attendu":"Drapeau tricolore de la France libre avec la croix de Lorraine","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"clemenceau","chapitre":"premiere-guerre","exercice":"qui","reponse":"Georges Clemenceau","distracteurs":["Philippe Pétain","Woodrow Wilson","Guillaume II"],"recherche":"Georges Clemenceau Nadar portrait","attendu":"Portrait photographique de Georges Clemenceau","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"affiche-mobilisation-1914","chapitre":"premiere-guerre","exercice":"date","reponse":"1914","distracteurs":["1870","1918","1939"],"recherche":"Ordre de mobilisation générale 1914 affiche","attendu":"Affiche de l'ordre de mobilisation générale du 1er août 1914","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"churchill","chapitre":"seconde-guerre","exercice":"qui","reponse":"Winston Churchill","distracteurs":["Franklin D. Roosevelt","Joseph Staline","Charles de Gaulle"],"recherche":"Winston Churchill 1941 portrait","attendu":"Portrait de Winston Churchill, Premier ministre britannique","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"drapeau-urss","chapitre":"guerre-froide","exercice":"symbole","reponse":"La faucille et le marteau, symbole du communisme","distracteurs":["La croix de Lorraine, symbole de la France libre","Les douze étoiles, symbole de l'Union européenne","La bannière étoilée, symbole des États-Unis"],"recherche":"Flag of the Soviet Union","attendu":"Drapeau de l'URSS (faucille et marteau)","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"mur-berlin-1989","chapitre":"guerre-froide","exercice":"date","reponse":"1989","distracteurs":["1961","1945","1991"],"recherche":"Berlin Wall November 1989 Brandenburg Gate","attendu":"Photographie de Berlinois sur le mur devant la porte de Brandebourg, novembre 1989","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"drapeau-europe","chapitre":"europe","exercice":"symbole","reponse":"Les douze étoiles, symbole de l'Union européenne","distracteurs":["La faucille et le marteau, symbole du communisme","La croix de Lorraine, symbole de la France libre","La bannière étoilée, symbole des États-Unis"],"recherche":"Flag of Europe","attendu":"Drapeau européen (cercle de douze étoiles dorées sur fond bleu)","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"simone-veil","chapitre":"societe-1950-1980","exercice":"qui","reponse":"Simone Veil","distracteurs":["Gisèle Halimi","Louise Weiss","Marie Curie"],"recherche":"Simone Veil 1975 portrait","attendu":"Portrait de Simone Veil, ministre de la Santé (années 1970)","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"},
  {"id":"de-gaulle-president","chapitre":"cinquieme-republique","exercice":"qui","reponse":"Charles de Gaulle","distracteurs":["Georges Pompidou","François Mitterrand","Valéry Giscard d'Estaing"],"recherche":"Charles de Gaulle 1961 president portrait","attendu":"Portrait du président de Gaulle (années 1960)","commons":null,"fichier":null,"licence":null,"auteur":null,"date":null,"url":null,"statut":"a_rechercher"}
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
  return `${im.auteur || 'Auteur inconnu'}${im.date ? `, ${im.date}` : ''} · ${im.licence} · Wikimedia Commons`;
}
