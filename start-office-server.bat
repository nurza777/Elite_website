@echo off
chcp 65001 >nul
title Elite Academy - dev site (office LAN)
cd /d "%~dp0"

REM ============================================================
REM  ASCII only! cmd.exe reads .bat in the OEM codepage (cp866),
REM  so Cyrillic here turns into garbage and breaks parsing.
REM  All Russian text lives in serve_lan.py - Python handles UTF-8.
REM ============================================================

REM Change the port here if 8080 is taken
set PORT=8080

set "PY="
where py >nul 2>&1
if not errorlevel 1 set "PY=py -3"
if defined PY goto run

where python >nul 2>&1
if not errorlevel 1 set "PY=python"
if defined PY goto run

goto nopython

:run
%PY% serve_lan.py %PORT%
if errorlevel 1 pause
goto :eof

:nopython
echo.
echo  ============================================================
echo   Python is not installed - the server cannot start.
echo  ============================================================
echo.
echo   1. Open  https://www.python.org/downloads/
echo   2. Click the yellow "Download Python" button
echo   3. In the installer TICK the checkbox at the bottom:
echo         [x] Add python.exe to PATH
echo   4. Click "Install Now" and wait until it finishes
echo   5. Close this window and run this file again
echo.
echo   Details in Russian: README-OFFICE.md
echo.
pause
exit /b 1
