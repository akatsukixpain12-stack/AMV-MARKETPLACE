@echo off
title VORTEX MARKETPLACE - AUTO RESTART SERVER
echo ========================================
echo   VORTEX MARKETPLACE - FOREVER MODE
echo ========================================
echo.
echo This server will automatically restart if it crashes
echo Press Ctrl+C to stop completely
echo.

REM Activate virtual environment
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
)

:restart
echo.
echo [%date% %time%] Starting server...
echo.

REM Run the Flask app
python app.py

echo.
echo [%date% %time%] Server stopped! Restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto restart
