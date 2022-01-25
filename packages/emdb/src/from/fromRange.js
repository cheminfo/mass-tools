'use strict';

const combineMFs = require('mf-generator');

/**
 * Generates a database 'generated' from an array of molecular formula
 * @param {string} rangesString - a string representing the range to search
 * @param {object} [options={}]
 * @param {boolean} [options.estimate=false] - estimate the number of MF without filters
 * @param {function} [options.onStep] - Callback to do after each step
 * @param {string} [options.databaseName='generated']
 * @param {number} [options.limit=100000] - Maximum number of results
 * @param {boolean} [options.canonizeMF=true] - Canonize molecular formula
 * @param {boolean} [options.uniqueMFs=true] - Force canonization and make MF unique
 * @param {string} [options.ionizations=''] - Comma separated list of ionizations (to charge the molecule)
 * @param {object} [options.filter={}]
 * @param {number} [options.filter.minMass=0] - Minimal monoisotopic mass
 * @param {number} [options.filter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number} [options.filter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number} [options.filter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number} [options.filter.minMSEM=0] - Minimal observed monoisotopic mass
 * @param {number} [options.filter.maxMSEM=+Infinity] - Maximal observed monoisotopic mass
 * @param {number} [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.filter.maxCharge=+Infinity] - Maximal charge
 *
 * @param {object} [options.filter.unsaturation={}]
 * @param {number} [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number} [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {boolean} [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {boolean} [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {function} [options.filter.callback] - a function to filter the MF
 * @param {object} [options.filter.atoms] - object of atom:{min, max}
 *
 * @returns {Promise} - list of possible molecular formula
 *
 * @example
 * const EMDB = require('emdb');
 * let emdb = new EMDB();
 * // semi-columns separated for combination, comma for 'or'
 * emdb.fromRange('C1-10, H1-10; Cl0-1 Br0-1'); // create a database 'generated' combining all possibilies
 * console.log(emdb.get('generated').length); // 80
 */

module.exports = async function fromRange(rangesString, options = {}) {
  let ranges = rangesString.split(/ *[;\r\n] */);
  for (let i = 0; i < ranges.length; i++) {
    let range = ranges[i];
    if (range.includes(',')) {
      ranges[i] = range.split(/ *, */);
    }
  }

  return combineMFs(ranges, options);
};
