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
   * @param {number} [options.minIntensity] - What is the minimal relative intensity to keep a peak
   * @param {number} [options.massPower=3] -
   * @param {number} [options.intensityPower=0.6]
   * @param {number|Function} [options.delta=0.1]
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
