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

* @param {object}   [options.filter={}]
* @param {boolean}  [options.filter.forceIonization=false] - If true ignore existing ionizations
* @param {number}   [options.filter.precision=1000] - The precision on the experimental mass
* @param {number}   [options.filter.minCharge=-Infinity] - Minimal charge
* @param {number}   [options.filter.maxCharge=+Infinity] - Maximal charge
* @param {number}   [options.filter.minUnsaturation=-Infinity] - Minimal unsaturation
* @param {number}   [options.filter.maxUnsaturation=+Infinity] - Maximal unsaturation
* @param {number}   [options.filter.onlyIntegerUnsaturation=false] - Integer unsaturation
* @param {number}   [options.filter.onlyNonIntegerUnsaturation=false] - Non integer unsaturation
* @param {object}   [options.filter.atoms] - object of atom:{min, max}

* @param {object}   [options.similarity={}]
* @param {object}   [options.similarity.widthBottom]
* @param {object}   [options.similarity.widthTop]
* @param {object}   [options.similarity.widthFunction] - function called with mass that should return an object width containing top and bottom
* @param {object}   [options.similarity.from] - from value for the comparison window
* @param {object}   [options.similarity.to] - to value for the comparison window
* @param {object}   [options.similarity.common]
*/

module.exports = function searchSimilarity(msem, options = {}) {
    const {
        similarity = {},
    } = options;

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
    let similarityProcessor = new Similarity(similarity);
    similarityProcessor.setPeaks1([this.experimentalSpectrum.x, this.experimentalSpectrum.y]);

    let targetMass = this.experimentalSpectrum.x[0];

    for (let entry of flatEntries) {
        let isotopicDistribution = new IsotopicDistribution(entry.mf + entry.ionization.mf);
        let distribution = isotopicDistribution.getDistribution();

        if (widthFunction) {
            var width = widthFunction(targetMass);
            similarityProcessor.setTrapezoid(width.bottom, width.top);
        }
        similarityProcessor.setPeaks2([distribution.xs, distribution.ys]);
        let result = similarityProcessor.getSimilarity();

        entry.ms.similarity = {
            value: result.similarity,
            experiment: result.extract1,
            theoretical: result.extract2,
            difference: result.diff,
        };
    }

    return results;
};

