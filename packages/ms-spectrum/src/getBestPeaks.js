'use strict';

/**
 * Filter the array by taking the higher peaks and only
 * keep one per slot.
 * There are 2 different slots, the smallest one will have the
 * extra annotation `close` to true
 * @param {array} peaks - array of all the peaks
 * @param {object} [options={}]
 * @param {number} [from] - min X value of the window to consider
 * @param {number} [to] - max X value of the window to consider
 * @param {number} [limit=20] - max number of peaks
 * @param {number} [threshold=0.01] - minimal intensity compare to base peak
 * @param {number} [numberSlots=10] - define the number of slots and inderectly the slot width
 * @param {number} [numberCloseSlots=50]
 * @returns {array} - copy of peaks with 'close' annotation
 */

function getBestPeaks(peaks, options = {}) {
  const {
    from = peaks.reduce(
      (previous, peak) => Math.min(peak.x, previous),
      Number.MAX_SAFE_INTEGER
    ),
    to = peaks.reduce(
      (previous, peak) => Math.max(peak.x, previous),
      Number.MIN_SAFE_INTEGER
    ),
    limit = 20,
    threshold = 0.01,
    numberCloseSlots = 50,
    numberSlots = 10
  } = options;
  let slot = (to - from) / numberSlots;
  let closeSlot = (to - from) / numberCloseSlots;
  let selected = peaks
    .filter((peak) => peak.x >= from && peak.x <= to)
    .sort((a, b) => b.y - a.y);
  // we can only take `limit` number of peaks
  let toReturn = [];
  let minY = selected[0].y * threshold;
  peakLoop: for (let peak of selected) {
    if (peak.y < minY) break;
    let close = false;
    for (let existing of toReturn) {
      if (Math.abs(existing.x - peak.x) < closeSlot) {
        continue peakLoop;
      }
      if (Math.abs(existing.x - peak.x) < slot) {
        close = true;
      }
    }
    let newPeak = JSON.parse(JSON.stringify(peak));
    newPeak.close = close;
    toReturn.push(newPeak);
    if (toReturn.length === limit) break;
  }
  return toReturn.sort((a, b) => a.x - b.x);
}

module.exports = getBestPeaks;
