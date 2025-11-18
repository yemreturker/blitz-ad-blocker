# Changelog

All notable changes to this project will be documented in this file.

## [1.2.1] - 2025-01-18

### Improved
- **Fully automatic installation**:
  - Launchers now automatically run `npm install` if dependencies are missing
  - No manual setup required - just clone and run!
  - Installation is now truly one-click after cloning
- **Simplified launcher scripts**:
  - Replaced `direct-admin-launch.bat` and `run-as-admin.bat` with single `start.bat`
  - Renamed `run-on-mac.sh` to `start.sh` for consistency
  - Both launchers automatically create `.env` from `.env.example` on first run
- **Better first-time user experience**:
  - Added `.env.example` file with helpful comments
  - Launchers automatically configure `.env` if missing
  - Dependencies install automatically on first run
  - No manual configuration needed for standard installations
- **Improved documentation**:
  - Simplified installation instructions (now just 2 steps!)
  - Clearer usage guide
  - Removed confusing multiple options

### Fixed
- Fixed missing `.env` file error for users downloading from GitHub
- Fixed "Cannot find module 'dotenv'" error when dependencies not installed
- Made dotenv configuration more robust
- Fixed start.bat using working direct-launch method

## [1.2.0] - 2025-01-18

### Added
- **Network-level ad blocking**: Intercepts and blocks ad requests before they load
  - Amazon Advertising System (aax.amazon-adsystem.com)
  - Google DoubleClick
  - Google Ad Services
  - Custom URL pattern blocking (/e/dtb/bid, /ads/, etc.)
- **MutationObserver**: Automatically detects and blocks newly added ad elements
- **Smarter selector targeting**: Only processes unprocessed elements to improve performance

### Fixed
- **DOM manipulation error**: Fixed "Failed to execute 'insertBefore' on 'Node'" error
  - Changed from removing elements to hiding them with CSS
  - Prevents conflicts with Blitz's React framework
  - Elements are now hidden using multiple CSS properties with !important flags
- Improved error handling for frame access issues

### Changed
- Ad elements are now hidden instead of removed from the DOM
- Added data attribute marking (`data-ad-blocked`) to prevent reprocessing
- Enhanced logging for blocked network requests

## [1.1.0] - Previous Release

### Features
- DOM-based ad removal using CSS selectors
- Cross-platform support (Windows & macOS)
- Configurable Blitz executable path via .env
- Click-triggered ad removal
- Navigation event listeners

## [1.0.0] - Initial Release

### Features
- Basic ad blocking functionality
- Windows support
- Puppeteer integration
