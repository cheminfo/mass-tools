'use strict';

const DBManager = require('..');

test('fromMonoisotopicMass', () => {
  let dbManager = new DBManager();
  dbManager.fromMonoisotopicMass(120, {
    allowNeutral: true,
  });
  expect(dbManager.databases.monoisotopic).toHaveLength(8);
});

test('fromMonoisotopicMass with ionizations', () => {
  let dbManager = new DBManager();
  dbManager.fromMonoisotopicMass(120, {
    allowNeutral: false,
    ionizations: ', H+, K+',
    precision: 100,
  });
  expect(dbManager.databases.monoisotopic).toHaveLength(9);
});

test('fromMonoisotopicMass large database', () => {
  let dbManager = new DBManager();
  dbManager.fromMonoisotopicMass(1000, {
    ranges: 'C0-100 H0-100 N0-100 O0-100',
    filter: {
      unsaturation: {
        min: 0,
        max: 100,
        onlyInteger: true,
      },
    },
    precision: 100,
    allowNeutral: true,
    limit: 10000,
  });
  expect(dbManager.databases.monoisotopic).toHaveLength(1407);
});

test('fromMonoisotopicMass with charge', () => {
  let dbManager = new DBManager();
  dbManager.fromMonoisotopicMass(12, {
    ranges: 'C0-100 H0-10 (+)1-2 (+)0-3',
    filter: {
      unsaturation: {
        min: 0,
        max: 100,
        onlyInteger: false,
      },
    },
    precision: 100,
    allowNeutral: false,
    limit: 10000,
  });
  let mfs = dbManager.databases.monoisotopic;
  for (let mf of mfs) {
    expect(mf.atoms.C).toEqual(mf.charge);
  }
  expect(mfs).toHaveLength(8);
});

test('fromMonoisotopicMass C0-10 H-10 F0-10 Cl0-10 (-) 55 .', () => {
  let dbManager = new DBManager();
  dbManager.fromMonoisotopicMass(55, {
    ranges: 'H F Cl (-1)0-8',
    filter: {
      unsaturation: {
        min: 0,
        max: 100,
        onlyInteger: false,
      },
    },
    precision: 1000,
    allowNeutral: false,
    limit: 10000,
  });
  let mfs = dbManager.databases.monoisotopic;
  expect(mfs).toHaveLength(1);
  expect(mfs[0].mf).toBe('Cl(-1)HF');
});
