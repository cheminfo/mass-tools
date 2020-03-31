'use strict';

const parse = require('./parse');
const toDisplay = require('./util/toDisplay');
const toHtml = require('./util/toHtml');

/**
 * Parse a molecular formula and converts it to an HTML code
 * @param {String} mf String containing the molecular formula
 */
function parseToHtml(mf) {
  let parsed = parse(mf);
  let display = toDisplay(parsed);
  return toHtml(display);
}

module.exports = {
  Kind: require('./Kind'),
  Format: require('./Format'),
  Style: require('./Style'),
  parse: require('./parse'),
  ensureCase: require('./ensureCase'),
  toDisplay,
  toHtml,
  parseToHtml,
  MF: require('./MF'),
};
