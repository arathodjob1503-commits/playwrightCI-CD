import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS, MESSAGES } from '../utils/testData';

test.describe('TC01-TC05 | Login Tests', () => {

  test('TC01 | Standard user can login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectOnInventoryPage();
  });

  test('TC02 | Locked out user cannot login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.expectLoginError(MESSAGES.lockedError);
  });

  test('TC03 | Invalid credentials show error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);
    await loginPage.expectLoginError(MESSAGES.loginError);
  });

  test('TC04 | Empty username shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', USERS.standard.password);
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Username is required');
  });

  test('TC05 | Empty password shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, '');
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Password is required');
  });

});
