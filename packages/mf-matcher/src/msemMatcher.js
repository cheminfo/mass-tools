import { getMsInfo } from 'mf-utilities';
import { xFindClosestIndex } from 'ml-spectra-processing';

import { unsaturationMatcher } from './unsaturationMatcher.js';

/**
 * @typedef {object} MSEMFilterOptions
 * @property {object}         [ionization={ mf: '', em: 0, charge: 0 }] - ionization method
 * @property {boolean}        [forceIonization=false] - If true ignore existing ionizations
 * @property {number}         [precision=1000] - The precision on the experimental mass
 * @property {number}         [targetMass] - Target mass, allows to calculate error and filter results
 * @property {number[]}       [targetMasses] - Target masses: SORTED array of numbers
 * @property {number[]}       [targetIntensities] - Target intensities: SORTED array of numbers
 * @property {number}         [minMW=-Infinity] - Minimal monoisotopic mass
 * @property {number}         [maxMW=+Infinity] - Maximal monoisotopic mass
 * @property {number}         [minEM=-Infinity] - Minimal monoisotopic mass
 * @property {number}         [maxEM=+Infinity] - Maximal monoisotopic mass
 * @property {number}         [minMSEM=-Infinity] - Minimal monoisotopic mass observed by mass
 * @property {number}         [maxMSEM=+Infinity] - Maximal monoisotopic mass observed by mass
 * @property {number}         [minCharge=-Infinity] - Minimal charge
 * @property {number}         [maxCharge=+Infinity] - Maximal charge
 * @property {boolean}        [absoluteCharge=false] - If true, the charge is absolute (so between 0 and +Infinity by default)
 * @property {boolean}        [allowNegativeAtoms=false] - Allow to have negative number of atoms
 * @property {object}         [unsaturation={}]
 * @property {number}         [unsaturation.min=-Infinity] - Minimal unsaturation
 * @property {number}         [unsaturation.max=+Infinity] - Maximal unsaturation
 * @property {boolean}        [unsaturation.onlyInteger=false] - Integer unsaturation
 * @property {boolean}        [unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @property {boolean}        [atoms] - object of atom:{min, max}
 * @property {Function}       [callback] - a function that contains information about the current MF
 */

/**
 * @param {object}             [entry={}]
 * @param {MSEMFilterOptions}  [options={}]
 * @return {boolean}
 */

/**
 * We always recalculate msem
 */

export function msemMatcher(entry, options = {}) {
  const {
    ionization = { mf: '', em: 0, charge: 0, atoms: {} },
    forceIonization = false,
    precision = 1000,
    minCharge = Number.MIN_SAFE_INTEGER,
    maxCharge = Number.MAX_SAFE_INTEGER,
    absoluteCharge = false,
    unsaturation = {},
    targetMass, // if present we will calculate the errors
    targetMasses, // if present we will calculate the smallest error
    targetIntensities, // if present it will be added in the report
    minEM = -Infinity,
    maxEM = +Infinity,
    minMSEM = -Infinity,
    maxMSEM = +Infinity,
    minMW = -Infinity,
    maxMW = +Infinity,
    allowNegativeAtoms = false,
    atoms,
    callback,
  } = options;

  if (entry.mw !== undefined && (entry.mw < minMW || entry.mw > maxMW)) {
    return false;
  }

  let msInfo = getMsInfo(entry, {
    ionization,
    forceIonization,
    targetMass,
  });
  let ms = msInfo.ms;

  if (entry.em !== undefined && (entry.em < minEM || entry.em > maxEM)) {
    return false;
  }

  if (ms.em !== undefined && (ms.em < minMSEM || ms.em > maxMSEM)) {
    return false;
  }

  if (targetMass && Math.abs(ms.ppm) > precision) {
    return false;
  }

  if (ms.charge !== undefined) {
    let charge = absoluteCharge ? Math.abs(ms.charge) : ms.charge;
    if (charge < minCharge || charge > maxCharge) return false;
  }
  if (
    unsaturation !== undefined &&
    entry.unsaturation !== undefined &&
    !unsaturationMatcher(entry, unsaturation)
  ) {
    return false;
  }
  if (entry.atoms !== undefined && atoms) {
    // all the atoms of the entry must fit in the range
    for (let atom in entry.atoms) {
      if (!atoms[atom]) return false;
      if (entry.atoms[atom] < atoms[atom].min) return false;
      if (entry.atoms[atom] > atoms[atom].max) return false;
    }
  }

  if (entry.atoms !== undefined && !allowNegativeAtoms) {
    const ionizationAtoms =
      (msInfo.ionization && msInfo.ionization.atoms) || {};
    const atomKeys = new Set(
      Object.keys(ionizationAtoms).concat(Object.keys(entry.atoms)),
    );
    for (let atom of atomKeys) {
      if ((entry.atoms[atom] || 0) + (ionizationAtoms[atom] || 0) < 0) {
        return false;
      }
    }
  }

  if (targetMasses && targetMasses.length > 0) {
    let index = xFindClosestIndex(targetMasses, ms.em);
    let closestMass = targetMasses[index];
    msInfo = getMsInfo(entry, {
      ionization,
      forceIonization,
      targetMass: closestMass,
    });
    msInfo.ms.target = { mass: closestMass };
    if (targetIntensities) {
      msInfo.ms.target.intensity = targetIntensities[index];
    }
    // need to find the closest targetMasses
    if (Math.abs(msInfo.ms.ppm) > precision) return false;
  }

  if (callback && !callback(entry)) return false;

  return msInfo;
}
