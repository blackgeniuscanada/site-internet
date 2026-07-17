# 🚀 Guide de Déploiement — Cloudflare Pages
**BlackGenius Canada | 24 juin 2026**

---

## 📦 Archive Fournie: `bgcanada-updated.zip`

Cette archive contient **TOUS les fichiers du site avec les modifications appliquées**.

### ✅ Fichiers Inclus:

```
✓ index.html (modifié ligne 74)
✓ evenements.html (modifié ligne 182)
✓ impact.html (modifié ligne 107)
✓ assets/css/style.css (modifié lignes 272-330)
✓ assets/js/ (tous les fichiers JS)
✓ Tous les autres fichiers HTML originaux
✓ Toute la documentation
```

---

## 🚀 Déployer sur Cloudflare Pages

### **Méthode 1: Via Git (Recommandé)**

#### 1️⃣ Extraire l'archive localement
```bash
unzip bgcanada-updated.zip -d bgcanada-site
cd bgcanada-site
```

#### 2️⃣ Ajouter à ton repository Git
```bash
git add .
git commit -m "🎨 Redesign boutons: couleurs distinctes (Vert, Or, Orange)"
git push origin main
```

#### 3️⃣ Cloudflare déploiera automatiquement ✅
Le site sera en ligne en **moins de 1 minute**!

---

### **Méthode 2: Via Wrangler CLI**

#### 1️⃣ Installe Wrangler
```bash
npm install -g wrangler
```

#### 2️⃣ Extraire et déployer
```bash
unzip bgcanada-updated.zip -d bgcanada-site
cd bgcanada-site
wrangler deploy
```

#### 3️⃣ Site en ligne ✅

---

### **Méthode 3: Upload Direct (Dashboard Cloudflare)**

#### 1️⃣ Ouvre ton dashboard Cloudflare Pages
```
https://dash.cloudflare.com/74016e3af83ff1d73a00f531196fa255/pages/view/bgcanada/deployments/new
```

#### 2️⃣ Extraire l'archive
```bash
unzip bgcanada-updated.zip
```

#### 3️⃣ Upload le dossier (Drag & Drop ou sélectionner)
- Tous les fichiers `.html`
- Le dossier `assets/`
- Tous les fichiers de config

#### 4️⃣ Déployer ✅

---

## 🔍 Vérifier le Déploiement

Après déploiement, vérifier que les boutons sont corrects:

### ✅ Page d'Accueil (index.html)
```
https://blackgeniuscanada.org/
```
- 🟢 "Inscrire mon enfant" → VERT (btn-primary)
- 🟡 "Voir la Nuit des Défis" → OR (btn-gold) ✨ NOUVEAU

### ✅ Page Événements (evenements.html)
```
https://blackgeniuscanada.org/evenements.html
```
- 🟡 "Faire un don" → OR (btn-gold) ✨ NOUVEAU

### ✅ Page Impact (impact.html)
```
https://blackgeniuscanada.org/impact.html
```
- 🟡 "Soutenir par un don" → OR (btn-gold) ✨ NOUVEAU

---

## 📊 Changements Appliqués

### Résumé
| Fichier | Ligne | Changement |
|---------|-------|-----------|
| `index.html` | 74 | `btn-outline` → `btn-gold` |
| `evenements.html` | 182 | `btn-outline` → `btn-gold` |
| `impact.html` | 107 | `btn-outline` → `btn-gold` |
| `assets/css/style.css` | 272-330 | Redesign complet |

### Couleurs Appliquées
- 🟢 **VERT** (#1B6B3A) — Actions principales
- 🟡 **OR** (#B8923D) — Actions secondaires (donations)
- 🟠 **ORANGE** (#D95F2B) — Actions urgentes
- ⚪ **OUTLINE** — Actions tertiaires

### Effets Appliqués
- ✨ Gradients fluides
- 🎯 Ombres visibles (0 4px 12px)
- 🎪 Animation au survol (remonte de 2px)
- 💫 Transitions lisses (0.2s ease-out)

---

## 🤔 Besoin d'Aide?

### Erreur: "File not found"
→ Vérifie que tu as extrait l'archive complètement

### Le site n'est pas à jour
→ Vide le cache Cloudflare:
1. Connexion Cloudflare Dashboard
2. Purge Cache → Purge Everything
3. Rafraîchir la page (Ctrl+Shift+R)

### Les images manquent
→ Les images ne sont pas dans cette archive (contrainte de taille)
→ Elle ne contient que le code HTML/CSS/JS
→ Les images restent sur ton serveur original

---

## ✅ Checklist Final

- [ ] Archive téléchargée: `bgcanada-updated.zip`
- [ ] Archive extraite localement
- [ ] Fichiers pushés via Git OU uploadés via Cloudflare
- [ ] Déploiement en cours sur Cloudflare Pages
- [ ] Site actualisé en ligne (vérifier les boutons)
- [ ] Cache Cloudflare vidé (si nécessaire)
- [ ] Boutons affichent les bonnes couleurs ✅

---

## 🎉 C'est Tout!

Ton site est à jour avec les nouveaux boutons redesignés! 🚀

**Questions?** Utilise le dashboard Cloudflare ou contacte le support.

---

**Généré:** 24 juin 2026  
**Status:** ✅ Prêt pour déploiement  
**Site:** https://blackgeniuscanada.org
