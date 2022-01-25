'use strict';

const gsd = require('ml-gsd').gsd;
const { xFindClosestIndex } = require('ml-spectra-processing');

const appendPeaksCharge = require('./appendPeaksCharge');

/**
 * Filter the array of peaks
 * @param {Spectrum} spectrum - array of all the peaks
 * @param {object} [options={}]
 * @param {object} [options.charge={}]
 * @param {number} [options.charge.min=1]
 * @param {number} [options.charge.max=10]
 * @param {number} [options.charge.low=-1]
 * @param {number} [options.charge.high=1]
 * @param {number} [options.charge.precision=30]
 * @returns {array} - copy of peaks with 'close' annotation
 */

function peakPicking(spectrum, options = {}) {
  const { charge: chargeOptions = {} } = options;
  if (!spectrum.peaks) {
    spectrum.peaks = [];
    const keys = Object.keys(spectrum.data).filter(
      (key) => key !== 'x' && key !== 'y',
    );
    if (spectrum.isContinuous()) {
      const gsdPeaks = gsd(spectrum.data, {
        noiseLevel: 0,
        minMaxRatio: 0.00025, // Threshold to determine if a given peak should be considered as a noise
        realTopDetection: true,
        maxCriteria: true, // inverted:false
        smoothY: false,
        sgOptions: { windowSize: 7, polynomial: 3 },
      });
      for (let gsdPeak of gsdPeaks) {
        const peak = { x: gsdPeak.x, y: gsdPeak.y, width: gsdPeak.width };
        const index = xFindClosestIndex(spectrum.data.x, gsdPeak.x);
        for (let key of keys) {
          peak[key] = spectrum.data[key][index];
        }
        spectrum.peaks.push(peak);
      }
    } else {
      spectrum.peaks = [];
      let data = spectrum.data;
      for (let i = 0; i < data.x.length; i++) {
        const peak = {
          x: data.x[i],
          y: data.y[i],
          width: 0,
        };
        for (let key of keys) {
          peak[key] = spectrum.data[key][i];
        }
        spectrum.peaks.push(peak);
      }
    }
    // required and linked to https://github.com/mljs/global-spectral-deconvolution/issues/17
    spectrum.peaks = spectrum.peaks.filter(
      (peak) => !isNaN(peak.x) && !isNaN(peak.y),
    );
    appendPeaksCharge(spectrum.peaks, chargeOptions);
  }

  return spectrum.peaks;
}

module.exports = peakPicking;
