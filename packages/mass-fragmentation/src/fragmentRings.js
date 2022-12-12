import { MF } from 'mf-parser';
import { getMF, getHoseCodesForAtoms } from 'openchemlib-utils';

import { getFragmentableRings } from './utils/getFragmentableRings.js';

/**
 * The function performs the fragmentation of all single ring bonds not belonging to aromatic rings
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @param {object} [options={}]
 * @param {boolean} [options.calculateHoseCodes=false] - calculating hose code for bonds is quite time consuming
 * @returns  Array with results for the fragmentation of ring bonds
 */

export function fragmentRings(molecule, options = {}) {
  const { Molecule } = molecule.getOCL();
  const { calculateHoseCodes } = options;
  let atoms = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    let atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.links = [];
  }

  const fragmentableRingBonds = getFragmentableRings(molecule);

  let fragmentationResults = [];

  for (let ringBonds of fragmentableRingBonds) {
    const brokenMolecule = molecule.getCompactCopy();
    let fragmentMap = [];
    let atoms = [];
    let rLinks = {};
    for (let bond of ringBonds.bonds) {
      brokenMolecule.markBondForDeletion(bond.index);
      brokenMolecule.setAtomCustomLabel(bond.atom1, '*');
      brokenMolecule.setAtomCustomLabel(bond.atom2, '*');
      atoms.push(bond.atom1);
      atoms.push(bond.atom2);
      rLinks[bond.atom1] = bond.atom2;
      rLinks[bond.atom2] = bond.atom1;
    }
    brokenMolecule.deleteMarkedAtomsAndBonds();

    const nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap);

    for (let i = 0; i < nbFragments; i++) {
      const result = {};
      if (calculateHoseCodes) {
        result.hoses = getHoseCodesForAtoms(molecule, atoms);
      }

      result.atomMap = [];
      let includeAtom = fragmentMap.map((id) => {
        return id === i;
      });
      let fragment = new Molecule(0, 0);
      let atomMap = [];

      brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap);
      // if includeAtom has more then 3 true all true should become false and all false should become true

      for (let j = 0; j < atomMap.length; j++) {
        if (fragment.getAtomCustomLabel(atomMap[j]) === '*') {
          result.atomMap.push(j);
          if (rLinks[j] !== undefined) {
            fragment.addBond(atomMap[j], fragment.addAtom(154));
          }
        }
      }
      fragment.removeAtomCustomLabels();

      fragment.setFragment(false);
      //      console.log(fragment.getIDCode(), getMF(fragment).mf);
      result.idCode = fragment.getIDCode();
      result.cleavedBonds = ringBonds.bonds;
      result.mfInfo = new MF(
        getMF(fragment).mf.replace(/R[1-9]?/, ''),
      ).getInfo();
      result.fragmentType = 'cyclic';
      fragmentationResults.push(result);
    }
  }

  fragmentationResults = fragmentationResults.sort((a, b) => {
    return a.mfInfo.monoisotopicMass - b.mfInfo.monoisotopicMass;
  });
  return fragmentationResults;
}
