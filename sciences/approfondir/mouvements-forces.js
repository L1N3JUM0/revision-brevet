// Fiche « Explique-moi plus » : mouvements et forces. Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Un mouvement se décrit par sa trajectoire et l\'évolution de sa vitesse, toujours par rapport à un objet de référence.',
      pourquoi: `<p>Sur une chronophotographie, les images sont prises à intervalles de temps égaux. Des points <strong>régulièrement espacés</strong> : l'objet parcourt la même distance à chaque intervalle, sa vitesse est constante (uniforme). Des écarts qui <strong>grandissent</strong> : il accélère. Des écarts qui <strong>rétrécissent</strong> : il ralentit.</p>
        <p>Dans un bus, tu es immobile par rapport au bus, mais en mouvement par rapport à la route : tout dépend du <strong>référentiel</strong>.</p>`,
      pieges: [
        { faux: 'Les points s\'écartent : le mouvement ralentit.', juste: 'Des écarts plus grands à chaque intervalle : l\'objet va <strong>plus vite</strong>, il accélère.' },
        { faux: 'Un objet est immobile, un point c\'est tout.', juste: 'On précise toujours <strong>par rapport à quoi</strong> (le référentiel).' }
      ],
      exemple: { niveau: 1, filtre: prefixe('nature') },
      verif: { niveaux: [1, 2], filtre: prefixe('nature', 'classe') },
      recherche: 'décrire un mouvement chronophotographie'
    },
    {
      titre: 'Les formules',
      idee: 'Le poids est la force d\'attraction d\'un astre : P = m × g. La masse ne change pas d\'un astre à l\'autre, le poids si.',
      pourquoi: `<p>La <strong>masse</strong> (en kg) mesure la quantité de matière : elle est la même sur Terre et sur la Lune. Le <strong>poids</strong> (en N) dépend de l'astre qui attire : g vaut 9,8 N/kg sur Terre et seulement 1,6 N/kg sur la Lune.</p>
        <p>Pour la vitesse, v = d ÷ t : les unités doivent aller ensemble (m et s pour des m/s).</p>`,
      pieges: [
        { faux: 'Sur la Lune, l\'astronaute a une masse plus petite.', juste: 'Sa masse est la même ; c\'est son <strong>poids</strong> qui est environ 6 fois plus faible.' },
        { faux: 'P = 60 kg', juste: 'Un poids s\'exprime en <strong>newtons</strong> : P = 60 × 9,8 = 588 N.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('poids') },
      verif: { niveaux: [2, 3], filtre: prefixe('poids', 'masse', 'piege', 'vimages') },
      recherche: 'poids et masse P = m × g'
    },
    vocabulaire({
      pieges: [
        { faux: 'Un dynamomètre mesure une masse.', juste: 'Il mesure une <strong>force</strong> (en N). La balance mesure une masse.' },
        { faux: 'Trajectoire et référentiel, c\'est pareil.', juste: 'La <strong>trajectoire</strong> est la ligne suivie ; le <strong>référentiel</strong> est l\'objet de référence.' }
      ],
      recherche: 'force poids référentiel trajectoire'
    })
  ]
};
