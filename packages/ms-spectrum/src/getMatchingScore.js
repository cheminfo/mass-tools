'use strict';

const { xSum } = require('ml-spectra-processing');

/**
 * Filter the array of peaks
 * @param {object} [matchedExpFragments={}] - object of all the experimental fragments matched
 * @param {Array} [fragmentsContribution=[]] - array of all the bond contributions for of matching fragments
 * @param {object} [options={}] - object containing the scale factor for mass and intensity
 * @param {number} [options.massCoefficient=3]
 * @param {number} [options.intensityCoefficient=0.6]
 * @returns {number} - returns the matching score
 */

// Scaling mass and intensity power can be found in DOI: 10.1016/1044-0305(94)87009-8

function getMatchingScore(
  matchedExpFragments = { x: [], y: [] },
  fragmentsContribution = [0],
  options = {},
) {
  const { massCoefficient = 3, intensityCoefficient = 0.6 } = options;
  // sum all bonds contribution of matched fragments
  let sumContribution = xSum(fragmentsContribution);

  // Scale the mass and intensity
  let weightFactor = 0;
  for (let i = 0; i < matchedExpFragments.x.length; i++) {
    weightFactor +=
      matchedExpFragments.y[i] ** intensityCoefficient *
      matchedExpFragments.x[i] ** massCoefficient;
  }

  // final score
  let finalScore = weightFactor + sumContribution;
  return finalScore;
}

module.exports = getMatchingScore;
