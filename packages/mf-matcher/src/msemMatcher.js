'use strict';

/**
 * Returns a very important number
 * @return {boolean}
 */
const getMsInfo = require('mf-utils/src/getMsInfo.js');

/**
 * We always recalculate msem
 *
 */

module.exports = function msemMatcher(entry, options = {}) {
    const {
        ionization = { mf: '', em: 0, charge: 0 },
        forceIonization = false,
        precision = 1000,
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
        minUnsaturation = Number.MIN_SAFE_INTEGER,
        maxUnsaturation = Number.MAX_SAFE_INTEGER,
        onlyIntegerUnsaturation,
        onlyNonIntegerUnsaturation,
        targetMass, // if present we will calculate the errors
        minEM = 0,
        maxEM = +Infinity,
        atoms
    } = options;

    let ms = getMsInfo(entry, {
        ionization,
        forceIonization,
        targetMass,
    });

    if (entry.em !== undefined) {
        if ((entry.em < minEM) || (entry.em > maxEM)) return false;
    }
    if (targetMass && (Math.abs(ms.em - targetMass) * 1e6) > precision) return false;
    if (entry.charge !== undefined) {
        if ((ms.charge < minCharge) || (ms.charge > maxCharge)) return false;
    }
    if (entry.unsaturation !== undefined) {
        if (entry.unsaturation < minUnsaturation || entry.unsaturation > maxUnsaturation) return false;
        if (onlyIntegerUnsaturation && !Number.isInteger(entry.unsaturation)) return false;
        if (onlyNonIntegerUnsaturation && Number.isInteger(entry.unsaturation)) return false;
    }
    if (entry.atoms !== undefined && atoms) {
        // all the atoms of the entry must fit in the range
        for (let atom of Object.keys(entry.atoms)) {
            if (!atoms[atom]) return false;
            if (entry.atoms[atom] < atoms[atom].min) return false;
            if (entry.atoms[atom] > atoms[atom].max) return false;
        }
    }
    return ms;
};
