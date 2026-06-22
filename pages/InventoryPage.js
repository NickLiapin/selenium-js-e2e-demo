const { By, until } = require('selenium-webdriver');
const { BasePage } = require('./BasePage');

/** Page Object for the product inventory (post-login landing) page. */
class InventoryPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.title = By.css('.title');
    this.cartBadge = By.css('.shopping_cart_badge');
    this.cartLink = By.css('.shopping_cart_link');
  }

  async waitLoaded() {
    await this.driver.wait(until.urlContains('inventory.html'), 5000);
    await this.find(this.title);
    // Wait until the product list is actually rendered (the SPA has hydrated),
    // otherwise early clicks can be dropped before handlers are wired up.
    await this.driver.wait(until.elementLocated(By.css('.inventory_item')), 5000);
  }

  async getTitle() {
    return this.getText(this.title);
  }

  /** Stable slug shared by the add / remove button selectors. */
  itemSlug(itemName) {
    return itemName.toLowerCase().replace(/\s+/g, '-');
  }

  addToCartButton(itemName) {
    return By.css(`[data-test="add-to-cart-${this.itemSlug(itemName)}"]`);
  }

  removeButton(itemName) {
    return By.css(`[data-test="remove-${this.itemSlug(itemName)}"]`);
  }

  /**
   * Add a product and confirm the click registered (the button flips to
   * "Remove"). Retries if a click is dropped on a slow CI run.
   */
  async addItem(itemName) {
    const add = this.addToCartButton(itemName);
    const remove = this.removeButton(itemName);
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      if ((await this.driver.findElements(remove)).length > 0) return; // already added
      const buttons = await this.driver.findElements(add);
      if (buttons.length > 0) {
        const el = buttons[0];
        await this.driver.executeScript(
          'arguments[0].scrollIntoView({block: "center"})',
          el,
        );
        if (attempt === 1) {
          try {
            await el.click();
          } catch (e) {
            /* fall through to a JS click on the next attempt */
          }
        } else {
          await this.driver.executeScript('arguments[0].click()', el);
        }
      }
      try {
        await this.driver.wait(until.elementLocated(remove), 3000);
        return;
      } catch (err) {
        if (attempt === 3) throw err;
      }
    }
  }

  async getCartCount() {
    const badges = await this.driver.findElements(this.cartBadge);
    if (badges.length === 0) return 0;
    return parseInt(await badges[0].getText(), 10);
  }

  /** Wait until the cart badge reaches the expected count (avoids read races). */
  async waitForCartCount(expected, timeout = 5000) {
    await this.driver.wait(
      async () => (await this.getCartCount()) === expected,
      timeout,
    );
    return this.getCartCount();
  }

  /** Open the cart, confirming navigation (retries a dropped click). */
  async openCart() {
    await this.clickUntil(this.cartLink, until.urlContains('cart.html'));
  }
}

module.exports = { InventoryPage };
