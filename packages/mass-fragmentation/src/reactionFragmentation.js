import { applyReactions } from 'openchemlib-utils';

import getDatabase from './database/getDatabase';
import { insertMfInfoFragments } from './utils/insertMfInfoFragments';

/**
 * @description Fragment a molecule by applying reactions from a custom database of reactions
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @param {Object}  [options={}]
 * @param {string}  [options.databaseName='cid'] - The database to be used
 * @param {string}  [options.mode='positive'] - The mode to be used
 * @param {number}  [options.maxDepth=5] - The maximum depth of the fragmentation tree
 * @returns {object} In-Silico fragmentation results with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees
 * - products: array of trees grouped by product idCode
 */
export function reactionFragmentation(molecule, options = {}) {
  let { databaseName = 'cid', mode = 'positive', maxDepth = 5 } = options;
  let database = getDatabase(databaseName);
  if (!database) {
    throw new Error(`Database ${databaseName} not found`);
  }

  const reactions = database[mode];
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
