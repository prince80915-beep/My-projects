@echo off
cd /d "%~dp0"
taskkill /F /IM node.exe >nul 2>&1
start "LearnHub Server" cmd /k "cd /d "%~dp0" && node server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000/learnhub-admin.html"
