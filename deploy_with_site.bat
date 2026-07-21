@echo off
cd /d "%~dp0"
echo.
echo === DERNIER DÉPLOIEMENT AVEC CONFIGURATION 'SITE' ===
echo.
echo Suppression du cache Wrangler...
rmdir /s /q .wrangler
echo.
echo Installation des dependances (npm install)...
call npm install
echo.
echo Redéploiement avec la configuration 'site'...
call npx wrangler deploy
echo.
echo Déploiement terminé!
pause
