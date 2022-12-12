import { MF } from 'mf-parser';
import { getMF, getHoseCodesForAtoms } from 'openchemlib-utils';

/**
 * The function performs the fragmentation of all single linear bonds
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @param {object} [options={}]
 * @param {boolean} [options.calculateHoseCodes=false] - calculating hose code for bonds is quite time consuming
 * @returns Results fragmentation of acyclic bonds
 */

export function fragmentAcyclicBonds(molecule, options = {}) {
  const { Molecule } = molecule.getOCL();
  const { calculateHoseCodes } = options;
  let atoms = [];
  // Prepare object with lenght equal to number of atoms
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    let atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.links = [];
  }
  let bonds = [];
  for (let i = 0; i < molecule.getAllBonds(); i++) {
    let bond = {};
    // get informations of bonds
    bond.index = i;
    bond.order = molecule.getBondOrder(i); // dative, single , double, triple
    bond.atom1 = molecule.getBondAtom(0, i); // atom 1 index
    bond.atom2 = molecule.getBondAtom(1, i); // atom 2 index

    bond.type = molecule.getBondType(i); // cBondTypeSingle,cBondTypeDouble,cBondTypeTriple,cBondTypeDelocalized
    bond.isAromatic = molecule.isAromaticBond(i);
    bond.isRingBond = molecule.isRingBond(i);

    // Mapping of bonds to be fragmented, only if they are single bond not aromatic and cyclic the mapping occurs
    if (
      bond.isAromatic ||
      bond.type > 1 ||
      bond.isRingBond ||
      bond.order !== 1
    ) {
      continue;
    } else {
      bond.selected = true;
      atoms[bond.atom1].links.push(bond.atom2);
      atoms[bond.atom2].links.push(bond.atom1);
    }
    bonds.push(bond);
  }

  let brokenMolecule = {};
  let fragmentMap = [];
  let nbFragments = [];
  let results = [
    {
      idCode: molecule.getIDCode(),
      mfInfo: new MF(getMF(molecule).mf).getInfo(),
      fragmentType: 'molecular ion',
    },
  ];

  for (let bond of bonds) {
    if (bond.selected) {
      // if bond.selected is true (line 46) the molecule will be fragmented
      brokenMolecule[bond.index] = molecule.getCompactCopy(); // get a copy of the molecule
      brokenMolecule[bond.index].setAtomCustomLabel(bond.atom1, '*');
      brokenMolecule[bond.index].setAtomCustomLabel(bond.atom2, '*');
      brokenMolecule[bond.index].markBondForDeletion(bond.index); //mark bond to be deleted
      // the function returns an array of map

      brokenMolecule[bond.index].deleteMarkedAtomsAndBonds(); // delete marked bonds
    }
    nbFragments = brokenMolecule[bond.index].getFragmentNumbers(fragmentMap);
    // only if there are 2 fragments code can continue
    if (nbFragments === 2) {
      for (let i = 0; i < nbFragments; i++) {
        const result = {};
        if (calculateHoseCodes) {
          result.hoses = getHoseCodesForAtoms(molecule, [
            bond.atom1,
            bond.atom2,
          ]);
        }

        result.atomMap = [];

        // assign fragment id to index of for loop
        let includeAtom = fragmentMap.map((id) => {
          return id === i;
        });

        let fragment = new Molecule(100, 100);

        let atomMap = [];

        brokenMolecule[bond.index].copyMoleculeByAtoms(
          fragment,
          includeAtom,
          false,
          atomMap,
        );

        for (let j = 0; j < atomMap.length; j++) {
          if (fragment.getAtomCustomLabel(atomMap[j]) === '*') {
            result.atomMap.push(j);
            if (atoms[j].links.length > 0) {
              fragment.addBond(atomMap[j], fragment.addAtom(154));
            }
          }
        }
        fragment.removeAtomCustomLabels();
        fragment.setFragment(false);
        result.idCode = fragment.getIDCode();
        result.cleavedBonds = [
          {
            index: bond.index,
            order: bond.order,
            atom1: bond.atom1,
            atom2: bond.atom2,
          },
        ];
        result.mfInfo = new MF(
          getMF(fragment).mf.replace(/R[1-9]?/, ''),
        ).getInfo();
        result.fragmentType = 'acyclic';

        results.push(result);
      }
    }
  }
  // sort result in order fragment 1-2; 3-4; ...
  results = results.sort((a, b) => {
    return a.mfInfo.monoisotopicMass - b.mfInfo.monoisotopicMass;
  });

  return results;
}
