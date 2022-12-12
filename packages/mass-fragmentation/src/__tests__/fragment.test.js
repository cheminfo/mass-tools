import OCL from 'openchemlib';

import { fragment } from '../fragment.js';

const { Molecule } = OCL;

describe('fragment', () => {
  it('CC', () => {
    const molecule = Molecule.fromSmiles('CC'); // just ring
    const results = fragment(molecule);
    const mfs = results.map((result) => result.mfInfo.mf);
    expect(mfs).toStrictEqual(['CH3', 'CH3', 'C2H6']);
    expect(results).toMatchSnapshot();
  });
  it('CCC', () => {
    const molecule = Molecule.fromSmiles('CCC'); // just ring
    const results = fragment(molecule);
    const mfs = results.map((result) => result.mfInfo.mf);
    expect(mfs).toStrictEqual(['CH3', 'CH3', 'C2H5', 'C2H5', 'C3H8']);
    expect(results).toMatchSnapshot();
  });
  it('C1CCC1', () => {
    const molecule = Molecule.fromSmiles('C1CCC1'); // just ring
    const results = fragment(molecule);
    const mfs = results.map((result) => result.mfInfo.mf);
    expect(mfs).toStrictEqual(['C2H4', 'C2H4', 'C2H4', 'C2H4', 'C4H8']);
    expect(results).toMatchSnapshot();
  });
  it('CCCCC2CCC1C(CC)CC(=O)CC1C2 - with Hose Codes', () => {
    const molecule = Molecule.fromSmiles('CCCCC2CCC1C(CC)CC(=O)CC1C2'); //3 cyclohexane connected
    const results = fragment(molecule, { calculateHoseCodes: true });
    const mfs = results.map((result) => result.mfInfo.mf);
    expect(mfs).toStrictEqual([
      'CH3',
      'CH3',
      'C2H4',
      'C2H5',
      'C2H5',
      'C2H2O',
      'C2H2O',
      'C3H7',
      'C3H4O',
      'C4H8',
      'C4H9',
      'C5H8O',
      'C6H12',
      'C6H12',
      'C6H10O',
      'C7H14',
      'C7H14',
      'C8H16',
      'C8H12O',
      'C9H14O',
      'C9H14O',
      'C10H18',
      'C10H16O',
      'C10H16O',
      'C11H20',
      'C12H19O',
      'C12H20O',
      'C13H24',
      'C13H21O',
      'C14H26',
      'C14H26',
      'C14H23O',
      'C14H23O',
      'C14H24O',
      'C15H25O',
      'C15H25O',
      'C16H28O',
    ]);
    expect(results).toMatchSnapshot();
  });

  it('CCCCCC(CC)CCC', () => {
    const molecule = Molecule.fromSmiles('CCCCCC(CC)CCC'); // just ring
    const results = fragment(molecule);
    const mfs = results.map((result) => result.mfInfo.mf);
    expect(mfs).toStrictEqual([
      'CH3',
      'CH3',
      'CH3',
      'C2H5',
      'C2H5',
      'C2H5',
      'C3H7',
      'C3H7',
      'C4H9',
      'C5H11',
      'C6H13',
      'C7H15',
      'C8H17',
      'C8H17',
      'C9H19',
      'C9H19',
      'C9H19',
      'C10H21',
      'C10H21',
      'C10H21',
      'C11H24',
    ]);
    expect(results).toMatchSnapshot();
  });
  it('noMolecule', () => {
    const molecule = Molecule.fromSmiles('');
    const results = fragment(molecule);
    expect(results).toStrictEqual([
      {
        idCode: 'd@',
        mfInfo: {
          mass: 0,
          monoisotopicMass: 0,
          charge: 0,
          mf: '',
          atoms: {},
          unsaturation: 1,
        },
        fragmentType: 'molecular ion',
      },
    ]);
  });
});
