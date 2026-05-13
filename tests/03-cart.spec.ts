import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/testData';

test.describe('TC11-TC15 | Cart Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('TC11 | Add single product updates cart badge to 1', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('TC12 | Add 3 products updates cart badge to 3', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.addProductToCart(PRODUCTS.bikeLight);
    await inventoryPage.addProductToCart(PRODUCTS.boltShirt);
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(3);
  });

  test('TC13 | Cart page shows correct added items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.addProductToCart(PRODUCTS.bikeLight);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.expectOnCartPage();
    const items = await cartPage.getCartItemNames();
    expect(items).toContain(PRODUCTS.backpack);
    expect(items).toContain(PRODUCTS.bikeLight);
  });

  test('TC14 | Remove item from cart page works correctly', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.addProductToCart(PRODUCTS.bikeLight);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.removeItem(PRODUCTS.backpack);
    const items = await cartPage.getCartItemNames();
    expect(items).not.toContain(PRODUCTS.backpack);
    expect(items).toContain(PRODUCTS.bikeLight);
  });

  test('TC15 | Continue Shopping from cart returns to inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.continueShopping();
    await inventoryPage.expectOnInventoryPage();
  });

});
