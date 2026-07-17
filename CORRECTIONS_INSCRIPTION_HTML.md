# 🔧 Corrections Inscription.html — Points Spécifiques

## Instructions d'Application

Appliquez ces corrections au fichier `inscription.html` en remplaçant les sections indiquées.

---

## ✏️ CORRECTION #1: Champs de Notes (Step 02)

**Localisation:** Ligne 172-191
**Remplacer le bloc entièrement par:**

```html
<!-- ====== STEP 02 — Résultats académiques ====== -->
<fieldset class="wizard-step" data-step="2">
  <header class="wizard-step-head">
    <span class="wizard-step-eyebrow">02 — Résultats académiques</span>
    <h3>Le dernier <em>bulletin</em>.</h3>
    <p class="wizard-step-lead">
      Indiquez les notes en pourcentage du <strong>dernier bulletin (juin 2026)</strong>.
      Seuils d'admission : <strong style="color: var(--gold);">Math ≥ 80 · Sciences ≥ 80 · Anglais ≥ 70 · Français ≥ 70</strong>.
    </p>
  </header>

  <div class="form-grid">
    <!-- BUG FIX #1: step="0.01" accepte décimales (80,5) -->
    <!-- BUG FIX #2: aria-label pour accessibilité -->
    <!-- BUG FIX #3: data-postal pour validation -->
    
    <div class="field">
      <label>Mathématiques (%) <span class="req">*</span></label>
      <input 
        type="number" 
        min="0" 
        max="100" 
        step="0.01"
        name="note_math" 
        required 
        data-threshold="80"
        placeholder="Ex. 87 ou 87,5"
        aria-label="Note mathématiques en pourcentage"
        inputmode="decimal"
      >
      <span class="field-hint" data-hint-for="note_math">Seuil minimum : 80</span>
    </div>

    <div class="field">
      <label>Sciences (%) <span class="req">*</span></label>
      <input 
        type="number" 
        min="0" 
        max="100" 
        step="0.01"
        name="note_sciences" 
        required 
        data-threshold="80"
        placeholder="Ex. 85,5"
        aria-label="Note sciences en pourcentage"
        inputmode="decimal"
      >
      <span class="field-hint" data-hint-for="note_sciences">Seuil minimum : 80</span>
    </div>

    <div class="field">
      <label>Français (%) <span class="req">*</span></label>
      <input 
        type="number" 
        min="0" 
        max="100" 
        step="0.01"
        name="note_francais" 
        required 
        data-threshold="70"
        placeholder="Ex. 75,5"
        aria-label="Note français en pourcentage"
        inputmode="decimal"
      >
      <span class="field-hint" data-hint-for="note_francais">Seuil minimum : 70</span>
    </div>

    <div class="field">
      <label>Anglais (%) <span class="req">*</span></label>
      <input 
        type="number" 
        min="0" 
        max="100" 
        step="0.01"
        name="note_anglais" 
        required 
        data-threshold="70"
        placeholder="Ex. 78,0"
        aria-label="Note anglais en pourcentage"
        inputmode="decimal"
      >
      <span class="field-hint" data-hint-for="note_anglais">Seuil minimum : 70</span>
    </div>
  </div>

  <div class="threshold-feedback" id="thresholdFeedback" style="display:none;"></div>

  <label class="check-line">
    <input type="checkbox" name="bulletins_joints" value="oui">
    <span>Je m'engage à envoyer les copies des bulletins scolaires officiels par courriel à <strong style="color: var(--gold);">inscriptions@blackgeniuscanada.org</strong> sous 7 jours (obligatoire pour le traitement du dossier).</span>
  </label>

  <div class="wizard-nav">
    <button type="button" class="btn btn-outline" data-prev>← Précédent</button>
    <button type="button" class="btn btn-primary" data-next>Continuer →</button>
  </div>
</fieldset>
```

**Changes:**
- ✅ `step="1"` → `step="0.01"` (accepte décimales)
- ✅ `placeholder="Ex. 87 ou 87,5"` (montre le format)
- ✅ `aria-label` pour accessibilité
- ✅ `inputmode="decimal"` (clavier mobile adapté)

---

## ✏️ CORRECTION #2: Numéro Téléphone Parent (Step 03)

**Localisation:** Ligne 225
**Remplacer par:**

```html
<div class="field">
  <label>Téléphone principal <span class="req">*</span></label>
  <input 
    type="tel" 
    name="parent_telephone" 
    placeholder="+1 514 555 1234"
    pattern="^\+?1?\s*\(?([0-9]{3})\)?\s*-?([0-9]{3})\s*-?([0-9]{4})$"
    title="Format: 514 555 1234 ou +1 514 555 1234"
    required
    aria-label="Numéro de téléphone du parent"
    inputmode="tel"
  >
  <span class="field-hint">Format: 514 555 1234</span>
</div>
```

**Changes:**
- ✅ `pattern` regex pour valider format CA
- ✅ `title` pour message d'erreur
- ✅ `aria-label` pour accessibilité
- ✅ `inputmode="tel"` (clavier mobile)

---

## ✏️ CORRECTION #3: Code Postal Parent (Step 03)

**Localisation:** Ligne 228
**Remplacer par:**

```html
<div class="field">
  <label>Code postal <span class="req">*</span></label>
  <input 
    name="parent_code_postal" 
    placeholder="H1A 1A1"
    pattern="^[A-Z]\d[A-Z]\s?\d[A-Z]\d$"
    maxlength="7"
    title="Format canadien: H1A 1A1"
    required
    aria-label="Code postal du parent"
    data-postal
  >
  <span class="field-hint">Format: H1A 1A1</span>
</div>
```

**Changes:**
- ✅ `pattern` regex format canadien
- ✅ `maxlength="7"` (limite H1A 1A1)
- ✅ `data-postal` (hook validation JS)

---

## ✏️ CORRECTION #4: WhatsApp Alternatif (Step 03)

**Localisation:** Ligne 236
**Remplacer par:**

```html
<div class="field full" id="whatsapp-other" style="display:none;">
  <label>Autre numéro WhatsApp</label>
  <input 
    type="tel" 
    name="whatsapp_autre" 
    placeholder="+1 514 555 1234"
    pattern="^\+?1?\s*\(?([0-9]{3})\)?\s*-?([0-9]{3})\s*-?([0-9]{4})$"
    title="Format: 514 555 1234"
    aria-label="Numéro WhatsApp alternatif"
    inputmode="tel"
  >
</div>
```

---

## ✏️ CORRECTION #5: Textareas Limites (Step 05)

**Localisation:** Lignes 309, 314, 319
**Remplacer par:**

```html
<div class="field full">
  <label>Points forts de l'enfant <span class="req">*</span></label>
  <textarea 
    name="points_forts" 
    rows="3" 
    maxlength="500"
    placeholder="Curiosité scientifique, lecture, sport, musique, sens du leadership…" 
    required
    aria-label="Points forts de l'enfant (max 500 caractères)"
  ></textarea>
  <small style="color: var(--char-muted); margin-top: 4px; display: block;">
    <span id="count-points_forts">0</span>/500 caractères
  </small>
</div>

<div class="field full" style="margin-top: 24px;">
  <label>Points à améliorer <span class="req">*</span></label>
  <textarea 
    name="points_ameliorer" 
    rows="3" 
    maxlength="500"
    placeholder="Confiance en soi, concentration, organisation, expression orale…" 
    required
    aria-label="Points à améliorer (max 500 caractères)"
  ></textarea>
  <small style="color: var(--char-muted); margin-top: 4px; display: block;">
    <span id="count-points_ameliorer">0</span>/500 caractères
  </small>
</div>

<div class="field full" style="margin-top: 24px;">
  <label>Vos motivations à rejoindre BlackGenius Canada <span class="req">*</span></label>
  <textarea 
    name="motivations" 
    rows="5" 
    maxlength="1000"
    placeholder="Pourquoi BlackGenius ? Qu'attendez-vous du collectif pour votre enfant ? Quelles compétences ou valeurs voulez-vous renforcer ?" 
    required
    aria-label="Motivations à rejoindre BlackGenius (max 1000 caractères)"
  ></textarea>
  <small style="color: var(--char-muted); margin-top: 4px; display: block;">
    <span id="count-motivations">0</span>/1000 caractères
  </small>
</div>

<script>
// Compteur de caractères
['points_forts', 'points_ameliorer', 'motivations'].forEach(field => {
  const ta = document.querySelector(`textarea[name="${field}"]`);
  const counter = document.querySelector(`#count-${field}`);
  if (ta && counter) {
    ta.addEventListener('input', function() {
      counter.textContent = this.value.length;
    });
  }
});
</script>
```

---

## ✏️ CORRECTION #6: Années Scolaires (Step 01)

**Localisation:** Lignes 129-140
**Remplacer par:**

```html
<div class="field">
  <label>Niveau scolaire <span class="req">*</span></label>
  <select name="niveau_scolaire" required>
    <option value="">— Choisir —</option>
    <option>1re année du primaire</option>
    <option>2e année du primaire</option>
    <option>3e année du primaire</option>
    <option>4e année du primaire</option>
    <option>5e année du primaire</option>
    <option>6e année du primaire</option>
    <option>Secondaire 1</option>
    <option>Secondaire 2</option>
    <option>Secondaire 3</option>
    <option>Secondaire 4</option>
    <option>Secondaire 5</option>
    <option>Cégep / Autre</option>
  </select>
</div>
```

**Changes:**
- ✅ `1ʳᵉ` → `1re` (pas d'exposants)
- ✅ Meilleure compatibilité encodage

---

## ✏️ CORRECTION #7: Code Postal Enfant (Step 01)

**Localisation:** Ligne 145
**Remplacer par:**

```html
<div class="field">
  <label>Code postal <span class="req">*</span></label>
  <input 
    name="code_postal_enfant" 
    placeholder="H1A 1A1"
    pattern="^[A-Z]\d[A-Z]\s?\d[A-Z]\d$"
    maxlength="7"
    title="Format: H1A 1A1"
    required
    aria-label="Code postal de résidence"
    data-postal
  >
</div>
```

---

## ✏️ CORRECTION #8: Script d'Initialisation (Footer avant </form>)

**Ajouter avant la fermeture de `</form>`:**

```html
<!-- Scripts de validation après tous les inputs -->
<script src="assets/js/format-utils.js"></script>
<script src="assets/js/validation-extended.js"></script>

<script>
// Initialisation supplémentaire si needed
document.addEventListener('DOMContentLoaded', function() {
  // Les validations s'initialisent automatiquement via validation-extended.js
  console.log('✓ Validations chargées');
});
</script>
```

---

## 📋 Checklist Application

- [ ] Correction #1: Champs notes (step="0.01")
- [ ] Correction #2: Téléphone parent (pattern)
- [ ] Correction #3: Code postal parent (pattern)
- [ ] Correction #4: WhatsApp (pattern)
- [ ] Correction #5: Textareas (maxlength)
- [ ] Correction #6: Années scolaires (1re au lieu de 1ʳᵉ)
- [ ] Correction #7: Code postal enfant (pattern)
- [ ] Correction #8: Scripts inclus
- [ ] Test en navigateur (tous les formats)
- [ ] Vérifier console.log pas d'erreurs
- [ ] Test validation temps réel (blur sur champs)
- [ ] Sauvegarder backup avant modifications

---

## 🧪 Tests de Validation

Après application, tester avec:

```javascript
// Dans la console du navigateur
normalizeNumber("80,5")      // → 80.5 ✓
validatePhoneCA("514 555 1234")  // → {isValid: true, ...}
validatePostalCodeCA("H1A 1A1")  // → {isValid: true, ...}
formatCAD(1000)              // → "1 000,00 $"
```

---

**Fichier:** CORRECTIONS_INSCRIPTION_HTML.md
**Date:** 24 juin 2026
**Status:** ✅ Prêt à appliquer
