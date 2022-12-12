import { MF } from 'mf-parser';
import { getMF } from 'openchemlib-utils';

import { fragmentAcyclicBonds } from './fragmentAcyclicBonds.js';
import { fragmentRings } from './fragmentRings.js';

/**
 * This function fragment both acyclic and cyclic bonds of the molecule
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @param {object} [options={}]
 * @param {boolean} [options.calculateHoseCodes=false] - calculating hose code for bonds is quite time consuming
 * @param {boolean} [options.cyclic=true] - calculate cyclic fragmentation
 * @param {boolean} [options.acyclic=true] - calculate acyclic fragmentation
 * @param {boolean} [options.full=true] - calculate the molecular formula of the full molecule
 * @returns {object} In-Silico fragmentation results
 */
export function fragment(molecule, options = {}) {
  const { cyclic = true, acyclic = true, full = true } = options;

  let molecularIon = full
    ? [
        {
          idCode: molecule.getIDCode(),
          mfInfo: new MF(getMF(molecule).mf).getInfo(),
          fragmentType: 'molecule',
        },
      ]
    : [];
  let acyclicBonds = acyclic ? fragmentAcyclicBonds(molecule, options) : [];
  let cyclicBonds = cyclic ? fragmentRings(molecule, options) : [];
  let result = [...molecularIon, ...acyclicBonds, ...cyclicBonds];

  return result.sort(
    (a, b) => a.mfInfo.monoisotopicMass - b.mfInfo.monoisotopicMass,
  );
}
