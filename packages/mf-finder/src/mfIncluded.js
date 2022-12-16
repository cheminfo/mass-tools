import { MF } from 'mf-parser';

import { findMFsSync } from './findMFsSync.js';

export function mfIncluded(target, range) {
  let targetEM = new MF(target).getInfo().monoisotopicMass;
  let results = findMFsSync(targetEM, {
    ranges: range,
    allowNeutral: true,
    precision: 0.0000001,
    limit: 1,
  });
  return results.mfs.length > 0;
}
