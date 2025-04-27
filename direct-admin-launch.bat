@echo off
setlocal

:: Get the absolute path to the current directory
set "PROJECT_DIR=%~dp0"

:: Change to the project directory
cd /d "%PROJECT_DIR%"

:: Create a direct launcher with full paths
echo @echo off > "%TEMP%\blitz_direct_launcher.bat"
echo cd /d "%PROJECT_DIR%" >> "%TEMP%\blitz_direct_launcher.bat"
echo echo Starting Blitz Ad Blocker... >> "%TEMP%\blitz_direct_launcher.bat"
echo call npm start >> "%TEMP%\blitz_direct_launcher.bat"
echo pause >> "%TEMP%\blitz_direct_launcher.bat"

:: Launch the batch file with admin privileges
echo Launching Blitz Ad Blocker with administrator privileges...
powershell -Command "Start-Process '%TEMP%\blitz_direct_launcher.bat' -Verb RunAs"

:: Exit this script
exit