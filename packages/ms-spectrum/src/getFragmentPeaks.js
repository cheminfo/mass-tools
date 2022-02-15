'use strict';

const EMDB = require('emdb');
const { MF } = require('mf-parser');

const getPeaks = require('./getPeaks.js');

/**
 * Filter the array of peaks
 * @param {array} peaks - array of all the peaks
 * @param {string} mf - Molecular formula of the parent molecule
 * @param {object} [options={}]
 * @param {number} [options.from] - min X value of the window to consider
 * @param {number} [options.to] - max X value of the window to consider
 * @param {number} [options.threshold=0.01] - minimal intensity compare to base peak
 * @param {number} [options.limit=undefined] - maximal number of peaks (based on intensity)
 * @param {string} [options.ionizations]
 * @param {number} [options.precision]
 * @returns {array} - copy of peaks with 'close' annotation
 */

async function getFragmentPeaks(peaks, mf, options = {}) {
  const { ionizations = '', precision } = options;

  const mfInfo = new MF(mf).getInfo();
  const ranges = Object.keys(mfInfo.atoms)
    .map((key) => `${key}0-${mfInfo.atoms[key]}`)
    .join(' ');
  const emdb = new EMDB();
  peaks = getPeaks(peaks, options);
  for (let peak of peaks) {
    peak.mfs = (
      await emdb.fromMonoisotopicMass(peak.x, {
        precision,
        ranges,
        ionizations,
      })
    ).mfs;
  }
  peaks = peaks.filter((peak) => peak.mfs.length > 0);
  return peaks;
}

module.exports = getFragmentPeaks;
