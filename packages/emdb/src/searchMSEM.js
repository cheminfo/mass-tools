'use strict';

const matcher = require('mf-matcher/src/msemMatcher');
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');

/**
Search for an experimental monoisotopic mass
* @param {number}   msem - The observed monoisotopic mass
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten=false] - should we return the array as a flat result

* @param {object}   [options.filter={}]
* @param {string}   [options.ionizations] - list the allowed ionizations possibilities
* @param {boolean}  [options.filter.forceIonization=false] - If true ignore existing ionizations
* @param {number}   [options.filter.precision=1000] - The precision on the experimental mass
* @param {number}   [options.filter.minCharge=-Infinity] - Minimal charge
* @param {number}   [options.filter.maxCharge=+Infinity] - Maximal charge
* @param {object}   [options.filter.unsaturation={}}]
* @param {number}   [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
* @param {number}   [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
* @param {number}   [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
* @param {number}   [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
* @param {object}   [options.filter.atoms] - object of atom:{min, max}

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
        let match = matcher(entry, filter);
        if (match) {
          results[database].push(
            Object.assign({}, entry, {
              ms: match.ms,
              ionization: match.ionization
            })
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
    flattenResults.sort((a, b) => a.ms.ppm - b.ms.ppm);
    return flattenResults;
  } else {
    Object.keys(results).forEach((k) =>
      results[k].sort((a, b) => a.ms.ppm - b.ms.ppm)
    );
    return results;
  }
};
