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
        if (!masses[molecule.info.mz]) {
          masses[molecule.info.mz] = { ...molecule.info, molecules: [], minDepth: node.depth };
        }
        masses[molecule.info.mz].molecules.push({ idCode: molecule.idCode, molfile: molecule.molfile, depth: node.depth })
        if (masses[molecule.info.mz].minDepth > node.depth) {
          masses[molecule.info.mz].minDepth = node.depth;
        }
      }
    }
  }
  return Object.values(masses);
}
