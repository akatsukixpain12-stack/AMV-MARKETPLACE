@echo off
echo ========================================
echo   VORTEX Marketplace - Starting...
echo ========================================
echo.

echo [1/2] Starting Flask Backend...
start "Flask Backend" cmd /k "python app.py"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit...
pause >nul
