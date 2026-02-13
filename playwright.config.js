const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for TODO Application E2E Tests
 * 
 * Following testing guidelines:
 * - Single browser (Chromium) only
 * - Port configuration uses environment variables
 * - Test isolation and independence
 * - Page Object Model pattern required
 */

const PORT = process.env.PORT || 3000;
const API_PORT = process.env.API_PORT || 3030;

module.exports = defineConfig({
  testDir: './tests/e2e',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['list'],
  ],
  
  // Shared settings for all projects
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Single browser configuration (Chromium only, as per guidelines)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev servers before starting tests
  webServer: [
    {
      command: 'cd packages/backend && npm start',
      port: API_PORT,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'cd packages/frontend && BROWSER=none npm start',
      port: PORT,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
});
