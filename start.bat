@echo off
setlocal

:: Get the absolute path to the current directory
set "PROJECT_DIR=%~dp0"

:: Change to the project directory
cd /d "%PROJECT_DIR%"

:: Check if .env file exists, if not create it from example
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file from .env.example...
        copy ".env.example" ".env" >nul
        echo .env file created! Using default Blitz path.
        echo.
    )
)

:: Check if node_modules exists, if not run npm install
if not exist "node_modules" (
    echo Dependencies not found. Installing...
    echo This may take a minute...
    echo.
    call npm install
    echo.
    echo Dependencies installed successfully!
    echo.
)

:: Create a direct launcher with full paths
echo @echo off > "%TEMP%\blitz_launcher.bat"
echo cd /d "%PROJECT_DIR%" >> "%TEMP%\blitz_launcher.bat"
echo title Blitz Ad Blocker >> "%TEMP%\blitz_launcher.bat"
echo echo Starting Blitz Ad Blocker... >> "%TEMP%\blitz_launcher.bat"
echo call npm start >> "%TEMP%\blitz_launcher.bat"
echo pause >> "%TEMP%\blitz_launcher.bat"

:: Launch the batch file with admin privileges
echo Launching Blitz Ad Blocker with administrator privileges...
powershell -Command "Start-Process '%TEMP%\blitz_launcher.bat' -Verb RunAs"

:: Exit this script
exit
