import OCL from 'openchemlib';
import { applyReactions, groupTreesByProducts } from 'openchemlib-utils';

import getDatabase from './database/getDatabase';
import { getMasses } from './utils/getMasses';
/**
 * @description Fragment a molecule by applying reactions from a custom database of reactions
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @param {Object}  [options={}]
 * @param {string}  [options.databaseName='cid'] - The database to be used
 * @param {string}  [options.mode='positive'] - The mode to be used
 * @param {number}  [options.maxDepth=5] - The maximum depth of the fragmentation tree
 * @param {number}  [options.maxIonizationDepth=1] - The maximum depth of the ionization tree
 * @param {Object}  [options.customDatabase={}] - A custom database of reactions
 * @param {Array}  [options.customDatabase.positive] - A custom database of reactions for positive mode
 * @param {Array}  [options.customDatabase.negative] - A custom database of reactions for negative mode
 * @returns {object} In-Silico fragmentation results with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees
 * - products: array of trees grouped by product idCode
 */
export function reactionFragmentation(molecule, options = {}) {
  let {
    databaseName = 'cid',
    mode = 'positive',
    maxDepth = 3,
    maxIonizationDepth = 1,
    customDatabase = {},
  } = options;
  let database;
  let IonizationDb;
  if (customDatabase[mode]) {
    database = customDatabase;
  } else {
    database = getDatabase(databaseName);
  }
  if (!database) {
    throw new Error(`Database ${databaseName} not found`);
  }
  if (databaseName === 'cid') {
    IonizationDb = getDatabase('');
  }
  let results = {};
  const reactions = database[mode];
  if (IonizationDb) {
    const ionizationReactions = IonizationDb[mode];
    let ionizationFragments = applyReactions([molecule], ionizationReactions, {
      maxDepth: maxIonizationDepth,
    });

    for (let tree of ionizationFragments.trees) {
      getMoleculesToFragment(tree, reactions, maxDepth);
    }
    ionizationFragments.products = groupTreesByProducts(
      ionizationFragments.trees,
    );
    results = ionizationFragments;
  } else {
    results = applyReactions([molecule], reactions, {
      maxDepth,
    });
  }

  let { masses, trees, products } = getMasses(results.trees, results.products);
  return {
    masses,
    trees,
    products,
  };
}

function getMoleculesToFragment(tree, reactions, maxDepth) {
  for (let product of tree.products) {
    if (product.children.length === 0) {
      if (product.charge !== 0) {
        let molecule = OCL.Molecule.fromIDCode(product.idCode);
        let fragments = applyReactions([molecule], reactions, {
          maxDepth,
        });
        product.children = fragments.trees;
      }
    } else {
      for (let child of product.children) {
        getMoleculesToFragment(child, reactions, maxDepth);
      }
    }
  }
}
