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
import { getChargeLadders } from './getChargeLadders.js';
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
   * @param {string|Array} [options.ionizations='H+'] - the charge carriers a
   * multiply charged species may show, used by `getChargeLadders`. A comma
   * separated list (`'H+,Na+,K+'`) or an array of preprocessed ionizations.
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
    this.options = {
      threshold: 0.00025,
      noiseFactor: 3,
      ionizations: 'H+',
      ...options,
    };
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
   * All the peaks of the spectrum, each carrying the `charge` of the series it
   * belongs to — an isotopologue cluster or, on an unresolved multiply charged
   * species, a charge-state ladder — when one was found. The charges are
   * evaluated once, over all the peaks, and cached; `getSelectedPeaksWithCharge`
   * reads them out of this result rather than recomputing them.
   * @param {object} [options={}]
   * @param {number} [options.min=1] - lowest charge the isotopologue clusters
   * consider
   * @param {number} [options.max=100] - highest charge to consider; shared by the
   * isotopologue clusters and the charge-state ladder (which spans `1` to `max`)
   * @param {number} [options.precision=20] - tolerance on the position of an
   * isotopologue, in ppm
   * @param {number} [options.minLength=3] - shortest series that shows a charge
   * @param {number} [options.minSignalToNoise=10] - on a continuous spectrum a
   * peak under `median + minSignalToNoise * sd` of the noise takes no part in a
   * series; ignored for a centroided spectrum
   * @param {string|Array} [options.ionizations] - the charge carriers a
   * charge-state ladder may show, see `getChargeLadders`. Defaults to the
   * spectrum's `ionizations`
   * @param {object} [options.ladder={}] - options forwarded to `getChargeLadders`,
   * kept apart because a ladder is broader than an isotopologue and needs its own
   * tolerances. `max` above is shared and caps both, so the ladder has no
   * `maxCharge` of its own
   * @param {number} [options.ladder.tolerance=500] - tolerance on the position of
   * the next charge state, in ppm
   * @param {number} [options.ladder.minLength=5] - shortest ladder that shows a
   * charge
   * @param {number} [options.ladder.minRelativeIntensity=0.05] - peaks under this
   * fraction of the most intense one take no part in the ladders
   * @param {number} [options.maxClusteredFraction=0.2] - the charge-state ladders
   * are ignored when the isotopologue clusters already explain more than this
   * fraction of the significant peaks: a resolved spectrum (where the ladders
   * would only be coincidences) is read from its isotopologues alone
   * @returns {Array} copy of the peaks, with a `charge` when one was found
   */
  getPeaksWithCharge(options = {}) {
    peakPicking(this);
    const merged = {
      minIntensity: getMinIntensity(this, options),
      ionizations: this.options.ionizations,
      ...options,
    };
    if (Object.keys(options).length > 0) {
      return getPeaksWithCharge(this.peaks, merged);
    }
    if (this.cache.peaksWithCharge === undefined) {
      this.cache.peaksWithCharge = getPeaksWithCharge(this.peaks, merged);
    }
    return this.cache.peaksWithCharge;
  }

  /**
   * Give to each of `selectedPeaks` the charge of the peak at the same mass in
   * `getPeaksWithCharge`. A peak matching none keeps no `charge`. Both arrays are
   * sorted by mass, so one pointer walks the precomputed peaks a single time.
   * This only reads the precomputed charges, so both entry points always agree.
   * @param {Array} selectedPeaks - peaks to evaluate
   * @param {object} [options={}] - see `getPeaksWithCharge`
   * @returns {Array} copy of `selectedPeaks` sorted by mass, with a `charge` when
   * one was found
   */
  getSelectedPeaksWithCharge(selectedPeaks, options = {}) {
    const peaks = this.getPeaksWithCharge(options);
    const selected = structuredClone(selectedPeaks).toSorted(
      (a, b) => a.x - b.x,
    );
    let index = 0;
    for (const peak of selected) {
      while (index < peaks.length && peaks[index].x < peak.x) index++;
      if (index < peaks.length && peaks[index].x === peak.x) {
        const { charge } = peaks[index];
        if (charge !== undefined) peak.charge = charge;
      }
    }
    return selected;
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

  /**
   * The charge carriers a multiply charged species may show, tried by
   * `getChargeLadders`. Changing them clears only the caches that depend on
   * them, so the peak picking and the noise estimate are kept.
   * @param {string|Array} ionizations - a comma separated list (`'H+,Na+,K+'`)
   * or an array of preprocessed ionizations
   * @returns {this}
   */
  setIonizations(ionizations) {
    if (ionizations === this.options.ionizations) return this;
    this.options.ionizations = ionizations;
    this.cache.chargeLadders = undefined;
    this.cache.peaksWithCharge = undefined;
    return this;
  }

  /**
   * The charge-state ladders of a multiply charged species (a protein
   * electrospray, ...). Contrary to `getChargeClusters`, which reads the charge
   * on the isotopologues of a single envelope, this reconstructs the neutral
   * mass from a series of peaks of the same molecule ionized a growing number of
   * times by the spectrum's `ionizations`. See `getChargeLadders`.
   * @returns {Array<{mass: number, ionization: string, peaks: Array}>}
   */
  getChargeLadders() {
    peakPicking(this);
    if (this.cache.chargeLadders === undefined) {
      this.cache.chargeLadders = getChargeLadders(this.peaks, {
        ionizations: this.options.ionizations,
      });
    }
    return this.cache.chargeLadders;
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
