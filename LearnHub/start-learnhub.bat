@echo off
setlocal
cd /d "%~dp0"
title LearnHub Server
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  pause
  exit /b 1
)
for /f "tokens=5" %%P in ('netstat -ano ^| findstr LISTENING ^| findstr ":3000"') do taskkill /F /PID %%P >nul 2>nul
node server.js
pause
endlocal
