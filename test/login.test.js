const assert = require('node:assert/strict');
const { buildDriver } = require('../utils/driver');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { users, invalidLogins } = require('../data/users');

describe('Authentication', function () {
  let driver, loginPage, inventoryPage;

  beforeEach(async () => {
    driver = buildDriver();
    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
    await loginPage.open();
  });

  afterEach(async () => {
    if (driver) await driver.quit();
  });

  it('standard user can log in', async () => {
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.waitLoaded();
    assert.equal(await inventoryPage.getTitle(), 'Products');
  });

  it('locked-out user is rejected with an error', async () => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    assert.match(await loginPage.getError(), /locked out/);
  });

  // Data-driven negative cases.
  for (const data of invalidLogins) {
    const label = `${data.username || '(empty)'} / ${data.password || '(empty)'}`;
    it(`invalid login is rejected: ${label}`, async () => {
      await loginPage.login(data.username, data.password);
      const actual = await loginPage.getError();
      assert.ok(
        actual.includes(data.error),
        `expected "${actual}" to include "${data.error}"`,
      );
    });
  }
});
