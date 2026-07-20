import { xMaxValue } from 'ml-spectra-processing';
/**
 * When a spectrum is continous ?
 * - has more than 100 points
 * - deltaX change can not be more than a factor 2
 * - deltaX may not be larger than what `maxDeltaX` allows at that mass
 * - if y is zero it does not count
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.minLength=100]
 * @param {number} [options.relativeHeightThreshold=0.001] // Under this value the
 * @param {number} [options.maxDeltaRatio=3]
 * @param {function} [options.maxDeltaX] - function called with the mass that
 * returns the largest step a profile spectrum may have there. Defaults to
 * `defaultMaxDeltaX`.
 */

export function isContinuous(spectrum, options = {}) {
  const {
    minLength = 100,
    maxDeltaRatio = 3,
    relativeHeightThreshold = 0.001,
    maxDeltaX = defaultMaxDeltaX,
  } = options;
  const minHeight = xMaxValue(spectrum.data.y) * relativeHeightThreshold;
  const minRadio = 1 / maxDeltaRatio;
  const maxRatio = 1 * maxDeltaRatio;
  if (spectrum.continuous === undefined) {
    let xs = spectrum.data.x;
    let ys = spectrum.data.y;
    if (xs.length < minLength) {
      spectrum.continuous = false;
    } else {
      let previousDelta = xs[1] - xs[0];
      spectrum.continuous = true;
      let success = 0;
      let failed = 0;
      for (let i = 0; i < xs.length - 1; i++) {
        if (ys[i] < minHeight || ys[i + 1] < minHeight) {
          previousDelta = 0;
          continue;
        }
        let delta = xs[i + 1] - xs[i];
        if (previousDelta) {
          let ratio = delta / previousDelta;
          const deltaLimit = maxDeltaX(xs[i]);
          if (
            (Math.abs(delta) > deltaLimit ||
              ratio < minRadio ||
              ratio > maxRatio) &&
            ys[i] !== 0 &&
            ys[i + 1] !== 0
          ) {
            failed++;
          } else {
            success++;
          }
        }
        previousDelta = delta;
      }
      if (success / failed < 10) {
        spectrum.continuous = false;
      }
    }
  }
  return spectrum.continuous;
}

/**
 * Largest step a profile spectrum may have around a mass.
 *
 * A time of flight is sampled evenly in time and an orbitrap evenly in
 * frequency, so in both the m/z step grows with the m/z: a MALDI-TOF is sampled
 * every 0.19 Da around m/z 1000 and every 0.47 Da around m/z 6000, and is still
 * a profile spectrum. The step is therefore allowed to grow with the mass,
 * between two bounds:
 * - never under `0.1` Da, so that a spectrum of small molecules keeps the step
 *   it always had
 * - never over `0.6` Da, because the isotopologues of a singly charged ion are
 *   one dalton apart: over that a profile could not describe them, and a list
 *   of centroids would pass for one whatever its mass
 * @param {number} mass
 * @returns {number}
 */
export function defaultMaxDeltaX(mass) {
  return Math.min(0.6, Math.max(0.1, mass * 0.0003));
}
