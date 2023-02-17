import { similarity } from 'ml-distance';
import {
  xIsMonotonic,
  xyArrayAlign,
  xyFilterMinYValue,
  xyFilterTopYValues,
  xySortX,
} from 'ml-spectra-processing';

export class MSComparator {
  /**
   * Create a class that will be able to get the similarity between 2 spectra
   * The similarity is based on 'cosine' similarity. The goal is 2 prepare 2 vectors
   * on which the similarity is calculated.
   * The vectors are created by taking the mass and the intensity of the peaks.
   * @param {object} [options={}]
   * @param {number} [options.nbPeaks] - Before comparing spectra how many peaks should be kept
   * @param {number} [options.minNbCommonPeaks] - Minimum number of peaks in common to consider any similarity
   * @param {number} [options.minIntensity] - What is the minimal relative intensity to keep a peak
   * @param {number} [options.massPower=3] - High power will give more weight to the mass. If you would prefer to observe fragments you should use a number less than 1
   * @param {number} [options.intensityPower=0.6] - How important is the intensity. By default we don't give to much importance to it
   * @param {boolean} [options.requiredY=false] - If true we remove all the peaks that don't have a common y value. Similarity will therefore usually be much higher
   * @param {number|Function} [options.delta=0.1] - Tolerance in Da (u) to consider 2 peaks as aligned. If a function is provided it will be called with the mass of the peak
   */
  constructor(options = {}) {
    this.options = {
      massPower: 3,
      intensityPower: 0.6,
      delta: 0.1,
      ...options,
    };
    this.cache = new WeakMap();
  }

  /**
   *
   * @param {import('cheminfo-types').DataXY} dataXY1
   * @param {import('cheminfo-types').DataXY} dataXY2
   */
  getSimilarity(dataXY1, dataXY2) {
    const data1 = normalizeAndCacheData(this.cache, dataXY1, this.options);
    const data2 = normalizeAndCacheData(this.cache, dataXY2, this.options);
    const aligned = xyArrayAlign([data1, data2], this.options);

    if (this.options.minNbCommonPeaks) {
      let commonPeaks = 0;
      for (let i = 0; i < aligned.ys[0].length; i++) {
        if (aligned.ys[0][i] !== 0 && aligned.ys[1][i] !== 0) {
          commonPeaks++;
        }
      }
      if (commonPeaks < this.options.minNbCommonPeaks) return 0;
    }

    const vector1 = new Float64Array(aligned.x.length);
    const vector2 = new Float64Array(aligned.x.length);
    for (let i = 0; i < aligned.x.length; i++) {
      vector1[i] =
        aligned.x[i] ** this.options.massPower *
        aligned.ys[0][i] ** this.options.intensityPower;
      vector2[i] =
        aligned.x[i] ** this.options.massPower *
        aligned.ys[1][i] ** this.options.intensityPower;
    }

    return similarity.cosine(vector1, vector2);
  }
}

/**
 *
 * @param {WeakMap} cache
 * @param {import('cheminfo-types').DataXY} dataXY
 * @param {object} [options={}]
 * @param {number} [options.nbPeaks]
 * @param {number} [options.minIntensity]
 */
function normalizeAndCacheData(cache, dataXY, options = {}) {
  const { nbPeaks, minIntensity } = options;
  if (cache.has(dataXY)) return cache.get(dataXY);

  let data = { ...dataXY };
  if (xIsMonotonic(data.x) !== 1) {
    data = xySortX(data);
  }

  if (minIntensity !== undefined) {
    data = xyFilterMinYValue(data, minIntensity);
  }

  if (nbPeaks !== undefined) {
    data = xyFilterTopYValues(data, nbPeaks);
  }

  cache.set(dataXY, data);
  return data;
}
