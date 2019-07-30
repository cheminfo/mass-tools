'use strict';

const getMsem = require('./getMsem');

/**
 * Returns an object containing:
 * {ms: {em, charge, ionization}, ionization: {}}
 * We return the ionization in order to know which one has been selected
 */

module.exports = function getMsInfo(entry, options = {}) {
  const {
    allowNeutralMolecules,
    ionization = { mf: '', em: 0, charge: 0 },
    forceIonization = false,
    targetMass
  } = options;

  let realIonization = ionization;
  if (!forceIonization && entry.ionization && entry.ionization.mf !== '') {
    realIonization = entry.ionization;
  }

  let ms = {
    ionization: realIonization.mf,
    em: 0,
    charge: entry.charge + realIonization.charge
  };

  if (ms.charge !== 0) {
    ms.em = getMsem(entry.em + realIonization.em, ms.charge);
  } else if (allowNeutralMolecules) {
    ms.em = entry.em + realIonization.em;
  }
  if (targetMass) {
    ms.delta = targetMass - ms.em;
    ms.ppm = ((targetMass - ms.em) / ms.em) * 1e6;
  }
  return {
    ms,
    ionization: realIonization
  };
};
