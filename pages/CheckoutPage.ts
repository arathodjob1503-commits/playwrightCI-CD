import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly summaryTotal: Locator;
  readonly confirmationHeader: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page               = page;
    this.firstNameInput     = page.locator('[data-test="firstName"]');
    this.lastNameInput      = page.locator('[data-test="lastName"]');
    this.postalCodeInput    = page.locator('[data-test="postalCode"]');
    this.continueButton     = page.locator('[data-test="continue"]');
    this.cancelButton       = page.locator('[data-test="cancel"]');
    this.finishButton       = page.locator('[data-test="finish"]');
    this.summaryTotal       = page.locator('.summary_total_label');
    this.confirmationHeader = page.locator('.complete-header');
    this.errorMessage       = page.locator('[data-test="error"]');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async getTotalPrice(): Promise<string> {
    return (await this.summaryTotal.textContent()) || '';
  }

  async expectOrderComplete(message: string) {
    await expect(this.confirmationHeader).toContainText(message);
  }

  async expectErrorMessage(msg: string) {
    await expect(this.errorMessage).toContainText(msg);
  }
}
