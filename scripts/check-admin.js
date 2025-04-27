const { exec } = require('child_process');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Detect platform
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

function runScript() {
  if (isWindows) {
    console.log('Checking administrator privileges...');
    
    // Check if running as admin
    exec('net session >nul 2>&1', (error) => {
      if (error) {
        console.log('Not running as administrator. Requesting elevated privileges...');
        console.log('A new window will open with administrator rights.');
        
        // Get the absolute path to the project root directory
        const projectRoot = path.resolve(__dirname, '..');
        
        // Create a temporary batch file to ensure correct working directory
        const tempBatchPath = path.join(os.tmpdir(), `blitz_admin_${Math.random().toString(36).substr(2, 9)}.bat`);
        const batchContent = `@echo off
cd /d "${projectRoot.replace(/\\/g, '\\\\')}"
echo Starting Blitz Ad Blocker with administrator privileges...
npm start
pause`;
        
        // Write the temp batch file
        fs.writeFileSync(tempBatchPath, batchContent);
        
        // Execute the batch file with administrator privileges
        const elevateProcess = spawn('powershell.exe', [
          '-Command',
          `Start-Process cmd.exe -ArgumentList '/c "${tempBatchPath}"' -Verb RunAs`
        ], {
          detached: true,
          stdio: 'ignore'
        });
        
        elevateProcess.unref();
        
        // Give the user some feedback
        console.log('Elevation request sent. Please continue in the new window.');
        console.log('This window will close in 5 seconds...');
        
        // Exit this process after a short delay
        setTimeout(() => {
          // Try to clean up the temp file
          try {
            fs.unlinkSync(tempBatchPath);
          } catch (e) {
            // Ignore errors during cleanup
          }
          process.exit(0);
        }, 5000);
      } else {
        console.log('Already running with administrator privileges. Starting app...');
        require('../index');
      }
    });
  } else if (isMac) {
    console.log('Starting application on macOS...');
    require('../index');
  } else {
    console.log('Unsupported platform. Starting anyway...');
    require('../index');
  }
}

runScript();