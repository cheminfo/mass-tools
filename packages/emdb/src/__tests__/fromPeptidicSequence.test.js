'use strict';

const DBManager = require('..');

test('test fromPeptidicSequence', () => {
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
