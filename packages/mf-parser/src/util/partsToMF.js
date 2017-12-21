'use strict';

const partToMF = require('./partToMF');

module.exports = function partsToMF(parts) {
    var mf = [];
    for (let part of parts) {
        mf.push(partToMF(part));
    }
    return mf.join('.');
};
