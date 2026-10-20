@echo off
setlocal EnableExtensions
title AiTron OS - DSH x AionUI
set "ROOT=%~dp0"
set "CACHE=K:\Reasonix-Temp-2"

echo.
echo  AiTron OS - DeepSeek Harness x AionUI
echo  ------------------------------------
echo.

rem --- 1. Outils requis -------------------------------------------------------
where node >nul 2>nul
if errorlevel 1 goto :no_node
where pnpm >nul 2>nul
if errorlevel 1 goto :no_pnpm

rem --- 2. Caches et temporaires hors du disque C: -----------------------------
if not exist "%CACHE%\tmp" mkdir "%CACHE%\tmp"
set "TEMP=%CACHE%\tmp"
set "TMP=%CACHE%\tmp"

cd /d "%ROOT%"
if errorlevel 1 goto :no_root

rem --- 3. Installation des dependances au premier lancement -------------------
if not exist "node_modules" (
  echo [1/3] Installation des dependances ^(quelques minutes^)...
  call pnpm install --frozen-lockfile
  if errorlevel 1 goto :fail
) else (
  echo [1/3] Dependances deja installees.
)

rem --- 4. Build au premier lancement ------------------------------------------
if not exist "apps\web\dist\index.html" (
  echo [2/3] Compilation ^(quelques minutes^)...
  call pnpm run build
  if errorlevel 1 goto :fail
) else (
  echo [2/3] Build deja present.
)

rem --- 5. Lancement ------------------------------------------------------------
echo [3/3] Demarrage du serveur sur http://127.0.0.1:3080
echo       Le navigateur s'ouvre avec un jeton de lancement.
echo       Fermer cette fenetre ou Ctrl+C pour arreter.
echo.
call pnpm dsh web
echo.
echo Serveur arrete.
pause
exit /b 0

:no_node
echo [ERREUR] Node.js est introuvable.
echo          Installez Node.js 24 LTS : https://nodejs.org/fr
echo          Puis relancez ce fichier.
pause
exit /b 1

:no_pnpm
echo [ERREUR] pnpm est introuvable.
echo          Ouvrez PowerShell et lancez :  npm install -g pnpm@11.28.5
echo          Puis relancez ce fichier.
pause
exit /b 1

:no_root
echo [ERREUR] Impossible d'acceder au dossier de travail :
echo          %ROOT%
echo          Verifiez que le disque K: est connecte.
pause
exit /b 1

:fail
echo.
echo [ERREUR] L'installation ou la compilation a echoue.
echo          Consultez les messages ci-dessus.
pause
exit /b 1