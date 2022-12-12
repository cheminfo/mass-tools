import OCL from 'openchemlib';

import { fragmentAcyclicBonds } from '../fragmentAcyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentAcyclicBonds', () => {
  it('CCCC', () => {
    const molecule = Molecule.fromSmiles('CCCC'); // for some reason tostrictEqual has problems with: 'eMHAIhNFhF`QR\\Ji\\Jh'
    const result = fragmentAcyclicBonds(molecule);

    expect(result).toMatchSnapshot();
  });
  it('c3ccc(CCCC2CCC1CCCCC1C2)cc3 - options false', () => {
    const molecule = Molecule.fromSmiles('c3ccc(CCCC2CCC1CCCCC1C2)cc3');
    const result = fragmentAcyclicBonds(molecule, {
      calculateHoseCodes: false,
    });

    expect(result).toMatchSnapshot();
  });
  it('c3ccc(CCCC2CCC1CCCCC1C2)cc3 - options true', () => {
    const molecule = Molecule.fromSmiles('c3ccc(CCCC2CCC1CCCCC1C2)cc3');
    const result = fragmentAcyclicBonds(molecule, { calculateHoseCodes: true });

    expect(result).toMatchSnapshot();
  });
});
