'use strict';

const matcher = require('mf-matcher/src/msemMatcher');
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');

/**
Search for an experimental monoisotopic mass
* @param {number}   msem - The observed monoisotopic mass
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten=false] - should we return the array as a flat result
* @param {string}   [options.ionizations=''] - Comma separated list of ionizations (to charge the molecule)
* @param {boolean}  [options.forceIonization=false] - If true ignore existing ionizations
* @param {number}   [options.precision=1000] - The precision on the experimental mass
* @param {number}   [options.minCharge=-Infinity] - Minimal charge
* @param {number}   [options.maxCharge=+Infinity] - Maximal charge
* @param {number}   [options.minUnsaturation=-Infinity] - Minimal unsaturation
* @param {number}   [options.maxUnsaturation=+Infinity] - Maximal unsaturation
* @param {number}   [options.onlyIntegerUnsaturation=false] - Integer unsaturation
* @param {number}   [options.onlyNonIntegerUnsaturation=false] - Non integer unsaturation
* @param {object}   [options.atoms] - object of atom:{min, max}
*/

module.exports = function searchMSEM(msem, options = {}) {
    options = Object.assign({}, options, { targetMass: msem });
    let {
        databases = Object.keys(this.databases),
        flatten = false,
    } = options;

    let ionizations = preprocessIonizations(options.ionizations);
    let results = {};
    for (let ionization of ionizations) {
        options.ionization = ionization;
        for (let database of databases) {
            results[database] = [];
            for (let entry of this.databases[database]) {
                let match = matcher(entry, options);
                if (match) {
                    results[database].push(Object.assign({}, entry, { ms: match }));
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
        Object.keys(results).forEach((k) => results[k].sort((a, b) => a.ms.ppm - b.ms.ppm));
        return results;
    }
};

