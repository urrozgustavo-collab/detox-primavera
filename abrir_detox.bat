@echo off
title Detox de Primavera - Iniciando App...
echo ========================================================
echo Abriendo WebApp del Detox de Primavera (Modo Remoto Seguro)
echo ========================================================
echo.
REM Abre Chrome desactivando la aceleracion por hardware (evita la pantalla negra en remoto)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-gpu "c:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas\detox-primavera\app\index.html"
) else (
    start "" "c:\Users\urroz\Proyectos\04_productividad_herramientas\salud-recetas\detox-primavera\app\index.html"
)
exit
