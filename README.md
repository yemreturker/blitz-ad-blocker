# Blitz Ad Blocker

A Node.js tool to remove advertisements from the Blitz application by manipulating its DOM using Puppeteer.

**⚠️ Warning**: Using this tool may violate Blitz.gg's terms of service and could lead to account suspension. Use it for educational purposes only at your own risk.

## Features
- Automatically removes ads based on predefined CSS selectors.
- Triggered by user actions (clicks or navigation).
- Minimal and clear console logs.
- Configurable Blitz executable path via `.env`.

## Prerequisites
- Node.js (v16 or higher recommended).
- Blitz application installed.
- Windows OS (for `taskkill` command).

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
   BLITZ_PATH=C:\\Users\\YourUsername\\AppData\\Local\\Programs\\Blitz\\Blitz.exe
   ```

## Usage
Run the tool:
```bash
npm start
```
- Make sure to run the terminal as an administrator to avoid permission issues.
- The tool connects to the Blitz app, removes ads on startup, and continues to remove ads whenever you click or navigate within the app.
- Logs are displayed in the terminal:
   - `[INFO]`: Status updates.
   - `[SUCCESS]`: Successful ad removals.
   - `[ERROR]`: Errors.

To stop, press `Ctrl+C` in the terminal.

## Configuration
- **Ad Selectors**: Edit `knownAdSelectors` in `index.js` to target different DOM elements.
- **Cooldown**: Adjust the 10-second cooldown in `auto |RemoveAds` to prevent excessive removals.

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