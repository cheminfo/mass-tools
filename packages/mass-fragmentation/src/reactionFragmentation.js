import { MF } from 'mf-parser';
import OCL from 'openchemlib';
import { Reactions, getMF } from 'openchemlib-utils';

import { getDatabase } from './database/getDatabase';
import { getMasses } from './utils/getMasses';
/**
 * @description Fragment a molecule by applying reactions from a custom database of reactions
 * @param {import('openchemlib').Molecule} oclMolecule - The OCL molecule to be fragmented
 * @param {Object}  [options={}]
 * @param {('esi'|'ei')[]}  [options.ionization=['esi']] - The ionization technique to be used
 * @param {('positive'|'negative')[]}  [options.mode=['positive']] - The ionization mode to be used
 * @param {number}  [options.maxDepth=5] - The maximum depth of the overall fragmentation tree
 * @param {number}  [options.limitReactions=200] - The maximum number of reactions to be applied to each branch
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
    ionization = ['esi'],
    mode = ['positive'],
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
    getDatabase({
      kind: ['ionization'],
      ionization,
      mode,
      dwar,
    }),
    {
      min: minIonizations,
      max: maxIonizations,
    },
  );
  const reactionDb = getDatabase({
    kind: ['reaction'],
    ionization,
    mode,
    dwar,
  });

  for (let i = 1; i <= maxReactions; i++) {
    let min = 1;
    if (minReactions < i + 1) {
      min = 0;
    }
    reactions.applyOneReactantReactions(reactionDb, {
      min,
      max: 1,
    });
  }

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
