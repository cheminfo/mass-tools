'use strict';

const DBManager = require('..');

test('test DBManager contaminants and knapSack', async () => {
  let dbManager = new DBManager();

  await dbManager.loadContaminants();
  await dbManager.loadKnapSack();

  expect(dbManager.listDatabases()).toEqual(['contaminants', 'knapSack']);
  expect(dbManager.get('contaminants').length).toBeGreaterThan(1000);
}, 30000);

test('test DBManager fromMonoisotopicMass', () => {
  let dbManager = new DBManager();

  dbManager.fromMonoisotopicMass(300, { ionizations: 'H+,Na+' });

  expect(dbManager.listDatabases()).toEqual(['monoisotopic']);
  expect(dbManager.get('monoisotopic').length).toBeGreaterThan(100);
});
