# Script pour initialiser Git et préparer le dépôt

Write-Host "============================================"
Write-Host "Initialisation du dépôt Git"
Write-Host "============================================"
Write-Host ""

# Initialiser Git
Write-Host "1. Initialisation du dépôt Git..."
git init
Write-Host ""

# Configurer Git
Write-Host "2. Configuration de Git..."
git config user.email "fredidez@gmail.com"
git config user.name "Frederic"
Write-Host ""

# Ajouter les fichiers
Write-Host "3. Ajout des fichiers..."
git add .
Write-Host ""

# Vérifier les fichiers à committer
Write-Host "4. Fichiers à committer:"
git status
Write-Host ""

# Committer les changements
Write-Host "5. Commit initial..."
git commit -m "Initial commit: Fixed button styling with gradients"
Write-Host ""

Write-Host "============================================"
Write-Host "ÉTAPE SUIVANTE: Créer un dépôt GitHub!"
Write-Host "============================================"
Write-Host ""
Write-Host "1. Allez sur https://github.com/new"
Write-Host "2. Créez un dépôt nommé 'site-internet' (PUBLIC)"
Write-Host "3. Copiez l'URL du dépôt"
Write-Host ""
Write-Host "Puis exécutez ces commandes:"
Write-Host "  git remote add origin <URL_DU_DEPOT>"
Write-Host "  git branch -M main"
Write-Host "  git push -u origin main"
Write-Host ""

Read-Host "Appuyez sur Entrée pour terminer"
