@echo off
rem Silent launcher body: no console, log to K:\Reasonix-Temp-2\logs\web.log
setlocal EnableExtensions
set "CACHE=K:\Reasonix-Temp-2"
if not exist "%CACHE%\tmp" mkdir "%CACHE%\tmp"
if not exist "%CACHE%\logs" mkdir "%CACHE%\logs"
set "TEMP=%CACHE%\tmp"
set "TMP=%CACHE%\tmp"
cd /d "K:\AiTron-OS-Projet-DSH"
if not exist "apps\web\dist\index.html" (
  call pnpm install --frozen-lockfile >> "%CACHE%\logs\web.log" 2>&1
  call pnpm run build >> "%CACHE%\logs\web.log" 2>&1
)
call pnpm dsh web >> "%CACHE%\logs\web.log" 2>&1