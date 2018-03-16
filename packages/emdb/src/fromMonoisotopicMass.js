'use strict';

const findMFs = require('mf-finder');


/**
 * Generates a database 'monoisotopic' from an array of molecular formula

/**
 * Generates a database 'generated' from an array of molecular formula
 * @param {number} mass - Monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.databaseName='monoisotopic']
 * @param {number} [options.maxIterations=10000000] - Maximum number of results
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 *
 * @param {number} [options.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.maxCharge=+Infinity] - Maximal charge
 *
 * @param {number} [options.unsaturation={}]
 * @param {number} [options.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number} [options.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number} [options.unsaturation.onlyIntege=false] - Integer unsaturation
 * @param {number} [options.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 */

module.exports = function fromMonoisotopicMass(mass, options = {}) {
    return findMFs(mass, options).mfs;
};

