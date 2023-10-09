import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.js';

const { Molecule } = OCL;

describe('ReactionFragmentation', async () => {
  it('full process', async () => {
    const molecule = Molecule.fromSmiles('CNC(Cc1ccc2c(c1)OCO2)C');
    const { trees, validNodes, masses } = reactionFragmentation(molecule);
    expect(validNodes).toHaveLength(274);
    expect(masses).toHaveLength(52);
    expect(trees).toMatchSnapshot();
  });
});
