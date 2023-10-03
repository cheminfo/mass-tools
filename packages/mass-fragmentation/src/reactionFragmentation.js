import { MF } from 'mf-parser';
import OCL from 'openchemlib';
import { Reactions, getMF } from 'openchemlib-utils';

import { getDatabases } from './database/getDatabases';
import { getMasses } from './utils/getMasses';
/**
 * @description Fragment a molecule by applying reactions from a custom database of reactions
 * @param {import('openchemlib').Molecule} oclMolecule - The OCL molecule to be fragmented
 * @param {Object}  [options={}]
 * @param {string}  [options.mode='positive'] - The mode to be used
 * @param {number}  [options.maxDepth=5] - The maximum depth of the overall fragmentation tree
 * @param {number}  [options.limitReactions=200] - The maximum number of reactions to be applied
 * @param {string}  [options.dwarEntry] - The dwar entry to be used, if not provided, the default one will be used
 * @param {number}  [options.maxIonizationDepth=1] - The maximum depth of the ionization tree
 * @param {number}  [options.minIonizationDepth=1] - The minimum depth of the ionization tree
 * @param {number}  [options.minReactionDepth=0] - The minimum depth of the reaction tree
 * @param {number}  [options.maxReactionDepth=3] - The maximum depth of the reaction tree
 * @returns {object} In-Silico fragmentation results with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees
 * - validNodes: nodes without dead branches
 */
export function reactionFragmentation(oclMolecule, options = {}) {
  const {
    mode = 'positive',
    dwarEntry = '',
    maxDepth = 5,
    limitReactions = 200,
    minIonizationDepth = 1,
    maxIonizationDepth = 1,
    minReactionDepth = 0,
    maxReactionDepth = 3,
  } = options;

  const reactions = new Reactions(OCL, {
    moleculeInfoCallback: (molecule) => {
      // @ts-ignore
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
    limitReactions,
    skipProcessed: true,
  });

  reactions.appendHead([oclMolecule]);
  reactions.applyOneReactantReactions(
    getDatabases({ kind: 'ionization', mode }, dwarEntry),
    {
      min: minIonizationDepth,
      max: maxIonizationDepth,
    },
  );
  reactions.applyOneReactantReactions(
    getDatabases({ kind: 'reaction', mode }, dwarEntry),
    {
      min: minReactionDepth,
      max: maxReactionDepth,
    },
  );

  const trees = reactions.trees;
  const validNodes = reactions.getValidNodes();
  const masses = getMasses(trees);

  return {
    trees,
    validNodes,
    masses,
  };
}
