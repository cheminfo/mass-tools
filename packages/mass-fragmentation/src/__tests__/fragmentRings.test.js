import OCL from 'openchemlib';

import { fragmentRings } from '../fragmentRings.js';

const { Molecule } = OCL;

describe('fragmentRings', () => {
  it('CCCC', () => {
    const molecule = Molecule.fromSmiles('CCCC'); // butane
    const result = fragmentRings(molecule);

    expect(result).toStrictEqual([]);
  });
  it('C1CC1', () => {
    const molecule = Molecule.fromSmiles('C1CC1'); // butane
    const result = fragmentRings(molecule);
    expect(result).toStrictEqual([]);
  });
  it('C1CCC1', () => {
    const molecule = Molecule.fromSmiles('C1CCC1'); // butane
    const results = fragmentRings(molecule, { calculateHoseCodes: true });
    expect(results).toHaveLength(4);
    const mfs = results.map((result) => result.mfInfo.mf);
    expect(mfs).toStrictEqual(['C2H4', 'C2H4', 'C2H4', 'C2H4']);
    expect(results).toMatchSnapshot();
  });
  it('c1ccncc1', () => {
    const molecule = Molecule.fromSmiles('c1ccncc1'); // benzene
    const results = fragmentRings(molecule);

    expect(results).toStrictEqual([]);
  });

  it('CCC13CCCC2CCCC(CCC1)C23', () => {
    const molecule = Molecule.fromSmiles('C1CC2CCCC3CCCC(C1)C23'); //3 cyclohexane connected
    const results = fragmentRings(molecule);

    expect(results).toMatchSnapshot();
  });

  it('C2CCC1CCCCC1C2', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const results = fragmentRings(molecule);
    const mfs = results.map((result) => result.mfInfo.mf);
    expect(mfs).toStrictEqual([
      'C2H4',
      'C2H4',
      'C2H4',
      'C2H4',
      'C2H4',
      'C2H4',
      'C3H6',
      'C3H6',
      'C3H6',
      'C3H6',
      'C4H8',
      'C4H8',
      'C6H10',
      'C6H10',
      'C7H12',
      'C7H12',
      'C7H12',
      'C7H12',
      'C8H14',
      'C8H14',
      'C8H14',
      'C8H14',
      'C8H14',
      'C8H14',
    ]);
    expect(results).toMatchSnapshot();

    // Bug: getRingSet do not reconise rings with less than 6 carbons and with more than 7
  });
  it('C2CCC1CCCC3CCCC4CCCC1', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCC3CCCC4CCCC1(CC2)C34'); //4 rings (2 hexane & 2 heptane)
    const results = fragmentRings(molecule);

    expect(results).toMatchSnapshot();
  });
});
