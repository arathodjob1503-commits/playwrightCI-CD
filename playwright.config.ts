import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  reporter: [
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'https://www.saucedemo.com/',
    headless: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});