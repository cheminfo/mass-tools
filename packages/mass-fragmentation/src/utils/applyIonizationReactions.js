import OCL from 'openchemlib';
import { applyReactions } from 'openchemlib-utils';

export function applyIonizationReactions(molecule, reactions, ionizationLevel) {
  const ionizationReaction = reactions.filter(
    (reaction) => reaction.Label === 'Ionization',
  );
  let ionization = applyReactions([molecule], ionizationReaction, {
    maxDepth: 1,
  });

  function ionize(reactant, ionizationReactions, currentIonizationLevel) {
    for (let product of reactant.products) {
      if (currentIonizationLevel < ionizationLevel) {
        let currentMolecule = OCL.Molecule.fromIDCode(product.idCode);
        let ionizedFragments = applyReactions(
          [currentMolecule],
          ionizationReactions,
          {
            maxDepth: 1,
          },
        );
        product.children = ionizedFragments;
        currentIonizationLevel = currentIonizationLevel + 1;
        if (product.children.length > 0) {
          for (let child of product.children) {
            ionize(child, ionizationReactions, currentIonizationLevel);
          }
        }
      }
    }
  }

  for (let ionizedFragment of ionization) {
    ionize(ionizedFragment, ionizationReaction, 1);
  }
  return ionization;
}
