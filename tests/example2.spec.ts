// @ts-check
import { test, expect } from '@playwright/test';

const { describe } = test;

test.beforeEach(async ({ page }) => {
  await page.goto('/examples/example2.html');
});

describe('Container with max-children=1', () => {
  test('should not allow to add more than one child', async ({ page }, testInfo) => {
    let step = 0;

    const destination = page.locator('dragdrop-container:nth-child(6)').last();

    // Drag child 1 to destination
    await page.locator('text=Child 1').hover();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-hover.png` });

    await page.mouse.down();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-dragstart.png` });

    await destination.hover();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-dragover.png` });

    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-dragend.png` });

    // Destination should have 1 child.
    expect(await destination.locator('dragdrop-child').count()).toBe(1);

    // Drag child 2 to destination
    await page.locator('text=Child 2').hover();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-hover.png` });

    await page.mouse.down();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-dragstart.png` });

    await destination.hover();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-dragover.png` });

    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-dragend.png` });

    // Destination should still have only 1 child
    expect(await destination.locator('dragdrop-child').count()).toBe(1);
  });
});