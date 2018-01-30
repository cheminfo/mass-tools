'use strict';

const getMsem = require('./getMsem');

/**
 * Adds a field 'ms' to an object containing em, charge and ioniwation
 */

module.exports = function getMsInfo(entry, options = {}) {
    const {
        allowNeutralMolecules,
        ionization = { mf: '', em: 0, charge: 0 },
        forceIonization = false,
        targetMass,
    } = options;

    let realIonization = ionization;
    if (!forceIonization && entry.ionization) {
        realIonization = entry.ionization;
    }

    let result = {
        ionization: realIonization.mf,
        em: 0,
        charge: entry.charge + realIonization.charge,
    };

    if (result.charge !== 0) {
        result.em = getMsem(entry.em + realIonization.em, result.charge);
    } else if (allowNeutralMolecules) {
        result.em = entry.em + realIonization.em;
    }
    if (targetMass) {
        result.delta = result.em - targetMass;
        result.ppm = Math.abs((targetMass - result.em) / targetMass * 1e6);
    }
    return result;
};
