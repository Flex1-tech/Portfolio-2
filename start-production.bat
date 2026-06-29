@echo off
REM Production Deployment Script for Windows
REM Run this to start both backend and frontend for production

echo 🚀 Starting Portfolio Production Deployment...
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Backend Setup
echo.
echo 📦 Setting up Backend...
cd server

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Run migrations
echo 🗄️  Running database migrations...
call npm run migrate

REM Seed database with sample data
echo 🌱 Seeding database with sample data...
call npm run seed

echo.
echo ✅ Backend setup complete!
echo.

REM Start backend in new window
echo 🟢 Starting backend server...
start "Backend Server" cmd /k npm run dev

timeout /t 2 >nul

REM Frontend Setup
echo.
echo 🎨 Setting up Frontend...
cd ..\Portfolio\app

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start frontend in new window
echo 🟢 Starting frontend server...
start "Frontend Server" cmd /k npm run dev

echo.
echo ================================================
echo ✅ Both servers are starting!
echo.
echo 📍 Frontend: http://localhost:5173
echo 📍 Backend:  http://localhost:5000
echo.
echo Check the new windows for server output
echo Close the windows to stop the servers
echo ================================================
