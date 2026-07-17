@echo off
REM Supprimer le cache Wrangler et forcer le redéploiement
echo Suppression du cache Wrangler...
rmdir /s /q .wrangler
echo.
echo Redéploiement avec Wrangler...
call npx wrangler deploy
echo.
echo Déploiement terminé!
pause
