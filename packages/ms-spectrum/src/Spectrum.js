import { isAnyArray } from 'is-any-array';
import {
  xMaxValue,
  xMinMaxValues,
  xMinValue,
  xNormed,
  xSum,
  xyMaxY,
} from 'ml-spectra-processing';
import { parseXY } from 'xy-parser';

import { getBestPeaks } from './getBestPeaks.js';
import { getChargeClusters } from './getChargeClusters.js';
import { getFragmentPeaks } from './getFragmentPeaks.js';
import { getMassRemainder } from './getMassRemainder.js';
import {
  getMinIntensity,
  getPeakChargeBySimilarity,
} from './getPeakChargeBySimilarity.js';
import { getPeaks } from './getPeaks.js';
import { getPeaksWithCharge } from './getPeaksWithCharge.js';
import { isContinuous } from './isContinuous.js';
import { peakPicking } from './peakPicking.js';
import { peaksWidth } from './peaksWidth.js';

const defaultData = { x: [], y: [] };

/**
 * Class dealing with mass spectra and peak picking
 */
export class Spectrum {
  /**
   *
   * @param {import('cheminfo-types').DataXY} data
   * @param {object} [options={}]
   * @param {number} [options.threshold=0.00025]
   * @param {number} [options.noiseFactor=3] - peaks under `median + noiseFactor * sd`
   * of the noise are ignored when peak picking a continuous spectrum. Set it to 0
   * to let the peak picking decide by itself.
   */
  constructor(data = defaultData, options = {}) {
    if (
      typeof data !== 'object' ||
      !isAnyArray(data.x) ||
      !isAnyArray(data.y)
    ) {
      throw new TypeError('Spectrum data must be an object with x:[], y:[]');
    }
    this.data = { ...data };
    this.options = { threshold: 0.00025, noiseFactor: 3, ...options };
    Object.defineProperty(this.data, 'xOriginal', {
      enumerable: false,
      writable: true,
    });

    /**
     * someProperty is an example property that is set to `true`
     * @type {array}
     * @public
     */
    this.peaks = [];
    this.clearCache();
  }

  /**
   * Forget everything that was derived from the data. Has to be called by any
   * method changing `data`, otherwise the peaks, the sums or the min / max
   * values would still describe the previous data.
   * @returns {this}
   */
  clearCache() {
    this.cache = {};
    this.peaks = [];
    this.continuous = undefined;
    this.info =
      this.data && this.data.x.length > 0
        ? {
            minX: xMinValue(this.data.x),
            maxX: xMaxValue(this.data.x),
            minY: xMinValue(this.data.y),
            maxY: xMaxValue(this.data.y),
          }
        : {
            minX: Number.NaN,
            maxX: Number.NaN,
            minY: Number.NaN,
            maxY: Number.NaN,
          };
    return this;
  }

  minMaxX() {
    return xMinMaxValues(this.data.x);
  }

  /**
   *
   * @param {import('ml-spectra-processing').XYMaxYOptions} options
   * @returns
   */
  maxY(options) {
    return xyMaxY(this.data, options);
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
    return this.clearCache();
  }

  rescaleX(callback) {
    this.ensureOriginalX();

    for (let i = 0; i < this.data.x.length; i++) {
      this.data.x[i] = callback(this.data.xOriginal[i]);
    }

    return this.clearCache();
  }

  ensureOriginalX() {
    if (!this.data.xOriginal) {
      this.data.xOriginal = this.data.x.slice(0);
    }
  }

  normedY(total = 1) {
    this.data.y = xNormed(this.data.y, { value: total });
    return this.clearCache();
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
  getSelectedPeaksWithCharge(selectedPeaks, options = {}) {
    peakPicking(this);
    return getPeaksWithCharge(selectedPeaks, this.peaks, {
      minIntensity: getMinIntensity(this, options),
      ...options,
    });
  }

  /**
   * The isotopologue clusters of the spectrum, from the one holding the most
   * intensity to the one holding the least. To give their charge to the peaks
   * themselves, use `getSelectedPeaksWithCharge`.
   * @param {object} [options={}] - see `getChargeClusters`
   * @param {number} [options.minSignalToNoise=10]
   * @returns {Array<{charge: number, peaks: Array}>}
   */
  getChargeClusters(options = {}) {
    peakPicking(this);
    const minIntensity = getMinIntensity(this, options);
    const peaks = [];
    for (const peak of this.peaks) {
      if (peak.y >= minIntensity) peaks.push(peak);
    }
    return getChargeClusters(peaks, options);
  }

  getPeakChargeBySimilarity(targetMass, options) {
    return getPeakChargeBySimilarity(this, targetMass, options);
  }

  getPeaks(options) {
    peakPicking(this);
    return getPeaks(this.peaks, options);
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
