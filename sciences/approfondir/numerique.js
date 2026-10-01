// Fiche « Explique-moi plus » : le numérique (binaire, réseaux, programmes). Une section par carte du cours.
import { lien, prefixe, vocabulaire } from './commun.js';

export default {
  lien,
  sections: [
    {
      titre: 'L\'essentiel',
      idee: 'Un ordinateur code tout avec des 0 et des 1 ; 8 bits font un octet, et le débit d\'une connexion se compte en bits par seconde.',
      pourquoi: `<p>Un fil électrique a deux états simples à distinguer : courant ou pas de courant. D'où le binaire, avec seulement 0 et 1.</p>
        <p>Attention aux unités : les fichiers se mesurent en <strong>octets</strong> (Mo), les connexions en <strong>bits</strong> par seconde (Mbit/s). Un fichier de 100 Mo = 800 Mbit : à 40 Mbit/s, il faut 800 ÷ 40 = <strong>20 s</strong>.</p>
        <p>Dans un programme, une <strong>boucle</strong> répète des instructions, une <strong>condition</strong> choisit entre deux chemins.</p>`,
      pieges: [
        { faux: '100 Mo à 40 Mbit/s : 100 ÷ 40 = 2,5 s.', juste: 'Convertis en bits : 100 Mo = 800 Mbit, donc <strong>20 s</strong>.' },
        { faux: 'Une boucle « répéter 3 fois (ajouter 4) » ajoute 4.', juste: 'Elle ajoute 4 <strong>trois fois</strong>, soit 12.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('prog') },
      verif: { niveaux: [2, 3], filtre: prefixe('prog', 'stock', 'debit') },
      recherche: 'bit octet débit internet'
    },
    {
      titre: 'Les puissances de 2',
      idee: 'En binaire, chaque rang vaut le double du précédent (1, 2, 4, 8, 16…) : on additionne les rangs où il y a un 1.',
      pourquoi: `<p>En décimal, les rangs valent 1, 10, 100… car on a 10 chiffres. En binaire, il n'y en a que 2 : les rangs valent 1, 2, 4, 8, 16, 32, 64, 128.</p>
        <p class="calcul">1011 = 8 + 2 + 1 = 11</p>
        <p>Pour écrire 22 en binaire, on prend les plus grandes puissances possibles : 22 = 16 + 4 + 2, donc <strong>10110</strong>.</p>`,
      pieges: [
        { faux: '1011 en binaire = 1 011', juste: 'Chaque 1 vaut une puissance de 2 selon sa place : 8 + 2 + 1 = <strong>11</strong>.' },
        { faux: '22 = 01101', juste: 'Le rang de 1 est <strong>à droite</strong> : 22 s\'écrit 10110.' }
      ],
      exemple: { niveau: 1, filtre: prefixe('bin2dec') },
      verif: { niveaux: [2, 3], filtre: prefixe('bin2dec', 'dec2bin') },
      recherche: 'conversion binaire décimal'
    },
    vocabulaire({
      pieges: [
        { faux: 'Internet et le Web, c\'est pareil.', juste: '<strong>Internet</strong> est le réseau ; le <strong>Web</strong> est un service qui l\'utilise.' },
        { faux: 'Une variable est une instruction qui se répète.', juste: 'Une <strong>variable</strong> est une case mémoire nommée ; ce qui se répète, c\'est une boucle.' }
      ],
      recherche: 'réseau adresse IP serveur algorithme'
    })
  ]
};
