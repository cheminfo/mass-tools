/**
 * @description get array of mz from fragmentation nodes
 * @param {Array} nodes valid nodes of fragmentation process
 * @returns {Array}  array of unique mz values

 */
export function groupByMZ(nodes) {
  let mzs = {};
  for (const node of nodes) {
    for (let molecule of node.molecules) {
      if (molecule.info.mz) {
        if (!mzs[molecule.info.mz]) {
          mzs[molecule.info.mz] = { ...molecule.info, molecules: [] };
        }
        mzs[molecule.info.mz].molecules.push({ idCode: molecule.idCode, molfile: molecule.molfile })
      }
    }
  }
  return Object.values(mzs);
}
