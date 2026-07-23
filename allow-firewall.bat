@echo off
chcp 65001 >nul
title Elite Academy - firewall rule
cd /d "%~dp0"

REM ASCII only - cmd.exe reads .bat in the OEM codepage, see start-office-server.bat

set PORT=8080

REM ---- need administrator rights: re-launch ourselves elevated ----
net session >nul 2>&1
if not errorlevel 1 goto admin

echo.
echo   Asking for administrator rights...
echo   Click "Yes" in the Windows prompt.
echo.
powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs" 2>nul
if errorlevel 1 goto noadmin
exit /b 0

:admin
echo.
echo  ============================================================
echo   Opening port %PORT% for the office network
echo  ============================================================
echo.

REM Rule for ALL profiles (Domain/Private/Public) on purpose: office Wi-Fi is
REM very often classified as "Public", and a Private-only rule would do
REM nothing there. Safe here because serve_lan.py answers 403 to every
REM client outside the local network anyway.
netsh advfirewall firewall delete rule name="Elite dev site" >nul 2>&1
netsh advfirewall firewall add rule name="Elite dev site" dir=in action=allow protocol=TCP localport=%PORT% profile=any
if errorlevel 1 goto failed

echo.
echo  ------------------------------------------------------------
echo   DONE. Colleagues on the office Wi-Fi can now open the site.
echo.
echo   If it still does not open from their devices, check that
echo   they are on the SAME Wi-Fi (not a guest network).
echo  ------------------------------------------------------------
echo.
pause
exit /b 0

:failed
echo.
echo   FAILED to create the rule.
echo   Do it by hand:
echo     1. Start - "Windows Defender Firewall with Advanced Security"
echo     2. Inbound Rules - New Rule - Port - TCP - %PORT%
echo     3. Allow the connection - tick ALL three profiles - name it
echo.
pause
exit /b 1

:noadmin
echo.
echo   Could not get administrator rights.
echo   Right-click this file and choose "Run as administrator".
echo.
pause
exit /b 1
