import { MF } from 'mf-parser';
import OCL from 'openchemlib';
import { Reactions, getMF } from 'openchemlib-utils';

import { getDatabase } from './database/getDatabase';
import { getMasses } from './utils/getMasses';
/**
 * @description Fragment a molecule by applying reactions from a custom database of reactions
 * @param {import('openchemlib').Molecule} oclMolecule - The OCL molecule to be fragmented
 * @param {Object}  [options={}]
 * @param {'positive'|'negative'|'both'}  [options.mode='positive'] - The mode to be used
 * @param {'esi'|'ei'}  [options.ionizationKind='esi'] - The ionization technique to be used
 * @param {number}  [options.maxDepth=5] - The maximum depth of the overall fragmentation tree
 * @param {number}  [options.limitReactions=200] - The maximum number of reactions to be applied
 * @param {string}  [options.dwar] - The dwar entry to be used, if not provided, the default one will be used
 * @param {number}  [options.maxIonizations=1] - The maximum depth of the ionization tree
 * @param {number}  [options.minIonizations=1] - The minimum depth of the ionization tree
 * @param {number}  [options.minReactions=0] - The minimum depth of the reaction tree
 * @param {number}  [options.maxReactions=3] - The maximum depth of the reaction tree
 * @returns {object} In-Silico fragmentation results with the following properties:
 * - masses: array of monoisotopic masses
 * - trees: array of fragmentation trees
 * - validNodes: nodes without dead branches
 */
export function reactionFragmentation(oclMolecule, options = {}) {
  const {
    mode = 'positive',
    ionizationKind = 'esi',
    dwar,
    maxDepth = 5,
    limitReactions = 200,
    minIonizations = 1,
    maxIonizations = 1,
    minReactions = 0,
    maxReactions = 3,
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
    getDatabase({ kind: 'ionization', mode, ionizationKind, dwar }),
    {
      min: minIonizations,
      max: maxIonizations,
    },
  );

  reactions.applyOneReactantReactions(
    getDatabase({ kind: 'reaction', mode, ionizationKind, dwar }),
    {
      min: minReactions,
      max: maxReactions,
    },
  );

  const trees = reactions.trees;
  const validNodes = reactions.getValidNodes();
  const masses = getMasses(validNodes);

  return {
    trees,
    validNodes,
    masses,
    reactions,
  };
}
