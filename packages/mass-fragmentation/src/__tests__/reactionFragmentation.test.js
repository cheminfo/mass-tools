import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.js';

const { Molecule } = OCL;

describe('ReactionFragmentation', async () => {
  it('Alpha cleavage: MDMAH+', async () => {
    const molecule = Molecule.fromSmiles('C[NH2+]C(C)Cc2ccc1OCOc1c2');
    const options = {
      maxDepth: 20,
    };
    const result = reactionFragmentation(molecule, options);

    expect(result).toMatchSnapshot();
  });
  it('tropylium rearrangement: MDMA after Alpha cleavage', async () => {
    const molecule = Molecule.fromSmiles('[CH2+]c2ccc1OCOc1c2');
    const options = {
      maxDepth: 20,
    };
    const result = reactionFragmentation(molecule, options);

    expect(result).toMatchSnapshot();
  });

  it('Full fragmentation: MDMA', async () => {
    const molecule = Molecule.fromSmiles('CNC(Cc1ccc2c(c1)OCO2)C');
    const options = {
      ionizationLevel: 1,
    };

    const result = reactionFragmentation(molecule, options);

    expect(result).toMatchSnapshot();
  });
});
