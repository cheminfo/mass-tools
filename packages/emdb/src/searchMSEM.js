'use strict';

const matcher = require('mf-matcher/src/msemMatcher');
const preprocessModifications = require('mf-utils/src/preprocessModifications');

/**
Search for an experimental monoisotopic mass
* @param {number}   msem - The observed monoisotopic mass
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten] - should we return the array as a flat result
* @param {string}   [options.modifications=''] - Comma separated list of modifications (to charge the molecule)
* @param {boolean}  [options.forceModification=false] - If true ignore existing modifications
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

    options = Object.assign({}, options);
    let {
        databases = Object.keys(this.databases),
        flatten = false,
    } = options;

    let modifications = preprocessModifications(options.modifications);
    let results = {};
    for (let modification of modifications) {
        options.modification = modification;
        for (let database of databases) {
            results[database] = [];
            for (let entry of this.databases[database]) {
                let match = matcher(entry, msem, options);
                if (match) {
                    results[database].push(Object.assign({}, entry, match));
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
        return flattenResults;
    } else {
        return results;
    }
};

