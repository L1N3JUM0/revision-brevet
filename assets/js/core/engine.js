// Déroulé d'une session : génération (anti-doublon), modes, score, adaptation du niveau.
// Aucune manipulation du DOM ici : l'affichage est dans assets/js/ui/.
import { dejaVue, memoriserCle, chapitre, sauver, profil as profilStocke } from './store.js';
import { verifier } from './answer.js';
import { tirerContexte } from './contexts.js';
import {
  enregistrerResultat, enregistrerRecord, message,
  MESSAGES_BRAVO, MESSAGES_OUPS, MESSAGES_SERIE
} from './gamification.js';

export const MAX_ESSAIS_ANTI_DOUBLON = 20;
export const QUESTIONS_CHRONO = 10;
export const BONNES_POUR_MONTER = 3;
export const ERREURS_POUR_DESCENDRE = 2;

/**
 * Génère un exercice en évitant les clés déjà vues (20 essais au maximum).
 * Renvoie l'exercice complété par { niveau, idChapitre }.
 */
export function genererExercice(gen, niveau, rng, { profil = {}, memoriser = true } = {}) {
  let exo = null;
  for (let essai = 0; essai < MAX_ESSAIS_ANTI_DOUBLON; essai++) {
    const ctx = tirerContexte(rng, profil);
    exo = gen.generer(niveau, rng, ctx);
    if (!memoriser || !dejaVue(gen.id, exo.cle)) break;
  }
  exo.niveau = niveau;
  exo.idChapitre = gen.id;
  if (memoriser) memoriserCle(gen.id, exo.cle);
  return exo;
}

// Plan de difficulté du défi chrono : on commence facile, on finit type brevet
function planChrono(niveauxMax) {
  const plan = [1, 1, 1, 2, 2, 2, 2, 3, 3, 3];
  return plan.map(n => Math.min(n, niveauxMax));
}

export class Session {
  constructor({ generateur, mode = 'entrainement', rng, niveauDepart = null }) {
    this.gen = generateur;
    this.mode = mode;
    this.rng = rng;
    this.profil = profilStocke();
    this.prenom = this.profil.prenom;
    const stats = chapitre(generateur.id);
    this.niveau = Math.min(Math.max(niveauDepart ?? stats.niveau ?? 1, 1), generateur.niveaux);
    this.plan = mode === 'chrono' ? planChrono(generateur.niveaux) : null;
    this.nbQuestions = mode === 'chrono' ? QUESTIONS_CHRONO : Infinity;
    this.index = 0;              // questions répondues
    this.bonnes = 0;
    this.serie = 0;              // bonnes réponses d'affilée
    this.meilleureSerie = 0;
    this.bonnesAuNiveau = 0;     // pour monter de niveau
    this.erreursAffilee = 0;     // pour descendre de niveau
    this.xpGagne = 0;
    this.exo = null;
    this.historique = [];
    this.debut = null;
    this.fin = null;
  }

  estTerminee() {
    return this.index >= this.nbQuestions;
  }

  // Temps écoulé en millisecondes (défi chrono)
  temps() {
    if (!this.debut) return 0;
    return (this.fin ?? Date.now()) - this.debut;
  }

  suivant() {
    if (this.estTerminee()) return null;
    if (!this.debut) this.debut = Date.now();
    const niveau = this.plan ? this.plan[this.index] : this.niveau;
    this.exo = genererExercice(this.gen, niveau, this.rng, { profil: this.profil });
    return this.exo;
  }

  /**
   * Traite une saisie. Si elle est illisible, renvoie { verif } sans rien compter.
   * Sinon renvoie { verif, correct, xp, message, serieMessage, changementNiveau, gam, terminee }.
   */
  repondre(saisie) {
    const exo = this.exo;
    const verif = verifier(exo, saisie);
    if (!verif.valide) return { verif };

    const correct = verif.correct;
    this.index++;
    this.historique.push({ exo, saisie, correct });

    if (correct) {
      this.bonnes++;
      this.serie++;
      this.meilleureSerie = Math.max(this.meilleureSerie, this.serie);
    } else {
      this.serie = 0;
    }
    const gam = enregistrerResultat(this.gen.id, exo.niveau, correct, this.serie);
    this.xpGagne += gam.xp;

    // Adaptation de la difficulté (entraînement uniquement)
    let changementNiveau = null;
    if (this.mode === 'entrainement') {
      if (correct) {
        this.erreursAffilee = 0;
        this.bonnesAuNiveau++;
        if (this.bonnesAuNiveau >= BONNES_POUR_MONTER && this.niveau < this.gen.niveaux) {
          this.niveau++;
          changementNiveau = 'monte';
        }
      } else {
        this.bonnesAuNiveau = 0;
        this.erreursAffilee++;
        if (this.erreursAffilee >= ERREURS_POUR_DESCENDRE && this.niveau > 1) {
          this.niveau--;
          changementNiveau = 'descend';
        }
      }
      if (changementNiveau) {
        this.bonnesAuNiveau = 0;
        this.erreursAffilee = 0;
        chapitre(this.gen.id).niveau = this.niveau;
        sauver();
      }
    }

    const vars = { prenom: this.prenom, n: this.serie };
    const res = {
      verif,
      correct,
      xp: gam.xp,
      gam,
      changementNiveau,
      message: message(this.rng, correct ? MESSAGES_BRAVO : MESSAGES_OUPS, vars),
      serieMessage: correct && (this.serie === 3 || this.serie % 5 === 0)
        ? message(this.rng, MESSAGES_SERIE, vars) : null,
      terminee: this.estTerminee()
    };
    if (res.terminee) this.fin = Date.now();
    return res;
  }

  // Fin du défi chrono : enregistre le record éventuel
  terminer() {
    if (!this.fin) this.fin = Date.now();
    if (this.mode === 'chrono') {
      return { record: enregistrerRecord(this.gen.id, this.bonnes, this.temps()) };
    }
    return { record: false };
  }
}
