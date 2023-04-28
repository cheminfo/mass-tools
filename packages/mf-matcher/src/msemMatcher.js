import { getMsInfo } from 'mf-utilities';
import { xFindClosestIndex } from 'ml-spectra-processing';

import { unsaturationMatcher } from './unsaturationMatcher.js';
/**
 * @param {object}         [entry={}]
 * @param {object}         [options={}]
 * @param {object}         [options.ionization={ mf: '', em: 0, charge: 0 }] - ionization method
 * @param {boolean}        [options.forceIonization=false] - If true ignore existing ionizations
 * @param {number}         [options.precision=1000] - The precision on the experimental mass
 * @param {number}         [options.targetMass] - Target mass, allows to calculate error and filter results
 * @param {number[]}       [options.targetMasses] - Target masses: SORTED array of numbers
 * @param {number[]}       [options.targetIntensities] - Target intensities: SORTED array of numbers
 * @param {number}         [options.minEM=0] - Minimal monoisotopic mass
 * @param {number}         [options.maxEM=+Infinity] - Maximal monoisotopic mass
 * @param {number}         [options.minMSEM=0] - Minimal monoisotopic mass observed by mass
 * @param {number}         [options.maxMSEM=+Infinity] - Maximal monoisotopic mass observed by mass
 * @param {number}         [options.minCharge=-Infinity] - Minimal charge
 * @param {number}         [options.maxCharge=+Infinity] - Maximal charge
 * @param {boolean}        [options.absoluteCharge=false] - If true, the charge is absolute (so between 0 and +Infinity by default)
 * @param {boolean}        [options.allowNegativeAtoms=false] - Allow to have negative number of atoms
 * @param {object}         [options.unsaturation={}]
 * @param {number}         [options.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}         [options.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {boolean}        [options.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {boolean}        [options.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {boolean}        [options.atoms] - object of atom:{min, max}
 * @param {Function}       [options.callback] - a function that contains information about the current MF
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
    allowNegativeAtoms = false,
    atoms,
    callback,
  } = options;

  let msInfo = getMsInfo(entry, {
    ionization,
    forceIonization,
    targetMass,
  });
  let ms = msInfo.ms;

  if (entry.em !== undefined) {
    if (entry.em < minEM || entry.em > maxEM) return false;
  }

  if (ms.em !== undefined) {
    if (ms.em < minMSEM || ms.em > maxMSEM) return false;
  }

  if (targetMass && Math.abs(ms.ppm) > precision) return false;

  if (ms.charge !== undefined) {
    let charge = absoluteCharge ? Math.abs(ms.charge) : ms.charge;
    if (charge < minCharge || charge > maxCharge) return false;
  }
  if (unsaturation !== undefined && entry.unsaturation !== undefined) {
    if (!unsaturationMatcher(entry, unsaturation)) {
      return false;
    }
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

  if (callback) {
    if (!callback(entry)) return false;
  }

  return msInfo;
}
