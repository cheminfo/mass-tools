/**
 * @description get array of mz from fragmentation trees
 * @param {Array} trees Fragmentation trees
 * @returns {Array}  array of mz values

 */
export function getMasses(trees) {
  let masses = {};
  for (const tree of trees) {
    getMassesFromTree(tree, masses);
  }
  return Object.keys(masses).map(Number);
}

function getMassesFromTree(currentBranch, masses) {
  for (const molecule of currentBranch.molecules) {
    if (Math.abs(molecule.info.charge) > 0) {
      masses[molecule.info.mz] = true;
    }
  }
  if (currentBranch.children && currentBranch.children.length > 0) {
    for (const child of currentBranch.children) {
      getMassesFromTree(child, masses);
    }
  }
}
