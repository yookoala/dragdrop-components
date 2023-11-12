// @ts-check
import { test, expect } from '@playwright/test';
const { describe } = test;

test.beforeEach(async ({ page }) => {
  await page.goto('/example.html');
});

describe('Example Page', () => {
  test('loading into browser', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Web Component Playground/);

    // Expect to find dragdrop container
    await page.goto('/example.html');
    const container = await page.evaluate(() => document.querySelector('dragdrop-container'));
    expect(container).not.toBeNull();

    // Expect to find dragdrop child
    await page.goto('/example.html');
    const child = await page.evaluate(() => document.querySelector('dragdrop-child'));
    expect(child).not.toBeNull();
  });
});

describe('Simple drag drop', () => {
  test.describe.configure({
    retries: 2,
  });
  test('grab "Child 1" to the last container', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const target = page.locator('.grid > dragdrop-container').last();
    await expect(source).toContainText('Child 1');
    await expect(target).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Drag source to target.
    const child = page.locator('dragdrop-child').nth(0);
    expect(child).not.toBeNull();
    await child.hover();
    await page.mouse.down();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-hover.png` });

    // Drag to outside of the container.
    await page.mouse.move(400, 400);
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drag.png` });

    // Drop on the target.
    // Check the drop is successful.
    await target.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(target).toContainText('Child 1');
  });
});
