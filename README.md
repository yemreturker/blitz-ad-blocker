# Blitz Ad Blocker

A Node.js tool to remove advertisements from the Blitz application by manipulating its DOM using Puppeteer.

**⚠️ Warning**: Using this tool may violate Blitz.gg's terms of service and could lead to account suspension. Use it for educational purposes only at your own risk.

## Troubleshooting

### Common Issues

1. **"Failed to execute 'insertBefore' on 'Node'" Error**
   - **Fixed in v1.2.0**: The tool now hides ad elements instead of removing them from the DOM
   - This prevents DOM manipulation conflicts with Blitz's React framework
   - If you still encounter this issue, please report it on GitHub

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
- **Network-level ad blocking**: Intercepts and blocks ad requests before they load (Amazon Ads, Google Ads, etc.)
- **DOM-based ad removal**: Removes ad elements from the page using CSS selectors
- Triggered by user actions (clicks or navigation)
- Minimal and clear console logs
- Configurable Blitz executable path via `.env`
- Cross-platform support for both Windows and macOS (macOS support is experimental)

## Prerequisites
- Node.js (v16 or higher recommended).
- Blitz application installed.
- Windows or macOS operating system.

## Installation

### Quick Start (Recommended)

1. **Download the latest release** from [Releases](https://github.com/yemreturker/blitz-ad-blocker/releases)
   - Or clone the repository:
   ```bash
   git clone https://github.com/yemreturker/blitz-ad-blocker.git
   cd blitz-ad-blocker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   - **Windows**: Double-click `start.bat`
   - **macOS**: Double-click `start.sh` (or run `./start.sh` in Terminal)

That's it! The `.env` file will be created automatically with default settings on first run.

### Advanced Configuration (Optional)

If Blitz is installed in a non-standard location, you can edit the `.env` file:

```env
# Windows example
BLITZ_PATH=C:\Users\YourUsername\AppData\Local\Programs\Blitz\Blitz.exe

# macOS example
BLITZ_PATH=/Applications/Blitz.app/Contents/MacOS/Blitz
```

**Note:** Most users don't need to configure anything - the default paths work automatically!

## Usage

### Starting the Ad Blocker

**Windows:**
- Simply double-click `start.bat`
- The script will request administrator privileges (required for debugging Blitz)
- A new window will open - keep it running while using Blitz

**macOS:**
- Double-click `start.sh` or run `./start.sh` in Terminal
- On first run, you may need to allow Terminal permissions in System Preferences

**Alternative (Both platforms):**
```bash
npm start
```

### What Happens

1. The tool automatically closes any running Blitz instances
2. Relaunches Blitz in debug mode
3. Connects to Blitz and starts blocking ads
4. Logs appear in the console:
   - `[INFO]` - Status updates
   - `[SUCCESS]` - Blocked ads and network requests
   - `[ERROR]` - Any issues encountered
   - `[WARNING]` - Important notices

### Stopping the Ad Blocker

Press `Ctrl+C` in the terminal window to stop.

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
- **Blocked Domains**: Edit `blockedDomains` array in `index.js` to block additional ad networks.
- **Blocked Patterns**: Edit `blockedPatterns` array in `index.js` to block URLs matching specific patterns.
- **Ad Selectors**: Edit `knownAdSelectors` in `index.js` to target different DOM elements.
- **Cooldown**: Adjust the 1-second cooldown in `autoRemoveAds` to prevent excessive removals.

### Currently Blocked Networks
- Amazon Advertising System (aax.amazon-adsystem.com)
- Google DoubleClick
- Google Ad Services
- Blitz internal ads

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