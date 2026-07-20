import { xNoiseStandardDeviation } from 'ml-spectra-processing';

import { getPeaksWithCharge } from './getPeaksWithCharge.js';

/**
 * Evaluate the charge of the peak observed at a mass.
 *
 * The charge is the one of the isotopologue cluster the peak belongs to, see
 * `getChargeClusters`. A peak on its own shows no charge: what shows it is the
 * series of peaks around it, separated by one dalton over the charge.
 * @param {import('./Spectrum.js').Spectrum} spectrum
 * @param {number} targetMass
 * @param {object}   [options={}]
 * @param {number}   [options.minCharge=1]
 * @param {number}   [options.maxCharge=10]
 * @param {number}   [options.precision=20] - tolerance on the position of an
 * isotopologue, in ppm
 * @param {number}   [options.minLength=3] - shortest series that shows a charge
 * @param {number}   [options.minSignalToNoise=10] - a peak under `median` plus
 * `minSignalToNoise` times the standard deviation of the noise takes no part in
 * the series: the position of a maximum of the noise is random and would give a
 * charge to what is only noise. Only for a continuous spectrum, a list of
 * centroids does not describe its noise anymore.
 * @returns {number|undefined} the charge, or undefined when no series of peaks
 * shows one at that mass
 */
export function getPeakChargeBySimilarity(spectrum, targetMass, options = {}) {
  if (!spectrum || spectrum.data.x.length === 0) {
    throw new Error(
      'You need to add an experimental spectrum first using setMassSpectrum',
    );
  }

  const { minCharge = 1, maxCharge = 10 } = options;
  const [peak] = getPeaksWithCharge(
    [{ x: targetMass, y: 0 }],
    spectrum.getPeaks({ threshold: 0 }),
    {
      ...options,
      min: minCharge,
      max: maxCharge,
      minIntensity: getMinIntensity(spectrum, options),
    },
  );
  return peak.charge;
}

/**
 * Intensity under which a peak is too close to the noise to say anything about
 * a charge. The peak picking already removes what is under `median + 3 sd`, but
 * a gaussian noise still leaves some of its maxima over it.
 * @param {import('./Spectrum.js').Spectrum} spectrum
 * @param {object} [options={}]
 * @param {number} [options.minSignalToNoise=10]
 * @returns {number}
 */
export function getMinIntensity(spectrum, options = {}) {
  const { minSignalToNoise = 10 } = options;
  // the intensities of a list of centroids are signal, not noise: their median
  // and deviation describe the peaks themselves and would remove all of them
  if (!minSignalToNoise || !spectrum.isContinuous()) return 0;
  if (spectrum.cache.noise === undefined) {
    spectrum.cache.noise = xNoiseStandardDeviation(spectrum.data.y);
  }
  const { median, sd } = spectrum.cache.noise;
  return median + minSignalToNoise * sd;
}
