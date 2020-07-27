'use strict';

const DBManager = require('..');

describe('fromPeptidicSequence', () => {
  test('AAKK', () => {
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

    expect(dbManager.databases.peptidic).toHaveLength(2);
    expect(dbManager.databases.peptidic).toMatchSnapshot();
  });

  test('AAKKKKKKKKKKKKKKKKKK allowNeutralLoss', () => {
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
    expect(dbManager.databases.peptidic).toHaveLength(23);
    expect(dbManager.databases.peptidic).toMatchSnapshot();
  });

  test('AAKKKKKK allowNeutralLoss limit: 1000', () => {
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
