import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.js';

const { Molecule } = OCL;

describe('ReactionFragmentation', async () => {
  it('full process: MDMA', async () => {
    const molecule = Molecule.fromSmiles('CNC(Cc1ccc2c(c1)OCO2)C');
    const { trees, validNodes, masses } = reactionFragmentation(molecule);
    expect(validNodes).toHaveLength(274);
    expect(masses).toHaveLength(52);
    for (const tree of trees) {
      deleteMolFile(tree);
    }
    expect(trees).toMatchSnapshot();
  });
  it.only('full process: Equisetin', async () => {
    const molecule = Molecule.fromSmiles(
      'CC=CC1C=CC2CC(CCC2C1(C)C(=C3C(=O)C(N(C3=O)C)CO)O)C',
    );
    const { trees, validNodes, masses } = reactionFragmentation(molecule);
    expect(validNodes).toHaveLength(257);
    expect(masses).toHaveLength(25);
    for (const tree of trees) {
      deleteMolFile(tree);
    }
    expect(trees).toMatchSnapshot();
  });
});

function deleteMolFile(currentBranch) {
  for (const node of currentBranch.children) {
    for (const molecule of node.molecules) {
      delete molecule.molfile;
    }
    if (node.children?.length > 0) {
      deleteMolFile(node);
    }
  }
}
