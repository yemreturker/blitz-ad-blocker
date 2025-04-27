@echo off
:: Check for admin privileges
NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    ECHO Running with Administrator privileges.
) ELSE (
    ECHO Requesting Administrator privileges...
    
    :: Script to elevate to admin permissions
    powershell -Command "Start-Process cmd -ArgumentList '/c cd /d \"%~dp0\" && npm start' -Verb RunAs"
    exit
)

:: If we're already admin, just run the program
npm start