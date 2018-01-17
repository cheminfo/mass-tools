'use strict';

const ELECTRON_MASS = require('chemical-elements/src/constants').ELECTRON_MASS;

/**
 * returns all the possible neutral mass for a defined experimental (targetMass) mass
 */

module.exports = function getTargetMassCache(targetMass, possibilities, options = {}) {
    const {
        allowNeutral = false, // msem because em in this case !
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
        precision = 100
    } = options;

    if (!possibilities || possibilities.length === 0) return {};

    let cache = {};
    let firstPossibility = possibilities[0];
    let currentMinCharge = Math.max(minCharge, firstPossibility.minCharge);
    let currentMaxCharge = Math.min(maxCharge, firstPossibility.maxCharge);

    cache.minCharge = currentMinCharge;
    cache.maxCharge = currentMaxCharge;

    let size = cache.maxCharge - cache.minCharge + 1;
    cache.data = [];
    let minMass = 0;
    let maxMass = 0;
    let range = targetMass * precision / 1e6;
    for (var i = 0; i < size; i++) {
        let charge = i + cache.minCharge;
        if (charge === 0) {
            if (allowNeutral) {
                minMass = targetMass - range;
                maxMass = targetMass + range;
            } else {
                minMass = 0;
                maxMass = 0;
            }
        } else {
            minMass = (targetMass - range) * Math.abs(charge) + ELECTRON_MASS * charge;
            maxMass = (targetMass + range) * Math.abs(charge) + ELECTRON_MASS * charge;
        }


        cache.data.push({
            charge,
            minMass,
            maxMass
        });
    }
    return cache;
};
