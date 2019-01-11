'use strict';

/**
 * When a spectrum is continous ?
 * - has more than 100 points
 * - deltaX change can not be more than a factor 2
 * - deltaX may not be larger than 0.1
 * - if y is zero it does not count
 * @param {*} spectrum
 */

function isContinuous(spectrum) {
  if (spectrum.continuous === undefined) {
    let xs = spectrum.data.x;
    let ys = spectrum.data.y;
    if (xs.length < 100) {
      spectrum.continuous = false;
    } else {
      let previousDelta = xs[1] - xs[0];
      spectrum.continuous = true;

      for (let i = 0; i < xs.length - 1; i++) {
        let delta = xs[i + 1] - xs[i];
        let ratio = delta / previousDelta;
        if (
          (Math.abs(delta) > 0.1 || ratio < 0.5 || ratio > 2) &&
          ys[i] !== 0 &&
          ys[i + 1] !== 0
        ) {
          spectrum.continuous = false;
          break;
        }
        previousDelta = delta;
      }
    }
  }
  return spectrum.continuous;
}

module.exports = isContinuous;
