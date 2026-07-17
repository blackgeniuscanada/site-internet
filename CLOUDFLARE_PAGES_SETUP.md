# 🚀 Configuration Cloudflare Pages

**ÉTAPE FINALE** — Connecter Cloudflare Pages au dépôt GitHub

---

## 📋 Procédure

### 1️⃣ Allez sur le tableau de bord Cloudflare
- URL: https://dash.cloudflare.com
- Connectez-vous avec votre compte

### 2️⃣ Sélectionnez votre domaine
- Cliquez sur `blackgeniuscanada.org`

### 3️⃣ Allez à la section Pages
- Menu latéral → `Pages`
- Cliquez le bouton **"Create a project"**

### 4️⃣ Connectez à GitHub
- Cliquez **"Connect to Git"**
- Autorisez Cloudflare à accéder à votre compte GitHub
- Sélectionnez l'organisation `blackgenius225-afk`
- Sélectionnez le dépôt **`site-internet`**

### 5️⃣ Configurez le Build
- **Production branch**: `main` ✅
- **Framework preset**: `None` (site statique)
- **Build command**: (laissez VIDE)
- **Build output directory**: `.` (un point)

### 6️⃣ Déployez!
- Cliquez **"Save and Deploy"**
- Attendez 5-10 minutes que Cloudflare redéploie

---

## ✅ Vérification

1. Attendez que Cloudflare finisse le build
2. Allez sur https://blackgeniuscanada.org
3. **Rafraîchissez** la page (Ctrl+F5 ou Cmd+Shift+R)
4. Les boutons doivent afficher les **gradients doré** ! 🎨

---

## 🔄 Après la configuration

À chaque fois que tu pushes vers GitHub:
```bash
git add .
git commit -m "Description du changement"
git push origin main
```

Cloudflare Pages redéploiera **automatiquement** en 5-10 minutes! ✨

---

## ❓ Troubleshooting

**Les changements n'apparaissent pas?**
1. Vérifiez le statut du build sur Cloudflare Pages
2. Videz le cache du navigateur (Ctrl+Shift+Delete)
3. Attendez 15 minutes pour la propagation CDN
4. Vérifiez que le push vers GitHub a réussi

**Erreur de build?**
- Vérifiez que `wrangler.jsonc` n'existe pas (pas besoin avec Pages)
- Assurez-vous que le dépôt contient tous les fichiers HTML/CSS

---

## 📞 Support
- Cloudflare Help: https://support.cloudflare.com
- GitHub Pages Docs: https://docs.github.com/en/pages
