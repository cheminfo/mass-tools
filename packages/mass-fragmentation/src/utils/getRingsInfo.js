/**
 * This function returns ringBond, and object that contains information about the bonds of each ring
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @returns Information of ring bonds for each ring in the molecule
 */

export function getRingsInfo(molecule) {
  const ringSet = molecule.getRingSet();
  let ringBonds = [];
  // create a new array with the length of the number of bonds in the molecule and fills it with 0
  let nbRingForBonds = new Array(molecule.getAllBonds()).fill(0);

  for (let i = 0; i < ringSet.getSize(); i++) {
    for (let bond of ringSet.getRingBonds(i)) {
      nbRingForBonds[bond]++;
    }
  }

  for (let i = 0; i < ringSet.getSize(); i++) {
    ringBonds.push({
      bonds: ringSet.getRingBonds(i).map((bondIndex) => ({
        index: bondIndex,
        ringIndex: i,
        nbRings: nbRingForBonds[bondIndex], // in how many rings this bond is included
        order: molecule.getBondOrder(bondIndex),
        isAromatic: ringSet.isAromatic(i),
        atom1: molecule.getBondAtom(0, bondIndex),
        atom2: molecule.getBondAtom(1, bondIndex),
      })),
    });
  }

  return ringBonds;
}
