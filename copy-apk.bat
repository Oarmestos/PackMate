@echo off
REM Script para copiar la APK generada a la carpeta APK con nombre descriptivo
echo Copiando APK a carpeta APK...

set SOURCE_DIR=android\app\build\outputs\apk\release
set DEST_DIR=APK

REM Buscar el archivo APK más reciente en la carpeta de release
for /f "delims=" %%i in ('dir /b /od "%SOURCE_DIR%\*.apk"') do set LATEST_APK=%%i

if defined LATEST_APK (
    echo Copiando %LATEST_APK% a %DEST_DIR%\
    copy "%SOURCE_DIR%\%LATEST_APK%" "%DEST_DIR%\"
    echo.
    echo ✓ APK copiada exitosamente: %LATEST_APK%
    echo Ubicación: %DEST_DIR%\%LATEST_APK%
) else (
    echo ✗ No se encontró ninguna APK en %SOURCE_DIR%
    exit /b 1
)

echo.
pause
