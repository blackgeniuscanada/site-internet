@echo off
cd /d "%~dp0"
echo.
echo ============ DEPLOYMENT FINAL v5 ============
echo.
echo Suppression du cache...
rmdir /s /q .wrangler
echo.
echo Installation des dependances (npm install)...
call npm install
echo.
echo Redéploiement avec configuration 'site'...
call npx wrangler deploy
echo.
echo ============ TERMINED! ============
pause
