@echo off
echo ====================================
echo   Blitz Ad Blocker Launcher
echo ====================================
echo.

:: Save the current directory path
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

:: Check if .env file exists, if not create it from example
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file from .env.example...
        copy ".env.example" ".env" >nul
        echo .env file created! Using default Blitz path.
        echo.
    ) else (
        echo Warning: .env.example not found. Using default Blitz path.
        echo.
    )
)

:: Check for administrator privileges
>nul 2>&1 net session
if %errorlevel% equ 0 (
    echo Running with administrator privileges.
    echo Starting Blitz Ad Blocker...
    echo.
    npm start
    goto :end
)

:: Request administrator elevation
echo Administrator privileges required.
echo A new window will open with elevated permissions.
echo.
pause

:: Create a temporary batch file to maintain the path
set "TEMP_BATCH=%TEMP%\blitz_launcher_%RANDOM%.bat"
echo @echo off > "%TEMP_BATCH%"
echo cd /d "%PROJECT_DIR%" >> "%TEMP_BATCH%"
echo title Blitz Ad Blocker >> "%TEMP_BATCH%"
echo npm start >> "%TEMP_BATCH%"
echo pause >> "%TEMP_BATCH%"

:: Run with administrator privileges
powershell -Command "Start-Process cmd.exe -ArgumentList '/c \"%TEMP_BATCH%\"' -Verb RunAs"

if %errorlevel% equ 0 (
    echo Administrator window opened successfully.
) else (
    echo Failed to request administrator privileges.
    echo.
    echo Alternative: Right-click Command Prompt, select "Run as administrator"
    echo Then navigate to this folder and run: npm start
    echo.
    pause
)

:end
exit
