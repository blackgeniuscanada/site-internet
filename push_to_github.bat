@echo off
cls
echo.
echo ============================================
echo PUSH VERS GITHUB
echo ============================================
echo.
echo 1. Configuration du remote GitHub...
git remote add origin https://github.com/blackgenius225-afk/site-internet.git
echo OK!
echo.
echo 2. Renommage de la branche en 'main'...
git branch -M main
echo OK!
echo.
echo 3. Push vers GitHub...
git push -u origin main
echo.
echo ============================================
echo SUCCES! Fichiers pushés vers GitHub
echo ============================================
echo.
echo ÉTAPE SUIVANTE: Connecter Cloudflare Pages
echo 1. Allez sur: https://dash.cloudflare.com
echo 2. Cliquez sur votre domaine
echo 3. Allez à Pages
echo 4. Cliquez "Create a project" -^> "Connect to Git"
echo 5. Sélectionnez le dépôt 'site-internet'
echo 6. Laissez les paramètres par défaut
echo 7. Cliquez "Save and Deploy"
echo.
pause
