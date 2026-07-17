@echo off
cls
echo.
echo ============================================
echo INITIALISATION DU DEPOT GIT
echo ============================================
echo.
echo 1. Initialisation du dépôt Git...
git init
echo.
echo 2. Configuration de Git...
git config user.email "fredidez@gmail.com"
git config user.name "Frederic"
echo.
echo 3. Ajout des fichiers...
git add .
echo.
echo 4. Affichage du statut...
git status
echo.
echo 5. Commit initial...
git commit -m "Initial commit: Fixed button styling with gradients"
echo.
echo ============================================
echo ÉTAPE SUIVANTE: Créer un dépôt GitHub!
echo ============================================
echo.
echo 1. Allez sur https://github.com/new
echo 2. Créez un dépôt nommé 'site-internet' (PUBLIC)
echo 3. Copiez l'URL du dépôt
echo.
echo 4. Exécutez ces commandes:
echo    git remote add origin ^<URL_DU_DEPOT^>
echo    git branch -M main
echo    git push -u origin main
echo.
pause
