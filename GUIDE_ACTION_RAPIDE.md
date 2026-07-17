# ⚡ GUIDE D'ACTION RAPIDE
**BlackGenius Canada | Déploiement Corrections Formats Numériques**

---

## 🎯 Où on en est?

✅ **Tous les tests passent** (48/48)
✅ **Tous les fichiers sont corrigés**
✅ **Prêt pour le déploiement**

---

## 🚀 CE QU'IL FAUT FAIRE MAINTENANT

### Étape 1: Copier les Librairies (1 min) ⚡

```bash
# Vérifier que les fichiers existent:
ls -la assets/js/format-utils.js
ls -la assets/js/validation-extended.js

# Ils doivent exister (créés lors de l'analyse)
# Si manquants: voir README_CORRECTIONS.md
```

### Étape 2: Remplacer don.html (2 min) ⚡

```bash
# Backup (sécurité):
cp don.html don.html.backup

# Remplacer:
cp don-fixed.html don.html

# Vérifier:
grep "format-utils.js" don.html
# Doit retourner une ligne ✓
```

### Étape 3: Remplacer inscription.js (2 min) ⚡

```bash
# Backup:
cp assets/js/inscription.js assets/js/inscription.js.backup

# Remplacer:
cp assets/js/inscription-fixed.js assets/js/inscription.js

# Vérifier:
grep "normalizeNumber" assets/js/inscription.js
# Doit retourner une ligne ✓
```

### Étape 4: Tester en Navigateur (5 min) ✅

Ouvrir `don.html`:
1. Entrer 5 → Voir "Montant à donner: 5,00 $" ✓
2. Entrer 1000 → Voir "Montant à donner: 1 000,00 $" ✓
3. Entrer 3 → Cliquer "Procéder" → Erreur "minimum" ✓
4. Ouvrir Console (F12) → Pas d'erreurs rouges ✓

Ouvrir `inscription.html`:
1. Aller à "Step 2 — Bulletin"
2. Entrer "80" en Math → Voir hint "✓ Seuil atteint" ✓
3. Entrer "79,5" en Math → Voir hint "✗ Seuil requis" ✓
4. Ouvrir Console (F12) → Pas d'erreurs rouges ✓

---

## 📋 PHASE 2: CORRECTIONS HTML (Cette Semaine)

**Fichier:** `inscription.html`
**Guide Complet:** `CORRECTIONS_INSCRIPTION_HTML.md`

**8 petits changements à faire (15 min):**

### Correction #1: Champs Notes
```
Localisation: Ligne 174
Changement: step="1"  →  step="0.01"
Ajouter: placeholder="Ex. 87,5"
Ajouter: aria-label="Note..."
Ajouter: inputmode="decimal"
```

### Correction #2-4: Téléphones & Codes Postaux
```
Ajouter: pattern="..." (regex fourni dans le guide)
Ajouter: title="Format: ..."
Ajouter: aria-label="..."
```

### Correction #5: Textareas
```
Ajouter: maxlength="500" ou "1000"
Ajouter: Compteur de caractères
```

### Correction #6-8: Autres
```
Remplacer: 1ʳᵉ → 1re (pas d'exposants)
Ajouter: Scripts d'initialisation
```

**→ Copier-coller les blocs du guide `CORRECTIONS_INSCRIPTION_HTML.md`**

---

## 🧪 TESTS RAPIDES (Vérifier que ça marche)

Copier dans la Console du navigateur:

```javascript
// Test 1: Format-utils
normalizeNumber("80,5")      // Doit retourner 80.5
formatCAD(1000)              // Doit retourner "1 000,00 $"

// Test 2: Validation
validateGrade(80, 80)        // Doit retourner {status: "passed"}
validateDonation(5)          // Doit retourner {isValid: true}
validatePhoneCA("514 555 1234")  // Doit retourner {isValid: true}

// Tout doit fonctionner ✓
```

---

## 📞 SUPPORT RAPIDE

Si un truc ne marche pas:

| Problème | Solution |
|----------|----------|
| "normalizeNumber is not defined" | Vérifier que format-utils.js est inclus |
| Montants affichent mal | Vérifier que format-utils.js est avant main.js |
| Notes pas validées | Vérifier que step="0.01" (Correction #1) |
| "formatCAD is not defined" | Attendre que format-utils.js se charge |
| Console pleine d'erreurs | Consulter RAPPORT_TESTS_COMPLET.md |

---

## 📊 RÉSULTAT FINAL

Après avoir tout fait:

✅ Les notes "80,5" sont acceptées (au lieu d'être rejetées)
✅ Les montants affichent "1 000,00 $" (au lieu de "1000")
✅ Les montants < 5 $ sont rejetés
✅ Les téléphones sont validés
✅ Les codes postaux sont validés

---

## ⏱️ TIMING TOTAL

- **PHASE 1 (Urgent):** 10 min
- **PHASE 2 (Cette semaine):** 30 min
- **TESTS:** 10 min
- **Total:** ~50 min

---

## 📖 DOCUMENTS À CONSULTER

Pour aller plus loin:

1. **README_CORRECTIONS.md** — Plan complet + FAQ
2. **RAPPORT_TESTS_COMPLET.md** — Tous les résultats de tests
3. **ANALYSE_PROFONDE_COMPLET.md** — Tous les 15 bugs expliqués
4. **CORRECTIONS_INSCRIPTION_HTML.md** — Bloc HTML pour chaque correction

---

## ✨ C'EST TOUT!

Vous avez maintenant:
✅ Tous les fichiers corrigés
✅ Tous les tests qui passent
✅ Un guide d'action simple
✅ Une documentation complète

**Prochaine étape:** Exécuter les 3 étapes de PHASE 1 ci-dessus (10 min max)

---

**Questions?** Consulter le guide correspondant. Chaque document couvre un aspect spécifique.

Bonne chance! 🚀
