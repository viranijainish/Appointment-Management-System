@echo off
echo Starting Appointment Management System...
echo.

echo Starting Backend API...
start "Backend API" cmd /k "cd backend && dotnet run"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && set PATH=%PATH%;C:\Program Files\nodejs\ && npx ng serve"

echo.
echo Both servers are starting...
echo Backend will be available at: https://localhost:7041
echo Frontend will be available at: http://localhost:4200
echo.
echo Press any key to continue...
pause > nul
