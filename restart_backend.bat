@echo off
echo ========================================
echo  Restart Backend Server
echo ========================================
echo.

cd backend

echo [1/3] Stopping any running backend processes...
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo [2/3] Starting backend server...
echo Please wait for "Started BackendApplication" message...
echo.

start cmd /k "mvn spring-boot:run"

echo.
echo [3/3] Backend is starting in a new window...
echo.
echo ========================================
echo  Next Steps:
echo ========================================
echo 1. Wait for backend to fully start
echo 2. Open browser: http://localhost:5173
echo 3. Clear localStorage and login again
echo 4. Go to /account page
echo ========================================
echo.

pause
