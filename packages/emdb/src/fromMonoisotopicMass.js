'use strict';

const findMFs = require('mf-finder');


/**
 * Generates a database 'monoisotopic' from an array of molecular formula

/**
 * Generates a database 'generated' from an array of molecular formula
 * @param {number} mass - Monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.databaseName='monoisotopic']
 * @param {number} [options.limit=10000000] - Maximum number of results
 * @param {boolean} [options.canonizeMF=true] - Canonize molecular formula
 * @param {boolean} [options.uniqueMFs=true] - Force canonization and make MF unique
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 *
 * @param {number} [options.filter={}]
 * @param {number} [options.filter.minMass=0] - Minimal monoisotopic mass
 * @param {number} [options.filter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number} [options.filter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number} [options.filter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number} [options.filter.minMSEM=0] - Minimal observed monoisotopic mass
 * @param {number} [options.filter.maxMSEM=+Infinity] - Maximal observed monoisotopic mass
 * @param {number} [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.filter.maxCharge=+Infinity] - Maximal charge
 *
 * @param {number} [options.filter.unsaturation={}]
 * @param {number} [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number} [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number} [options.filter.unsaturation.onlyIntege=false] - Integer unsaturation
 * @param {number} [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object} [options.filter.atoms] - object of atom:{min, max}
 */

module.exports = function fromMonoisotopicMass(mass, options = {}) {
    return findMFs(mass, options).mfs;
};

