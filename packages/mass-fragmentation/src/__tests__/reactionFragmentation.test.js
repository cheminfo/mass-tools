import { writeFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.js';

import { ionisationReactions } from './data/ionisationDB.js';
import { reactionsDB } from './data/reactionsDB.js';

const { Molecule } = OCL;

describe('ReactionFragmentation', async () => {
  it('Ionisation: fake molecule', async () => {
    const molecule = Molecule.fromSmiles('C/N=C(CN(C)CO)C(=O)CNCCCC(S)CC(C)=S');
    const options = {
      database: 'cid',
      maxDepth: 10,
      reactions: ionisationReactions,
    };
    const result = reactionFragmentation(molecule, options);
    expect(result).toMatchSnapshot();
  });
  it.only('Ionisation: mdma', async () => {
    const molecule = Molecule.fromSmiles('CNC(Cc1ccc2c(c1)OCO2)C');
    const options = {
      database: 'cid',
      maxDepth: 10,
      reactions: ionisationReactions,
    };
    const result = reactionFragmentation(molecule, options);
    writeFileSync(
      join(__dirname, 'data/ionisation.json'),
      JSON.stringify(result.tree),
    );
  });
});
