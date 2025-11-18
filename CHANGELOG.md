# Changelog

All notable changes to this project will be documented in this file.

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
