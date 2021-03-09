'use strict';

const mfFinder = require('mf-finder');

/**
 * Generates a database 'monoisotopic' from a monoisotopic mass and various options
 * @param {number}    mass - Monoisotopic mass
 * @param {object}    [options={}]
 * @param {number}    [options.maxIterations=10000000] - Maximum number of iterations
 * @param {number}    [options.limit=1000] - Maximum number of results
 * @param {string}    [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string}    [options.ranges='C0-100 H0-100 O0-100 N0-100'] - range of mfs to search
 * @param {number}    [options.precision=100] - Allowed mass range based on precision
 * @param {number}    [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number}    [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {number}    [options.filter.unsaturation={}]
 * @param {number}    [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}    [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number}    [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {number}    [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object}    [options.filter.atoms] - object of atom:{min, max}
 * @param {function}  [options.filter.callback] - a function to filter the MF
 */

module.exports = function fromMonoisotopicMass(mass, options = {}) {
  return mfFinder(mass, options);
};
