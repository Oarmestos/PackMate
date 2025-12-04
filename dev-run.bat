@echo off
echo ========================================
echo   Instalando PackMate en dispositivo
echo ========================================
echo.
echo Verificando dispositivo...
adb devices
echo.
echo Compilando e instalando app...
echo (Esto puede tardar 1-2 minutos la primera vez)
echo.
npm run android
echo.
echo ========================================
echo App instalada! Revisa tu dispositivo
echo ========================================
pause
