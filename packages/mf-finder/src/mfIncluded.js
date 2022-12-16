import { MF } from 'mf-parser';

import { findMFsSync } from './findMFsSync.js';

/**
 * @param {string}        mf - the molecular formula to check
 * @param {string}        range - the range of MF to explore
 * @param {object}        [options={}]
 * @param {number}        [options.maxIterations=10000000] - Maximum number of iterations
 * @param {boolean}       [options.allowNeutral=true]
 * @param {string}        [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {object}        [options.filter={}]
 * @param {number}        [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number}        [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {object}        [options.filter.unsaturation={}]
 * @param {number}        [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}        [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number}        [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {number}        [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object}        [options.filter.atoms] - object of atom:{min, max}
 * @param {function}      [options.filter.callback] - a function to filter the MF
 * @returns {boolean}
 */
export function mfIncluded(mf, range, options = {}) {
  let targetEM = new MF(mf).getInfo().monoisotopicMass;
  let results = findMFsSync(targetEM, {
    ...{ allowNeutral: true },
    ...options,
    ...{
      ranges: range,
      precision: 0.0000001,
      limit: 1,
    },
  });
  return results.mfs.length > 0;
}
