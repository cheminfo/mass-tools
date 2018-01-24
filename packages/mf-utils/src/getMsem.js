'use strict';

const { ELECTRON_MASS } = require('chemical-elements/src/constants');

module.exports = function getMsem(em, charge) {
    if (charge > 0) {
        return em / charge - ELECTRON_MASS;
    } else if (charge < 0) {
        return em / (charge * -1) + ELECTRON_MASS;
    } else {
        return 0;
    }
};
