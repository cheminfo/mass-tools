/* eslint-disable import/no-extraneous-dependencies */

const { toBeDeepCloseTo } = require('jest-matcher-deep-close-to');

expect.extend({ toBeDeepCloseTo });

const DBManager = require('../..');

describe('fromNucleicSequence', () => {
  it('fromNucleicSequence', async () => {
    let dbManager = new DBManager();
    await dbManager.fromNucleicSequence('AAA', {
      ionizations: 'H+,Na+',
      fragmentation: {
        a: true,
      },
      info: {
        kind: 'dna',
      },
    });
    let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
    expect(nucleic).toHaveLength(6);
    expect(nucleic[0]).toBeDeepCloseTo({
      charge: 0,
      em: 313.05760550518,
      mw: 313.2069506932622,
      ionization: { mf: 'H+', em: 1.00782503223, charge: 1, atoms: { H: 1 } },
      unsaturation: 8,
      atoms: { C: 10, H: 12, N: 5, O: 5, P: 1 },
      ms: { ionization: 'H+', em: 314.0648819575009, charge: 1 },
      parts: ['HODampO-1H-1'],
      mf: 'C10H12N5O5P',
      sequence: 'A',
      comment: 'a1',
    });
  });

  it('fromNucleicSequence ds-DNA', async () => {
    let dbManager = new DBManager();
    await dbManager.fromNucleicSequence('AAA', {
      ionizations: 'H+,Na+',
      fragmentation: {
        a: true,
      },
      info: {
        kind: 'dsdna',
      },
    });

    let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);

    expect(nucleic).toHaveLength(12);
    expect(nucleic).toMatchSnapshot();
  });

  it('TACGTGCCAATAC internal fragment', async () => {
    let dbManager = new DBManager();
    await dbManager.fromNucleicSequence('TACGTGCCAATAC', {
      ionizations: '(H+)-5',
      fragmentation: {
        abw: true,
      },
      info: {
        kind: 'dna',
      },
    });

    let nucleic = dbManager.databases.nucleic.sort((a, b) => {
      if (a.ms.em !== b.ms.em) return a.ms.em - b.ms.em;
      if (a.ms.comment < b.ms.comment) return 1;
      return -1;
    });
    expect(nucleic).toHaveLength(56);

    expect(nucleic[0]).toBeDeepCloseTo({
      charge: 0,
      em: 467.04948243777,
      mw: 467.2622646800317,
      ionization: {
        mf: '(H+)-5',
        em: -5.03912516115,
        charge: -5,
        atoms: { H: -5 },
      },
      unsaturation: 8,
      atoms: { C: 14, H: 19, N: 3, O: 11, P: 2 },
      ms: { ionization: '(H+)-5', em: 92.40262003523306, charge: -5 },
      parts: ['HODcmpFurp'],
      mf: 'C14H19N3O11P2',
      sequence: 'C⬠',
      comment: 'w6:a9-B',
    });
  });

  it('TACGTGCCAATAC callback', async () => {
    let dbManager = new DBManager();
    await dbManager.fromNucleicSequence('TACGTGCCAATAC', {
      ionizations: '(H+)-5',
      fragmentation: {
        abw: true,
      },
      info: {
        kind: 'dna',
      },
      filter: { callback: (entry) => entry.unsaturation % 2 === 0 },
    });

    let nucleic = dbManager.databases.nucleic.sort((a, b) => {
      if (a.ms.em !== b.ms.em) return a.ms.em - b.ms.em;
      if (a.ms.comment < b.ms.comment) return 1;
      return -1;
    });
    expect(nucleic).toHaveLength(30);
  });

  it('AGGCAG fragment', async () => {
    let dbManager = new DBManager();
    await dbManager.fromNucleicSequence('AGGCAG', {
      ionizations: '(H+)-',
      fragmentation: {
        y: true,
      },
      info: {
        kind: 'dna',
      },
    });
    let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
    expect(nucleic).toHaveLength(6);
    expect(nucleic).toMatchSnapshot();
  });

  it('AGG with d-h2o and base loss', async () => {
    let dbManager = new DBManager();
    await dbManager.fromNucleicSequence('AGG', {
      ionizations: '(H+)-1',
      fragmentation: {
        dh2o: true,
        baseLoss: true,
      },

      info: {
        kind: 'dna',
      },
    });
    let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
    expect(nucleic).toHaveLength(5);
    expect(nucleic).toMatchSnapshot();
  });

  it('HODamDamDamDamDamH', async () => {
    let dbManager = new DBManager();
    await dbManager.fromNucleicSequence('HODamDamDamDamDamH', {
      ionizations: '(H+)-',
      fragmentation: {
        y: true,
      },
      info: {
        kind: 'dna',
      },
    });
    let nucleic = dbManager.databases.nucleic.sort((a, b) => a.ms.em - b.ms.em);
    expect(nucleic).toHaveLength(5);
    expect(nucleic).toMatchSnapshot();
  });
});
