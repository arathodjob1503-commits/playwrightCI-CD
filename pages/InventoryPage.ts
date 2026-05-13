import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.page          = page;
    this.inventoryList = page.locator('.inventory_list');
    this.cartBadge     = page.locator('.shopping_cart_badge');
    this.cartLink      = page.locator('.shopping_cart_link');
    this.sortDropdown  = page.locator('[data-test="product-sort-container"]');
    this.burgerMenu    = page.locator('#react-burger-menu-btn');
    this.logoutLink    = page.locator('#logout_sidebar_link');
    this.resetLink     = page.locator('#reset_sidebar_link');
  }

  async expectOnInventoryPage() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.inventoryList).toBeVisible();
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.page.locator('.inventory_item_price').allTextContents();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async addProductToCart(productName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.locator('button').click();
  }

  async getCartCount(): Promise<number> {
    const badge = this.page.locator('.shopping_cart_badge');
    if (await badge.isVisible()) {
      return parseInt((await badge.textContent()) || '0');
    }
    return 0;
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async openMenu() {
    await this.burgerMenu.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('/');
  }

  async openProductDetail(productName: string) {
    await this.page
      .locator('.inventory_item_name')
      .filter({ hasText: productName })
      .click();
  }
}
