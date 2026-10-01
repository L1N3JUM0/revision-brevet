// Fiche « Explique-moi plus » : la Terre (plaques, séismes, volcans). Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'La surface de la Terre est découpée en plaques qui bougent lentement ; leurs frontières concentrent séismes et volcans.',
      pourquoi: `<p>Quelques centimètres par an, ça paraît rien. Mais en 10 millions d'années, 2 cm/an font 20 000 000 cm, soit <strong>200 km</strong>. C'est ainsi que l'Atlantique s'est ouvert.</p>
        <p>Là où les plaques se frottent ou plongent l'une sous l'autre, les roches accumulent des tensions puis cassent brutalement : c'est un <strong>séisme</strong>.</p>`,
      pieges: [
        { faux: '20 000 000 cm = 20 000 km.', juste: '1 km = 100 000 cm : 20 000 000 ÷ 100 000 = <strong>200 km</strong>.' },
        { faux: 'L\'épicentre est en profondeur.', juste: 'Le <strong>foyer</strong> est en profondeur ; l\'épicentre est le point de la surface juste au-dessus.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('plaques') },
      verif: { niveaux: [1, 2], filtre: prefixe('plaques', 'seisme', 'classe') },
      recherche: 'tectonique des plaques séismes volcans'
    },
    vocabulaire({
      pieges: [
        { faux: 'Aléa et risque, c\'est pareil.', juste: 'L\'<strong>aléa</strong> est le phénomène ; le <strong>risque</strong> tient compte des personnes et des biens exposés.' },
        { faux: 'Dorsale = zone où une plaque plonge.', juste: '<strong>Dorsale</strong> : les plaques s\'écartent. <strong>Subduction</strong> : une plaque plonge.' }
      ],
      recherche: 'dorsale subduction foyer épicentre'
    })
  ]
};
