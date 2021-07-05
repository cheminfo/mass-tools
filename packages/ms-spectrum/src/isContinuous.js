'use strict';

const max = require('ml-array-max');
/**
 * When a spectrum is continous ?
 * - has more than 100 points
 * - deltaX change can not be more than a factor 2
 * - deltaX may not be larger than 0.1
 * - if y is zero it does not count
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.minLength=100]
 * @param {number} [options.relativeHeightThreshold=0.001] // Under this value the
 * @param {number} [options.maxDeltaRatio=3]
 */

function isContinuous(spectrum, options = {}) {
  const {
    minLength = 100,
    maxDeltaRatio = 3,
    relativeHeightThreshold = 0.001,
  } = options;
  const minHeight = max(spectrum.data.y) * relativeHeightThreshold;
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
          if (
            (Math.abs(delta) > 0.1 || ratio < minRadio || ratio > maxRatio) &&
            ys[i] !== 0 &&
            ys[i + 1] !== 0
          ) {
            failed++;
            break;
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

module.exports = isContinuous;
