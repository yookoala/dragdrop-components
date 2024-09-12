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

  test('drag nested container into shadow of itself before drop', async ({ page }, testInfo) => {
    let step = 0;

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('#container-2').first();
    const destination = page.locator('#container-4').first();
    //const child4 = page.locator('#child-4').first();

    await expect(source).toContainText('Can drop here');
    await page.mouse.move(230, 52);
    await page.mouse.down();
    await page.mouse.move(230, 62); // drag moving in the container
    await page.mouse.move(230, 600); // drag away from any container
    await page.mouse.move(630, 100); // drag onto container 4, within it's own "shadow"
    await page.mouse.move(630, 120); // wiggle a bit to make sure browser registers
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup-2.png` });
    await page.mouse.up(); // drop it
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop.png` });

    // Check if child-4 is moved to container-4
    await expect(source).not.toContainText('Can drop here');
    await expect(destination).toContainText('Can drop here');
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
      'dragdrop-child[dragging=true]',
      [{ pageX: 400, pageY: 400 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drag.png` });

    // Drop on the target.
    // Check the drop is successful.
    await dispatchTouchEvent(
      page,
      'touchmove',
      'dragdrop-child[dragging=true]',
      [{ pageX: 652, pageY: 75 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drag.png` });

    await dispatchTouchEvent(
      page,
      'touchend',
      'dragdrop-child[dragging=true]',
      [],
      [],
      [{ pageX: 652, pageY: 75 }],
    );

    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop.png` });
    await expect(source).not.toContainText('Child 1');
    await expect(destination).toContainText('Child 1');
  });
});

describe('Mouse drag and drop', () => {
  test.describe.configure({
    retries: 2,
  });

  test('life cycle triggers all dnd:* event as expected', async({ page }, testInfo) => {
    // Make sure the indicator is created.
    let step = 0;

    page.evaluate(() => {
      // Define all elements on the page
      // Note: child4 contains container2child.
      const child1 = document.getElementById('child-1');
      const containerEventHandler = (event: CustomEvent) => {
        // @ts-expect-error
        console.log(event.target?.id || 'dragdrop-container', event.type, event.detail?.child?.id || 'dragdrop-child');
      };
      const childEventHandler = (event: CustomEvent) => {
        // @ts-expect-error
        console.log(event.target?.id || 'dragdrop-child', event.type);
      };

      document.querySelectorAll('dragdrop-child').forEach((child) => {
        child.addEventListener('dnd:dragstart', childEventHandler);
        child.addEventListener('dnd:dragend', childEventHandler);
      });
      document.querySelectorAll('dragdrop-container').forEach((container) => {
        container.addEventListener('dnd:dragenter', containerEventHandler);
        container.addEventListener('dnd:dragleave', containerEventHandler);
        container.addEventListener('dnd:dropped', containerEventHandler);
      });
    });

    // Capture all console logs for evaluation
    const logPromises = [];
    page.on('console', msg => logPromises.push(Promise.all(msg.args().map(arg => arg.jsonValue()))));

    // Verify setup
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const child1 = page.locator('dragdrop-child').nth(0);
    await expect(source).toContainText('Child 1');

    // Drag child1 from source to destination.
    await child1.hover();
    await page.mouse.down();
    await page.mouse.move(10, 10);
    await page.mouse.move(10, 100); // drag moving in the container
    await page.mouse.move(10, 600); // drag away from any container
    await page.mouse.move(600, 150); // drag onto the right-most item
    await page.mouse.up();

    const logs = await Promise.all(logPromises);
    expect(logs).toEqual([
      ['child-1', 'dnd:dragstart'],
      ['container-1', 'dnd:dragenter', 'child-1'],
      ['container-1', 'dnd:dragleave', 'child-1'],
      ['container-4', 'dnd:dragenter', 'child-1'],
      ['container-4', 'dnd:dropped', 'child-1'],
      ['child-1', 'dnd:dragend'],
    ]);
  });
});

describe('Touch drag and drop', () => {
  test.describe.configure({
    retries: 2,
  });

  test('life cycle triggers all dnd:* event as expected', async({ page }, testInfo) => {
    // Make sure the indicator is created.
    let step = 0;

    page.evaluate(() => {
      // Define all elements on the page
      // Note: child4 contains container2child.
      const child1 = document.getElementById('child-1');
      const containerEventHandler = (event: CustomEvent) => {
        // @ts-expect-error
        console.log(event.target?.id || 'dragdrop-container', event.type, event.detail?.child?.id || 'dragdrop-child');
      };
      const childEventHandler = (event: CustomEvent) => {
        // @ts-expect-error
        console.log(event.target?.id || 'dragdrop-child', event.type);
      };

      document.querySelectorAll('dragdrop-child').forEach((child) => {
        child.addEventListener('dnd:dragstart', childEventHandler);
        child.addEventListener('dnd:dragend', childEventHandler);
      });
      document.querySelectorAll('dragdrop-container').forEach((container) => {
        container.addEventListener('dnd:dragenter', containerEventHandler);
        container.addEventListener('dnd:dragleave', containerEventHandler);
        container.addEventListener('dnd:dropped', containerEventHandler);
      });
    });

    // Capture all console logs for evaluation
    const logPromises = [];
    page.on('console', msg => logPromises.push(Promise.all(msg.args().map(arg => arg.jsonValue()))));

    // Verify setup
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-setup.png` });

    // Identify the source and target containers.
    // Check that the source has the text "Child 1" and the target doesn't.
    const source = page.locator('.grid > dragdrop-container').first();
    const child1 = page.locator('dragdrop-child').nth(0);
    await expect(source).toContainText('Child 1');

    // Drag child1 from source to destination.
    await dispatchTouchEvent(
      page,
      'touchstart',
      'dragdrop-child',
      [{ pageX: 93, pageY: 96 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-hover.png` });

    // Move the child away from the source
    // (and other container to prevent unwanted events)
    await dispatchTouchEvent(
      page,
      'touchmove',
      'dragdrop-child[dragging=true]',
      [{ pageX: 93, pageY: 100 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drag.png` });
    await dispatchTouchEvent(
      page,
      'touchmove',
      'dragdrop-child[dragging=true]',
      [{ pageX: 93, pageY: 600 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drag.png` });

    // Move to destination
    await dispatchTouchEvent(
      page,
      'touchmove',
      'dragdrop-child[dragging=true]',
      [{ pageX: 652, pageY: 75 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drag.png` });

    // Drop on the destination
    await dispatchTouchEvent(
      page,
      'touchend',
      'dragdrop-child[dragging=true]',
      [],
      [],
      [{ pageX: 652, pageY: 75 }],
    );
    await page.screenshot({ path: `${testInfo.outputPath()}/${step++}-after-drop.png` });

    const logs = await Promise.all(logPromises);
    expect(logs).toEqual([
      ['child-1', 'dnd:dragstart'],
      ['container-1', 'dnd:dragenter', 'child-1'],
      ['container-1', 'dnd:dragleave', 'child-1'],
      ['container-4', 'dnd:dragenter', 'child-1'],
      ['container-4', 'dnd:dropped', 'child-1'],
      ['child-1', 'dnd:dragend'],
    ]);
  });
});