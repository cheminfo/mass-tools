'use strict';

const DBManager = require('../..');

describe('fromPeptidicSequence', () => {
  it('AAKK', async () => {
    let dbManager = new DBManager();
    await dbManager.fromPeptidicSequence('AAKK', {
      allowNeutralLoss: false,
      protonation: false,
      protonationPH: 7,
      ionizations: 'H+,Na+',
      fragmentation: {
        a: true,
      },
      filter: {
        minMSEM: 100,
        maxMSEM: 300,
        targetMass: 150, // just to test, this is useless with precision 1e6
        precision: 1e6,
      },
    });

    const peptidic = dbManager.databases.peptidic.sort(
      (a, b) => a.ms.em - b.ms.em,
    );

    expect(peptidic).toHaveLength(2);
    expect(peptidic).toMatchSnapshot();
  });

  it('AAKK with callback', async () => {
    let dbManager = new DBManager();
    await dbManager.fromPeptidicSequence('AAKK', {
      allowNeutralLoss: false,
      protonation: false,
      protonationPH: 7,
      ionizations: 'H+,Na+',
      fragmentation: {
        a: true,
      },
      filter: {
        callback: (value) => {
          return value.parts[0].includes('AlaAlaLys');
        },
      },
    });

    const peptidic = dbManager.databases.peptidic.sort(
      (a, b) => a.ms.em - b.ms.em,
    );

    expect(peptidic).toHaveLength(4);
    expect(peptidic).toMatchSnapshot();
  });

  it('AAKKKKKKKKKKKKKKKKKK allowNeutralLoss', async () => {
    let dbManager = new DBManager();
    await dbManager.fromPeptidicSequence('AAKKKKKKKKKKKKKKKKKK', {
      allowNeutralLoss: true,
      protonation: false,
      protonationPH: 7,
      limit: 1000000,
      ionizations: 'H+,Na+',
      fragmentation: {
        a: true,
      },
      filter: {
        minMSEM: 100,
        maxMSEM: 300,
        targetMass: 150, // just to test, this is useless with precision 1e6
        precision: 1e6,
      },
    });

    const peptidic = dbManager.databases.peptidic.sort(
      (a, b) => a.ms.em - b.ms.em,
    );

    expect(peptidic).toHaveLength(23);
    expect(peptidic).toMatchSnapshot();
  });

  it('AAKKKKKKKKKKKKKKKKKK filter callback', async () => {
    let dbManager = new DBManager();
    await dbManager.fromPeptidicSequence('AAKKKKKKKKKKKKKKKKKK', {
      ionizations: 'H+,Na+',
      fragmentation: {
        a: true,
      },
      filter: {
        callback: (entry) => entry.atoms.C * 2 === entry.atoms.H,
      },
    });

    expect(dbManager.databases.peptidic).toHaveLength(2);
  });

  it('AAKKKKKK allowNeutralLoss limit: 1000', async () => {
    let dbManager = new DBManager();
    await expect(
      dbManager.fromPeptidicSequence('AAKKKKKKKKK', {
        allowNeutralLoss: true,
        protonation: false,
        protonationPH: 7,
        limit: 100,
        ionizations: 'H+,Na+',
        fragmentation: {
          a: true,
        },

        filter: {
          minMSEM: 100,
          maxMSEM: 300,
          targetMass: 150, // just to test, this is useless with precision 1e6
          precision: 1e6,
        },
      }),
    ).rejects.toMatchInlineSnapshot(
      `[Error: processRange generates to many fragments (over 100)]`,
    );
  });

  it('Linked AA(H-1#1)AA,GG(H-1#1)GG', async () => {
    let dbManager = new DBManager();
    await dbManager.fromPeptidicSequence('AA(H-1#1)AA,GG(H-1#2)GG', {
      links: { filter: true },
      mfsArray: ['#1C6H4#2'],
      fragmentation: {
        a: true,
      },
    });

    const peptidic = dbManager.databases.peptidic
      .sort((a, b) => a.ms.em - b.ms.em)
      .map((item) => item.parts);
    expect(peptidic).toHaveLength(9);
    expect(peptidic).toMatchSnapshot();
  });

  it('Optional linked AA(H-1#1)A,GG(H-1#1)G', async () => {
    let dbManager = new DBManager();
    await dbManager.fromPeptidicSequence('AA(H-1#1)A,GG(H-1#2)G', {
      links: { filter: true },
      mfsArray: ['#1C6H4#2,'],
      fragmentation: {
        a: true,
      },
    });

    const peptidic = dbManager.databases.peptidic
      .sort((a, b) => a.ms.em - b.ms.em)
      .map((item) => item.parts);
    expect(peptidic).toHaveLength(6);
    expect(peptidic).toMatchSnapshot();
  });
});
