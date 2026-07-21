@echo off
cd /d "%~dp0"
REM Supprimer le cache Wrangler et forcer le redéploiement
echo Suppression du cache Wrangler...
rmdir /s /q .wrangler
echo.
echo Installation des dependances (npm install)...
call npm install
echo.
echo Redéploiement avec Wrangler...
call npx wrangler deploy
echo.
echo Déploiement terminé!
pause
