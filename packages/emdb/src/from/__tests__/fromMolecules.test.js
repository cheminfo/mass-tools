import OCL from 'openchemlib/full.js';
import { describe, expect, it } from 'vitest';

import { EMDB } from '../..';

describe('fromMolecules', () => {
  it('smiles', async () => {
    const emdb = new EMDB();
    const entries = [{ smiles: 'CC' }, { smiles: 'CCC' }, { smiles: 'CCOC' }];

    await emdb.fromMolecules(entries, OCL);
    expect(emdb.databases.molecules).toHaveLength(3);
    expect(emdb).toMatchSnapshot();
  });

  it('smiles + H+,Na+', async () => {
    const emdb = new EMDB();
    const entries = [{ smiles: 'CC' }, { smiles: 'CCC' }, { smiles: 'CCOC' }];

    await emdb.fromMolecules(entries, OCL, { ionizations: 'H+,Na+' });
    expect(emdb.databases.molecules).toHaveLength(6);
    expect(emdb).toMatchSnapshot();
  });

  it('smiles + parts', async () => {
    const emdb = new EMDB();
    const entries = [{ smiles: '[NH4+]' }, { smiles: 'CC.OC' }];

    await emdb.fromMolecules(entries, OCL);
    expect(emdb.databases.molecules).toHaveLength(2);
    expect(emdb).toMatchSnapshot();
  });

  it('smiles + fragments + group', async () => {
    const emdb = new EMDB();
    const entries = [{ smiles: 'CCC' }, { smiles: 'CCOC' }];

    await emdb.fromMolecules(entries, OCL, {
      fragmentation: { acyclic: true },
      groupResults: true,
    });
    expect(emdb.databases.molecules[1].fragments[0]).toStrictEqual({
      count: 3,
      idCode: 'eMBAYRZ@',
      type: 'acyclic',
      parents: [
        { smiles: 'CCC', idCode: 'eM@Hz@', count: 2 },
        { smiles: 'CCOC', idCode: 'gCa@@eMP@', count: 1 },
      ],
    });
    expect(emdb.databases.molecules).toHaveLength(6);
    expect(emdb).toMatchSnapshot();
  });

  it('smiles + target spectrum', async () => {
    const emdb = new EMDB();
    const entries = [{ smiles: 'CC' }, { smiles: 'CCC' }, { smiles: 'CCCO' }];
    await emdb.fromMolecules(entries, OCL, {
      fragmentation: { cyclic: true, acyclic: true },
      ionizations: 'H+, Na+',
      filter: {
        precision: 1000,
        targetMasses: [14, 16, 18],
        targetIntensities: [10, 20, 30],
      },
    });
    expect(emdb.databases.molecules).toHaveLength(1);
    expect(emdb.databases.molecules).toMatchSnapshot();
  });

  it('smiles + fragmentation', async () => {
    const emdb = new EMDB();
    const entries = [{ smiles: 'CCO' }, { smiles: 'C1COCC1' }];

    await emdb.fromMolecules(entries, OCL, {
      fragmentation: { cyclic: true, acyclic: true },
    });
    expect(emdb.databases.molecules).toHaveLength(16);
    expect(emdb).toMatchSnapshot();
  });
});
