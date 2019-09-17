'use strict';

const gsd = require('ml-gsd').gsd;

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
    if (spectrum.isContinuous()) {
      spectrum.peaks = gsd(spectrum.data.x, spectrum.data.y, {
        noiseLevel: 0,
        minMaxRatio: 0.00025, // Threshold to determine if a given peak should be considered as a noise
        realTopDetection: true,
        maxCriteria: true, // inverted:false
        smoothY: false,
        sgOptions: { windowSize: 7, polynomial: 3 }
      });
    } else {
      spectrum.peaks = [];
      let data = spectrum.data;
      for (let i = 0; i < data.x.length; i++) {
        spectrum.peaks.push({
          x: data.x[i],
          y: data.y[i],
          width: 0
        });
      }
    }
    appendPeaksCharge(spectrum.peaks, chargeOptions);
  }

  return spectrum.peaks;
}

module.exports = peakPicking;
