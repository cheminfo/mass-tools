import { MF } from 'mf-parser';

const masses = {};

export function insertMfInfoFragments(trees,products) {
  for (let tree of trees) {
    mfInfoFragments(tree);

  }
  for(let product of products){
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

function mfInfoFragments(reaction) {
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
      if (product.children?.length > 0) {
        for (const child of product.children) {
          mfInfoFragments(child);
        }
      }
      const productMF = new MF(product.mf);
      product.monoisotopicMass =
        Math.round(
          (productMF.getInfo().observedMonoisotopicMass ??
            productMF.getInfo().monoisotopicMass) * 10000,
        ) / 10000;
      masses[product.monoisotopicMass] = true;
    }
  }
}


