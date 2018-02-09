'use strict';

/**
Search for an experimental monoisotopic mass and calculate the similarity
* @param {number}   msem - The observed monoisotopic mass
* @param {Array}    massSpectrum - Mass spectrum as an object of {x: [], y:[]}sear
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten] - should we return the array as a flat result
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

module.exports = function searchSimilarity(msem, massSpectrum, options = {}) {
    let results = this.searchMSEM(msem, options);
    console.log(results.contaminants[0]);

};

