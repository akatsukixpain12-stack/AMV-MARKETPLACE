@echo off
echo ========================================
echo VORTEX MARKETPLACE - Starting Server
echo ========================================
echo.
echo Installing Python dependencies...
python -m pip install -r requirements.txt
echo.
echo Starting Flask backend on http://localhost:5000
echo.
python app.py
pause
