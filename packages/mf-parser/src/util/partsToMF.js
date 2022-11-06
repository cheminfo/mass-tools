import { partToMF } from './partToMF';

export function partsToMF(parts, options) {
  let mf = [];
  for (let part of parts) {
    mf.push(partToMF(part, options));
  }
  return mf.join(' . ');
}
