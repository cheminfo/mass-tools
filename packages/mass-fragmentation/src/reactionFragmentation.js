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
 * @param {boolean}  [options.getProductsTrees=false] - If true, the products trees are returned else products is an empty array
 * @param {number}  [options.limitReactions=200] - The maximum number of reactions to be applied
 * @param {number}  [options.maxIonizationDepth=1] - The maximum depth of the ionization tree
 * @param {Object}  [options.customDatabase={}] - A custom database of reactions
 * @param {Array}  [options.customDatabase.positive] - A custom database of reactions for positive mode
 * @param {Array}  [options.customDatabase.negative] - A custom database of reactions for negative mode
 * @param {Object}  [options.customDatabase.ionization] - A custom database ionization reactions
 * @param {Array}  [options.customDatabase.ionization.positive] - A custom database of ionization reactions for positive mode
 * @param {Array}  [options.customDatabase.ionization.negative] - A custom database of ionization reactions for negative mode
 * @returns {object} In-Silico fragmentation results with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees
 * - products: array of trees grouped by product idCode
 */
export function reactionFragmentation(molecule, options = {}) {
  let {
    databaseName = 'cid',
    mode = 'positive',
    maxDepth = 5,
    maxIonizationDepth = 1,
    getProductsTrees = false,
    customDatabase = {},
    limitReactions = 200,
  } = options;
  let database;
  let IonizationDb;
  if (customDatabase[mode] && customDatabase[mode].length > 0) {
    database = customDatabase;
  } else {
    database = getDatabase(databaseName);
  }
  if (!database) {
    throw new Error(`Database ${databaseName} not found`);
  }
  if (databaseName === 'cid') {
    if (
      customDatabase.ionization &&
      customDatabase.ionization[mode].length > 0
    ) {
      IonizationDb = customDatabase.ionization[mode];
    } else {
      IonizationDb = getDatabase('')[mode];
    }
  }
  let results = {};
  const reactions = database[mode];
  if (IonizationDb) {
    let ionizationFragments = {
      trees: [],
      products: [],
    };
    for (
      let currentMaxIonizationDepth = 1;
      currentMaxIonizationDepth <= maxIonizationDepth;
      currentMaxIonizationDepth++
    ) {
      let ionizationLevelResult = applyReactions([molecule], IonizationDb, {
        maxDepth: currentMaxIonizationDepth,
        limitReactions,
      });
      // add array to ionizationfragments.trees
      // @ts-ignore
      ionizationFragments.trees.push(...ionizationLevelResult.trees);
      // @ts-ignore
      ionizationFragments.products.push(...ionizationLevelResult.products);
    }
    for (let tree of ionizationFragments.trees) {
      getMoleculesToFragment(tree, reactions, maxDepth, limitReactions);
    }

    if (getProductsTrees) {
      // @ts-ignore
      ionizationFragments.products = groupTreesByProducts(
        ionizationFragments.trees,
      );
    }
    results = ionizationFragments;
  } else {
    results = applyReactions([molecule], reactions, {
      maxDepth,
      limitReactions,
    });
  }

  let { masses, trees, products } = getMasses(results.trees, results.products);
  return {
    masses,
    trees,
    products,
  };
}

function getMoleculesToFragment(tree, reactions, maxDepth, limitReactions) {
  for (let product of tree.products) {
    if (product.children.length === 0) {
      if (product.charge !== 0) {
        let molecule = OCL.Molecule.fromIDCode(product.idCode);

        let fragments = applyReactions([molecule], reactions, {
          maxDepth,
          limitReactions,
          getProductsTrees: true,
        });
        // @ts-ignore
        product.children = fragments.trees;
      }
    } else {
      for (let child of product.children) {
        getMoleculesToFragment(child, reactions, maxDepth, limitReactions);
      }
    }
  }
}
