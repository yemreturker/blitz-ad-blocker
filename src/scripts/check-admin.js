const { exec } = require('child_process');
const { spawn } = require('child_process');
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
        
        // Start the batch file that requests elevation
        const bat = spawn('cmd.exe', ['/c', 'run-as-admin.bat'], {
          detached: true,
          stdio: 'ignore'
        });
        bat.unref();
        
        console.log('Elevation request sent. The application will restart with proper permissions.');
        process.exit(0);
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