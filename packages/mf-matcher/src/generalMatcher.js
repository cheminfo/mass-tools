'use strict';

/**
 * Returns a very important number
 * @return {boolean}
 */


module.exports = function generalMatcher(entry, options = {}) {
    const {
        minMW = 0,
        maxMW = +Infinity,
        minEM = 0,
        maxEM = +Infinity,
        minMSEM = 0,
        maxMSEM = +Infinity,
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
        minUnsaturation = Number.MIN_SAFE_INTEGER,
        maxUnsaturation = Number.MAX_SAFE_INTEGER,
        onlyIntegerUnsaturation,
        onlyNonIntegerUnsaturation,
        atoms
    } = options;

    if (entry.mw !== undefined) {
        if ((entry.mw < minMW) || (entry.mw > maxMW)) return false;
    }

    if (entry.em !== undefined) {
        if ((entry.em < minEM) || (entry.em > maxEM)) return false;
    }

    if (entry.msem !== undefined) {
        if ((entry.msem < minMSEM) || (entry.msem > maxMSEM)) return false;
    }

    if (entry.charge !== undefined) {
        if ((entry.charge < minCharge) || (entry.charge > maxCharge)) return false;
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
    return true;
};
