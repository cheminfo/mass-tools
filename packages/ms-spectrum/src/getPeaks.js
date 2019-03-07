'use strict';

/**
 * Filter the array of peaks
 * @param {array} peaks - array of all the peaks
 * @param {object} [options={}]
 * @param {number} [options.from] - min X value of the window to consider
 * @param {number} [options.to] - max X value of the window to consider
 * @param {number} [options.threshold=0.01] - minimal intensity compare to base peak
 * @returns {array} - copy of peaks with 'close' annotation
 */

function getPeaks(peaks, options = {}) {
  const {
    from = peaks.reduce(
      (previous, peak) => Math.min(peak.x, previous),
      Number.MAX_SAFE_INTEGER
    ),
    to = peaks.reduce(
      (previous, peak) => Math.max(peak.x, previous),
      Number.MIN_SAFE_INTEGER
    ),
    threshold = 0.01
  } = options;
  let maxY = Number.MIN_SAFE_INTEGER;
  for (let peak of peaks) {
    if (peak.y > maxY) maxY = peak.y;
  }
  let minY = maxY * threshold;

  return peaks.filter((peak) => peak.x >= from && peak.x <= to && peak.y >= minY);
}

module.exports = getPeaks;
