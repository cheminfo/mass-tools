'use strict';

const sum = require('ml-array-sum/lib/index');

/**
 * Filter the array of peaks
 * @param {object} [matchedExpFragments={}] - object of all the experimental fragments matched
 * @param {Array} [fragmentsContribution=[]] - array of all the bond contributions for of matching fragments
 * @param {object} [options={}] - object containing the scale factor for mass and intensity (m and i)
 * @returns {number} - returns the matching score
 */

// Scaling mass and intensity power can be found in DOI: 10.1016/1044-0305(94)87009-8

function getMatchingScore(
  matchedExpFragments = { x: [], y: [] },
  fragmentsContribution = [0],
  options = { m: 3, i: 0.6 },
) {
  // sum all bonds contribution of matched fragments
  let sumContribution = sum(fragmentsContribution);

  // Scale the mass and intensity
  let weightFactor = 0;
  for (let i = 0; i < matchedExpFragments.x.length; i++) {
    weightFactor +=
      Math.pow(matchedExpFragments.y[i], options.i) *
      Math.pow(matchedExpFragments.x[i], options.m);
  }

  // final score
  let finalScore = weightFactor + sumContribution;
  // round to 3 decimals
  return Math.round(finalScore * 1000) / 1000;
}

module.exports = getMatchingScore;
