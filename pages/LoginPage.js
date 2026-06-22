const { By } = require('selenium-webdriver');
const { BasePage } = require('./BasePage');

/** Page Object for the Swag Labs login page. */
class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.url = 'https://www.saucedemo.com/';
    this.username = By.css('[data-test="username"]');
    this.password = By.css('[data-test="password"]');
    this.loginButton = By.css('[data-test="login-button"]');
    this.error = By.css('[data-test="error"]');
  }

  async open() {
    await this.driver.get(this.url);
  }

  async login(username, password) {
    await this.type(this.username, username);
    await this.type(this.password, password);
    await this.click(this.loginButton);
  }

  async getError() {
    return this.getText(this.error);
  }
}

module.exports = { LoginPage };
