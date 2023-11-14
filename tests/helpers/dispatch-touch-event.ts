import { Page } from 'playwright';
import { TouchCoordinates, PageExtraTouchOptions } from './types';

/**
 * Dispatch touch event on the page for Playwright tests.
 *
 * @param {Page} page  The Playwright Page object
 * @param {'touchstart' | 'touchend' | 'touchcancel' | 'touchmove'} type  Touch event type string.
 * @param {string} selector  The selector string
 * @param {TouchCoordinates[]} touches  An array of touch coordinates relative to the page (include scroll offset).
 * @param {PageExtraTouchOptions} options  Extra options for initializing each Touch in the TouchEvent.
 */
export async function dispatchTouchEvent(
    page: Page,
    type: 'touchstart' | 'touchend' | 'touchcancel' | 'touchmove',
    selector: string,
    touches: TouchCoordinates[],
    options?: PageExtraTouchOptions,
  ) {
    await page.$eval(
      selector,
      (el, options) => {
        const rect = el.getBoundingClientRect();

        const {
          type,
          touches: touchCoordinates,
          options: touchOpt,
        } = options;

        const touches = touchCoordinates.map(({pageX, pageY}: TouchCoordinates) => new Touch({
            identifier: Date.now(),
            target: el,
            pageX,
            pageY,
            clientX: pageX - rect.left,
            clientY: pageY - rect.top,
            screenX: pageX - window.scrollX,
            screenY: pageY - window.scrollY,
        }));

        // if the touch is within the rect
        const targetTouches = touches.filter((touch) => (
          touch.clientX >= 0 &&
          touch.clientX <= rect.width &&
          touch.clientY >= 0 &&
          touch.clientY <= rect.height
        ));

        const touchEvent = new TouchEvent(type, {
          bubbles: true,
          cancelable: true,
          ...touchOpt,
          changedTouches: touches,
          targetTouches,
          touches,
        });
        return el.dispatchEvent(touchEvent);
      },
      { options, touches, type },
    );
  }