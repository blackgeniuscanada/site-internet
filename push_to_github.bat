@echo off
cd /d "%~dp0"
cls
echo.
echo ============================================
echo PUSH VERS GITHUB
echo ============================================
echo.
echo Dossier courant : %cd%
echo.
if not exist ".git" (
  echo ERREUR: Aucun depot Git trouve dans ce dossier.
  echo Ce script doit rester dans le dossier "site internet".
  echo.
  pause
  exit /b 1
)
echo 1. Configuration du remote GitHub...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin https://github.com/blackgenius225-afk/site-internet.git
) else (
  git remote set-url origin https://github.com/blackgenius225-afk/site-internet.git
)
echo OK!
echo.
echo 2. Renommage de la branche en 'main'...
git branch -M main
echo OK!
echo.
echo 3. Push vers GitHub...
git push -u origin main
if errorlevel 1 (
  echo.
  echo ============================================
  echo ECHEC DU PUSH — voir le message d'erreur ci-dessus.
  echo Causes frequentes : pas connecte a GitHub ^(identifiants^),
  echo pas de connexion internet, ou conflit avec le depot distant.
  echo ============================================
  echo.
  pause
  exit /b 1
)
echo.
echo ============================================
echo SUCCES! Fichiers pushes vers GitHub
echo ============================================
echo.
echo ETAPE SUIVANTE: Connecter Cloudflare Pages
echo 1. Allez sur: https://dash.cloudflare.com
echo 2. Cliquez sur votre domaine
echo 3. Allez a Pages
echo 4. Cliquez "Create a project" -^> "Connect to Git"
echo 5. Selectionnez le depot 'site-internet'
echo 6. Laissez les parametres par defaut
echo 7. Cliquez "Save and Deploy"
echo.
pause
