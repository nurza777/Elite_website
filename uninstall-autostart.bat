@echo off
chcp 65001 >nul
title Elite Academy - remove autostart
cd /d "%~dp0"

REM ASCII only - see start-office-server.bat

echo.
echo   Removing autostart for the Elite dev site...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$lnk = Join-Path ([Environment]::GetFolderPath('Startup')) 'Elite dev site.lnk';" ^
  "if (Test-Path $lnk) { Remove-Item $lnk -Force; Write-Host '  Autostart removed.' }" ^
  "else { Write-Host '  Autostart was not installed - nothing to remove.' }"

echo.
echo   The site can still be started manually:
echo       double-click start-office-server.bat
echo.
pause
exit /b 0
