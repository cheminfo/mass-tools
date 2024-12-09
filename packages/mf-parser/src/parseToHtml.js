import { parse, toDisplay, toHtml } from './index.js';

/**
 * Parse a molecular formula and converts it to an HTML code
 * @param {string} mf String containing the molecular formula
 * @returns {string} HTML code
 */
export function parseToHtml(mf) {
  let parsed = parse(mf);
  let display = toDisplay(parsed);
  return toHtml(display);
}
