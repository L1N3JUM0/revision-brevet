// Calculatrice commune : bouton 🧮 flottant + panneau en bas de l'écran (bottom-sheet).
// Le calcul passe par un petit parseur (aucun eval). Comme sur une calculatrice de collège,
// la touche √ ouvre une parenthèse, et les parenthèses non fermées sont fermées à la fin.
import { fmt } from '../core/answer.js';
import { charger, sauver } from '../core/store.js';

// ---------- Parseur ----------

export class ErreurCalcul extends Error {}

// Découpe le texte en jetons : nombres, opérateurs, parenthèses, ², √, Ans
function jetons(texte) {
  const t = [];
  const s = String(texte);
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9,.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9,.]/.test(s[j])) j++;
      const brut = s.slice(i, j).replace(/\./g, ',');
      if ((brut.match(/,/g) || []).length > 1 || brut === ',') throw new ErreurCalcul('Erreur de syntaxe');
      t.push({ type: 'nombre', v: Number(brut.replace(',', '.')) });
      i = j;
      continue;
    }
    if (s.startsWith('Ans', i)) { t.push({ type: 'ans' }); i += 3; continue; }
    const ops = { '+': '+', '−': '-', '-': '-', '×': '*', '*': '*', '÷': '/', '/': '/' };
    if (c in ops) { t.push({ type: 'op', v: ops[c] }); i++; continue; }
    if (c === '(' || c === ')' || c === '²' || c === '√') { t.push({ type: c }); i++; continue; }
    throw new ErreurCalcul('Erreur de syntaxe');
  }
  return t;
}

/**
 * Évalue une expression affichée (« √(6²+8²) », « 2,5×(3−1) », « Ans÷2 »).
 * Priorités : parenthèses, ² et √, signe, × ÷ (et multiplication implicite « 2(3) »), + −.
 * Lève ErreurCalcul avec un message lisible.
 */
export function evaluer(texte, ans = 0) {
  const t = jetons(texte);
  if (t.length === 0) throw new ErreurCalcul('Rien à calculer');
  let i = 0;
  const voir = () => t[i];
  const est = (type, v) => t[i] && t[i].type === type && (v === undefined || t[i].v === v);

  function expression() {
    let v = terme();
    while (est('op', '+') || est('op', '-')) {
      const o = t[i++].v;
      const d = terme();
      v = o === '+' ? v + d : v - d;
    }
    return v;
  }

  function terme() {
    let v = unaire();
    for (;;) {
      if (est('op', '*') || est('op', '/')) {
        const o = t[i++].v;
        const d = unaire();
        if (o === '/') {
          if (d === 0) throw new ErreurCalcul('Division par zéro');
          v /= d;
        } else v *= d;
      } else if (voir() && ['nombre', 'ans', '(', '√'].includes(voir().type)) {
        v *= puissance(); // multiplication implicite : 2(3+1), 3√(2)
      } else break;
    }
    return v;
  }

  function unaire() {
    if (est('op', '-')) { i++; return -unaire(); }
    if (est('op', '+')) { i++; return unaire(); }
    return puissance();
  }

  function puissance() {
    let v = primaire();
    while (est('²')) { i++; v *= v; }
    return v;
  }

  function primaire() {
    const j = voir();
    if (!j) throw new ErreurCalcul('Calcul incomplet');
    if (j.type === 'nombre') { i++; return j.v; }
    if (j.type === 'ans') { i++; return ans; }
    if (j.type === '(') {
      i++;
      const v = expression();
      if (est(')')) i++;
      else if (i < t.length) throw new ErreurCalcul('Erreur de syntaxe');
      // sinon : parenthèse non fermée en fin de calcul, on la ferme
      return v;
    }
    if (j.type === '√') {
      i++;
      const v = est('(') ? primaire() : puissance();
      if (v < 0) throw new ErreurCalcul('Racine d\'un nombre négatif');
      return Math.sqrt(v);
    }
    throw new ErreurCalcul(j.type === 'op' ? 'Calcul incomplet' : 'Erreur de syntaxe');
  }

  const v = expression();
  if (i < t.length) throw new ErreurCalcul(est(')') ? 'Parenthèse en trop' : 'Erreur de syntaxe');
  if (!Number.isFinite(v)) throw new ErreurCalcul('Résultat trop grand');
  return v;
}

// Résultat à la française, 10 chiffres significatifs au plus
export function formaterResultat(x) {
  if (Math.abs(x) >= 1e12) return 'Trop grand';
  const propre = Number(x.toPrecision(10));
  return fmt(Object.is(propre, -0) ? 0 : propre);
}

// ---------- Interface ----------

const TOUCHES = [
  ['C', 'effacer-tout', 'Tout effacer'], ['⌫', 'retour', 'Effacer'], ['(', '('], [')', ')'], ['÷', '÷', 'Divisé par'],
  ['x²', '²', 'Au carré'], ['7', '7'], ['8', '8'], ['9', '9'], ['×', '×', 'Multiplié par'],
  ['√', '√(', 'Racine carrée'], ['4', '4'], ['5', '5'], ['6', '6'], ['−', '−', 'Moins'],
  ['Ans', 'Ans', 'Dernier résultat'], ['1', '1'], ['2', '2'], ['3', '3'], ['+', '+', 'Plus'],
  ['0', '0', null, 2], [',', ',', 'Virgule'], ['=', 'egal', 'Égal', 2]
];

const OPERATEURS = ['+', '−', '×', '÷', '²'];

/**
 * Monte la calculatrice dans la page. Renvoie { ouvrir, fermer, detruire }.
 * À appeler en entraînement et en contrôle blanc, jamais en défi chrono.
 */
export function monterCalculatrice() {
  const memoire = charger().calculatrice;
  let expr = '';
  let apresEgal = false;
  let message = '';

  const bouton = document.createElement('button');
  bouton.className = 'calc-bouton';
  bouton.type = 'button';
  bouton.setAttribute('aria-label', 'Ouvrir la calculatrice');
  bouton.textContent = '🧮';

  const panneau = document.createElement('section');
  panneau.className = 'calc-panneau';
  panneau.setAttribute('aria-label', 'Calculatrice');
  panneau.setAttribute('aria-hidden', 'true');
  panneau.innerHTML = `
    <div class="calc-tete">
      <span class="calc-poignee" aria-hidden="true"></span>
      <strong>Calculatrice</strong>
      <button type="button" class="calc-fermer" aria-label="Fermer la calculatrice">✕</button>
    </div>
    <ol class="calc-historique" aria-label="Derniers calculs"></ol>
    <div class="calc-ecran" aria-live="polite">
      <div class="calc-expr"></div>
      <div class="calc-apercu"></div>
    </div>
    <div class="calc-touches">
      ${TOUCHES.map(([libelle, action, aria, largeur]) =>
        `<button type="button" data-action="${action}"${aria ? ` aria-label="${aria}"` : ''}
          class="${action === 'egal' ? 'calc-egal' : OPERATEURS.includes(action) || action === '√(' ? 'calc-op' : ['effacer-tout', 'retour'].includes(action) ? 'calc-effacer' : ''}"
          ${largeur ? `style="grid-column: span ${largeur}"` : ''}>${libelle}</button>`).join('')}
    </div>`;

  document.body.append(bouton, panneau);
  document.body.classList.add('avec-calc');
  const $ = s => panneau.querySelector(s);

  function afficher() {
    $('.calc-expr').textContent = expr || '0';
    let apercu = message;
    if (!apercu && expr && !apresEgal) {
      try { apercu = '= ' + formaterResultat(evaluer(expr, memoire.ans)); } catch { apercu = ''; }
    }
    if (apresEgal) apercu = '= ' + formaterResultat(memoire.ans);
    $('.calc-apercu').textContent = apercu;
    $('.calc-apercu').classList.toggle('calc-erreur', !!message);
    $('.calc-apercu').classList.toggle('calc-resultat', apresEgal);
    $('.calc-historique').innerHTML = memoire.historique.map((h, k) =>
      `<li><button type="button" data-histo="${k}" aria-label="Réutiliser ${formaterResultat(h.res)}">
        <span>${echapper(h.expr)}</span><strong>= ${formaterResultat(h.res)}</strong></button></li>`).join('');
    const ecran = $('.calc-expr');
    ecran.scrollLeft = ecran.scrollWidth;
  }

  function inserer(morceau) {
    message = '';
    if (apresEgal) {
      // Après « = » : un opérateur continue avec Ans, sinon on repart de zéro
      expr = OPERATEURS.includes(morceau) ? 'Ans' : '';
      apresEgal = false;
    }
    expr += morceau;
  }

  function calculer() {
    if (!expr) return;
    try {
      const res = evaluer(expr, memoire.ans);
      memoire.ans = res;
      memoire.historique.push({ expr, res });
      memoire.historique = memoire.historique.slice(-3);
      sauver();
      apresEgal = true;
      message = '';
    } catch (e) {
      message = e instanceof ErreurCalcul ? e.message : 'Erreur';
    }
  }

  function action(a) {
    if (a === 'effacer-tout') { expr = ''; apresEgal = false; message = ''; }
    else if (a === 'retour') {
      if (apresEgal) { apresEgal = false; }
      else if (expr.endsWith('Ans')) expr = expr.slice(0, -3);
      else if (expr.endsWith('√(')) expr = expr.slice(0, -2);
      else expr = expr.slice(0, -1);
      message = '';
    } else if (a === 'egal') calculer();
    else inserer(a);
    afficher();
  }

  panneau.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.action) action(b.dataset.action);
    else if (b.dataset.histo !== undefined) {
      const h = memoire.historique[Number(b.dataset.histo)];
      // Le résultat affiché (« −7 », « 1 250,5 ») se relit tel quel, sans les espaces des milliers
      if (h) { inserer(formaterResultat(h.res).replace(/ /g, '')); afficher(); }
    } else if (b.classList.contains('calc-fermer')) fermer();
  });

  // Clavier (ordinateur), seulement quand le panneau est ouvert et qu'aucun champ n'a le focus
  const CLAVIER = { '*': '×', 'x': '×', '/': '÷', ':': '÷', '-': '−', '+': '+', '.': ',', ',': ',', '(': '(', ')': ')', 'r': '√(', '²': '²' };
  function clavier(e) {
    if (!panneau.classList.contains('ouvert')) return;
    const actif = document.activeElement;
    if (actif && (actif.tagName === 'INPUT' || actif.tagName === 'TEXTAREA')) return;
    let a = null;
    if (/^[0-9]$/.test(e.key)) a = e.key;
    else if (e.key in CLAVIER) a = CLAVIER[e.key];
    else if (e.key === 'Enter' || e.key === '=') a = 'egal';
    else if (e.key === 'Backspace') a = 'retour';
    else if (e.key === 'Delete') a = 'effacer-tout';
    else if (e.key === 'Escape') { fermer(); a = ''; }
    if (a === null) return;
    // Capture : la touche Entrée ne doit pas aussi passer à la question suivante
    e.preventDefault();
    e.stopImmediatePropagation();
    if (a) action(a);
  }
  window.addEventListener('keydown', clavier, true);

  function ouvrir() {
    const actif = document.activeElement;
    if (actif && actif.tagName === 'INPUT') actif.blur(); // referme le clavier du téléphone
    panneau.classList.add('ouvert');
    panneau.setAttribute('aria-hidden', 'false');
    bouton.classList.add('cache');
    // La page garde assez de place en bas pour faire défiler l'énoncé au-dessus du panneau
    document.body.style.setProperty('--calc-hauteur', `${panneau.offsetHeight}px`);
    document.body.classList.add('calc-ouverte');
    afficher();
  }

  function fermer() {
    panneau.classList.remove('ouvert');
    panneau.setAttribute('aria-hidden', 'true');
    bouton.classList.remove('cache');
    document.body.classList.remove('calc-ouverte');
  }

  function detruire() {
    window.removeEventListener('keydown', clavier, true);
    bouton.remove();
    panneau.remove();
    document.body.classList.remove('avec-calc', 'calc-ouverte');
  }

  bouton.addEventListener('click', ouvrir);
  afficher();
  return { ouvrir, fermer, detruire };
}

function echapper(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
