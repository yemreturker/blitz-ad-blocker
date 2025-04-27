# Blitz Ad Blocker

A Node.js tool to remove advertisements from the Blitz application by manipulating its DOM using Puppeteer.

**⚠️ Warning**: Using this tool may violate Blitz.gg's terms of service and could lead to account suspension. Use it for educational purposes only at your own risk.

## Troubleshooting

### Windows Administrator Issues
If you encounter problems with administrator execution:

1. **"The system cannot find the path specified" Error**
   - This is usually caused by working directory issues when elevating privileges
   - Try using the `direct-admin-launch.bat` script which uses absolute paths
   - Alternatively, open Command Prompt as administrator and navigate to the exact folder path

2. **Windows Security Blocks**
   - Windows might block the elevation request. Look for security prompts.
   - Try the direct administrator execution method described above.

3. **Console Windows Closing**
   - It's normal for consoles to close when elevating privileges.
   - The application continues in the new administrator window.
   - If no new window appears, try the direct-admin-launch.bat method.

4. **NPM Not Found in Administrator Window**
   - This can happen if NPM is installed under your user profile
   - Try using the full path to npm in the batch files
   - Or use the direct-admin-launch.bat which handles this issue

### macOS Issues
1. **Permission Denied**
   - Ensure you've given Terminal the necessary permissions in System Preferences.
   - Try running the Terminal as administrator: `sudo ./run-on-mac.sh`

2. **Blitz Not Found**
   - Verify your Blitz path in the `.env` file.
   - The default path is `/Applications/Blitz.app/Contents/MacOS/Blitz`.# Blitz Ad Blocker

A Node.js tool to remove advertisements from the Blitz application by manipulating its DOM using Puppeteer.

**⚠️ Warning**: Using this tool may violate Blitz.gg's terms of service and could lead to account suspension. Use it for educational purposes only at your own risk.

## Features
- Automatically removes ads based on predefined CSS selectors.
- Triggered by user actions (clicks or navigation).
- Minimal and clear console logs.
- Configurable Blitz executable path via `.env`.
- Cross-platform support for both Windows and macOS (macOS support is experimental).

## Prerequisites
- Node.js (v16 or higher recommended).
- Blitz application installed.
- Windows or macOS operating system.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yemreturker/blitz-ad-blocker.git
   cd blitz-ad-blocker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and specify the Blitz executable path:
   ```env
   # For Windows
   BLITZ_PATH=C:\\Users\\YourUsername\\AppData\\Local\\Programs\\Blitz\\Blitz.exe
   
   # For macOS
   # BLITZ_PATH=/Applications/Blitz.app/Contents/MacOS/Blitz
   ```
   If you don't specify a path, the tool will attempt to use the default installation path for your platform.

## Usage

### Windows
For Windows users, you have several options to run with administrator privileges:

1. **Using direct-admin-launch.bat (Recommended and Most Reliable)**
   ```
   direct-admin-launch.bat
   ```
   This script uses absolute paths to ensure the application launches correctly with administrator privileges.

2. **Using run-as-admin.bat**
   ```
   run-as-admin.bat
   ```
   This batch file will automatically request administrator privileges and open a new console with the proper permissions.

3. **Using npm script**
   ```
   npm run start:admin
   ```
   This checks for administrator rights and requests elevation if needed.

4. **Direct Administrator Execution**
   - Right-click on Command Prompt and select "Run as administrator"
   - Navigate to the project directory: `cd C:\path\to\blitz-ad-blocker`
   - Run `npm start`

**Note:** When using methods 1-3, a new console window with administrator privileges will open, and the original window will close after a few seconds. This is normal behavior.

### macOS
For macOS users, you can use the shell script:
```bash
chmod +x run-on-mac.sh  # Only needed first time
./run-on-mac.sh
```

Or run directly:
```bash
npm start
```

On macOS, you may need to grant Terminal permission to control the Blitz app in System Preferences > Security & Privacy > Privacy > Automation.

### General Information
- The tool connects to the Blitz app, removes ads on startup, and continues to remove ads whenever you click or navigate within the app.
- Logs are displayed in the terminal:
   - `[INFO]`: Status updates.
   - `[SUCCESS]`: Successful ad removals.
   - `[ERROR]`: Errors.
   - `[WARNING]`: Important notices.

To stop, press `Ctrl+C` in the terminal.

## Platform-Specific Notes

### Windows
- Fully tested and supported.
- Uses `taskkill` to terminate existing Blitz processes.

### macOS
- **Experimental support**: The macOS implementation has not been extensively tested.
- Uses `pkill` to terminate existing Blitz processes.
- Default path is `/Applications/Blitz.app/Contents/MacOS/Blitz`.
- Please report any issues encountered on macOS.

## Configuration
- **Ad Selectors**: Edit `knownAdSelectors` in `index.js` to target different DOM elements.
- **Cooldown**: Adjust the 1-second cooldown in `autoRemoveAds` to prevent excessive removals.

## Project Structure
- `index.js`: Main script for ad removal.
- `.env`: Configuration file for Blitz executable path.
- `package.json`: Project metadata and dependencies.
- `.gitignore`: Ignores unnecessary files (e.g., `node_modules`, `.env`).

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## LICENSE
This project is licensed under the [MIT License](LICENSE).

## Disclaimer
This tool is for educational purposes only. The author is not responsible for any consequences of its use.