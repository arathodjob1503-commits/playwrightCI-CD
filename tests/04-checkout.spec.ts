import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PRODUCTS, CHECKOUT_INFO, MESSAGES } from '../utils/testData';

test.describe('TC16-TC20 | Checkout & End-to-End Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('TC16 | Full E2E checkout with single item completes order', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.expectOnCartPage();
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutPage.continue();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete(MESSAGES.orderComplete);
  });

  test('TC17 | Full E2E checkout with multiple items completes order', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.addProductToCart(PRODUCTS.fleeceJacket);
    await inventoryPage.addProductToCart(PRODUCTS.onesie);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutPage.continue();
    await expect(page.locator('.summary_info')).toBeVisible();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete(MESSAGES.orderComplete);
  });

  test('TC18 | Checkout without filling info shows required error', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.continue();
    await checkoutPage.expectErrorMessage('First Name is required');
  });

  test('TC19 | Checkout summary shows correct total price format', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.firstName,
      CHECKOUT_INFO.lastName,
      CHECKOUT_INFO.postalCode
    );
    await checkoutPage.continue();
    const total = await checkoutPage.getTotalPrice();
    expect(total).toContain('Total:');
    expect(total).toMatch(/\$\d+\.\d{2}/);
  });

  test('TC20 | User can logout and is redirected to login page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectOnInventoryPage();
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});
