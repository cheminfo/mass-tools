import { xNoiseStandardDeviation } from 'ml-spectra-processing';
import { Comparator } from 'peaks-similarity';

/**
 * Evaluate the charge of a peak by comparing the experimental isotopologues with
 * theoretical ones placed NEUTRON_MASS / charge apart.
 *
 * The comparison is done on the peaks of the spectrum, never on the raw data: a
 * continuous spectrum has to be peak picked first, otherwise the baseline points
 * take part in the comparison and an unresolved peak matches any charge.
 * @param {import('./Spectrum.js').Spectrum} spectrum
 * @param {number} targetMass
 * @param {object}   [options={}]
 * @param {number}   [options.minCharge=1]
 * @param {number}   [options.maxCharge=10]
 * @param {number}   [options.minSignalToNoise=10] - a peak under `median` plus
 * `minSignalToNoise` times the standard deviation of the noise takes no part in
 * the comparison: the position of a maximum of the noise is random and would
 * give a charge to what is only noise. Only for a continuous spectrum, a list
 * of centroids does not describe its noise anymore.
 * @param {number}   [options.minSeparation=1] - a charge is only evaluated if the
 * peak is narrower than `minSeparation` times the distance between its
 * isotopologues, otherwise nothing in the peak can show them apart
 * @param {object}   [options.similarity={}]
 * @param {number}   [options.similarity.widthBottom]
 * @param {number}   [options.similarity.widthTop]
 * @param {object}   [options.similarity.widthFunction] - function called with mass that should return an object width containing top and bottom
 * @param {object}   [options.similarity.zone={}]
 * @param {number}   [options.similarity.zone.low=-0.5] - window shift based on observed monoisotopic mass
 * @param {number}   [options.similarity.zone.high=2.5] - to value for the comparison window
 * @param {string}   [options.similarity.common]
 * @returns {number|undefined} the most likely charge, or undefined when the zone
 * holds less than 2 peaks and no isotopologue distance can be measured
 */

const NEUTRON_MASS = 1;

export function getPeakChargeBySimilarity(spectrum, targetMass, options = {}) {
  if (!spectrum || spectrum.data.x.length === 0) {
    throw new Error(
      'You need to add an experimental spectrum first using setMassSpectrum',
    );
  }

  // for a centroid spectrum every point is a peak, so this keeps the historical
  // behaviour, while a continuous spectrum is reduced to its real maxima
  return getChargeFromPeaks(spectrum.getPeaks({ threshold: 0 }), targetMass, {
    minIntensity: getMinIntensity(spectrum, options),
    ...options,
  });
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

/**
 * Evaluate the charge of a peak against a list of peaks.
 *
 * This is where the charge is really evaluated: `getPeakChargeBySimilarity`
 * peak picks a spectrum first, `getPeaksWithCharge` already has the peaks.
 * @param {Array<{x: number, y: number, width?: number}>} peaks - all the peaks,
 * sorted by mass
 * @param {number} targetMass
 * @param {object} [options={}] - same as `getPeakChargeBySimilarity`
 * @returns {number|undefined}
 */
export function getChargeFromPeaks(peaks, targetMass, options = {}) {
  let {
    similarity = {},
    minCharge = 1,
    maxCharge = 10,
    minSeparation = 1,
    minIntensity = 0,
  } = options;
  let { zone = {}, widthFunction, widthBottom, widthTop } = similarity;
  let { low = -0.5, high = 2.5 } = zone;

  let width = {
    bottom: widthBottom,
    top: widthTop,
  };

  similarity = structuredClone(similarity);
  similarity.common = 'second';

  // the position of a maximum of the noise is random: it would be compared with
  // the theoretical isotopologues like a real one and give a charge to what is
  // only noise. Peaks under `minIntensity` take no part in the comparison.
  if (minIntensity > 0) {
    const significant = [];
    for (let i = 0; i < peaks.length; i++) {
      if (peaks[i].y >= minIntensity) significant.push(peaks[i]);
    }
    peaks = significant;
  }

  // a single peak carries no isotopologue distance, so no charge can be evaluated
  let peaksInZone = [];
  for (let i = 0; i < peaks.length; i++) {
    const mass = peaks[i].x;
    if (mass < targetMass + low) continue;
    if (mass > targetMass + high) break;
    peaksInZone.push(peaks[i]);
  }
  if (peaksInZone.length < 2) return undefined;

  // the isotopologues of a charge are NEUTRON_MASS / charge apart: a peak wider
  // than that distance can not show them, whatever the theoretical pattern it
  // happens to look like. A centroid has no width and is not concerned.
  let observedPeak = getClosestPeak(peaksInZone, targetMass);
  let maxResolvableCharge = observedPeak?.width
    ? Math.ceil(NEUTRON_MASS / (observedPeak.width * minSeparation)) - 1
    : Number.POSITIVE_INFINITY;

  let experimentalData = getDataXY(peaks);

  let similarityProcessor = new Comparator(similarity);
  similarityProcessor.setPeaks1([experimentalData.x, experimentalData.y]);

  if (widthFunction && typeof widthFunction === 'string') {
    // eslint-disable-next-line no-new-func
    widthFunction = new Function('mass', widthFunction);
    let checkTopBottom = widthFunction(123);
    if (!checkTopBottom.bottom || !checkTopBottom.top) {
      throw new Error(
        'widthFunction should return an object with bottom and top properties',
      );
    }
  }

  let fromCharge =
    minCharge * maxCharge > 0
      ? Math.round(Math.min(Math.abs(minCharge), Math.abs(maxCharge)))
      : 1;
  let toCharge = Math.round(Math.max(Math.abs(minCharge), Math.abs(maxCharge)));

  if (maxResolvableCharge < fromCharge) return undefined;
  toCharge = Math.min(toCharge, maxResolvableCharge);

  let fromIsotope = Math.ceil(low);
  let toIsotope = Math.floor(high);
  let isotopeHeight = 1 / (toIsotope - fromIsotope + 1);

  let results = [];

  for (let charge = fromCharge; charge < toCharge + 1; charge++) {
    let isotopePositions = { x: [], y: [] };
    for (
      let isotopePosition = fromIsotope;
      isotopePosition < toIsotope + 1;
      isotopePosition++
    ) {
      isotopePositions.x.push(
        targetMass + (isotopePosition * NEUTRON_MASS) / charge,
      );
      isotopePositions.y.push(isotopeHeight);
    }
    let from = targetMass + low / Math.abs(charge);
    let to = targetMass + high / Math.abs(charge);
    similarityProcessor.setFromTo(from, to);
    if (widthFunction) {
      width = widthFunction(targetMass);
      similarityProcessor.setTrapezoid(width.bottom, width.top);
    }

    similarityProcessor.setPeaks2([isotopePositions.x, isotopePositions.y]);
    let result = similarityProcessor.getSimilarity();

    results.push({ charge, similarity: result.similarity });
  }

  return results.toSorted((a, b) => b.similarity - a.similarity)[0].charge;
}

/**
 * Peak of the zone that is the closest to the observed mass.
 * @param {Array<{x: number, width: number}>} peaks
 * @param {number} targetMass
 * @returns {{x: number, width: number}|undefined}
 */
function getClosestPeak(peaks, targetMass) {
  let closest;
  let smallestDistance = Number.POSITIVE_INFINITY;
  for (let i = 0; i < peaks.length; i++) {
    const distance = Math.abs(peaks[i].x - targetMass);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = peaks[i];
    }
  }
  return closest;
}

// evaluating the charge of a selection of peaks calls the code above once per
// peak with the same list, and the comparator wants it as two arrays
const dataXYCache = new WeakMap();

/**
 * @param {Array<{x: number, y: number}>} peaks
 * @returns {{x: number[], y: number[]}}
 */
function getDataXY(peaks) {
  let cached = dataXYCache.get(peaks);
  if (cached) return cached;
  const x = [];
  const y = [];
  for (let i = 0; i < peaks.length; i++) {
    x.push(peaks[i].x);
    y.push(peaks[i].y);
  }
  cached = { x, y };
  dataXYCache.set(peaks, cached);
  return cached;
}
