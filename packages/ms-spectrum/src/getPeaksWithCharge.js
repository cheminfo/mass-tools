import { xFindClosestIndex } from 'ml-spectra-processing';

import { getPeaksWithClusterCharge } from './getChargeClusters.js';

/**
 * Evaluate the charge of a selection of peaks.
 *
 * The charge comes from the isotopologue clusters of `allPeaks`: a peak takes
 * the charge of the series it belongs to. Evaluating a peak on its own can not
 * work, because an isotopologue in the middle of an envelope looks the same
 * whatever the charge and the last one of an envelope has nothing after it.
 *
 * A peak that belongs to no series gets no `charge` at all.
 * @param {Array} selectedPeaks - peaks to evaluate
 * @param {Array} allPeaks - all the peaks of the spectrum, sorted by mass
 * @param {object} [options={}]
 * @param {number} [options.min=1] - lowest charge to consider
 * @param {number} [options.max=10] - highest charge to consider
 * @param {number} [options.precision=20] - tolerance on the position of an
 * isotopologue, in ppm
 * @param {number} [options.minLength=3] - shortest series that shows a charge
 * @param {number} [options.minIntensity=0] - peaks under it are noise and take
 * no part in the series
 * @returns {Array} copy of `selectedPeaks`, with a `charge` when one was found
 */
export function getPeaksWithCharge(selectedPeaks, allPeaks, options = {}) {
  const {
    precision = 20,
    min: minCharge = 1,
    max: maxCharge = 10,
    minLength = 3,
    minIntensity = 0,
  } = options;

  const significant = [];
  for (const peak of allPeaks) {
    if (peak.y >= minIntensity) significant.push(peak);
  }

  const clustered = getPeaksWithClusterCharge(significant, {
    minCharge,
    maxCharge,
    precision,
    minLength,
  });

  const masses = new Float64Array(clustered.length);
  for (let i = 0; i < clustered.length; i++) masses[i] = clustered[i].x;

  const peaksWithCharge = [];
  for (const peak of selectedPeaks) {
    const charge = getChargeAtMass(clustered, masses, peak.x, precision);
    peaksWithCharge.push(
      charge === undefined ? { ...peak } : { ...peak, charge },
    );
  }
  return peaksWithCharge;
}

/**
 * Charge of the clustered peak lying at a mass, if there is one there.
 * @param {Array} clustered - peaks carrying their charge, sorted by mass
 * @param {import('cheminfo-types').NumberArray} masses - their masses
 * @param {number} targetMass
 * @param {number} precision - in ppm
 * @returns {number|undefined}
 */
export function getChargeAtMass(clustered, masses, targetMass, precision) {
  if (masses.length === 0) return undefined;
  const index = xFindClosestIndex(masses, targetMass);
  const peak = clustered[index];
  const tolerance = precision * 1e-6 * targetMass;
  if (Math.abs(peak.x - targetMass) > tolerance) return undefined;
  return peak.charge;
}
