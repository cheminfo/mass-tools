import { applyReactions } from 'openchemlib-utils';

import { cid } from './database/collisionInducedDissociation';
import { insertMfInfoFragments } from './utils/insertMfInfoFragments';

const databases = {
  cid,
};
export function reactionFragmentation(molecule, options = {}) {
  const { database = 'cid', mode = 'positive', maxDepth = 10 } = options;
  let reactions = databases[database][mode];
  let fragmentation = applyReactions([molecule], reactions, maxDepth);
  let { masses, tree } = insertMfInfoFragments(fragmentation);
  return {
    masses,
    tree,
  };
}
