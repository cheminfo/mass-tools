import { MF } from 'mf-parser';
import OCL from 'openchemlib';
import { Reactions, getMF } from 'openchemlib-utils';

import { getDatabases } from './database/getDatabases';
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
  const {
    ionization = 'cid',
    mode = 'positive',
    maxDepth = 5,
    maxIonizationDepth = 1,
    getProductsTrees = false,
    databases = getDatabases(),
    limitReactions = 200,
  } = options;

  const reactions = new Reactions(OCL, {
    moleculeInfoCallback: (molecule) => {
      const mf = getMF(molecule).mf;
      const mfInfo = new MF(mf).getInfo();
      return {
        mf,
        mw: mfInfo.mass,
        em: mfInfo.monoisotopicMass,
        mz: mfInfo.observedMonoisotopicMass,
        charge: mfInfo.charge,
      };
    },
    maxDepth,
    skipProcessed: true,
  });

  reactions.appendHead([molecule]);
  reactions.applyOneReactantReactions(databases.ionizations, {
    min: 1,
    max: 1,
  });
  reactions.applyOneReactantReactions(databases.fragmentations, {
    min: 0,
    max: 2,
  });

  const trees = reactions.trees;
  const validNodes = reactions.getValidNodes();

  return {
    trees,
    validNodes,
  };
}
