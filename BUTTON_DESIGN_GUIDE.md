# 🎨 Guide de Redesign des Boutons
**BlackGenius Canada | 24 juin 2026**

---

## ✨ Résumé des Changements

Les boutons du site ont été **redesignés avec des couleurs distinctes** pour créer une **meilleure hiérarchie visuelle** et **éviter la confusion**.

### Avant vs Après

| Aspect | Avant | Après |
|--------|-------|-------|
| **Couleurs** | Similaires, confuses | Distinctes et claires |
| **Contraste** | Faible | Maximal |
| **Effets au survol** | Minimalistes | Fluides et évidents |
| **Ombres** | Subtiles | Visibles et cohérentes |
| **Hiérarchie** | Pas claire | Très évidente |

---

## 🎯 Les 4 Types de Boutons

### 1️⃣ **VERT** — Boutons Primaires
```html
<a href="#" class="btn btn-primary">Inscrire mon enfant</a>
```

**Caractéristiques:**
- Gradient vert foncé (du #1B6B3A au #15573F)
- Couleur blanc texte
- Ombre 0 4px 12px rgba(27, 107, 58, 0.25)
- Au hover: Devient plus foncé + remonte (-2px)

**Quand l'utiliser:**
- ✅ Inscriptions
- ✅ Appels à l'action PRINCIPAUX
- ✅ Continuations (Suivant, Continuer)
- ✅ Actions par défaut

**Exemples:**
- "Inscrire mon enfant"
- "S'inscrire maintenant"
- "Rejoindre le programme"

---

### 2️⃣ **OR** — Boutons Secondaires
```html
<a href="#" class="btn btn-gold">Faire un don</a>
```

**Caractéristiques:**
- Gradient or (du #B8923D au #9C7A2A)
- Couleur blanc texte
- Ombre 0 4px 12px rgba(184, 146, 61, 0.25)
- Au hover: Devient plus foncé + remonte (-2px)

**Quand l'utiliser:**
- ✅ Donations
- ✅ Actions secondaires
- ✅ Appels à l'action alternatifs
- ✅ Liens VIP/Premium

**Exemples:**
- "Faire un don"
- "Soutenir le projet"
- "Accéder à Espace famille"
- "Consulter les Jeux Maths"

---

### 3️⃣ **ORANGE** — Boutons Accentués
```html
<a href="#" class="btn btn-orange">Accès Limité</a>
```

**Caractéristiques:**
- Gradient orange (du #D95F2B au #C04A1A)
- Couleur blanc texte
- Ombre 0 4px 12px rgba(217, 95, 43, 0.25)
- Au hover: Devient plus foncé + remonte (-2px)

**Quand l'utiliser:**
- ✅ Actions urgentes
- ✅ Alertes positives
- ✅ Événements
- ✅ Accès limité / Places disponibles

**Exemples:**
- "Voir les dates"
- "Inscription fermée"
- "Places limitées"
- "Événement spécial"

---

### 4️⃣ **BLANC** — Boutons Outline
```html
<a href="#" class="btn btn-outline">En savoir plus</a>
<a href="#" class="btn btn-outline-green">Découvrir</a>
<a href="#" class="btn btn-outline-gold">Consulter</a>
```

**Caractéristiques:**
- Fond transparent + bordure
- Au hover: Fond semi-transparent
- Transition fluide

**Variantes:**
- `.btn-outline` — Blanc sur fond coloré
- `.btn-outline-green` — Vert sur fond clair
- `.btn-outline-gold` — Or sur fond clair

**Quand l'utiliser:**
- ✅ Sur fonds colorés
- ✅ Actions tertiaires
- ✅ Alternatives discrètes
- ✅ Liens secondaires

---

## 🎨 Nouvelle Palette CSS

```css
/* Couleurs Primaires */
--green: #1B6B3A           /* Boutons Vert Principal */
--gold: #B8923D            /* Boutons Or Secondaire */
--orange: #D95F2B          /* Boutons Orange Accentué */

/* Dégradés */
Vert:    linear-gradient(135deg, #1B6B3A 0%, #15573F 100%)
Or:      linear-gradient(135deg, #B8923D 0%, #9C7A2A 100%)
Orange:  linear-gradient(135deg, #D95F2B 0%, #C04A1A 100%)

/* Ombres */
Repose:  0 4px 12px rgba(couleur, 0.25)
Survol:  0 6px 16px rgba(couleur, 0.4)
```

---

## 📏 Tailles de Boutons

```html
<!-- Small -->
<a href="#" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Small</a>

<!-- Normal (par défaut) -->
<a href="#" class="btn btn-primary">Normal</a>

<!-- Large -->
<a href="#" class="btn btn-primary btn-lg">Large</a>

<!-- XL -->
<a href="#" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1rem;">XL</a>
```

---

## 🔄 Effets Interactifs

Tous les boutons ont maintenant des effets cohérents:

### Au Survol (`:hover`)
1. **Changement de gradient** — Devient plus foncé
2. **Élévation** — Remonte de 2px (transform: translateY(-2px))
3. **Ombre renforcée** — Passe de 12px à 16px
4. **Transition fluide** — 0.2s ease-out

### Au Clic (`:active`)
- Revient à la position normale (transform: translateY(0))
- Sensation de "press" naturelle

---

## 💡 Bonnes Pratiques

### ✅ À Faire

1. **Un seul bouton primaire (vert) par page**
   ```html
   <!-- BON: Une action principale -->
   <a href="/inscription" class="btn btn-primary">Inscrire mon enfant</a>
   ```

2. **Utiliser l'or pour les actions secondaires**
   ```html
   <!-- BON: Action alternative -->
   <a href="/don" class="btn btn-gold">Soutenir financièrement</a>
   ```

3. **Grouper logiquement les boutons**
   ```html
   <!-- BON: Actions liées -->
   <a href="/inscription" class="btn btn-primary">Inscrire</a>
   <a href="/en-savoir-plus" class="btn btn-outline-green">En savoir plus</a>
   ```

### ❌ À Éviter

1. **Ne pas mettre plusieurs boutons primaires**
   ```html
   <!-- MAUVAIS: Confusion d'action principale -->
   <a href="#" class="btn btn-primary">Inscrire</a>
   <a href="#" class="btn btn-primary">Donner</a>
   ```

2. **Ne pas mélanger les styles sans raison**
   ```html
   <!-- MAUVAIS: Trop de couleurs -->
   <a href="#" class="btn btn-primary">Cliquez ici</a>
   <a href="#" class="btn btn-gold">Ou ici</a>
   <a href="#" class="btn btn-orange">Ou là</a>
   <a href="#" class="btn btn-white">Ou partout!</a>
   ```

3. **Ne pas utiliser outline pour les actions principales**
   ```html
   <!-- MAUVAIS: Outline n'est pas assez visible -->
   <a href="#" class="btn btn-outline-green">Inscrire</a>
   ```

---

## 📋 Checklist d'Implémentation

### Pages à Vérifier

- [ ] **index.html**
  - [ ] "Inscrire mon enfant" → `.btn-primary` ✅
  - [ ] "Voir la Nuit des Défis" → `.btn-gold` ou `.btn-outline`
  - [ ] Autres CTA → couleurs appropriées

- [ ] **inscription.html**
  - [ ] "Continuer" → `.btn-primary`
  - [ ] "Retour" → `.btn-outline`

- [ ] **don.html**
  - [ ] Montants fixes → `.btn-gold` ou radio buttons
  - [ ] "Procéder" → `.btn-primary`
  - [ ] "Voir autres options" → `.btn-outline-gold`

- [ ] **programmes.html**
  - [ ] "En savoir plus" → `.btn-outline-green`
  - [ ] "S'inscrire" → `.btn-primary`

- [ ] **evenements.html**
  - [ ] "Voir dates" → `.btn-orange` (si urgent)
  - [ ] "S'inscrire" → `.btn-primary`

- [ ] **Formulaires**
  - [ ] Submit button → `.btn-primary`
  - [ ] Reset/Cancel → `.btn-outline` ou `.btn-outline-green`

---

## 🎓 Démonstration

Ouvrez **`button-showcase.html`** pour voir tous les boutons en action avec:
- Tous les styles disponibles
- Les tailles différentes
- Les effets au survol
- Des exemples d'utilisation
- Le guide complet

---

## 🔧 Code CSS Complet

Tous les changements sont dans **`assets/css/style.css`** aux lignes **272-330**.

Fichiers affectés:
- ✅ `assets/css/style.css` — Styles des boutons redesignés

---

## 📞 Questions?

Si un bouton ne ressemble pas à votre attente:

1. **Vérifier la classe CSS**
   ```html
   ✅ <a href="#" class="btn btn-primary">Bien</a>
   ❌ <a href="#" class="button btn-primary">Mauvais (classe != "btn")</a>
   ```

2. **Vérifier le contexte de couleur**
   - Sur fond blanc → `.btn-primary`, `.btn-gold`, `.btn-outline-green`
   - Sur fond vert → `.btn-white`, `.btn-outline`
   - Sur fond coloré → `.btn-outline`

3. **Vérifier l'hiérarchie**
   - Action principale → `.btn-primary` (vert)
   - Action secondaire → `.btn-gold` (or)
   - Action tertiaire → `.btn-outline-*` (outline)

---

**Redesign complété ✅**  
**Prêt pour production**  
**24 juin 2026**
