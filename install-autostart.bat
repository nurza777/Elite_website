@echo off
chcp 65001 >nul
title Elite Academy - autostart setup
cd /d "%~dp0"

REM ASCII only - cmd.exe reads .bat in the OEM codepage, see start-office-server.bat
REM
REM We put a shortcut into the Startup folder instead of creating a
REM scheduled task: Task Scheduler needs administrator rights, the
REM Startup folder does not - and on an office PC there is often no admin.

echo.
echo  ============================================================
echo   Autostart setup for the Elite dev site
echo  ============================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "try {" ^
  "  $lnk = Join-Path ([Environment]::GetFolderPath('Startup')) 'Elite dev site.lnk';" ^
  "  $s = (New-Object -ComObject WScript.Shell).CreateShortcut($lnk);" ^
  "  $s.TargetPath = '%~dp0start-office-server.bat';" ^
  "  $s.WorkingDirectory = '%~dp0'.TrimEnd('\');" ^
  "  $s.WindowStyle = 7;" ^
  "  $s.Description = 'Elite Academy dev site for the office LAN';" ^
  "  $s.Save();" ^
  "  Write-Host ('  Shortcut created: ' + $lnk);" ^
  "  exit 0" ^
  "} catch { Write-Host ('  ERROR: ' + $_.Exception.Message); exit 1 }"

if errorlevel 1 goto failed

echo.
echo  ------------------------------------------------------------
echo   DONE. The site will start automatically every time
echo   someone logs in to Windows on this PC.
echo.
echo   The window opens minimized - it must stay open.
echo.
echo   Start it right now without rebooting:
echo       double-click start-office-server.bat
echo.
echo   To turn autostart off:
echo       double-click uninstall-autostart.bat
echo  ------------------------------------------------------------
echo.
pause
exit /b 0

:failed
echo.
echo   FAILED to set up autostart.
echo   You can do it by hand:
echo     1. Press Win+R, type   shell:startup   and press Enter
echo     2. Copy start-office-server.bat into the folder that opens
echo        (right-click - Copy, then right-click - Paste shortcut)
echo.
pause
exit /b 1
