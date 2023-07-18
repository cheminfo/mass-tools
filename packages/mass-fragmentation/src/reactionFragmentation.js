import { applyReactions } from 'openchemlib-utils';

import { cid } from './database/collisionInducedDissociation';
import { insertMfInfoFragments } from './utils/insertMfInfoFragments';

const databases = {
  cid,
};

export function reactionFragmentation(molecule, options = {}) {
  let { database = 'cid', mode = 'positive', maxDepth = 5 } = options;

  const reactions = databases[database][mode];
  let fragments = applyReactions([molecule], reactions, {
    maxDepth,
  });

  let { masses, trees, products } = insertMfInfoFragments(
    fragments.trees,
    fragments.products,
  );
  return {
    masses,
    trees,
    products,
  };
}
