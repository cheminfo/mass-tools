'use strict';

const normed = require('ml-array-normed/lib/index.js');

const peakPicking = require('./peakPicking');

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

Spectrum.prototype.peakPicking = function () {
  peakPicking(this);
  return this.peaks;
};

module.exports = Spectrum;
