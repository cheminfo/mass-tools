'use strict';

const gsd = require('ml-gsd').gsd;

function peakPicking(spectrum) {
  if (!spectrum.peaks) {
    spectrum.peaks = gsd(spectrum.data.x, spectrum.data.y, {
      noiseLevel: 0,
      minMaxRatio: 0.0,
      realTopDetection: true,
      maxCriteria: true, // inverted:false
      smoothY: false,
      sgOptions: { windowSize: 7, polynomial: 3 }
    });
  }
  return spectrum.peaks;
}

module.exports = peakPicking;
