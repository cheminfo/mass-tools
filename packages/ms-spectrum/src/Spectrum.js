'use strict';

const normed = require('ml-array-normed/lib/index.js');
const gsd = require('ml-gsd').gsd;

function Spectrum(data = { x: [], y: [] }) {
  if (
    typeof data !== 'object' ||
    !Array.isArray(data.x) ||
    !Array.isArray(data.y)
  ) {
    throw new TypeError('Spectrum data must be an object with x:[], y:[]');
  }
  this.data = data;
}

Spectrum.prototype.normedY = function () {
  this.data.y = normed(this.data.y);
  return this;
};

Spectrum.prototype.gsd = function () {
  if (!this.peaks) {
    this.peaks = gsd(this.data.x, this.data.y, {
      noiseLevel: 0,
      minMaxRatio: 0.0,
      realTopDetection: true,
      maxCriteria: true, // inverted:false
      smoothY: false,
      sgOptions: { windowSize: 7, polynomial: 3 }
    });
  }
  return this.peaks;
};

module.exports = Spectrum;
