// Fiche « Explique-moi plus » des angles et parallèles : une section par carte du cours flash
// (même ordre que gen.cours). Voir assets/js/ui/approfondir.js pour le format.
import { figureCours } from '../generators/angles.js';

const relation = r => (c, exo) => /^reconnaitre:/.test(c) && exo.donnees?.relation === r;

export default {
  sections: [
    {
      titre: 'Alternes-internes',
      idee: 'Deux angles alternes-internes sont de part et d\'autre de la sécante, et tous les deux entre les deux droites.',
      pourquoi: `<p>Le nom dit tout :</p>
        <ul>
          <li><strong>alternes</strong> : un de chaque côté de la sécante ;</li>
          <li><strong>internes</strong> : à l'intérieur de la bande formée par les deux droites.</li>
        </ul>
        <p>Ils dessinent souvent un « Z » (ou un « N »).</p>`,
      figure: figureCours({ 3: '3', 5: '5' }),
      pieges: [
        { faux: 'Deux angles du même côté de la sécante, entre les droites.', juste: 'Ils doivent être de part et d\'autre de la sécante (alternes).' },
        { faux: 'Un angle au-dessus des deux droites et un entre elles.', juste: 'Les deux angles doivent être <strong>entre</strong> les deux droites (internes).' }
      ],
      exemple: { niveau: 1, filtre: relation('alternes-internes') },
      verif: { niveaux: [1, 1], filtre: c => /^reconnaitre:/.test(c) },
      recherche: 'angles alternes-internes'
    },
    {
      titre: 'Correspondants',
      idee: 'Deux angles correspondants sont du même côté de la sécante et occupent la même position par rapport à chacune des deux droites.',
      pourquoi: `<p>Imagine qu'on fasse glisser la première droite le long de la sécante jusqu'à la seconde : l'angle vient se poser exactement sur son correspondant.</p>
        <p>Ils dessinent souvent un « F ».</p>`,
      figure: figureCours({ 1: '1', 5: '5' }),
      pieges: [
        { faux: 'Deux angles qui ont le même sommet, face à face.', juste: 'Ceux-là sont <strong>opposés par le sommet</strong> (toujours égaux), pas correspondants.' },
        { faux: 'Un angle au-dessus d\'une droite et l\'autre au-dessous de l\'autre droite.', juste: 'Correspondants : même côté de la sécante <strong>et</strong> même position (tous deux au-dessus, par exemple).' }
      ],
      exemple: { niveau: 1, filtre: relation('correspondants') },
      verif: { niveaux: [1, 1], filtre: c => /^reconnaitre:/.test(c) },
      recherche: 'angles correspondants'
    },
    {
      titre: 'La propriété',
      idee: 'Si deux droites sont parallèles, les angles alternes-internes qu\'elles forment avec une sécante ont la même mesure ; les angles correspondants aussi.',
      pourquoi: `<p>Deux droites parallèles ont la même direction : la sécante les coupe avec la même « inclinaison ». En faisant glisser une droite sur l'autre, rien ne change : les angles correspondants sont égaux.</p>
        <p>Et comme deux angles opposés par le sommet sont égaux, les alternes-internes le sont aussi. Deux angles qui forment un angle plat font 180° à eux deux.</p>`,
      figure: figureCours({ 3: '60°', 5: '?' }),
      pieges: [
        { faux: 'J\'utilise la propriété sans savoir si les droites sont parallèles.', juste: 'La propriété ne marche que si les droites sont <strong>parallèles</strong> : écris-le dans la rédaction.' },
        { faux: 'L\'angle voisin mesure aussi 60°.', juste: 'Deux angles qui forment un angle plat sont supplémentaires : 180° − 60° = <strong>120°</strong>.' }
      ],
      exemple: { niveau: 2, filtre: c => /^calculer:/.test(c) },
      verif: { niveaux: [2, 3], filtre: c => /^calculer:/.test(c) },
      recherche: 'angles alternes-internes droites parallèles calculer un angle'
    },
    {
      titre: 'Prouver que deux droites sont parallèles',
      idee: 'Si deux angles alternes-internes (ou correspondants) ont la même mesure, les droites sont parallèles ; s\'ils sont différents, elles ne le sont pas.',
      pourquoi: `<p>C'est la <strong>réciproque</strong> de la propriété : des angles égaux suffisent pour conclure que les droites sont parallèles.</p>
        <p>Et si les angles sont différents, les droites ne peuvent pas être parallèles : avec des parallèles, ils seraient égaux.</p>`,
      pieges: [
        { faux: 'Les droites ont l\'air parallèles sur le dessin.', juste: 'Un dessin ne prouve rien : seule la comparaison des angles permet de conclure.' },
        { faux: 'Je compare deux angles quelconques de la figure.', juste: 'Les angles comparés doivent être <strong>alternes-internes</strong> ou <strong>correspondants</strong>.' }
      ],
      exemple: { niveau: 3, filtre: c => /^parallelisme:/.test(c) },
      verif: { niveaux: [3, 3], filtre: c => /^parallelisme:/.test(c) },
      recherche: 'démontrer que deux droites sont parallèles angles'
    }
  ]
};
