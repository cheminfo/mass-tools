import { EMDB } from '../..';

test('fromMonoisotopicMass', async () => {
  let emdb = new EMDB();
  await emdb.fromMonoisotopicMass(120, {
    allowNeutral: true,
  });
  expect(emdb.databases.monoisotopic).toHaveLength(8);
});

test('fromMonoisotopicMass string', async () => {
  let emdb = new EMDB();
  await emdb.fromMonoisotopicMass('120,60', {
    allowNeutral: true,
  });
  expect(emdb.databases.monoisotopic).toHaveLength(10);
});

test('fromMonoisotopicMass array', async () => {
  let emdb = new EMDB();
  await emdb.fromMonoisotopicMass([60, 120], {
    allowNeutral: true,
  });
  expect(emdb.databases.monoisotopic).toHaveLength(10);
});

test('fromMonoisotopicMass with ionizations', async () => {
  let emdb = new EMDB();
  await emdb.fromMonoisotopicMass(120, {
    allowNeutral: false,
    ionizations: ', H+, K+',
    precision: 100,
  });
  expect(emdb.databases.monoisotopic).toHaveLength(9);
});

test('fromMonoisotopicMass large database', async () => {
  let emdb = new EMDB();
  await emdb.fromMonoisotopicMass(1000, {
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
  expect(emdb.databases.monoisotopic).toHaveLength(1407);
});
