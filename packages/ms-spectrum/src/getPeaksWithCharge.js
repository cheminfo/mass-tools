import { getChargeFromPeaks } from './getPeakChargeBySimilarity.js';

/**
 * Evaluate the charge of a selection of peaks.
 *
 * The charge of one peak is evaluated by `getChargeFromPeaks`, the same code
 * `getPeakChargeBySimilarity` uses: the two used to be separate implementations
 * of the same idea and did not agree with each other.
 *
 * A peak whose charge can not be evaluated, because the isotopologues are not
 * resolved or because there is nothing else in the zone, gets no `charge` at
 * all rather than a default one.
 * @param {Array} selectedPeaks - peaks to evaluate
 * @param {Array} allPeaks - all the peaks of the spectrum, sorted by mass
 * @param {object} [options={}]
 * @param {number} [options.min=1] - lowest charge to consider
 * @param {number} [options.max=10] - highest charge to consider
 * @param {number} [options.low=-0.5] - lowest isotopologue of the comparison zone
 * @param {number} [options.high=2.5] - highest isotopologue of the comparison zone
 * @param {number} [options.precision=100] - tolerance on the position of an
 * isotopologue, in ppm
 * @param {number} [options.minSeparation=1] - a charge is only evaluated if the
 * peak is narrower than `minSeparation` times the distance between its
 * isotopologues
 * @returns {Array} copy of `selectedPeaks`, with a `charge` when it could be evaluated
 */
export function getPeaksWithCharge(selectedPeaks, allPeaks, options = {}) {
  const {
    precision = 100,
    low = -0.5,
    high = 2.5,
    min: minCharge = 1,
    max: maxCharge = 10,
    minSeparation = 1,
    minIntensity = 0,
  } = options;

  const peaksWithCharge = [];
  for (const peak of selectedPeaks) {
    // a peak that is itself in the noise gets no charge, even when real peaks
    // of its neighbourhood would have given one
    if (minIntensity > 0 && peak.y < minIntensity) {
      peaksWithCharge.push({ ...peak });
      continue;
    }
    // the tolerance is relative, so it has to be evaluated at each mass
    const tolerance = precision * 1e-6 * peak.x;
    const charge = getChargeFromPeaks(allPeaks, peak.x, {
      minCharge,
      maxCharge,
      minSeparation,
      minIntensity,
      similarity: {
        zone: { low, high },
        widthBottom: tolerance,
        widthTop: tolerance,
      },
    });
    peaksWithCharge.push(
      charge === undefined ? { ...peak } : { ...peak, charge },
    );
  }
  return peaksWithCharge;
}
