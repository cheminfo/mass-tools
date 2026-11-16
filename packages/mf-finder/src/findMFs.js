import { findMFsSync } from './findMFsSync';

/** @typedef {import('./types').MFFinderResult} MFFinderResult */
/** @typedef {import('./types').MFFinderOptions} MFFinderOptions */

/**
 * @param {number} targetMass - Monoisotopic mass
 * @param {MFFinderOptions} [options={}]
 * @returns {Promise<MFFinderResult>}
 */
export async function findMFs(targetMass, options = {}) {
  return findMFsSync(targetMass, options);
}
