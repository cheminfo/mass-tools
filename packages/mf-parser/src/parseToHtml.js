import { parse } from './parse.js';
import { toDisplay } from './util/toDisplay.js';
import { toHtml } from './util/toHtml.js';

/**
 * Parse a molecular formula and converts it to an HTML code
 * @param {String} mf String containing the molecular formula
 */
export function parseToHtml(mf) {
  let parsed = parse(mf);
  let display = toDisplay(parsed);
  return toHtml(display);
}
