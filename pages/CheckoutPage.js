const { By, until } = require('selenium-webdriver');
const { BasePage } = require('./BasePage');

/** Page Object for the two-step checkout flow. */
class CheckoutPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.firstName = By.css('[data-test="firstName"]');
    this.lastName = By.css('[data-test="lastName"]');
    this.postalCode = By.css('[data-test="postalCode"]');
    this.continueButton = By.css('[data-test="continue"]');
    this.finishButton = By.css('[data-test="finish"]');
    this.completeHeader = By.css('.complete-header');
  }

  async fillInformation(firstName, lastName, postalCode) {
    await this.type(this.firstName, firstName);
    await this.type(this.lastName, lastName);
    await this.type(this.postalCode, postalCode);
    await this.clickUntil(this.continueButton, until.urlContains('checkout-step-two'));
  }

  async finishOrder() {
    await this.clickUntil(this.finishButton, until.urlContains('checkout-complete'));
  }

  async getCompleteHeader() {
    return this.getText(this.completeHeader);
  }
}

module.exports = { CheckoutPage };
