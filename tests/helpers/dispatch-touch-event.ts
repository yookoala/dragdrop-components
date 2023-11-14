import { Page } from 'playwright';
import { TouchCoordinates, PageExtraTouchOptions } from './types';

/**
 * Dispatch touch event on the page for Playwright tests.
 *
 * @param {Page} page  The Playwright Page object
 * @param {'touchstart' | 'touchend' | 'touchcancel' | 'touchmove'} type  Touch event type string.
 * @param {string} selector  The selector string
 * @param {TouchCoordinates[]} touches  A coordinates array of active touches relative to the page (include scroll offset).
 * @param {TouchCoordinates[]} targetTouches  A coordinates array of touches relative to the page (include scroll offset).
 *                                            These touches are considered touching the event target.
 * @param {TouchCoordinates[]} changedTouches  A coordinates array of touches relative to the page (include scroll offset).
 *                                             Nature of the coordinates depends on the event type.
 *                                             See: https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
 * @param {PageExtraTouchOptions} options  Extra options for initializing each Touch in the TouchEvent.
 */
export async function dispatchTouchEvent(
    page: Page,
    type: 'touchstart' | 'touchend' | 'touchcancel' | 'touchmove',
    selector: string,
    touches: TouchCoordinates[],
    targetTouches?: TouchCoordinates[],
    changedTouches?: TouchCoordinates[],
    options?: PageExtraTouchOptions,
  ) {
    await page.$eval(
      selector,
      (el, options) => {
        const rect = el.getBoundingClientRect();

        const {
          type,
          touches: touchCoordinates,
          targetTouches: targetTouchCoordinates,
          changedTouches: changedTouchCoordinates,
          options: touchOpt,
        } = options;

        // Active touches.
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

        // Target touches. If not provided, use all the active touches.
        const targetTouches = targetTouchCoordinates
          ? targetTouchCoordinates.map(({pageX, pageY}: TouchCoordinates) => new Touch({
              identifier: Date.now(),
              target: el,
              pageX,
              pageY,
              clientX: pageX - rect.left,
              clientY: pageY - rect.top,
              screenX: pageX - window.scrollX,
              screenY: pageY - window.scrollY,
            }))
          : touches;

        // Depends on the event type, the changed touches may be different:
        // See: https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches
        if (type === 'touchend' && !changedTouchCoordinates) {
          throw new Error('Parameter `changedTouches` must be provided for `touchend` event.');
        }
        const changedTouches = changedTouchCoordinates
          ? changedTouchCoordinates.map(({pageX, pageY}: TouchCoordinates) => new Touch({
              identifier: Date.now(),
              target: el,
              pageX,
              pageY,
              clientX: pageX - rect.left,
              clientY: pageY - rect.top,
              screenX: pageX - window.scrollX,
              screenY: pageY - window.scrollY,
            }))
          : touches;

        const touchEvent = new TouchEvent(type, {
          bubbles: true,
          cancelable: true,
          ...touchOpt,
          changedTouches,
          targetTouches,
          touches,
        });
        return el.dispatchEvent(touchEvent);
      },
      { options, touches, targetTouches, changedTouches, type },
    );
  }