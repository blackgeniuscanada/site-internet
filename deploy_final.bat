@echo off
echo.
echo ============ DEPLOYMENT FINAL v5 ============
echo.
echo Suppression du cache...
rmdir /s /q .wrangler
echo.
echo Redéploiement avec configuration 'site'...
call npx wrangler deploy
echo.
echo ============ TERMINED! ============
pause
