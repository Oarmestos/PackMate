@echo off
echo ========================================
echo   PackMate - Modo Desarrollo
echo ========================================
echo.
echo Verificando dispositivo conectado...
adb devices
echo.
echo Iniciando Metro Bundler...
echo.
echo IMPORTANTE:
echo - Mantén esta ventana abierta
echo - Los cambios se veran automaticamente
echo - Presiona Ctrl+C para detener
echo.
echo ========================================
npm start
