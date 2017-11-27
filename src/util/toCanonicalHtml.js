'use strict';

const toHtml = require('./toHtml');
const partsToDisplay = require('./partsToDisplay');

module.exports = function toCanonicalHtml(parts) {
    var display = partsToDisplay(parts);

    return toHtml(display);
};
