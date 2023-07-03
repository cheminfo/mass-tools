//import { writeFileSync } from 'fs';
//import { join } from 'path';

import OCL from 'openchemlib';

import { reactionFragmentation } from '../reactionFragmentation.js';

import { alphaCleavage } from './data/alphaCleavage.js';
import { ionisationReactions } from './data/ionisationDB.js';
import { reactionsDB } from './data/reactionsDB.js';
import { tropylium } from './data/tropyliumResonance.js';

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
  it('Ionisation: mdma', async () => {
    const molecule = Molecule.fromSmiles('CNC(Cc1ccc2c(c1)OCO2)C');
    const options = {
      database: 'cid',
      maxDepth: 10,
      reactions: ionisationReactions,
    };
    const result = reactionFragmentation(molecule, options);
    expect(result).toMatchSnapshot();
  });
  it('tropylium rearrangement', async () => {
    const molecule = Molecule.fromSmiles('[CH2+]c1cccc(O)c1');
    const options = {
      database: 'cid',
      maxDepth: 10,
      reactions: tropylium,
    };
    const result = reactionFragmentation(molecule, options);
    expect(result).toMatchSnapshot();
  });
  it('Alpha cleavage: MDMAH+', async () => {
    const molecule = Molecule.fromSmiles('C[NH2+]C(C)Cc2ccc1OCOc1c2');
    const options = {
      database: 'cid',
      maxDepth: 100,
      reactions: alphaCleavage,
    };
    const result = reactionFragmentation(molecule, options);

    expect(result).toMatchSnapshot();
  });
  it('tropylium rearrangement: MDMA after Alpha cleavage', async () => {
    const molecule = Molecule.fromSmiles('[CH2+]c2ccc1OCOc1c2');
    const options = {
      database: 'cid',
      maxDepth: 100,
      reactions: tropylium,
    };
    const result = reactionFragmentation(molecule, options);

    expect(result).toMatchSnapshot();
  });

  it.only('Full fragmentation: MDMA', async () => {
    const molecule = Molecule.fromSmiles('CNC(Cc1ccc2c(c1)OCO2)C');
    const options = {
      database: 'cid',
      maxDepth: 1000,
      reactions: reactionsDB,
    };
    const result = reactionFragmentation(molecule, options);

    expect(result).toMatchSnapshot();
  });
});

/**
     writeFileSync(
      join(__dirname, 'data/ionisation.json'),
      JSON.stringify(result.tree),
    );
 */
