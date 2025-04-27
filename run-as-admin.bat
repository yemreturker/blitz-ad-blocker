@echo off
setlocal

:: Save the current directory path
set "CURRENT_DIR=%~dp0"
cd /d "%CURRENT_DIR%"

:: Check for administrator privileges
>nul 2>&1 net session
if %errorlevel% equ 0 (
    echo Already running with administrator privileges. Starting Blitz Ad Blocker...
    npm start
    goto :end
)

:: Request administrator elevation
echo Requesting administrator privileges...
echo This will open a new window with elevated permissions.

:: Create a temporary batch file to maintain the path
set "TEMP_BATCH=%TEMP%\blitz_admin_runner_%RANDOM%.bat"
echo @echo off > "%TEMP_BATCH%"
echo cd /d "%CURRENT_DIR%" >> "%TEMP_BATCH%"
echo echo Starting Blitz Ad Blocker with administrator privileges... >> "%TEMP_BATCH%"
echo npm start >> "%TEMP_BATCH%"
echo pause >> "%TEMP_BATCH%"

:: Run the temp batch with administrator privileges
powershell -Command "Start-Process cmd.exe -ArgumentList '/c \"%TEMP_BATCH%\"' -Verb RunAs"

:: Check if the elevation request was successful
if %errorlevel% equ 0 (
    echo Administrator privileges request sent.
    echo The application will continue in a new window.
) else (
    echo Failed to request administrator privileges.
    echo Try running Command Prompt as administrator and use 'npm start' directly.
)

:: Wait briefly before closing this window
timeout /t 3 > nul

:end
exit