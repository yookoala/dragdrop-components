// @ts-check
const { test, expect } = require('@playwright/test');
const { describe } = test;

describe('Example Page', () => {
  test('has title', async ({ page }) => {
    await page.goto('/example.html');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Web Component Playground/);
  });

  test('has dragdrop-container', async ({ page }) => {
    await page.goto('/example.html');
    const container = await page.evaluate(() => document.querySelector('dragdrop-container'));
    expect(container).not.toBeNull();
  });

  test('has dragdrop-child', async ({ page }) => {
    await page.goto('/example.html');
    const container = await page.evaluate(() => document.querySelector('dragdrop-child'));
    expect(container).not.toBeNull();
  });
});
