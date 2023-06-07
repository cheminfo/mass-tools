import { IsotopicDistribution } from 'isotopic-distribution';
import { generateMFs } from 'mf-generator';
import { fcnnlsVector } from 'ml-fcnnls';
import { Matrix } from 'ml-matrix';
import { xyArrayAlignToFirst, xNormed } from 'ml-spectra-processing';
/**
 *
 * @param {import('ms-spectrum').Spectrum} spectrum
 * @param {Array} ranges
 * @param {object} [options={}]
 * @param {number} [options.threshold=0.001]
 * @param {string|Function} [options.peakWidthFct=()=>0.01]
 * @param {import('cheminfo-types').Logger} [options.logger]
 * @param {string}   [options.ionizations=''] - Comma separated list of ionizations (to charge the molecule)
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

  const { threshold = 0.001, filter, ionizations, logger } = options;
  if (!ionizations) {
    logger?.warn(
      'No ionizations provided this could be an error if the molecule is not naturally charged.',
    );
  }

  const peakWidthFct = getPeakWidthFct(options);
  const centroids = getCentroids(spectrum, { threshold });

  let mfs = await generateMFs(ranges, { filter, ionizations });
  mfs = addIsotopicDistributionAndCheckMF(mfs, { logger, peakWidthFct });

  const combined = buildCombined(centroids, mfs, { peakWidthFct });
  if (!hasOverlap(combined.ys)) {
    throw new Error(
      'Could not find any overlaping peaks between experimental and theoretical spectrum.',
    );
  }

  // Time to make the NNMF
  const A = new Matrix(combined.ys.slice(1));
  const At = A.transpose();
  const b = Array.from(combined.ys[0]); // target

  const w = fcnnlsVector(At, b);
  const W = new Matrix([w]); // weights

  // now that we know all the weights we need to reconstruct the spectrum to check if it looks ok
  const reconstructed = W.mmul(A).getRow(0);

  const relativeIntensity = xNormed(w);

  for (let i = 0; i < mfs.length; i++) {
    mfs[i].weight = w[i];
    mfs[i].relative = relativeIntensity[i];
    mfs[i].distribution.y = mfs[i].distribution.y.map((y) => y * w[i]);
  }

  return {
    reconstructed: {
      x: combined.x,
      y: reconstructed,
    },
    mfs,
  };
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
    try {
      mf.distribution = isotopicDistribution.getXY({ sumValue: 1 });
    } catch (e) {
      logger?.warn(
        'Problem with isotopic distribution calculation. Negative number of atoms ?',
      );
    }
  }

  mfs = mfs.filter((mf) => mf.distribution);

  if (mfs.length === 0) {
    throw new Error('No MF found. Did you forget ionization ?');
  }
  return mfs;
}

/**
 *
 * @param {object} [options ={}]
 * @param {string|Function} [options.peakWidthFct=()=>0.01]
 * @param {import('cheminfo-types').Logger} [options.logger]
 * @param {number} [options.precision=0]
 * @returns
 */
function getPeakWidthFct(options = {}) {
  const { logger, precision = 0, peakWidthFct } = options;
  if (peakWidthFct instanceof Function) {
    return peakWidthFct;
  }
  if (!peakWidthFct) {
    return () => 0.01;
  }
  try {
    // eslint-disable-next-line no-new-func
    return new Function(
      'mass',
      `return ${peakWidthFct} + ${precision} * mass / 1e6`,
    );
  } catch (e) {
    logger?.warn(`error in peakWidthFct: ${e.toString()}`);
    return () => 0.01;
  }
}

function buildCombined(centroids, mfs, options = {}) {
  const { peakWidthFct } = options;
  if (!peakWidthFct) {
    throw new Error('peakWidthFct is mandatory');
  }

  const data = [centroids];
  mfs.forEach((mf) => data.push(mf.distribution));

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
