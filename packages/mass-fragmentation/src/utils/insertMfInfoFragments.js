import { MF } from 'mf-parser';

/**
 * @description Recursively insert monoisotopic mass information into the fragmentation trees, products and get array of monoisotopic masses
 * @param {Array} trees Fragmentation trees
 * @param {Array} products Fragmentation trees grouped by product idCode
 * @returns {object} Object with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees with monoisotopic mass
 * - products: array of trees grouped by product idCode with monoisotopic mass
 */
export function insertMfInfoFragments(trees, products) {
  let masses = {};
  for (let tree of trees) {
    mfInfoFragments(tree, masses);
  }
  for (let product of products) {
    const productMF = new MF(product.mf);
    product.monoisotopicMass =
      Math.round(
        (productMF.getInfo().observedMonoisotopicMass ??
          productMF.getInfo().monoisotopicMass) * 10000,
      ) / 10000;
  }
  return {
    masses: Object.keys(masses).map(Number),
    trees,
    products,
  };
}

/**
 * @description Recursively insert monoisotopic mass information into the fragmentation trees and get array of monoisotopic masses
 * @param {*} reaction Fragmentation trees
 * @param {*} masses Object with monoisotopic masses
 */
function mfInfoFragments(reaction, masses) {
  if (reaction?.reactant) {
    const reactantMF = new MF(reaction.reactant.mf);
    reaction.reactant.monoisotopicMass =
      Math.round(
        (reactantMF.getInfo().observedMonoisotopicMass ??
          reactantMF.getInfo().monoisotopicMass) * 10000,
      ) / 10000;
    masses[reaction.reactant.monoisotopicMass] = true;
  }

  if (reaction?.products?.length > 0) {
    for (const product of reaction.products) {
      const productMF = new MF(product.mf);
      product.monoisotopicMass =
        Math.round(
          (productMF.getInfo().observedMonoisotopicMass ??
            productMF.getInfo().monoisotopicMass) * 10000,
        ) / 10000;
      masses[product.monoisotopicMass] = true;
      if (product.children?.length > 0) {
        for (const child of product.children) {
          mfInfoFragments(child, masses);
        }
      }
    }
  }
}
