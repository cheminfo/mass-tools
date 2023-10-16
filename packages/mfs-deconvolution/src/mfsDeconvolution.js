import { v4 } from '@lukeed/uuid';
import { IsotopicDistribution } from 'isotopic-distribution';
import { generateMFs } from 'mf-generator';
import { Matrix } from 'ml-matrix';
import { xyArrayAlignToFirst, xNormed, xSum } from 'ml-spectra-processing';

import { getPeakWidthFct } from './getPeakWidthFct';
import { blockFcnnls } from './utils/blockFcnnls.js';

/**
 *
 * @param {import('ms-spectrum').Spectrum} spectrum
 * @param {Array}         ranges
 * @param {object}        [options={}]
 * @param {string}        [options.ionizations=''] - Comma separated list of ionizations (to charge the molecule)
 * @param {object}        [options.mass={}]
 * @param {number}        [options.mass.threshold=0.001]
 * @param {number}        [options.mass.precision=0] -  Precision (accuracy) of the monoisotopic mass in ppm
 * @param {string|Function} [options.mass.peakWidthFct=()=>0.01]
 * @param {import('cheminfo-types').Logger} [options.logger]
 * @param {object}        [options.filter={}]
 * @param {number}        [options.filter.minMass=0] - Minimal monoisotopic mass
 * @param {number}        [options.filter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number}        [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number}        [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {boolean}       [options.filter.absoluteCharge=false] - If true, the charge is absolute (so between 0 and +Infinity by default)
 * @param {boolean}       [options.filter.allowNegativeAtoms=false] - Allow to have negative number of atoms
 * @param {object}        [options.filter.unsaturation={}]
 * @param {number}        [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}        [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {boolean}       [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {boolean}       [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object}        [options.filter.atoms] - object of atom:{min, max}
 * @param {function}      [options.filter.callback] - a function to filter the MF
 * @param {string}        [options.filterFct]
 */
export async function mfsDeconvolution(spectrum, ranges, options = {}) {
  if (!spectrum || !spectrum.getPeaks || !spectrum.getPeaks()) {
    throw new Error('spectrum must be an instance of Spectrum');
  }

  const { mass: massOptions = {}, filter, ionizations, logger } = options;
  const { threshold = 0.001 } = massOptions;
  if (!ionizations) {
    logger?.warn(
      'No ionizations provided this could be an error if the molecule is not naturally charged.',
    );
  }

  const peakWidthFct = getPeakWidthFct(options);
  const centroids = getCentroids(spectrum, { threshold });
  let mfs = await generateMFs(ranges, { filter, ionizations });
  mfs.forEach((mf) => {
    mf.id = v4();
  });
  mfs = addIsotopicDistributionAndCheckMF(mfs, { logger, peakWidthFct });

  mfs.sort((mf1, mf2) => mf1.ms.em - mf2.ms.em);

  const combined = buildCombined(centroids, mfs, { peakWidthFct });

  if (!hasOverlap(combined.ys)) {
    throw new Error(
      'Could not find any overlaping peaks between experimental and theoretical spectra.',
    );
  }

  const { weights, reconstructed } = blockFcnnls(combined.ys);

  const relativeIntensity = xNormed(weights);

  for (let i = 0; i < mfs.length; i++) {
    mfs[i].absoluteQuantity = weights[i];
    mfs[i].relativeQuantity = relativeIntensity[i];
    mfs[i].distribution.y = mfs[i].distribution.y.map((y) => y * weights[i]);
  }

  let matchingScore = 0;
  const difference = [];
  for (let i = 0; i < combined.ys[0].length; i++) {
    matchingScore += Math.min(combined.ys[0][i], reconstructed[i]);
    difference.push(combined.ys[0][i] - reconstructed[i]);
  }
  matchingScore = matchingScore / xSum(combined.ys[0]);

  let A;
  let W;

  return {
    reconstructed: {
      x: combined.x,
      y: reconstructed,
    },
    difference: {
      x: combined.x,
      y: difference,
    },
    mfs: mfs.slice().sort((mf1, mf2) => mf2.absoluteQuantity - mf1.absoluteQuantity),
    matchingScore,
    getFilteredReconstructed,
  };



  function getFilteredReconstructed(ids = mfs.map((mf) => mf.id)) {
    if (!A) A = new Matrix(combined.ys.slice(1));
    if (!W) W = new Matrix([weights]);
    let wClone = W
    if (ids.length !== W.length) {
      wClone = W.clone()
      for (let i = 0; i < mfs.length; i++) {
        if (ids.includes(mfs[i].id)) continue;
        wClone.set(0, i, 0);
      }
    }

    const filteredReconstructed = wClone.mmul(A).getRow(0);
    return {
      x: combined.x,
      y: filteredReconstructed,
    };
  }
}

/**
 *
 * @param {object} spectrum
 * @param {object} [options={}]
 * @param {number} [options.threshold=0.001]
 */
function getCentroids(spectrum, options = {}) {
  const { threshold = 0.001 } = options;
  const peaks = spectrum.getPeaks({
    threshold,
  });
  return {
    x: peaks.map((peak) => peak.x),
    y: peaks.map((peak) => peak.y),
  };
}

function addIsotopicDistributionAndCheckMF(mfs, options) {
  const { logger, peakWidthFct } = options;
  for (let mf of mfs) {
    const isotopicDistribution = new IsotopicDistribution(mf.mf, {
      fwhm: peakWidthFct(mf.ms.em), // when should we join peaks
      ionizations: mf.ms.ionization,
    });
    mf.distribution = isotopicDistribution.getXY({ sumValue: 1 });
    if (mf.distribution.y.length === 0) {
      logger?.warn(
        `Problem with isotopic distribution calculation. Negative number of atoms ? ${mf.mf} ${mf.ms.ionization}`,
      );
    }
  }

  mfs = mfs.filter((mf) => mf.distribution.x.length > 0);
  if (mfs.length === 0) {
    throw new Error('No MF found. Did you forget ionization ?');
  }
  return mfs;
}

function buildCombined(centroids, mfs, options = {}) {
  const { peakWidthFct } = options;
  if (!peakWidthFct) {
    throw new Error('peakWidthFct is mandatory');
  }

  const data = [centroids];
  mfs.forEach((mf) => data.push(mf.distribution));

  // we align all the spectra to the first one but if some values (X) are missing we will add them
  let combined = xyArrayAlignToFirst(data, {
    delta: peakWidthFct,
  });
  return combined;
}

/**
 * We will check if there is any overlap between the theoretical and experimental spectra
 * @param {number[][]} ys
 */
function hasOverlap(ys) {
  for (let i = 0; i < ys[0].length; i++) {
    for (let j = 1; j < ys.length; j++) {
      if (ys[0][i] > 0 && ys[j][i] > 0) {
        return true;
      }
    }
  }
  return false;
}
