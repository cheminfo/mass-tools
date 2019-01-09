'use strict';

const gsd = require('ml-gsd').gsd;

function peakPicking(spectrum) {
  if (!spectrum.peaks) {
    spectrum.peaks = gsd(spectrum.data.x, spectrum.data.y, {
      noiseLevel: 0,
      minMaxRatio: 0.00025, // Threshold to determine if a given peak should be considered as a noise
      realTopDetection: true,
      maxCriteria: true, // inverted:false
      smoothY: false,
      sgOptions: { windowSize: 7, polynomial: 3 }
    });
  }

  return spectrum.peaks;
}

module.exports = peakPicking;
