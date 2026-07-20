import { xMaxValue } from 'ml-spectra-processing';
/**
 * When a spectrum is continous ?
 * - has more than 100 points
 * - deltaX change can not be more than a factor 2
 * - deltaX may not be larger than `maxDeltaX`, or than `maxRelativeDeltaX` times
 *   the mass. A time-of-flight is sampled evenly in time, so its m/z step grows
 *   with the m/z: a MALDI-TOF spectrum is sampled every 0.2 Da around m/z 1000
 *   and every 0.5 Da around m/z 6000, and is still a profile spectrum.
 * - if y is zero it does not count
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.minLength=100]
 * @param {number} [options.relativeHeightThreshold=0.001] // Under this value the
 * @param {number} [options.maxDeltaRatio=3]
 * @param {number} [options.maxDeltaX=0.1] - largest step allowed whatever the mass
 * @param {number} [options.maxRelativeDeltaX=0.0003] - largest step relative to the
 * mass. Under a third of the distance between the isotopologues of a singly
 * charged ion, so that a list of centroids can not pass for a profile.
 */

export function isContinuous(spectrum, options = {}) {
  const {
    minLength = 100,
    maxDeltaRatio = 3,
    relativeHeightThreshold = 0.001,
    maxDeltaX = 0.1,
    maxRelativeDeltaX = 0.0003,
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
          const deltaLimit = Math.max(maxDeltaX, xs[i] * maxRelativeDeltaX);
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
