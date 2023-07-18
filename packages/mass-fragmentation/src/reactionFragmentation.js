import { applyReactions } from 'openchemlib-utils';

import { cid } from './database/collisionInducedDissociation';
import { insertMfInfoFragments } from './utils/insertMfInfoFragments';

const databases = {
  cid,
};
/**
 * @description Fragment a molecule by applying reactions from a custom database of reactions
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @param {Object}  [options={}]
 * @param {string}  [options.database='cid'] - The database to be used
 * @param {string}  [options.mode='positive'] - The mode to be used
 * @param {number}  [options.maxDepth=5] - The maximum depth of the fragmentation tree
 * @returns {object} In-Silico fragmentation results with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees
 * - products: array of trees grouped by product idCode
 */
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
