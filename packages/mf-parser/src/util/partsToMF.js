import { partToMF } from './partToMF';

/** @typedef {import('./partToMF.types').PartToMFOptions} PartToMFOptions */
/** @typedef {import('./toParts.types').ToPartsPart} ToPartsPart */

/**
 * @param {ToPartsPart[][]} parts
 * @param {PartToMFOptions} [options]
 * @return {string}
 */
export function partsToMF(parts, options) {
  let mf = [];
  for (let part of parts) {
    mf.push(partToMF(part, options));
  }
  return mf.join(' . ');
}
