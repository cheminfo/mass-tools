'use strict';

var Similarity = require('peaks-similarity');
var IsotopicDistribution = require('isotopic-distribution');
/**
Search for an experimental monoisotopic mass and calculate the similarity
* @param {number}   msem - The observed monoisotopic mass
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
* @param {object}   [options.widthBottom]
* @param {object}   [options.widthTop]
* @param {object}   [options.widthFunction] - function called with mass that should return an object width containing top and bottom
* @param {object}   [options.from] - from value for the comparison window
* @param {object}   [options.to] - to value for the comparison window
* @param {object}   [options.common]
*/

module.exports = function searchSimilarity(msem, options = {}) {

    if (!this.experimentalSpectrum || !this.experimentalSpectrum.x || !this.experimentalSpectrum.x.length > 0) {
        throw Error('You need to add an experimental spectrum first using setMassSpectrum');
    }

    if (!msem) {
        throw Error('You need to specify a target mass');
    }


    // the result of this query will be stored in a property 'ms'
    let results = this.searchMSEM(msem, options);
    let flatEntries = [];
    if (!options.flatten) {
        for (let database of Object.keys(results)) {
            for (let entry of results[database]) {
                flatEntries.push(entry);
            }
        }
    } else {
        flatEntries = results;
    }

    const {
        widthFunction,
    } = options;


    // we need to calculate the similarity of the isotopic distribution
    let similarity = new Similarity(options);
    similarity.setPeaks1([this.experimentalSpectrum.x, this.experimentalSpectrum.y]);

    let targetMass = this.experimentalSpectrum.x[0];

    for (let entry of flatEntries) {
        let isotopicDistribution = new IsotopicDistribution(entry.mf + entry.ionization.mf);
        let distribution = isotopicDistribution.getDistribution();

        if (widthFunction) {
            var width = widthFunction(targetMass);
            similarity.setTrapezoid(width.bottom, width.top);
        }
        similarity.setPeaks2([distribution.xs, distribution.ys]);
        let result = similarity.getSimilarity();

        entry.ms.similarity = {
            value: result.similarity,
            experiment: result.extract1,
            theoretical: result.extract2,
            difference: result.diff,
        };
    }

    return results;
};

