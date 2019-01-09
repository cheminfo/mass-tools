'use strict';

var Similarity = require('peaks-similarity');
var IsotopicDistribution = require('isotopic-distribution');
/**
Search for an experimental monoisotopic mass and calculate the similarity
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten] - should we return the array as a flat result
* @param {string}   [options.ionizations=''] - Comma separated list of ionizations (to charge the molecule)
* @param {object}   [options.minSimilarity=0.5] - min similarity value

* @param {object}   [options.filter={}]
* @param {boolean}  [options.filter.forceIonization=false] - If true ignore existing ionizations
* @param {number}   [options.filter.msem] - Observed monoisotopic mass in mass spectrometer
* @param {number}   [options.filter.precision=1000] - The precision on the experimental mass
* @param {number}   [options.filter.minCharge=-Infinity] - Minimal charge
* @param {number}   [options.filter.maxCharge=+Infinity] - Maximal charge
* @param {object}   [options.filter.unsaturation={}}]
* @param {number}   [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
* @param {number}   [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
* @param {number}   [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
* @param {number}   [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
* @param {object}   [options.filter.atoms] - object of atom:{min, max}

* @param {object}   [options.similarity={}]
* @param {object}   [options.similarity.widthBottom]
* @param {object}   [options.similarity.widthTop]
* @param {object}   [options.similarity.widthFunction] - function called with mass that should return an object width containing top and bottom
* @param {object}   [options.similarity.zone={}]
* @param {object}   [options.similarity.zone.low=-0.5] - window shift based on observed monoisotopic mass
* @param {object}   [options.similarity.zone.high=2.5] - to value for the comparison window
* @param {object}   [options.similarity.common]
*/

module.exports = function searchSimilarity(options = {}) {
  const { similarity = {}, minSimilarity = 0.5, filter = {} } = options;

  if (
    !this.experimentalSpectrum ||
    !this.experimentalSpectrum.data.x.length > 0
  ) {
    throw Error(
      'You need to add an experimental spectrum first using setMassSpectrum'
    );
  }

  let experimentalData = this.experimentalSpectrum.data;

  // the result of this query will be stored in a property 'ms'

  let results = this.searchMSEM(filter.msem, options);
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

  const { widthFunction, zone = {} } = similarity;
  const { low = -0.5, high = 2.5 } = zone;

  // we need to calculate the similarity of the isotopic distribution
  let similarityProcessor = new Similarity(similarity);
  similarityProcessor.setPeaks1([experimentalData.x, experimentalData.y]);

  let targetMass = experimentalData.x[0];

  for (let entry of flatEntries) {
    let isotopicDistribution = new IsotopicDistribution(entry.mf, {
      allowNeutral: false,
      ionizations: [entry.ionization]
    });

    let distribution = isotopicDistribution.getDistribution();
    // we need to define the comparison zone that depends of the charge
    let from = entry.ms.em + low / entry.ms.charge;
    let to = entry.ms.em + high / entry.ms.charge;
    similarityProcessor.setFromTo(from, to);

    if (widthFunction) {
      var width = widthFunction(targetMass);
      similarityProcessor.setTrapezoid(width.bottom, width.top);
    }
    similarityProcessor.setPeaks2([distribution.xs, distribution.ys]);
    let result = similarityProcessor.getSimilarity();

    result.extractInfo1.from = from;
    result.extractInfo1.to = to;

    if (result.similarity > minSimilarity) {
      entry.ms.similarity = {
        value: result.similarity,
        experimental: result.extract1,
        theoretical: result.extract2,
        difference: result.diff,
        experimentalInfo: result.extractInfo1,
        thereoticalInfo: result.extractInfo2,
        quantity: result.extractInfo1.sum / result.extractInfo2.sum
      };
    }
  }

  if (!options.flatten) {
    for (let database of Object.keys(results)) {
      results[database] = results[database]
        .filter((entry) => entry.ms.similarity)
        .sort((a, b) => b.ms.similarity.value - a.ms.similarity.value);
      for (let entry of results[database]) {
        flatEntries.push(entry);
      }
    }
  } else {
    results = results
      .filter((entry) => entry.ms.similarity)
      .sort((a, b) => b.ms.similarity.value - a.ms.similarity.value);
  }

  return results;
};
