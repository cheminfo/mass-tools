'use strict';

const toDisplay = require('./util/toDisplay');
const parse = require('./parse');
const toHtml = require('./util/toHtml');

/**
 * Parse a molecular formula and converts it to an HTML code
 * @param {String} mf String containing the molecular formula
 */
function parseToHtml(mf) {
    var parsed = parse(mf);
    var display = toDisplay(parsed);
    return toHtml(display);
}

module.exports = {
    Kind: require('./Kind'),
    Format: require('./Format'),
    Style: require('./Style'),
    parse: require('./parse'),
    toDisplay,
    toHtml,
    parseToHtml,
    MF: require('./MF'),
};
