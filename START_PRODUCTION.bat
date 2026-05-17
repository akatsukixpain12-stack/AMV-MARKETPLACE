@echo off
echo ========================================
echo   VORTEX MARKETPLACE - PRODUCTION MODE
echo ========================================
echo.

REM Activate virtual environment
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
    echo [OK] Virtual environment activated
) else (
    echo [WARNING] Virtual environment not found, using global Python
)

echo.
echo Starting production server with Gunicorn...
echo Server will run forever until manually stopped
echo Press Ctrl+C to stop the server
echo.

REM Run with Gunicorn for production (handles crashes and restarts)
python -m gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:5000 --timeout 120 --keep-alive 5 --log-level info app:app

pause
