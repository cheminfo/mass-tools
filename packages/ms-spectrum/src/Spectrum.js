import { isAnyArray } from 'is-any-array';
import { xMaxValue, xNormed } from 'ml-spectra-processing';
import { parseXY } from 'xy-parser';

import { getBestPeaks } from './getBestPeaks';
import { getFragmentPeaks } from './getFragmentPeaks';
import { getMassRemainder } from './getMassRemainder';
import { getPeakChargeBySimilarity } from './getPeakChargeBySimilarity';
import { getPeaks } from './getPeaks';
import { isContinuous } from './isContinuous';
import { peakPicking } from './peakPicking';
import { peaksWidth } from './peaksWidth';

/**
 * Class dealing with mass spectra and peak picking
 */
export class Spectrum {
  constructor(data = { x: [], y: [] }) {
    if (
      typeof data !== 'object' ||
      !isAnyArray(data.x) ||
      !isAnyArray(data.y)
    ) {
      throw new TypeError('Spectrum data must be an object with x:[], y:[]');
    }
    this.data = { ...data };
    Object.defineProperty(this.data, 'xOriginal', {
      enumerable: false,
      writable: true,
    });
    this.cache = {};
    this.peaks = [];
  }

  maxY() {
    return xMaxValue(this.data.y);
  }

  sumY() {
    if (!this.cache.sumY) {
      this.cache.sumY = this.data.y.reduce(
        (previous, current) => previous + current,
        0,
      );
    }
    return this.cache.sumY;
  }

  scaleY(intensity = 1) {
    let basePeak = this.maxY() / intensity;
    this.data.y = this.data.y.map((y) => y / basePeak);
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
    this.data.y = xNormed(this.data.y);
    if (total !== 1) {
      this.data.y = this.data.y.map((y) => y * total);
    }
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

  getPeakChargeBySimilarity(targetMass, options) {
    return getPeakChargeBySimilarity(this, targetMass, options);
  }

  getPeaks(options) {
    peakPicking(this);
    return getPeaks(this.peaks, options);
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

export function fromText(text) {
  const data = parseXY(text);
  return new Spectrum(data);
}
