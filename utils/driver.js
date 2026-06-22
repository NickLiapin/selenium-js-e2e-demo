const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Build a Chrome WebDriver instance.
 * Headless by default; set HEADLESS=false to watch it run locally.
 * Selenium Manager (bundled with selenium-webdriver 4.x) resolves the matching
 * chromedriver automatically - no manual driver management needed.
 */
function buildDriver() {
  const options = new chrome.Options();
  if (process.env.HEADLESS !== 'false') {
    options.addArguments('--headless=new');
  }
  options.addArguments(
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1280,900',
  );
  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

module.exports = { buildDriver };
