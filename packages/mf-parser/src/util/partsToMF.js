'use strict';

const partToMF = require('./partToMF');

module.exports = function partsToMF(parts, options) {
  let mf = [];
  for (let part of parts) {
    mf.push(partToMF(part, options));
  }
  return mf.join(' . ');
};
