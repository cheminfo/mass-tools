import { xyArrayWeightedMerge } from 'ml-spectra-processing';

/**
 * Reconstruct a mass spectrum from a set of molecular formulas
 * that has the  distribution property
 * @param {object[]} mfs
 * @param {object} [options={}]
 * @param {import('cheminfo-types').Logger} [options.logger]
 * @param {object}        [options.mass={}]
 * @param {number}        [options.mass.precision=0] -  Precision (accuracy) of the monoisotopic mass in ppm
 * @param {string|Function} [options.mass.peakWidthFct=()=>0.01]
 */

import { getPeakWidthFct } from './getPeakWidthFct.js';

export function reconstruct(mfs, options = {}) {
  const delta = getPeakWidthFct(options);

  const data = mfs.map((mf) => mf.distribution);
  const reconstructed = xyArrayWeightedMerge(data, { delta });
  return reconstructed;
}
