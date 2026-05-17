@echo off
echo ========================================
echo   VORTEX Marketplace - Installation
echo ========================================
echo.

echo [1/3] Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing Node.js dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Setting up environment...
if not exist .env (
    copy .env.example .env
    echo Created .env file - Please edit it with your API keys
) else (
    echo .env file already exists
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your API keys
echo 2. Run: run.bat
echo.
echo See SETUP.md for detailed instructions
echo ========================================
pause
