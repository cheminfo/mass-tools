import { MF } from 'mf-parser';
import { applyReactions } from 'openchemlib-utils';

let masses = [];
export function reactionFragmentation(molecule, options = {}) {
  const { database = 'cid', reactions, maxDepth } = options;

  let fragmentation = applyReactions([molecule], reactions, maxDepth);
  for (let fragment of fragmentation) {
    mfInfoFragments(fragment);
  }
  return {
    masses,
    tree: fragmentation,
  };
}

function mfInfoFragments(branch) {
  if (branch?.products) {
    for (let product of branch.products) {
      product.monoisotopicMass = new MF(product.mf).getInfo().monoisotopicMass;
      masses.push(product.monoisotopicMass);
      if (product.children && product.children.length > 0) {
        mfInfoFragments(product);
      }
    }
  }
}
