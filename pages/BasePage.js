const { until } = require('selenium-webdriver');

/**
 * Shared WebDriver interactions with explicit waits - keeps page objects small
 * and tests reliable on slow CI runners.
 */
class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async find(locator, timeout = 5000) {
    const el = await this.driver.wait(until.elementLocated(locator), timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    await this.driver.executeScript(
      'arguments[0].scrollIntoView({block: "center"})',
      el,
    );
    return el;
  }

  async type(locator, text) {
    const el = await this.find(locator);
    // Click first to focus - avoids strict "not interactable" errors on sendKeys.
    await el.click();
    await el.clear();
    await el.sendKeys(text);
    // Verify the value landed; React controlled inputs in headless occasionally
    // drop sendKeys. Fall back to the native setter + an "input" event so the
    // framework registers the change.
    if ((await el.getAttribute('value')) !== text) {
      await this.driver.executeScript(
        'const e=arguments[0],v=arguments[1];'
          + 'const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set;'
          + 's.call(e,v); e.dispatchEvent(new Event("input",{bubbles:true}));',
        el,
        text,
      );
    }
  }

  async click(locator) {
    const el = await this.find(locator);
    await el.click();
  }

  /**
   * Click and wait for a post-condition, retrying the click if it was dropped.
   * Swag Labs is a React SPA - on a slow CI run the first click can land before
   * the handlers are wired up and silently do nothing.
   */
  async clickUntil(locator, condition, attempts = 3, timeout = 5000) {
    let lastErr;
    for (let i = 1; i <= attempts; i += 1) {
      try {
        const el = await this.find(locator, 4000);
        if (i === 1) {
          await el.click();
        } else {
          // Native click was swallowed (React SPA timing) - dispatch via JS,
          // which the framework's delegated listener still receives.
          await this.driver.executeScript('arguments[0].click()', el);
        }
      } catch (err) {
        lastErr = err;
      }
      try {
        await this.driver.wait(condition, timeout);
        return;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr;
  }

  async getText(locator) {
    const el = await this.find(locator);
    return el.getText();
  }
}

module.exports = { BasePage };
