/**
 * @description get array of mz from fragmentation nodes
 * @param {Array} nodes valid nodes of fragmentation process
 * @returns {Array}  array of unique mz values

 */
export function getMasses(nodes) {
  let masses = {};
  for (const node of nodes) {
    for (let molecule of node.molecules) {
      if (molecule.info.mz) {
        masses[molecule.info.mz] = true;
      }
    }
  }
  return Object.keys(masses).map(Number);
}
