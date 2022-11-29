import { msemMatcher } from 'mf-matcher';
import { preprocessIonizations } from 'mf-utilities';

/**
Search for an experimental monoisotopic mass
* @param {number}   msem - The observed monoisotopic mass
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten=false] - should we return the array as a flat result
* @param {string}   [options.ionizations] - list the allowed ionizations possibilities
* @param {object}   [options.filter={}]
* @param {number}         [options.filter.targetMass] - Target mass, allows to calculate error and filter results
* @param {Array<number>}  [options.filter.targetMasses] - Target masses: SORTED array of numbers
* @param {Array<number>}  [options.filter.targetIntensities] - Target intensities: SORTED array of numbers
* @param {number}         [options.filter.minEM=0] - Minimal monoisotopic mass
* @param {number}         [options.filter.maxEM=+Infinity] - Maximal monoisotopic mass
* @param {number}         [options.filter.minMSEM=0] - Minimal monoisotopic mass observed by mass
* @param {number}         [options.filter.maxMSEM=+Infinity] - Maximal monoisotopic mass observed by mass
* @param {number}         [options.filter.minCharge=-Infinity] - Minimal charge
* @param {number}         [options.filter.maxCharge=+Infinity] - Maximal charge
* @param {object}         [options.filter.unsaturation={}]
* @param {number}         [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
* @param {number}         [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
* @param {number}         [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
* @param {number}         [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
* @param {object}         [options.filter.callback] - a function to filter the MF
* @param {object}         [options.filter.atoms] - object of atom:{min, max}
*/

module.exports = function searchMSEM(msem, options = {}) {
  let filter = Object.assign({}, options.filter || {}, { targetMass: msem });
  let { databases = Object.keys(this.databases), flatten = false } = options;

  let ionizations = preprocessIonizations(options.ionizations);
  let results = {};
  for (let database of databases) {
    results[database] = [];
  }
  for (let ionization of ionizations) {
    filter.ionization = ionization;
    for (let database of databases) {
      for (let entry of this.databases[database]) {
        let match = msemMatcher(entry, filter);
        if (match) {
          results[database].push(
            Object.assign({}, entry, {
              ms: match.ms,
              ionization: match.ionization,
            }),
          );
        }
      }
    }
  }
  if (flatten) {
    let flattenResults = [];
    for (let database of databases) {
      for (let entry of results[database]) {
        entry.database = database;
        flattenResults.push(entry);
      }
    }
    flattenResults.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));
    return flattenResults;
  } else {
    Object.keys(results).forEach((k) =>
      results[k].sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm)),
    );
    return results;
  }
};
