import { findMFsSync } from './findMFsSync';

/**
 * @param {number}        targetMass - Monoisotopic mass
 * @param {object}        [options={}]
 * @param {number}        [options.maxIterations=10000000] - Maximum number of iterations
 * @param {boolean}       [options.allowNeutral=true]
 * @param {boolean}       [options.uniqueMFs=true]
 * @param {number}        [options.limit=1000] - Maximum number of results
 * @param {string}        [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string}        [options.ranges='C0-100 H0-100 O0-100 N0-100'] - range of mfs to search
 * @param {number}        [options.precision=100] - Allowed mass range based on precision
 * @param {object}        [options.filter={}]
 * @param {number}        [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number}        [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {object}        [options.filter.unsaturation={}]
 * @param {number}        [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}        [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {boolean}        [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {boolean}        [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object}        [options.filter.atoms] - object of atom:{min, max}
 * @param {function}      [options.filter.callback] - a function to filter the MF
 * @returns {Promise}
 */

export async function findMFs(targetMass, options = {}) {
  return findMFsSync(targetMass, options);
}
