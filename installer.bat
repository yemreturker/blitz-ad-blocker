@echo off
setlocal enabledelayedexpansion

echo ====================================
echo    Blitz Ad Blocker Installer
echo ====================================
echo.

:: Check for administrator privileges
>nul 2>&1 net session
if %errorlevel% neq 0 (
    echo [WARNING] Not running with administrator privileges.
    echo This script needs to install dependencies and may require admin rights.
    echo.
    echo Please run this installer as administrator.
    echo Right-click on installer.bat and select "Run as administrator"
    pause
    exit /b 1
)

:: Check for winget installation
echo Checking for winget installation...
winget --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Winget is not installed or not in PATH.
    echo.
    echo Winget is needed to install other dependencies.
    echo For Windows 10 version 1809 or later, you can install it from the Microsoft Store.
    echo.
    echo Would you like to open the Microsoft Store to install App Installer (Winget)? (Y/N)
    set /p install_winget=
    if /i "!install_winget!"=="Y" (
        start ms-windows-store://pdp/?ProductId=9NBLGGH4NNS1
        echo Please run this installer again after installing Winget.
        pause
        exit /b 1
    ) else (
        echo Skipping Winget installation.
        echo The installer will try to continue but may fail.
    )
) else (
    echo [SUCCESS] Winget is installed.
)
echo.

:: Check for Git installation
echo Checking for Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Git is not installed or not in PATH.
    echo.
    echo Would you like to install Git? (Y/N)
    set /p install_git=
    if /i "!install_git!"=="Y" (
        echo Installing Git...
        winget install --id Git.Git -e --accept-source-agreements --accept-package-agreements
        
        if %errorlevel% neq 0 (
            echo [ERROR] Failed to install Git.
            echo Please install Git manually from https://git-scm.com/downloads
            echo Then run this installer again.
            pause
            exit /b 1
        )
        
        echo [SUCCESS] Git installed successfully.
        echo Refreshing environment variables...
        :: Refresh environment PATH to include Git
        call :refresh_env
    ) else (
        echo Skipping Git installation.
        echo The installer will try to continue but may fail if Git is required.
    )
) else (
    echo [SUCCESS] Git is installed.
)
echo.

:: Check for Node.js installation
echo Checking for Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Node.js is not installed or not in PATH.
    echo.
    echo Would you like to install Node.js? (Y/N)
    set /p install_node=
    if /i "!install_node!"=="Y" (
        echo Installing Node.js...
        winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
        
        if %errorlevel% neq 0 (
            echo [ERROR] Failed to install Node.js.
            echo Please install Node.js manually from https://nodejs.org/
            echo Then run this installer again.
            pause
            exit /b 1
        )
        
        echo [SUCCESS] Node.js installed successfully.
        echo Refreshing environment variables...
        :: Refresh environment PATH to include Node.js
        call :refresh_env
    ) else (
        echo Skipping Node.js installation.
        echo Cannot continue without Node.js.
        pause
        exit /b 1
    )
) else (
    echo [SUCCESS] Node.js is installed.
)
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
exit /b 0

:: Function to refresh environment variables
:refresh_env
for /f "tokens=2* delims= " %%a in ('reg query HKLM\SYSTEM\CurrentControlSet\Control\Session" "Manager\Environment /v Path') do set "PATH=%%b"
for /f "tokens=2* delims= " %%a in ('reg query HKCU\Environment /v Path') do set "PATH=!PATH!;%%b"
goto :eof