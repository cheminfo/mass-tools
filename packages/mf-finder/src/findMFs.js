import { findMFsSync } from './findMFsSync';

/** @typedef {import('./types').MFResult} MFResult */
/** @typedef {import('./types').MFFinderOptions} MFFinderOptions */

/**
 * @param {number} targetMass - Monoisotopic mass
 * @param {MFFinderOptions} [options={}]
 * @returns {Promise<MFResult[]>}
 */
export async function findMFs(targetMass, options = {}) {
  return findMFsSync(targetMass, options);
}
