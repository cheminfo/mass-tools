'use strict';

const max = require('ml-array-max/lib/index.js');
const normed = require('ml-array-normed/lib/index.js');
const { parseXY } = require('xy-parser');

const getBestPeaks = require('./getBestPeaks');
const getMassRemainder = require('./getMassRemainder');
const getPeakChargeBySimilarity = require('./getPeakChargeBySimilarity');
const getPeaks = require('./getPeaks');
const isContinuous = require('./isContinuous');
const peakPicking = require('./peakPicking');
const peaksWidth = require('./peaksWidth');

function Spectrum(data = { x: [], y: [] }) {
  if (
    typeof data !== 'object' ||
    !Array.isArray(data.x) ||
    !Array.isArray(data.y)
  ) {
    throw new TypeError('Spectrum data must be an object with x:[], y:[]');
  }
  this.data = {}; // we make a copy so that we can add new properties
  for (let key in data) {
    this.data[key] = data[key];
  }
  Object.defineProperty(this.data, 'xOriginal', {
    enumerable: false,
    writable: true,
  });
  this.cache = {};
}

Spectrum.fromPeaks = function fromPeaks(peaks) {
  if (peaks.length === 0) return new Spectrum();
  const data = {};
  for (let key of Object.keys(peaks[0])) {
    data[key] = peaks.map((peak) => peak[key]);
  }
  return new Spectrum(data);
};

Spectrum.fromText = function fromText(text) {
  const data = parseXY(text);
  return new Spectrum(data);
};

Spectrum.prototype.maxY = function maxY() {
  return max(this.data.y);
};

Spectrum.prototype.sumY = function sumY() {
  if (!this.cache.sumY) {
    this.cache.sumY = this.data.y.reduce(
      (previous, current) => previous + current,
      0,
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

Spectrum.prototype.peakPicking = function peakPickingFct() {
  peakPicking(this);
  return this.peaks;
};

Spectrum.prototype.peaksWidth = function peaksWidthFct() {
  peakPicking(this);
  return peaksWidth(this.peaks);
};

Spectrum.prototype.getBestPeaks = (options) => {
  peakPicking(this);
  return getBestPeaks(this.peaks, options);
};

Spectrum.prototype.getPeakChargeBySimilarity = (targetMass, options) => {
  return getPeakChargeBySimilarity(this, targetMass, options);
};

Spectrum.prototype.getPeaks = function getPeaksFct(options) {
  peakPicking(this);
  return getPeaks(this.peaks, options);
};

Spectrum.prototype.isContinuous = function isContinuousFct() {
  return isContinuous(this);
};

/**
 * Remove an integer number of time the specifiedd monoisotopic mass
 * Mass remainder analysis (MARA): https://doi.org/10.1021/acs.analchem.7b04730
 */
Spectrum.prototype.getMassRemainder = function getMassRemainderFct(
  mass,
  options = {},
) {
  return getMassRemainder(this.data, mass, options);
};

Spectrum.JsGraph = Spectrum.prototype.JsGraph = require('./jsgraph/index');

module.exports = Spectrum;
