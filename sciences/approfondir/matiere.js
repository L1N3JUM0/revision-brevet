// Fiche « Explique-moi plus » : la matière (états, masse volumique). Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'La matière est faite de particules (molécules) : leur organisation change selon l\'état, mais leur nombre, donc la masse, ne change pas.',
      pourquoi: `<p>Dans un <strong>solide</strong>, les molécules sont collées et rangées ; dans un <strong>liquide</strong>, collées mais en désordre ; dans un <strong>gaz</strong>, éloignées et très agitées.</p>
        <p>Quand un glaçon fond, aucune molécule n'apparaît ni ne disparaît : elles se réorganisent. C'est pour cela que <strong>la masse se conserve</strong>, alors que le volume peut changer.</p>`,
      pieges: [
        { faux: 'Un glaçon qui fond devient plus léger.', juste: 'La masse se conserve : seul le volume change (l\'eau liquide prend même un peu moins de place).' },
        { faux: 'Le sucre fond dans le café.', juste: 'Il se <strong>dissout</strong> : c\'est une dissolution, pas une fusion.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('dissol') },
      verif: { niveaux: [1, 2], filtre: prefixe('q', 'vf', 'dissol') },
      recherche: 'états de la matière conservation de la masse'
    },
    {
      titre: 'Les formules',
      idee: 'La masse volumique ρ = m ÷ V indique la masse d\'un cm³ de matière : c\'est une carte d\'identité du matériau.',
      pourquoi: `<p>Un gros morceau de fer et un petit morceau de fer n'ont pas la même masse, mais si on divise la masse par le volume, on trouve toujours <strong>7,9 g/cm³</strong> : c'est la masse d'un cm³ de fer.</p>
        <p>Comparer ρ à celle de l'eau (1 g/cm³) dit si un objet <strong>flotte</strong> (ρ plus petite) ou <strong>coule</strong> (ρ plus grande).</p>`,
      pieges: [
        { faux: 'ρ = V ÷ m', juste: 'C\'est la <strong>masse</strong> qu\'on divise par le volume : ρ = m ÷ V.' },
        { faux: '2 L d\'huile, ρ = 0,92 g/mL, donc m = 0,92 × 2 = 1,84 g.', juste: 'Convertis d\'abord : 2 L = 2 000 mL, donc m = 0,92 × 2 000 = 1 840 g.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('rho') },
      verif: { niveaux: [2, 3], filtre: prefixe('masse', 'volume', 'flotte', 'ident') },
      recherche: 'masse volumique'
    },
    {
      titre: 'Les changements d\'état',
      idee: 'Chaque passage d\'un état à un autre a un nom ; pour un corps pur, la température reste constante pendant le changement d\'état.',
      pourquoi: `<p>Pendant la fusion de la glace, l'énergie reçue sert à séparer les molécules, pas à chauffer : la température reste à <strong>0 °C</strong> tant qu'il reste de la glace. Sur un graphique, c'est un <strong>palier</strong>.</p>
        <p>Un mélange (eau salée, cire) n'a pas de palier net : sa température continue de varier.</p>`,
      pieges: [
        { faux: 'Gaz → liquide : vaporisation.', juste: 'Gaz → liquide : <strong>liquéfaction</strong> (la buée). Liquide → gaz : vaporisation.' },
        { faux: 'Sur le graphique, je lis la température de départ.', juste: 'La température de changement d\'état se lit sur le <strong>palier horizontal</strong>.' }
      ],
      exemple: { niveau: 2, filtre: prefixe('palier') },
      verif: { niveaux: [1, 2], filtre: prefixe('etat', 'palier') },
      recherche: 'changements d\'état palier corps pur'
    },
    vocabulaire({
      pieges: [
        { faux: 'Soluté et solvant, c\'est pareil.', juste: 'Le <strong>soluté</strong> se dissout (le sucre) ; le <strong>solvant</strong> le dissout (l\'eau).' },
        { faux: 'Homogène = corps pur.', juste: 'L\'eau du robinet est homogène mais c\'est un <strong>mélange</strong>.' }
      ],
      recherche: 'corps pur mélange homogène hétérogène',
      niveaux: [2, 2]
    })
  ]
};
