require('dotenv').config(); // Load environment variables from .env
const puppeteer = require('puppeteer-core');
const { exec } = require('child_process');
const fs = require('fs').promises;
const net = require('net');
const { promisify } = require('util');
const path = require('path');
const os = require('os');

const execPromise = promisify(exec);

// Logging functions
const logInfo = (msg) => console.log(`[INFO] ${msg}`);
const logSuccess = (msg) => console.log(`[SUCCESS] ${msg}`);
const logError = (msg) => console.log(`[ERROR] ${msg}`);
const logWarning = (msg) => console.log(`[WARNING] ${msg}`);

// Check admin rights on Windows
function checkAdminRights() {
  if (isWindows) {
    try {
      // Check if we are running as administrator by trying to access a protected resource
      execPromise('net session >nul 2>&1').then(() => {
        logSuccess('Running with Administrator privileges.');
      }).catch(() => {
        logWarning('Not running as Administrator. Some features may not work correctly.');
        logInfo('Consider using run-as-admin.bat to launch with proper privileges.');
      });
    } catch (err) {
      // Ignore errors
    }
  }
}

// Detect platform
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

// Check if a file exists
async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Find an available port starting from startPort
async function findFreePort(startPort) {
  let port = startPort;
  while (true) {
    const available = await new Promise((resolve) => {
      const server = net.createServer();
      server.unref();
      server.on('error', () => resolve(false));
      server.listen(port, () => {
        server.close(() => resolve(true));
      });
    });
    if (available) return port;
    port++;
  }
}

// Terminate existing Blitz processes
async function killBlitzProcesses() {
  try {
    if (isWindows) {
      await execPromise('taskkill /IM Blitz.exe /F');
    } else if (isMac) {
      await execPromise('pkill -f "Blitz"');
    }
  } catch (err) {
    // Ignore errors if no processes were found
  }
}

// Initialize click listener and mutation observer on a page
async function setupClickListener(page) {
  try {
    await page.evaluate(() => {
      document.addEventListener('click', () => {
        window._triggerAdRemoval = true;
      });

      // Setup MutationObserver to watch for new ad elements
      if (!window._adObserverSetup) {
        const adSelectors = [
          '.🤑-container',
          '.⚡b5a12479',
          '.🤑-column',
          '.placeholder',
        ];

        const observer = new MutationObserver((mutations) => {
          let foundAds = false;
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                adSelectors.forEach((selector) => {
                  if (node.matches && node.matches(selector)) {
                    foundAds = true;
                  }
                  // Check children
                  if (node.querySelectorAll) {
                    const children = node.querySelectorAll(selector);
                    if (children.length > 0) foundAds = true;
                  }
                });
              }
            });
          });
          if (foundAds) {
            window._triggerAdRemoval = true;
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        window._adObserverSetup = true;
      }
    });
  } catch (err) {
    logError(`Failed to setup click listener: ${err.message}`);
  }
}

// Get proper Blitz path based on platform
function getBlitzPath(configPath) {
  // Use the path from config if provided
  if (configPath) {
    return configPath;
  }
  
  // If no path was provided in .env, try to use default locations
  if (isWindows) {
    const defaultWinPath = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Blitz', 'Blitz.exe');
    return defaultWinPath;
  } else if (isMac) {
    const defaultMacPath = '/Applications/Blitz.app/Contents/MacOS/Blitz';
    return defaultMacPath;
  }
  
  throw new Error('Unsupported platform');
}

// Main function to remove ads from Blitz
async function removeBlitzAds(configAppPath) {
  let appProcess, browser, page;
  let lastRemoval = 0;

  try {
    // Get appropriate Blitz path for the platform
    const appPath = getBlitzPath(configAppPath);
    
    // Validate Blitz executable path
    if (!(await checkFileExists(appPath))) {
      throw new Error(`Blitz executable not found: ${appPath}`);
    }

    // Terminate existing Blitz processes
    await killBlitzProcesses();

    // Find a free port for debugging
    const debugPort = await findFreePort(9222);

    // Launch Blitz in debug mode
    let launchCommand;
    if (isWindows) {
      launchCommand = `"${appPath}" --remote-debugging-port=${debugPort}`;
    } else if (isMac) {
      launchCommand = `"${appPath}" --remote-debugging-port=${debugPort}`;
      
      // Display warning for macOS
      logWarning('macOS support is experimental and untested. Please report any issues.');
    }

    appProcess = exec(launchCommand, { windowsHide: false });

    // Wait for debug port to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Connect to Blitz via Puppeteer
    for (let i = 0; i < 30; i++) {
      try {
        browser = await puppeteer.connect({
          browserURL: `http://localhost:${debugPort}`,
          defaultViewport: null,
        });
        break;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!browser) {
      throw new Error('Failed to connect to Blitz.');
    }

    // Blocked domains and patterns for network requests
    const blockedDomains = [
      'aax.amazon-adsystem.com',
      'amazon-adsystem.com',
      'ads.blitz.gg',
      'doubleclick.net',
      'googlesyndication.com',
      'googleadservices.com',
    ];

    const blockedPatterns = [
      '/e/dtb/bid',
      '/ads/',
      '/ad/',
      '/banner',
    ];

    // Setup request interception for a page
    async function setupRequestInterception(page) {
      try {
        await page.setRequestInterception(true);

        page.on('request', (request) => {
          const url = request.url();
          const shouldBlock = blockedDomains.some(domain => url.includes(domain)) ||
                             blockedPatterns.some(pattern => url.includes(pattern));

          if (shouldBlock) {
            logSuccess(`Blocked: ${url}`);
            request.abort();
          } else {
            request.continue();
          }
        });

        logInfo('Network-level ad blocking enabled.');
      } catch (err) {
        logError(`Failed to setup request interception: ${err.message}`);
      }
    }

    // Get pages and select the main page
    async function refreshPage() {
      const pages = await browser.pages();
      if (pages.length === 0) {
        logError('No pages found.');
        return null;
      }
      page = pages[0];
      try {
        await page.waitForSelector('body', { timeout: 30000 });
        await setupRequestInterception(page);
        await setupClickListener(page);
        logInfo('Connected to Blitz page.');
      } catch (err) {
        logError(`Failed to initialize page: ${err.message}`);
      }
      return page;
    }

    page = await refreshPage();
    if (!page) {
      throw new Error('No valid page found.');
    }

    // Remove ads matching the given selector
    async function removeAd(selector) {
      const frames = [page.mainFrame(), ...(await page.frames())];
      let removedCount = 0;

      for (const frame of frames) {
        try {
          const count = await frame.evaluate((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
              // Instead of removing, hide the element to prevent DOM manipulation errors
              if (element && element.style) {
                element.style.setProperty('display', 'none', 'important');
                element.style.setProperty('visibility', 'hidden', 'important');
                element.style.setProperty('opacity', '0', 'important');
                element.style.setProperty('height', '0', 'important');
                element.style.setProperty('width', '0', 'important');
                element.style.setProperty('overflow', 'hidden', 'important');
                element.style.setProperty('position', 'absolute', 'important');
                element.style.setProperty('pointer-events', 'none', 'important');
                // Mark as processed to avoid reprocessing
                element.setAttribute('data-ad-blocked', 'true');
              }
            });
            return elements.length;
          }, selector);
          removedCount += count;
        } catch (err) {
          // Silently handle frame access errors
        }
      }

      return removedCount;
    }

    // Known ad selectors - only target elements that haven't been processed yet
    const knownAdSelectors = [
      'div.🤑-container:not([data-ad-blocked])',
      'div.⚡b5a12479:not([data-ad-blocked])',
      'div.🤑-column:not([data-ad-blocked])',
      'div.placeholder:not([data-ad-blocked])',
      // Add more specific ad selectors if needed
      '[class*="ad-container"]:not([data-ad-blocked])',
      '[id*="ad-slot"]:not([data-ad-blocked])',
    ];

    // Automatically remove known ads
    async function autoRemoveAds() {
      if (!page) {
        page = await refreshPage();
        if (!page) return;
      }

      const now = Date.now();
      if (now - lastRemoval < 1000) return; // 1-second cooldown
      lastRemoval = now;

      let totalRemoved = 0;
      for (const selector of knownAdSelectors) {
        totalRemoved += await removeAd(selector);
      }
      if (totalRemoved > 0) {
        logSuccess(`Ad removal completed. Total removed: ${totalRemoved}`);
      } else {
        logInfo('No ads found.');
      }
    }

    // Start ad removal, triggered by user actions
    logInfo('Ad removal started. Triggered by user actions (clicks or navigation).');
    await autoRemoveAds(); // Initial removal

    // Listen for navigation events
    page.on('framenavigated', async () => {
      page = await refreshPage();
      if (page) await autoRemoveAds();
    });

    // Check for click triggers
    setInterval(async () => {
      if (!page) {
        page = await refreshPage();
        if (!page) return;
      }

      try {
        const shouldRemove = await page.evaluate(() => {
          const result = window._triggerAdRemoval;
          window._triggerAdRemoval = false;
          return result;
        });
        if (shouldRemove) {
          await autoRemoveAds();
        }
      } catch (err) {
        if (err.message.includes('detached')) {
          page = await refreshPage();
          if (page) await autoRemoveAds();
        } else {
          logError(`Click trigger error: ${err.message}`);
        }
      }
    }, 1000); // Check every second

    // Keep the program running
    await new Promise(() => {});

  } catch (err) {
    logError(err.message);
  } finally {
    if (browser) await browser.disconnect();
    if (appProcess) appProcess.kill();
  }
}

// Check admin rights before starting (Windows only)
checkAdminRights();

// Start the application using path from .env
const appPath = process.env.BLITZ_PATH;
removeBlitzAds(appPath);