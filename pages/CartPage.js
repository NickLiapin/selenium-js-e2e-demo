const { By, until } = require('selenium-webdriver');
const { BasePage } = require('./BasePage');

/** Page Object for the shopping cart page. */
class CartPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.checkoutButton = By.css('[data-test="checkout"]');
  }

  /** XPath: a cart row that contains the given product name. */
  itemByName(name) {
    return By.xpath(`//div[contains(@class,"cart_item")][.//div[text()="${name}"]]`);
  }

  async hasItem(name, timeout = 5000) {
    try {
      await this.driver.wait(until.elementLocated(this.itemByName(name)), timeout);
      return true;
    } catch {
      return false;
    }
  }

  async proceedToCheckout() {
    await this.clickUntil(this.checkoutButton, until.urlContains('checkout-step-one'));
  }
}

module.exports = { CartPage };
