'use strict';

const { xSum } = require('ml-spectra-processing');

/**
 * @description Get the matching score of in-silico matched fragments by taking into account the mass and intensity of the matched fragments and the bond contribution of the matched fragments
 * @param {object} [matchedExpFragments={}] - object of all the experimental fragments matched
 * @param {Array} [matchedExpFragments.masses] - array of masses of the matched experimental fragments
 * @param {Array} [matchedExpFragments.intensities] - array of intensities of the matched experimental fragments
 * @param {Array} [fragmentsContribution=[]] - array of all the bond contributions for of matching fragments
 * @param {object} [options={}] - object containing the scale factor for mass and intensity
 * @param {number} [options.massCoefficient=3] - scale factor for mass
 * @param {number} [options.intensityCoefficient=0.6] - scale factor for intensity
 * @returns {number} - returns the matching score of the candidate molecule
 */

// Scaling mass and intensity power can be found in DOI: 10.1016/1044-0305(94)87009-8

function getFragmentedCandidateScore(
  matchedExpFragments = { masses: [], intensities: [] },
  fragmentsContribution = [0],
  options = {},
) {
  const { massCoefficient = 3, intensityCoefficient = 0.6 } = options;
  // sum all bonds contribution of matched fragments
  let sumContribution = xSum(fragmentsContribution);

  // Scale the mass and intensity
  let weightFactor = 0;
  for (let i = 0; i < matchedExpFragments.masses.length; i++) {
    weightFactor +=
      matchedExpFragments.intensities[i] ** intensityCoefficient *
      matchedExpFragments.masses[i] ** massCoefficient;
  }

  // final score
  let finalScore = weightFactor + sumContribution;
  return finalScore;
}

module.exports = getFragmentedCandidateScore;
