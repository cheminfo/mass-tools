'use strict';

const normed = require('ml-array-normed/lib/index.js');
const max = require('ml-array-max/lib/index.js');
const { parseXY } = require('xy-parser');

const peaksWidth = require('./peaksWidth');
const peakPicking = require('./peakPicking');
const getBestPeaks = require('./getBestPeaks');
const isContinuous = require('./isContinuous');

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

Spectrum.fromText = function fromText(text) {
  const data = parseXY(text, { arrayType: 'xxyy' });
  return new Spectrum({ x: data[0], y: data[1] });
};

Spectrum.prototype.maxY = function maxY() {
  return max(this.data.y);
};

Spectrum.prototype.normedY = function normedY() {
  this.data.y = normed(this.data.y);
  return this;
};

Spectrum.prototype.peakPicking = function () {
  peakPicking(this);
  return this.peaks;
};

Spectrum.prototype.peaksWidth = function () {
  peakPicking(this);
  return peaksWidth(this.peaks);
};

Spectrum.prototype.getBestPeaks = function (options) {
  peakPicking(this);
  return getBestPeaks(this.peaks, options);
};

Spectrum.prototype.getPeaks = function (options) {
  peakPicking(this);
  return getBestPeaks(this.peaks, options);
};

Spectrum.prototype.isContinuous = function () {
  return isContinuous(this);
};

Spectrum.JsGraph = Spectrum.prototype.JsGraph = require('./jsgraph/index');

module.exports = Spectrum;
