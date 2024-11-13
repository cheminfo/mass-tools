import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.js';

const { Molecule } = OCL;

describe('ReactionFragmentation', async () => {
  it('full process: MDMA', async () => {
    const molecule = Molecule.fromSmiles('CNC(Cc1ccc2c(c1)OCO2)C');
    const { trees, validNodes, masses } = reactionFragmentation(molecule);
    expect(validNodes).toBeGreaterThan(548);
    expect(masses).toBeGreaterThan(50);
    expect(trees).toMatchSnapshot();
  });
  it('full process: Equisetin', async () => {
    const molecule = Molecule.fromSmiles(
      'CC=CC1C=CC2CC(CCC2C1(C)C(=C3C(=O)C(N(C3=O)C)CO)O)C',
    );
    const { trees, validNodes, masses } = reactionFragmentation(molecule, {
      limitReactions: 20,
      maxReactions: 2,
    });
    expect(validNodes).toHaveLength(255);
    expect(masses).toHaveLength(30);

    expect(trees).toMatchSnapshot();
  });
  it('full process: Cephalocromin', async () => {
    const molecule = Molecule.fromSmiles(
      'CC1CC(=O)C2=C(O1)C=C3C(=C2O)C(=CC(=C3C4=C(C=C(C5=C(C6=C(C=C54)OC(CC6=O)C)O)O)O)O)O',
    );
    const { trees, validNodes, masses } = reactionFragmentation(molecule);
    expect(validNodes).toHaveLength(1022);
    expect(masses).toHaveLength(47);
    expect(trees).toMatchSnapshot();
  });
});
