@echo off
chcp 65001 >nul
title Elite Academy - dev-сайт для офиса
cd /d "%~dp0"

REM Порт можно поменять здесь, если 8080 занят
set PORT=8080

where py >nul 2>nul
if errorlevel 1 (
    echo.
    echo  Не найден Python. Установи его с python.org
    echo  и при установке поставь галочку "Add Python to PATH".
    echo.
    pause
    exit /b 1
)

py -3 serve_lan.py %PORT%

REM Если сервер упал — окно не закрываем, чтобы была видна ошибка
if errorlevel 1 pause
