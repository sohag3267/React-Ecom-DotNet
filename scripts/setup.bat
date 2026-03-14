@echo off
REM DebuggerMind Setup Script for Windows
REM This script automates the initial setup process

echo.
echo ============================================
echo DebuggerMind - Automated Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)

echo Checking Node.js version...
node -v
echo.

REM Install dependencies
echo Installing dependencies...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install dependencies
    exit /b 1
)

echo Dependencies installed successfully
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local file...
    copy .env.example .env.local
    echo Created .env.local from .env.example
    echo IMPORTANT: Please update .env.local with your actual values
    echo.
) else (
    echo .env.local already exists, skipping...
    echo.
)

REM Run type check
echo Running TypeScript type check...
call npm run type-check

if %ERRORLEVEL% NEQ 0 (
    echo Warning: TypeScript errors found
    echo Please fix them before deployment
    echo.
) else (
    echo No TypeScript errors found
    echo.
)

REM Run linting
echo Running ESLint...
call npm run lint

if %ERRORLEVEL% NEQ 0 (
    echo Warning: ESLint errors found
    echo Run 'npm run lint:fix' to auto-fix some issues
    echo.
) else (
    echo No linting errors found
    echo.
)

echo ============================================
echo Setup completed successfully!
echo ============================================
echo.
echo Next steps:
echo   1. Update .env.local with your API URLs
echo   2. Run 'npm run dev' to start development server
echo   3. Open http://localhost:3000 in your browser
echo.
echo For more information, see DOCUMENTATION.html
echo.

pause
