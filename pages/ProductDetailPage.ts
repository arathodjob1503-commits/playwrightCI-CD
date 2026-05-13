import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page               = page;
    this.productName        = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice       = page.locator('.inventory_details_price');
    this.addToCartButton    = page.locator('[data-test^="add-to-cart"]');
    this.backButton         = page.locator('[data-test="back-to-products"]');
  }

  async expectProductName(name: string) {
    await expect(this.productName).toHaveText(name);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async goBack() {
    await this.backButton.click();
    await expect(this.page).toHaveURL(/inventory/);
  }
}
