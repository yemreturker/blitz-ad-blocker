@echo off
setlocal enabledelayedexpansion

echo ====================================
echo    Blitz Ad Blocker Installer
echo ====================================
echo.

:: Check for Node.js installation
echo Checking for Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo After installing Node.js, run this installer again.
    pause
    exit /b 1
)
echo [SUCCESS] Node.js is installed.
echo.

:: Get Blitz installation path
echo Checking for Blitz installation...
set "DEFAULT_BLITZ_PATH=%LOCALAPPDATA%\Programs\Blitz\Blitz.exe"

if exist "%DEFAULT_BLITZ_PATH%" (
    echo [SUCCESS] Found Blitz at default location:
    echo %DEFAULT_BLITZ_PATH%
    set "BLITZ_PATH=%DEFAULT_BLITZ_PATH%"
) else (
    echo [WARNING] Blitz was not found at the default location.
    echo.
    
    echo Please enter the path to your Blitz.exe file
    echo Example: C:\Users\YourUsername\AppData\Local\Programs\Blitz\Blitz.exe
    echo.
    set /p "BLITZ_PATH=Enter Blitz.exe path: "
    
    if not exist "!BLITZ_PATH!" (
        echo [ERROR] The specified path does not exist:
        echo !BLITZ_PATH!
        echo Installation will continue, but you'll need to update the .env file later.
    ) else (
        echo [SUCCESS] Blitz found at the specified location.
    )
)

:: Escape backslashes for the .env file
set "ESCAPED_BLITZ_PATH=%BLITZ_PATH:\=\\%"

:: Create .env file
echo.
echo Creating .env file...
echo BLITZ_PATH=%ESCAPED_BLITZ_PATH% > .env
echo [SUCCESS] Created .env file.

:: Install dependencies
echo.
echo Installing dependencies (this may take a while)...
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    echo Please try running 'npm install' manually.
    pause
    exit /b 1
)

echo [SUCCESS] Dependencies installed successfully.
echo.

:: Create desktop shortcut (optional)
echo Would you like to create a desktop shortcut? (Y/N)
set /p create_shortcut=
if /i "%create_shortcut%"=="Y" (
    echo Creating desktop shortcut...
    
    set "SHORTCUT_PATH=%USERPROFILE%\Desktop\Blitz Ad Blocker.lnk"
    set "CURRENT_DIR=%cd%"
    
    :: Create a temporary VBScript to make the shortcut
    set "VBS_SCRIPT=%TEMP%\CreateShortcut.vbs"
    
    echo Set oWS = WScript.CreateObject("WScript.Shell") > "%VBS_SCRIPT%"
    echo sLinkFile = "%SHORTCUT_PATH%" >> "%VBS_SCRIPT%"
    echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%VBS_SCRIPT%"
    echo oLink.TargetPath = "cmd.exe" >> "%VBS_SCRIPT%"
    echo oLink.Arguments = "/c cd /d ""%CURRENT_DIR%"" && direct-admin-launch.bat" >> "%VBS_SCRIPT%"
    echo oLink.WorkingDirectory = "%CURRENT_DIR%" >> "%VBS_SCRIPT%"
    echo oLink.Description = "Blitz Ad Blocker" >> "%VBS_SCRIPT%"
    echo oLink.IconLocation = "%DEFAULT_BLITZ_PATH%,0" >> "%VBS_SCRIPT%"
    echo oLink.Save >> "%VBS_SCRIPT%"
    
    cscript //nologo "%VBS_SCRIPT%"
    del "%VBS_SCRIPT%"
    
    echo [SUCCESS] Desktop shortcut created.
) else (
    echo Skipping desktop shortcut creation.
)

echo.
echo ====================================
echo    Installation Complete!
echo ====================================
echo.
echo To run Blitz Ad Blocker:
echo.
echo Option 1 (Recommended): Run direct-admin-launch.bat
echo Option 2: Run run-as-admin.bat
echo Option 3: Run 'npm run start:admin' in Command Prompt
echo.
echo Note: The application will run Blitz with ad blocking enabled.
echo       You need administrator privileges to use this tool.
echo.

pause