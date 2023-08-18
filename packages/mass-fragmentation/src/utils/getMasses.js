/**
 * @description get array of mz from fragmentation trees
 * @param {Array} trees Fragmentation trees
 * @param {Array} products Fragmentation trees grouped by product idCode
 * @returns {object} Object with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees
 * - products: array of trees grouped by product idCode
 */
export function getMasses(trees, products) {
  let masses = {};
  for (let product of products) {
    if (Math.abs(product.charge) > 0) {
      masses[product.mz] = true;
    }
  }
  return {
    masses: Object.keys(masses).map(Number),
    trees,
    products,
  };
}
