@echo off
echo Checking Node.js installation...
echo.

REM Check common Node.js installation paths
if exist "C:\Program Files\nodejs\node.exe" (
    echo Found Node.js at: C:\Program Files\nodejs\
    "C:\Program Files\nodejs\node.exe" --version
    echo.
    echo Adding to PATH temporarily...
    set PATH=%PATH%;C:\Program Files\nodejs\
    echo Node.js version:
    node --version
    echo npm version:
    npm --version
) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
    echo Found Node.js at: C:\Program Files (x86)\nodejs\
    "C:\Program Files (x86)\nodejs\node.exe" --version
    echo.
    echo Adding to PATH temporarily...
    set PATH=%PATH%;C:\Program Files (x86)\nodejs\
    echo Node.js version:
    node --version
    echo npm version:
    npm --version
) else if exist "%USERPROFILE%\AppData\Roaming\npm\node.exe" (
    echo Found Node.js at: %USERPROFILE%\AppData\Roaming\npm\
    "%USERPROFILE%\AppData\Roaming\npm\node.exe" --version
) else (
    echo Node.js not found in common locations.
    echo Please check if Node.js is installed properly.
    echo You may need to restart your terminal or add Node.js to PATH manually.
)

echo.
echo If Node.js is working, you can now run:
echo cd frontend
echo npm install
echo ng serve

pause
