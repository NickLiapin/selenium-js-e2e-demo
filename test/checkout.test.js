const assert = require('node:assert/strict');
const { buildDriver } = require('../utils/driver');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { users } = require('../data/users');

describe('Checkout', function () {
  let driver;

  beforeEach(async () => {
    driver = buildDriver();
  });

  afterEach(async () => {
    if (driver) await driver.quit();
  });

  it('completes an end-to-end purchase', async () => {
    const loginPage = new LoginPage(driver);
    const inventoryPage = new InventoryPage(driver);
    const cartPage = new CartPage(driver);
    const checkoutPage = new CheckoutPage(driver);

    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.waitLoaded();

    await inventoryPage.addItem('Sauce Labs Backpack');
    await inventoryPage.addItem('Sauce Labs Bike Light');
    assert.equal(await inventoryPage.waitForCartCount(2), 2);

    await inventoryPage.openCart();
    assert.ok(await cartPage.hasItem('Sauce Labs Backpack'));
    await cartPage.proceedToCheckout();

    await checkoutPage.fillInformation('Nick', 'Liapin', '12345');
    await checkoutPage.finishOrder();
    assert.equal(await checkoutPage.getCompleteHeader(), 'Thank you for your order!');
  });
});
