# 🚀 Instructions de Déploiement via Git + GitHub

## Résumé du Problème
Wrangler CLI ne détectait pas les modifications aux fichiers HTML et CSS. **Solution: Utiliser Git + GitHub + Cloudflare Pages.**

## État Actuel
- ✅ Dépôt Git initialisé localement
- ✅ Fichiers modifiés committés
- ❌ **À faire: Créer un dépôt GitHub et connecter**

---

## ÉTAPES À FAIRE (par l'utilisateur)

### 1️⃣ Créer un dépôt GitHub
1. Allez sur: https://github.com/new
2. Remplissez:
   - **Repository name**: `site-internet`
   - **Description**: `BlackGenius Canada Website`
   - **Visibility**: `Public` ✅
   - **Initialize**: Ne cochez rien
3. Cliquez "Create repository"
4. **Copiez l'URL** du dépôt (ressemble à: `https://github.com/YOUR_USERNAME/site-internet.git`)

### 2️⃣ Connecter Git à GitHub
Ouvrez Command Prompt dans le dossier du projet et exécutez:

```bash
git remote add origin https://github.com/YOUR_USERNAME/site-internet.git
git branch -M main
git push -u origin main
```

**Remplacez** `YOUR_USERNAME` par votre nom d'utilisateur GitHub!

### 3️⃣ Connecter Cloudflare à GitHub
1. Allez sur: https://dash.cloudflare.com
2. Cliquez sur votre domaine "blackgeniuscanada.org"
3. Allez à **Pages**
4. Cliquez "Create a project" → "Connect to Git"
5. Autorisez Cloudflare à accéder à GitHub
6. Sélectionnez le dépôt `site-internet`
7. Configurez:
   - **Framework**: None (Static site)
   - **Build command**: (laissez vide)
   - **Build output directory**: . (un point)
8. Cliquez "Save and Deploy"

### 4️⃣ Vérifier le Déploiement
1. Allez sur https://blackgeniuscanada.org
2. Attendez 5-10 minutes que Cloudflare Pages redéploie
3. **Rafraîchissez** la page (Ctrl+F5)
4. Les boutons doivent maintenant afficher les gradients doré! ✅

---

## Fichiers Modifiés
- `index.html` - Changement du bouton 2 en `btn-gold`
- `style.css` - Ajout des gradients pour `.hero .btn-primary` et `.hero .btn-gold`
- `wrangler.jsonc` - Configuration simplifiée (ne pas utiliser Wrangler CLI)

---

## Troubleshooting
Si les changements n'apparaissent pas:
1. Vérifiez le statut de build sur le tableau de bord Cloudflare Pages
2. Videz le cache du navigateur (Ctrl+Shift+Delete)
3. Attendez 10-15 minutes pour la propagation CDN

---

## Besoin d'aide?
Contactez le support Cloudflare: https://support.cloudflare.com
