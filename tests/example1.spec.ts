// @ts-check
import { test, expect } from '@playwright/test';
import { dispatchTouchEvent } from '@tests/helpers/dispatch-touch-event';

const { describe } = test;

test.beforeEach(async ({ page }) => {
  await page.goto('/examples/example1.html');
});

describe('Example Page', () => {
  test('loading into browser', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Example 1: Kanban UI/);

    // Expect to find dragdrop container
    const container = await page.evaluate(() => document.querySelector('dragdrop-container'));
    expect(container).not.toBeNull();

    // Expect to find dragdrop child
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
    const destination = page.locator('.grid > dragdrop-container').last();
    await expect(source).toContainText('Child 1');
    await expect(destination).not.toContainText('Child 1');
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
    await destination.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(destination).toContainText('Child 1');
  });

  test('grab and reorder child before another child', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const nestedContainer = page.locator('.grid > dragdrop-container > dragdrop-child > dragdrop-container').first();
    const destination = page.locator('.grid > dragdrop-container').last();
    await expect(source).toContainText('Child 1');
    await expect(nestedContainer).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Identify child to use in the test.
    const child1 = page.locator('dragdrop-child').nth(0);
    expect(child1).not.toBeNull();

    // Drag first child from source to destination.
    await child1.hover();
    await page.mouse.down();
    await destination.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-moved-child1.png` });

    // Drag second child and place it before the first child.
    const child2 = page.locator('dragdrop-child').nth(0);
    expect(child2).not.toBeNull();
    await child2.hover();
    await page.mouse.down();
    await page.mouse.move(636, 86);
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-moved-child2.png` });

    const text = await destination.innerText();
    expect(text).toBe('Child 2\nChild 1');
  });

  test('grab and reorder child after another child', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const nestedContainer = page.locator('.grid > dragdrop-container > dragdrop-child > dragdrop-container').first();
    const destination = page.locator('.grid > dragdrop-container').last();
    await expect(source).toContainText('Child 1');
    await expect(nestedContainer).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Identify child to use in the test.
    const child1 = page.locator('dragdrop-child').nth(0);
    expect(child1).not.toBeNull();

    // Drag first child from source to destination.
    await child1.hover();
    await page.mouse.down();
    await destination.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-moved-child1.png` });

    // Drag second child and place it before the first child.
    const child2 = page.locator('dragdrop-child').nth(0);
    expect(child2).not.toBeNull();
    await child2.hover();
    await page.mouse.down();
    await page.mouse.move(636, 112);
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-moved-child2.png` });

    const text = await destination.innerText();
    expect(text).toBe('Child 1\nChild 2');
  });
});

describe('Nested drag drop', () => {
  test.describe.configure({
    retries: 2,
  });

  test('move nested container-child', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const nestedContainer = page.locator('.grid > dragdrop-container > dragdrop-child > dragdrop-container').first();
    const destination = page.locator('.grid > dragdrop-container').last();
    await expect(source).toContainText('Child 1');
    await expect(nestedContainer).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Drag first child from source to target.
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
    await nestedContainer.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop1.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(nestedContainer).toContainText('Child 1');

    // Drag the parent of the nested container to the destination.
    await page.mouse.move(231, 54); // handle location of the child that has container.
    await page.mouse.down();
    await destination.hover();
    await page.mouse.up(); // drop on the destination
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop2.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(nestedContainer).toContainText('Child 1');
    await expect(destination).toContainText('Child 1');
  });

  test('reorder before nested container', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const nestedContainer = page.locator('.grid > dragdrop-container:nth-child(2) > dragdrop-child > dragdrop-container').first();
    await expect(source).toContainText('Child 1');
    await expect(nestedContainer).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Drag first child from source into the nested container.
    const child1 = page.locator('dragdrop-child').nth(0);
    expect(child1).not.toBeNull();
    await child1.hover();
    await page.mouse.down();
    await nestedContainer.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop1.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(nestedContainer).toContainText('Child 1');

    // Drag second child before the nested container.
    const child2 = page.locator('dragdrop-child').nth(0);
    expect(child2).not.toBeNull();
    await child2.hover();
    await page.mouse.down();
    await page.mouse.move(274, 74);
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop2.png` });
    await expect(source).not.toContainText('Child 2');
    // Child 2 should be before nested container, not in it.
    await expect(nestedContainer).not.toContainText('Child 2');

    // Child 2 should be before Child 1
    expect(page.locator('.grid > dragdrop-container:nth-child(2) dragdrop-child').first()).toContainText('Child 2');
    expect(page.locator('.grid > dragdrop-container:nth-child(2) dragdrop-child').last()).toContainText('Child 1');
  });

  test('reorder after nested container', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const nestedContainer = page.locator('.grid > dragdrop-container:nth-child(2) > dragdrop-child > dragdrop-container').first();
    await expect(source).toContainText('Child 1');
    await expect(nestedContainer).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Drag first child from source into the nested container.
    const child1 = page.locator('dragdrop-child').nth(0);
    expect(child1).not.toBeNull();
    await child1.hover();
    await page.mouse.down();
    await nestedContainer.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop1.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(nestedContainer).toContainText('Child 1');

    // Drag second child before the nested container.
    const child2 = page.locator('dragdrop-child').nth(0);
    expect(child2).not.toBeNull();
    await child2.hover();
    await page.mouse.down();
    await page.mouse.move(274, 280); // Should be after the nested container.
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop2.png` });
    await expect(source).not.toContainText('Child 2');
    // Child 2 should be after nested container, not in it.
    await expect(nestedContainer).not.toContainText('Child 2');

    // Child 2 should be after Child 1
    expect(page.locator('.grid > dragdrop-container:nth-child(2) dragdrop-child').first()).toContainText('Child 1');
    expect(page.locator('.grid > dragdrop-container:nth-child(2) dragdrop-child').last()).toContainText('Child 2');
  });

  test('reorder inside nested container before child 1', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const nestedContainer = page.locator('.grid > dragdrop-container:nth-child(2) > dragdrop-child > dragdrop-container').first();
    await expect(source).toContainText('Child 1');
    await expect(nestedContainer).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Drag first child from source into the nested container.
    const child1 = page.locator('dragdrop-child').nth(0);
    expect(child1).not.toBeNull();
    await child1.hover();
    await page.mouse.down();
    await nestedContainer.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop1.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(nestedContainer).toContainText('Child 1');

    // Drag second child before the nested container.
    const child2 = page.locator('dragdrop-child').nth(0);
    expect(child2).not.toBeNull();
    await child2.hover();
    await page.mouse.down();
    await page.mouse.move(274, 138);
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop2.png` });
    await expect(source).not.toContainText('Child 2');
    await expect(nestedContainer).toContainText('Child 2');

    const text = await nestedContainer.innerText();
    expect(text).toBe('Child 2\nChild 1');
  });

  test('reorder inside nested container after child 1', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const nestedContainer = page.locator('.grid > dragdrop-container:nth-child(2) > dragdrop-child > dragdrop-container').first();
    await expect(source).toContainText('Child 1');
    await expect(nestedContainer).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Drag first child from source into the nested container.
    const child1 = page.locator('dragdrop-child').nth(0);
    expect(child1).not.toBeNull();
    await child1.hover();
    await page.mouse.down();
    await nestedContainer.hover();
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop1.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(nestedContainer).toContainText('Child 1');

    // Drag second child before the nested container.
    const child2 = page.locator('dragdrop-child').nth(0);
    expect(child2).not.toBeNull();
    await child2.hover();
    await page.mouse.down();
    await page.mouse.move(274, 181);
    await page.mouse.up();
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop2.png` });
    await expect(source).not.toContainText('Child 2');
    await expect(nestedContainer).toContainText('Child 2');

    const text = await nestedContainer.innerText();
    expect(text).toBe('Child 1\nChild 2');
  });
});

describe('Touch drag drop', () => {
  test.describe.configure({
    retries: 2,
  });

  test('grab "Child 1" to the last container', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const destination = page.locator('.grid > dragdrop-container').last();
    await expect(source).toContainText('Child 1');
    await expect(destination).not.toContainText('Child 1');
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Drag source to target.
    const child = page.locator('dragdrop-child').nth(0);
    expect(child).not.toBeNull();

    await dispatchTouchEvent(
      page,
      'touchstart',
      'dragdrop-child',
      [{ pageX: 93, pageY: 96 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-hover.png` });

    // Drag to outside of the container.
    await dispatchTouchEvent(
      page,
      'touchmove',
      'dragdrop-child',
      [{ pageX: 400, pageY: 400 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drag.png` });

    // Drop on the target.
    // Check the drop is successful.
    await dispatchTouchEvent(
      page,
      'touchmove',
      'dragdrop-child',
      [{ pageX: 652, pageY: 75 }],
    );

    await dispatchTouchEvent(
      page,
      'touchend',
      'dragdrop-child',
      [],
      [{ pageX: 652, pageY: 75 }],
    );

    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(destination).toContainText('Child 1');
  });
});