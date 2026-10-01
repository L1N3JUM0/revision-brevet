// Fiche « Explique-moi plus » : système nerveux et santé. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Un récepteur capte l\'information, un nerf sensitif la transmet au centre nerveux, qui envoie un ordre par un nerf moteur au muscle.',
      pourquoi: `<p>Ce trajet prend un peu de temps : c'est le <strong>temps de réaction</strong> (environ 1 s au volant). Pendant ce temps, une voiture à 90 km/h (25 m/s) parcourt 25 m sans freiner.</p>
        <p>L'alcool, le cannabis ou la fatigue perturbent les synapses, où le message passe d'un neurone à l'autre : le temps de réaction augmente, la distance parcourue aussi.</p>`,
      pieges: [
        { faux: 'À 90 km/h avec 1 s de réaction : 90 m.', juste: 'Convertis d\'abord : 90 km/h = 25 m/s, donc <strong>25 m</strong>.' },
        { faux: 'Le message va du muscle vers le cerveau.', juste: 'Il va du <strong>récepteur</strong> au centre nerveux, puis du centre nerveux au muscle.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('reaction') },
      verif: { niveaux: [2, 3], filtre: prefixe('reaction', 'message', 'seq') },
      recherche: 'message nerveux temps de réaction'
    },
    vocabulaire({
      pieges: [
        { faux: 'Nerf sensitif et nerf moteur, c\'est pareil.', juste: '<strong>Sensitif</strong> : vers le centre nerveux. <strong>Moteur</strong> : vers le muscle.' },
        { faux: 'La synapse est un neurone.', juste: 'C\'est la <strong>zone de contact</strong> entre deux neurones.' }
      ],
      recherche: 'neurone synapse centre nerveux'
    })
  ]
};
