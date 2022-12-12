import { getRingsInfo } from './getRingsInfo.js';
/**
 * This function returns an array of objects with all combination of 2 bonds who can be fragmented in the same ring
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @returns All combination of 2 bonds who can be fragmented in the same ring
 */
export function getFragmentableRings(molecule) {
  let ringsInfo = getRingsInfo(molecule);
  let fragmentableRingBonds = [];
  for (let ring = 0; ring < ringsInfo.length; ring++) {
    let bonds = ringsInfo[ring].bonds;
    // we prevent to consecutive bonds to be cleaved
    for (let first = 0; first < bonds.length; first++) {
      let end = first === 0 ? bonds.length - 1 : bonds.length;
      for (let second = first + 2; second < end; second++) {
        if (
          bonds[first].order === 1 &&
          bonds[second].order === 1 &&
          !bonds[first].isAromatic &&
          !bonds[second].isAromatic &&
          bonds[first].nbRings < 2 &&
          bonds[second].nbRings < 2
        ) {
          fragmentableRingBonds.push({ bonds: [bonds[first], bonds[second]] });
        }
      }
    }
  }

  return fragmentableRingBonds;
}
