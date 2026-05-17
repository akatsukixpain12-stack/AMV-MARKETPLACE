@echo off
echo ========================================
echo VORTEX MARKETPLACE - Starting Frontend
echo ========================================
echo.
echo Installing Node dependencies...
call npm install
echo.
echo Starting Next.js frontend on http://localhost:3000
echo.
call npm run dev
pause
