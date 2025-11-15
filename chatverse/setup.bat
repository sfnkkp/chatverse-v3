@echo off
REM ChatVerse Setup Script for Windows
REM This script helps you set up ChatVerse quickly

echo =========================================
echo    ChatVerse - Quick Setup Script
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

node --version
echo.

REM Setup Backend
echo [*] Setting up Backend...
cd backend

REM Create .env file
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo [+] Created backend\.env
) else (
    echo [!] backend\.env already exists
)

REM Install dependencies
echo Installing backend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [+] Backend dependencies installed

cd ..

REM Setup Frontend
echo.
echo [*] Setting up Frontend...
cd frontend

REM Create .env.local file
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.example .env.local
    echo [+] Created frontend\.env.local
) else (
    echo [!] frontend\.env.local already exists
)

REM Install dependencies
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [+] Frontend dependencies installed

cd ..

REM Success message
echo.
echo =========================================
echo    [+] Setup Complete!
echo =========================================
echo.
echo Next steps:
echo.
echo 1. Start the backend:
echo    cd backend ^&^& npm start
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:3000
echo.
echo 4. Admin panel:
echo    http://localhost:3000/admin
echo    Username: admin
echo    Password: chatverse2025
echo.
echo [*] For more information, read:
echo    - README.md (complete guide)
echo    - QUICKSTART.md (quick start)
echo    - DEPLOYMENT.md (production deployment)
echo.
echo Happy chatting! ^_^
echo.
pause
