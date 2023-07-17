import { applyReactions } from 'openchemlib-utils';

import { cid } from './database/collisionInducedDissociation';
//import { applyFragmentationReactions } from './utils/applyFragmentationReactions';
//import { applyIonizationReactions } from './utils/applyIonizationReactions';
import { insertMfInfoFragments } from './utils/insertMfInfoFragments';

const databases = {
  cid,
};

//ionizationLevel fix the maximum depth of the ionization reactions in the molecule
export function reactionFragmentation(molecule, options = {}) {
  let {
    database = 'cid',
    mode = 'positive',
    //   maxDepth = 0,
    //  ionizationLevel = 1,
  } = options;
  /* if (maxDepth === 0) {
    let mass = molecule.getMolecularFormula().absoluteWeight;
    maxDepth = Math.round(mass / 10);
  }
  const reactions = databases[database][mode];
  let ionizedFragments = applyIonizationReactions(
    molecule,
    reactions,
    ionizationLevel,
  );
  for (let ionizedFragment of ionizedFragments) {
    applyFragmentationReactions(ionizedFragment, reactions, maxDepth);
  }*/
  let result = applyReactions(
    [molecule],
    databases[database][mode].filter(
      (reaction) => reaction.Label === 'Ionization',
    ),
    { maxDepth: 3 },
  );
  let { masses, tree } = insertMfInfoFragments(result);
  return {
    masses,
    tree,
  };
}
