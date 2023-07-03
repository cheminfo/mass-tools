import { MF } from 'mf-parser';
import { applyReactions } from 'openchemlib-utils';

let masses = {};
export function reactionFragmentation(molecule, options = {}) {
  const { database = 'cid', reactions, maxDepth } = options;

  let fragmentation = applyReactions([molecule], reactions, maxDepth);

  for (let fragment of fragmentation) {
    mfInfoFragments(fragment);
  }
  return {
    masses: Object.keys(masses).map(Number),
    tree: fragmentation,
  };
}

function mfInfoFragments(reaction) {
  if (reaction?.reactant) {
    reaction.reactant.monoisotopicMass = new MF(
      reaction?.reactant.mf,
    ).getInfo().monoisotopicMass;
    reaction.reactant.monoisotopicMass =
      Math.round(reaction.reactant.monoisotopicMass * 10000) / 10000;
    masses[reaction.reactant.monoisotopicMass] = true;
  }

  if (reaction?.products?.length > 0) {
    for (let product of reaction.products) {
      if (product.children && product.children.length > 0) {
        for (let child of product.children) {
          mfInfoFragments(child);
        }
      }
      product.monoisotopicMass = new MF(product.mf).getInfo().monoisotopicMass;
      product.monoisotopicMass =
        Math.round(product.monoisotopicMass * 10000) / 10000;
      masses[product.monoisotopicMass] = true;
    }
  }
}
