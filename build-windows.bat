@echo off
echo ===== Building Picture Dictionary for Windows =====
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Install it from https://nodejs.org then run again.
  pause
  exit /b 1
)
call npm install
call npm run build-win
echo.
echo Done. The installer is inside the "dist" folder.
pause
