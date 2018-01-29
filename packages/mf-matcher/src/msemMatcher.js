'use strict';

/**
 * Returns a very important number
 * @return {boolean}
 */
const getMsem = require('mf-utils/src/getMsem.js');

module.exports = function msemMatcher(entry, targetMass, options = {}) {
    const {
        modification = { mf: '', em: 0, charge: 0 },
        forceModification = false,
        precision = 1000,
        minCharge = Number.MIN_SAFE_INTEGER,
        maxCharge = Number.MAX_SAFE_INTEGER,
        minUnsaturation = Number.MIN_SAFE_INTEGER,
        maxUnsaturation = Number.MAX_SAFE_INTEGER,
        onlyIntegerUnsaturation,
        onlyNonIntegerUnsaturation,
        atoms
    } = options;

    let msem = entry.msem;
    let realModification = modification.mf;
    if (forceModification || !entry.modification) {
        msem = getMsem(entry.em + modification.em, entry.charge + modification.charge);
    } else {
        realModification = entry.modification;
    }
    //    console.log(msem, entry.em, entry.charge, entry.modification);
    if ((Math.abs(msem - targetMass) * 1e6) > precision) return false;

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
    return {
        msem,
        delta: msem - targetMass,
        ppm: Math.abs((targetMass - msem) / targetMass * 1e6),
        modification: realModification,
        charge: entry.charge + modification.charge
    };
};
