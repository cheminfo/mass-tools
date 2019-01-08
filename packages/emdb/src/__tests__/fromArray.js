'use strict';

const DBManager = require('..');

test('test fromArray', () => {
  let dbManager = new DBManager();
  dbManager.fromArray(['C.N', 'N.O']);
  expect(dbManager.databases.generated).toHaveLength(4);
});

test('test fromArray of array', () => {
  let dbManager = new DBManager();
  dbManager.fromArray(['C.N', ['Cl0-1', 'Br0-1']]);
  let result = dbManager
    .get('generated')
    .map((entry) => entry.mf)
    .sort()
    .join();
  expect(result).toBe('BrN,C,CBr,CCl,ClN,N');
});
