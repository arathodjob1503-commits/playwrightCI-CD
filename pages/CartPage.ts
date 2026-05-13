import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartTitle: Locator;

  constructor(page: Page) {
    this.page                   = page;
    this.cartItems              = page.locator('.cart_item');
    this.checkoutButton         = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartTitle              = page.locator('.title');
  }

  async expectOnCartPage() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.cartTitle).toHaveText('Your Cart');
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeItem(productName: string) {
    const item = this.cartItems.filter({ hasText: productName });
    await item.locator('button').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/inventory/);
  }
}
