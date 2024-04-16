import { isAnyArray } from 'is-any-array';
import {
  xMaxValue,
  xMinMaxValues,
  xNormed,
  xSum,
  xMinValue,
} from 'ml-spectra-processing';
import { parseXY } from 'xy-parser';

import { getBestPeaks } from './getBestPeaks';
import { getFragmentPeaks } from './getFragmentPeaks';
import { getMassRemainder } from './getMassRemainder';
import { getPeakChargeBySimilarity } from './getPeakChargeBySimilarity';
import { getPeaks } from './getPeaks';
import { getPeaksWithCharge } from './getPeaksWithCharge.js';
import { isContinuous } from './isContinuous';
import { peakPicking } from './peakPicking';
import { peaksWidth } from './peaksWidth';

/**
 * Class dealing with mass spectra and peak picking
 */
export class Spectrum {
  /**
   *
   * @param {import('cheminfo-types').DataXY} data
   * @param {object} [options={}]
   * @param {number} [options.threshold=0.00025]
   */
  constructor(data = { x: [], y: [] }, options = {}) {
    if (
      typeof data !== 'object' ||
      !isAnyArray(data.x) ||
      !isAnyArray(data.y)
    ) {
      throw new TypeError('Spectrum data must be an object with x:[], y:[]');
    }
    this.data = { ...data };
    this.options = { threshold: 0.00025, ...options };
    Object.defineProperty(this.data, 'xOriginal', {
      enumerable: false,
      writable: true,
    });
    if (this.data && this.data.x.length > 0) {
      this.info = {
        minX: xMinValue(this.data.x),
        maxX: xMaxValue(this.data.x),
        minY: xMinValue(this.data.y),
        maxY: xMaxValue(this.data.y),
      };
    } else {
      this.info = {
        minX: NaN,
        maxX: NaN,
        minY: NaN,
        maxY: NaN,
      };
    }

    this.cache = {};
    /**
     * someProperty is an example property that is set to `true`
     * @type {array}
     * @public
     */
    this.peaks = [];
  }

  minMaxX() {
    return xMinMaxValues(this.data.x);
  }

  maxY() {
    return xMaxValue(this.data.y);
  }

  sumY() {
    if (!this.cache.sumY) {
      this.cache.sumY = xSum(this.data.y);
    }
    return this.cache.sumY;
  }

  scaleY(intensity = 1) {
    this.data.y = Array.from(
      xNormed(this.data.y, { value: intensity, algorithm: 'max' }),
    );
    return this;
  }

  rescaleX(callback) {
    this.ensureOriginalX();

    for (let i = 0; i < this.data.x.length; i++) {
      this.data.x[i] = callback(this.data.xOriginal[i]);
    }

    return this;
  }

  ensureOriginalX() {
    if (!this.data.xOriginal) {
      this.data.xOriginal = this.data.x.slice(0);
    }
  }

  normedY(total = 1) {
    this.data.y = xNormed(this.data.y, { value: total });
    return this;
  }

  peakPicking() {
    peakPicking(this);
    return this.peaks;
  }

  peaksWidth() {
    peakPicking(this);
    return peaksWidth(this.peaks);
  }

  getBestPeaks(options) {
    peakPicking(this);
    return getBestPeaks(this.peaks, options);
  }

  /**
   * This is a very intensive function so better to calculate it on a selection of peaks
   * @param {Array} selectedPeaks
   * @param {object} [options={}]
   * @param {number} [options.min=1]
   * @param {number} [options.max=10]
   * @param {number} [options.low=-1]
   * @param {number} [options.high=1]
   * @param {number} [options.precision=30]
   * @returns
   */
  getSelectedPeaksWithCharge(selectedPeaks, options) {
    return getPeaksWithCharge(selectedPeaks, this.peaks, options);
  }

  getPeakChargeBySimilarity(targetMass, options) {
    return getPeakChargeBySimilarity(this, targetMass, options);
  }

  getPeaks() {
    peakPicking(this);
    return getPeaks(this.peaks);
  }

  getPeaksAsDataXY(options) {
    peakPicking(this);
    const peaks = getPeaks(this.peaks, options);
    return {
      x: peaks.map((peak) => peak.x),
      y: peaks.map((peak) => peak.y),
    };
  }

  /**
   * Returns also peaks possible for a specific molecular formula
   * @example
   *  const spectrum = new Spectrum({x:[], y:[]})
   *  await spectrum.getFragmentPeaks();
   * @param {string} mf
   * @param {object} options
   * @returns
   */
  getFragmentPeaksFct(mf, options) {
    peakPicking(this);
    return getFragmentPeaks(this.peaks, mf, options);
  }

  isContinuous() {
    return isContinuous(this);
  }

  /**
   * Remove an integer number of time the specifiedd monoisotopic mass
   * Mass remainder analysis (MARA): https://doi.org/10.1021/acs.analchem.7b04730
   */
  getMassRemainderFct(mass, options = {}) {
    return getMassRemainder(this.data, mass, options);
  }
}

export function fromPeaks(peaks) {
  if (peaks.length === 0) return new Spectrum();
  const data = {};
  for (let key of Object.keys(peaks[0])) {
    data[key] = peaks.map((peak) => peak[key]);
  }
  return new Spectrum(data);
}

export function fromText(text, options) {
  const data = parseXY(text);
  return new Spectrum(data, options);
}
