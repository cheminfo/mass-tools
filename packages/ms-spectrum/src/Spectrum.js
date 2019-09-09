'use strict';

const normed = require('ml-array-normed/lib/index.js');
const max = require('ml-array-max/lib/index.js');
const { parseXY } = require('xy-parser');

const peaksWidth = require('./peaksWidth');
const peakPicking = require('./peakPicking');
const getBestPeaks = require('./getBestPeaks');
const getPeakCharge = require('./getPeakCharge');
const getPeaks = require('./getPeaks');
const isContinuous = require('./isContinuous');

function Spectrum(data = { x: [], y: [] }) {
  if (
    typeof data !== 'object' ||
    !Array.isArray(data.x) ||
    !Array.isArray(data.y)
  ) {
    throw new TypeError('Spectrum data must be an object with x:[], y:[]');
  }
  this.data = {
    x: data.x,
    y: data.y
  };
  Object.defineProperty(this.data, 'xOriginal', {
    enumerable: false,
    writable: true
  });
  this.cache = {};
}

Spectrum.fromText = function fromText(text) {
  const data = parseXY(text, { arrayType: 'xxyy' });
  return new Spectrum({ x: data[0], y: data[1] });
};

Spectrum.prototype.maxY = function maxY() {
  return max(this.data.y);
};

Spectrum.prototype.sumY = function sumY() {
  if (!this.cache.sumY) {
    this.cache.sumY = this.data.y.reduce(
      (previous, current) => previous + current,
      0
    );
  }
  return this.cache.sumY;
};

Spectrum.prototype.scaleY = function scaleY(intensity = 1) {
  let basePeak = this.maxY() / intensity;
  this.data.y = this.data.y.map((y) => y / basePeak);
  return this;
};

Spectrum.prototype.rescaleX = function rescaleX(callback) {
  this.ensureOriginalX();

  for (let i = 0; i < this.data.x.length; i++) {
    this.data.x[i] = callback(this.data.xOriginal[i]);
  }

  return this;
};

Spectrum.prototype.ensureOriginalX = function ensureOriginalX() {
  if (!this.data.xOriginal) {
    this.data.xOriginal = this.data.x.slice(0);
  }
};

Spectrum.prototype.normedY = function normedY(total = 1) {
  this.data.y = normed(this.data.y);
  if (total !== 1) {
    this.data.y = this.data.y.map((y) => y * total);
  }
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

Spectrum.prototype.getPeakCharge = function (targetMass, options) {
  return getBestPeaks(this, targetMass, options);
};

Spectrum.prototype.getPeaks = function (options) {
  peakPicking(this);
  return getPeaks(this.peaks, options);
};

Spectrum.prototype.isContinuous = function () {
  return isContinuous(this);
};

Spectrum.JsGraph = Spectrum.prototype.JsGraph = require('./jsgraph/index');

module.exports = Spectrum;
