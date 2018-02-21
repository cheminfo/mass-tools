'use strict';

var Similarity = require('peaks-similarity');
var IsotopicDistribution = require('isotopic-distribution');
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

    if (!msem) return;

    if (!massSpectrum || !massSpectrum.x || !massSpectrum.x.length > 0) return;

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
        from = -0.5,
        to = 3.5,
    } = options;

    // we need to calculate the similarity of the isotopic distribution
    let similarity = new Similarity(options);
    similarity.setPeaks1([massSpectrum.x, massSpectrum.y]);

    let targetMass = massSpectrum.x[0];

    for (let entry of flatEntries) {
        let isotopicDistribution = new IsotopicDistribution(entry.mf + entry.ionization.mf);
        let distribution = isotopicDistribution.getDistribution();

        if (widthFunction) {
            var width = widthFunction(targetMass);
            similarity.setTrapezoid(width.widthBottom, width.widthTop);
        }

        entry.ms.similarity = {
            value: similarity.fastSimilarity([distribution.xs, distribution.ys], targetMass + from, targetMass + to),
            experiment: similarity.getExtract1(),
            theoretical: similarity.getExtract2(),
        };
    }

    return results;
};

