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

// Initialize click listener on a page
async function setupClickListener(page) {
  try {
    await page.evaluate(() => {
      document.addEventListener('click', () => {
        window._triggerAdRemoval = true;
      });
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
              element.remove();
            });
            return elements.length;
          }, selector);
          removedCount += count;
        } catch (err) {}
      }

      return removedCount;
    }

    // Known ad selectors
    const knownAdSelectors = [
      '#main-content div.🤑-container',
      '#main-content div.placeholder',
      '#main-content > div > div.route-wrapper:nth-child(1) > div > div:nth-child(2) > div > div:nth-child(2) > section:nth-child(2) > div > div:nth-child(3) > div',
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

// Start the application using path from .env
const appPath = process.env.BLITZ_PATH;
removeBlitzAds(appPath);