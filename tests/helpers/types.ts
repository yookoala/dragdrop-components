/**
 * Touch coordiates relative to the page (include scroll offset).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Touch
 */
export interface TouchCoordinates {
  /**
   * @property {number} pageX  X coordinate of touch relative to the page (include scroll offset).
   */
  pageX: number;

  /**
   * @property {number} pageY  Y coordinate of touch relative to the page (include scroll offset).
   */
  pageY: number;
}

export interface PageExtraTouchOptions {
  /**
   * @default true
   */
  bubbles?: boolean;
  /**
   * @default true
   */
  cancelable?: boolean;
}