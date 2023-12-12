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
   * @param {number[]} [options.selectedMasses] - List of allowed masses.
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
   * Get the similarity between a spectrum and a list of masses.
   * The main issue is that we don't have the intensity of the peaks.
   * So we will use the intensity of the closest peak.
   * @param {import('cheminfo-types').DataXY} dataXY
   * @param {number[]} masses
   */
  getSimilarityToMasses(dataXY, masses) {
    const data1 = normalizeAndCacheData(this.cache, dataXY, this.options);
    const data2 = {
      x: Float64Array.from(masses),
      y: new Float64Array(masses.length).fill(1),
    };

    let aligned;
    if (this.options.selectedMasses?.length > 0) {
      aligned = xyArrayAlign(
        [
          data1,
          data2,
          {
            // this allows to force the selection of some specific masses
            x: Float64Array.from(this.options.selectedMasses),
            y: new Float64Array(this.options.selectedMasses.length).fill(1),
          },
        ],
        {
          delta: this.options.delta,
          requiredY: true,
        },
      );
    } else {
      aligned = xyArrayAlign([data1, data2], {
        delta: this.options.delta,
      });
    }
    // because we don't have any idea of the intensity we will use the intensity of the experimental peak
    // and otherwise we ignore the theoretical peak
    for (let i = 0; i < aligned.ys[0].length; i++) {
      if (aligned.ys[0][i] === 0) {
        aligned.ys[1][i] = 0;
      }
      if (aligned.ys[0][i] > 0 && aligned.ys[1][i] !== 0) {
        aligned.ys[1][i] = aligned.ys[0][i];
      }
    }
    return returnSimilarity(aligned, this.options);
  }

  /**
   *
   * @param {import('cheminfo-types').DataXY} dataXY1
   * @param {import('cheminfo-types').DataXY} dataXY2
   */
  getSimilarity(dataXY1, dataXY2) {
    const data1 = normalizeAndCacheData(this.cache, dataXY1, this.options);
    const data2 = normalizeAndCacheData(this.cache, dataXY2, this.options);

    let aligned;
    if (this.options.selectedMasses?.length > 0) {
      aligned = xyArrayAlign(
        [
          data1,
          data2,
          {
            // this allows to force the selection of some specific masses
            x: Float64Array.from(this.options.selectedMasses),
            y: new Float64Array(this.options.selectedMasses.length).fill(1),
          },
        ],
        {
          delta: this.options.delta,
          requiredY: true,
        },
      );
    } else {
      aligned = xyArrayAlign([data1, data2], {
        delta: this.options.delta,
      });
    }

    return returnSimilarity(aligned, this.options);
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

/**
 * 
 * @param {*} aligned 
 * @param {object} [options={}]
 * @param {number} [options.massPower]
 * @param {number} [options.intensityPower]
 * @param {number} [options.minNbCommonPeaks]

 * @returns 
 */
function returnSimilarity(aligned, options = {}) {
  const { massPower, intensityPower, minNbCommonPeaks } = options;
  let nbCommonPeaks = 0;
  let nbPeaks1 = 0;
  let nbPeaks2 = 0;
  for (let i = 0; i < aligned.ys[0].length; i++) {
    if (aligned.ys[0][i] !== 0) {
      nbPeaks1++;
    }
    if (aligned.ys[1][i] !== 0) {
      nbPeaks2++;
    }
    if (aligned.ys[0][i] !== 0 && aligned.ys[1][i] !== 0) {
      nbCommonPeaks++;
    }
  }
  if (
    nbCommonPeaks === 0 ||
    (minNbCommonPeaks && nbCommonPeaks < minNbCommonPeaks)
  ) {
    return {
      nbCommonPeaks,
      nbPeaks1,
      nbPeaks2,
      tanimoto: 0,
      cosine: 0,
    };
  }

  const vector1 = new Float64Array(aligned.x.length);
  const vector2 = new Float64Array(aligned.x.length);
  for (let i = 0; i < aligned.x.length; i++) {
    vector1[i] = aligned.x[i] ** massPower * aligned.ys[0][i] ** intensityPower;
    vector2[i] = aligned.x[i] ** massPower * aligned.ys[1][i] ** intensityPower;
  }
  return {
    nbCommonPeaks,
    nbPeaks1,
    nbPeaks2,
    tanimoto: nbCommonPeaks / (nbPeaks1 + nbPeaks2 - nbCommonPeaks),
    cosine: similarity.cosine(vector1, vector2),
  };
}
