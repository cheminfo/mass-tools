import { MF } from 'mf-parser';
import { applyReactions } from 'openchemlib-utils';

import { cid } from './database/collisionInducedDissociation';

const databases = {
  cid,
};
let masses = {};
export function reactionFragmentation(molecule, options = {}) {
  const { database = 'cid', mode = 'positive', maxDepth = 10 } = options;
  let reactions = databases[database][mode];
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
    let reactantMF = new MF(reaction?.reactant.mf);
    reaction.reactant.monoisotopicMass =
      reactantMF.getInfo().observedMonoisotopicMass;
    if (reaction.reactant.monoisotopicMass === undefined) {
      reaction.reactant.monoisotopicMass =
        reactantMF.getInfo().monoisotopicMass;
    }
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
      let productMF = new MF(product.mf);
      product.monoisotopicMass = productMF.getInfo().observedMonoisotopicMass;
      if (product.monoisotopicMass === undefined) {
        product.monoisotopicMass = productMF.getInfo().monoisotopicMass;
      }
      product.monoisotopicMass =
        Math.round(product.monoisotopicMass * 10000) / 10000;
      masses[product.monoisotopicMass] = true;
    }
  }
}
