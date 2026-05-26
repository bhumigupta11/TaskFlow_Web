@echo off
REM Team Task Manager - Development Setup Script (Windows)
REM This script will install all dependencies and set up your development environment

echo.
echo 🚀 Team Task Manager - Setup Script
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Create environment files if they don't exist
echo 📝 Setting up environment files...

if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
) else (
    echo ℹ️  backend\.env already exists
)

if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env
    echo ✅ Created frontend\.env
) else (
    echo ℹ️  frontend\.env already exists
)

echo.
echo 📦 Installing dependencies...
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)

echo ✅ Backend dependencies installed

cd ..

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install

if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo ✅ Frontend dependencies installed

cd ..

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your MongoDB URI and JWT secret
echo 2. Update frontend\.env if needed (optional)
echo 3. Run 'npm run dev' to start development servers
echo.
echo Happy coding! 🎉
