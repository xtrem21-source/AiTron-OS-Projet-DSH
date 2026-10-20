@echo off
rem Stop the server listening on port 3080 (AiTron OS).
setlocal EnableExtensions
set "QUIET="
if /I "%~1"=="/silencieux" set "QUIET=1"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$c = Get-NetTCPConnection -LocalPort 3080 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($null -eq $c) { Write-Host 'Aucun serveur sur le port 3080.' } else { $pidToStop = $c.OwningProcess; & taskkill /PID $pidToStop /T /F | Out-Null; Write-Host ('Serveur arrete (PID ' + $pidToStop + ').') }"

if not defined QUIET pause
exit /b 0