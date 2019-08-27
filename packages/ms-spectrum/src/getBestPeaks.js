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
 * @param {number} [searchMonoisotopicRatio=0] - search previous peaks with at least ratio height
 * @param {number} [limit=20] - max number of peaks
 * @param {number} [threshold=0.01] - minimal intensity compare to base peak
 * @param {number} [numberSlots=10] - define the number of slots and indirectly the slot width
 * @param {number} [numberCloseSlots=50]
 * @returns {array} - copy of peaks with 'close' annotation
 */

function getBestPeaks(peaks, options = {}) {
  const {
    searchMonoisotopicRatio = 0,
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
    .map((peak) => {
      return {
        peak,
        monoisotopic: false
      };
    });

  if (searchMonoisotopicRatio) {
    selected = selected.sort((a, b) => b.peak.x - a.peak.x);

    for (let i = 0; i < selected.length; i++) {
      let item = selected[i];
      for (let j = i + 1; j < selected.length; j++) {
        let nextItem = selected[j];
        if (item.peak.x - nextItem.peak.x < 0.09) continue;
        if (item.peak.x - nextItem.peak.x > 1.1) break;
        if (nextItem.peak.y > item.peak.y * searchMonoisotopicRatio) {
          item.monoisotopic = false;
          nextItem.monoisotopic = true;
          break;
        }
      }
    }
  }

  selected = selected.sort((a, b) => {
    if (a.monoisotopic && !b.monoisotopic) return -1;
    if (b.monoisotopic && !a.monoisotopic) return 1;
    return b.peak.y - a.peak.y;
  });

  let toReturn = [];
  if (selected.length === 0) return [];
  let minY = selected[0].peak.y * threshold;
  peakLoop: for (let item of selected) {
    if (item.peak.y < minY) {
      if (item.monoisotopic) {
        continue;
      } else {
        break;
      }
    }
    let close = false;
    for (let existing of toReturn) {
      if (Math.abs(existing.x - item.peak.x) < closeSlot) {
        continue peakLoop;
      }
      if (Math.abs(existing.x - item.peak.x) < slot) {
        close = true;
      }
    }
    let newPeak = JSON.parse(JSON.stringify(item.peak));
    newPeak.close = close;
    toReturn.push(newPeak);
    if (toReturn.length === limit) break;
  }
  return toReturn.sort((a, b) => a.x - b.x);
}

module.exports = getBestPeaks;
