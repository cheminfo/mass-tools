'use strict';

const Kind = require('../Kind');

const toDisplay = require('./toDisplay');
/**
 * Converts an array of mf elements to an array of formatting information
 * @param {Array<Object>} result of the parse method
 */

module.exports = function partsToDisplay(parts) {
  let lines = [];
  for (let part of parts) {
    if (lines.length > 0) lines.push({ kind: Kind.SALT, value: '•' });
    for (let partLine of part) {
      lines.push(partLine);
      if (partLine.multiplier) {
        lines.push({
          kind: Kind.MULTIPLIER,
          value: partLine.multiplier,
        });
      }
    }
  }

  return toDisplay(lines);
};
