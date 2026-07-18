@echo off
cd /d "%~dp0"
cls
echo.
echo ============================================
echo DEPLOYMENT FINAL - CONFIGURATION SITE
echo ============================================
echo.
echo Etape 1: Suppression complete du cache...
rmdir /s /q .wrangler
echo OK!
echo.
echo Etape 2: Redéploiement...
call npx wrangler deploy --verbose
echo.
echo ============================================
echo DEPLOYMENT TERMINE!
echo ============================================
pause
