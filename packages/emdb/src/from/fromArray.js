import { generateMFs } from 'mf-generator';

/**
 * Generates a database 'generated' from an array of molecular formula
 * @param {array} mfsArray - Array of string or Array of array containing the parts to combine
 * @param {object} [options={}]
 * @param {boolean} [options.estimate=false] - estimate the number of MF without filters
 * @param {string} [options.databaseName='generated']
 * @param {function} [options.onStep] - Callback to do after each step
 * @param {number} [options.limit=10000000] - Maximum number of results
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
 * @param {boolean}  [options.filter.absoluteCharge=false] - If true, the charge is absolute (so between 0 and +Infinity by default)
 * @param {object} [options.filter.unsaturation={}]
 * @param {number} [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number} [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {boolean} [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {boolean} [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object} [options.filter.atoms] - object of atom:{min, max}
 * @param {function} [options.filter.callback] - a function to filter the MF
 * @param {string}  [options.filterFct] - A string representing a function
 *
 * @example
 *
 * const {EMDB} = require('emdb');
 * let emdb = new EMDB();
 * let array = ['C1-10', 'H1-10'];
 * emdb.fromArray(array); // create a database 'generated' combining all possibilies
 * console.log(emdb.get('generated').length); // 100
 *
 * @example
 * const {EMDB} = require('emdb');
 * let emdb = new EMDB();
 * let array = ['C1-10 H1-10'];
 * emdb.fromArray(array); // create a database 'generated' combining all possibilies
 * console.log(emdb.get('generated').length); // 100
 *
 * @example
 * const {EMDB} = require('emdb');
 * let emdb = new EMDB();
 * // in case of an array of array, one of the group is allwed
 * let array = [['C1-10','H1-10'],'Cl0-1 Br0-1'];
 * emdb.fromArray(array); // create a database 'generated' combining all possibilies
 * console.log(emdb.get('generated').length); // 80
 *
 * @example
 * <script src="https://www.lactame.com/lib/mass-tools/HEAD/mass-tools.js" />
 * <script>
 *   let emdb = new MassTools.EMDB();
 *   let array = ['C1-10', 'H1-10'];
 *   emdb.fromArray(array); // create a database 'generated' combining all possibilities
 *   console.log(emdb.get('generated').length); // 100
 * </script>
 *
 * // from the browser
 */

export async function fromArray(mfsArray, options = {}) {
  return generateMFs(mfsArray, options);
}
