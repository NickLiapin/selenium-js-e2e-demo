const assert = require('node:assert/strict');
const { buildDriver } = require('../utils/driver');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { users } = require('../data/users');

describe('Shopping cart', function () {
  let driver, inventoryPage, cartPage;

  beforeEach(async () => {
    driver = buildDriver();
    const loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
    cartPage = new CartPage(driver);
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.waitLoaded();
  });

  afterEach(async () => {
    if (driver) await driver.quit();
  });

  it('adds a single product to the cart', async () => {
    await inventoryPage.addItem('Sauce Labs Backpack');
    assert.equal(await inventoryPage.waitForCartCount(1), 1);
  });

  it('adds multiple products to the cart', async () => {
    await inventoryPage.addItem('Sauce Labs Backpack');
    await inventoryPage.addItem('Sauce Labs Bike Light');
    assert.equal(await inventoryPage.waitForCartCount(2), 2);
  });

  it('shows the added product on the cart page', async () => {
    await inventoryPage.addItem('Sauce Labs Backpack');
    await inventoryPage.openCart();
    assert.ok(await cartPage.hasItem('Sauce Labs Backpack'));
  });
});
