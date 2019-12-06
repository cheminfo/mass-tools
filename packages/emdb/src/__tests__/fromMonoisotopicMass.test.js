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
    unsaturation: {
      min: 0,
      max: 100,
      onlyInteger: true,
    },
    precision: 100,
    allowNeutral: true,
  });
  expect(dbManager.databases.monoisotopic).toHaveLength(1407);
});
