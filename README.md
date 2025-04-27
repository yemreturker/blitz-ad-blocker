# Blitz Ad Blocker

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
For Windows users, you can use the included batch file to automatically run with administrator privileges:
```bash
run-as-admin.bat
```

Alternatively, you can run manually:
```bash
npm start
```
Note that you should run the command prompt as administrator for best results.

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