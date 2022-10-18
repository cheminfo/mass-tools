'use strict';

/**
 * @description A function which returns a matching score for a list of fragments
 * Scaling mass and intensity power can be found in DOI: 10.1016/1044-0305(94)87009-8
 * @param {object} [experimentalSpectrum={}] - the experimental spectrum
 * @param {number[]} [experimentalSpectrum.masses] - array of masses of the experimental spectrum
 * @param {number[]} [experimentalSpectrum.intensities] - array of intensities of the experimental spectrum
 * @param {number[]} [fragmentMasses=[]] - fragments to be matched
 * @param {object} [options={}] - object containing the scale factor for mass and intensity and the precision in ppm
 * @param {number} [options.massCoefficient=3] - scale factor for mass
 * @param {number} [options.intensityCoefficient=0.6] - scale factor for intensity
 * @param {number} [options.precision=5] - experimental precision in ppm
 * @returns {number} returns the matching score of the candidate molecule
 */

function getFragmentedCandidateScore(
  experimentalSpectrum = { masses: [], intensities: [] },
  fragmentMasses = [],
  options = {},
) {
  const {
    massCoefficient = 3,
    intensityCoefficient = 0.6,
    precision = 5,
  } = options;
  let matchedExpFragments = { masses: [], intensities: [] };
  for (let i = 0; i < experimentalSpectrum.masses.length; i++) {
    let massExperimental = experimentalSpectrum.masses[i];
    let allowedError = (precision * massExperimental) / 1e6;
    for (let j = 0; j < fragmentMasses.length; j++) {
      let massFragment = fragmentMasses[j];
      if (
        // use absolute value to avoid negative values
        Math.abs(massExperimental - massFragment) <= allowedError
      ) {
        matchedExpFragments.masses.push(massExperimental);
        matchedExpFragments.intensities.push(
          experimentalSpectrum.intensities[i],
        );
      }
    }
  }
  // Scale the mass and intensity
  let score = 0;
  for (let i = 0; i < matchedExpFragments.masses.length; i++) {
    score +=
      matchedExpFragments.intensities[i] ** intensityCoefficient *
      matchedExpFragments.masses[i] ** massCoefficient;
  }

  return score;
}

module.exports = getFragmentedCandidateScore;
