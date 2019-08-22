'use strict';

const partToMF = require('./partToMF');

module.exports = function partsToMF(parts, options) {
  var mf = [];
  for (let part of parts) {
    mf.push(partToMF(part, options));
  }
  return mf.join(' . ');
};
