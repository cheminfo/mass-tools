import { cid } from './database/collisionInducedDissociation';
import { applyFragmentationReactions } from './utils/applyFragmentationReactions';
import { applyIonizationReactions } from './utils/applyIonizationReactions';
import { insertMfInfoFragments } from './utils/insertMfInfoFragments';

const databases = {
  cid,
};

//ionizationLevel fix the maximum depth of the ionization reactions in the molecule
export function reactionFragmentation(molecule, options = {}) {
  const {
    database = 'cid',
    mode = 'positive',
    maxDepth = 10,
    ionizationLevel = 1,
  } = options;
  const reactions = databases[database][mode];

  let ionizedFragments = applyIonizationReactions(
    molecule,
    reactions,
    ionizationLevel,
  );
  for (let ionizedFragment of ionizedFragments) {
    applyFragmentationReactions(ionizedFragment, reactions, maxDepth);
  }
  let { masses, tree } = insertMfInfoFragments(ionizedFragments);
  return {
    masses,
    tree,
  };
}
