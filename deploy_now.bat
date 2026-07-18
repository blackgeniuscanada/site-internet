@echo off
cd /d "%~dp0"
cls
echo.
echo ============================================
echo DEPLOYMENT FINAL - CONFIGURATION SITE
echo ============================================
echo.
echo Dossier courant : %cd%
echo.
echo Etape 1: Suppression du cache local (si present)...
if exist ".wrangler" rmdir /s /q .wrangler
echo OK!
echo.
echo Etape 2: Redeploiement...
call npx wrangler deploy
if errorlevel 1 (
  echo.
  echo ============================================
  echo ECHEC DU DEPLOIEMENT — voir le message d'erreur ci-dessus.
  echo ============================================
  echo.
  pause
  exit /b 1
)
echo.
echo ============================================
echo DEPLOYMENT TERMINE!
echo ============================================
pause
