'use strict';

const DBManager = require('../..');

describe('fromPeptidicSequence', () => {
  it('AAKK', () => {
    let dbManager = new DBManager();
    dbManager.fromPeptidicSequence('AAKK', {
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

  it('AAKKKKKKKKKKKKKKKKKK allowNeutralLoss', () => {
    let dbManager = new DBManager();
    dbManager.fromPeptidicSequence('AAKKKKKKKKKKKKKKKKKK', {
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

  it('AAKKKKKKKKKKKKKKKKKK filter callback', () => {
    let dbManager = new DBManager();
    dbManager.fromPeptidicSequence('AAKKKKKKKKKKKKKKKKKK', {
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

  it('AAKKKKKK allowNeutralLoss limit: 1000', () => {
    let dbManager = new DBManager();
    expect(() => {
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
      });
    }).toThrow('processRange generates to many fragments (over 100)');
  });
});
