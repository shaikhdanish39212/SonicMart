@echo off
echo 🚀 Starting Sounds Accessories App with MongoDB Atlas...
echo.

REM Stop any existing Node processes
taskkill /f /im node.exe >nul 2>&1

REM Start Backend Server
echo 📡 Starting Backend Server on port 5000...
start "Backend Server" cmd /c "cd /d C:\TYCS_44\Project\backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend Server
echo 🖥️ Starting Frontend Server on port 5174...
start "Frontend Server" cmd /c "cd /d C:\TYCS_44\Project\myproject && npm run dev"

echo.
echo ✅ Both servers are starting...
echo 📡 Backend: http://localhost:5000
echo 🖥️ Frontend: http://localhost:5174
echo.
echo After setting up MongoDB Atlas, use this script to restart both servers!
pause
