import { expect, test } from 'vitest';

import { EMDB } from '..';

test('EMDB contaminants and knapSack', async () => {
  let emdb = new EMDB();

  await emdb.loadContaminants();
  await emdb.loadKnapSack();

  expect(emdb.listDatabases()).toStrictEqual(['contaminants', 'knapSack']);
  expect(emdb.get('contaminants').length).toBeGreaterThan(1000);
}, 30000);

test('EMDB fromMonoisotopicMass', async () => {
  let emdb = new EMDB();

  await emdb.fromMonoisotopicMass(300, { ionizations: 'H+,Na+' });

  expect(emdb.listDatabases()).toStrictEqual(['monoisotopic']);
  expect(emdb.get('monoisotopic').length).toBeGreaterThan(100);
});
