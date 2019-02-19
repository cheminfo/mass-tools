'use strict';

const DBManager = require('..');

test('test fromArray', () => {
  let dbManager = new DBManager();
  dbManager.fromArray(['C.N', 'N.O']);
  expect(dbManager.databases.generated).toHaveLength(4);
});

test('test fromArray with groups', () => {
  let dbManager = new DBManager();
  dbManager.fromArray(['(CH2)0-2N0-1', 'O0-1']);
  expect(dbManager.databases.generated).toHaveLength(12);
  let mfs = dbManager.databases.generated.map((entry) => entry.mf).sort();
  expect(mfs).toStrictEqual([
    '',
    'C2H4',
    'C2H4N',
    'C2H4NO',
    'C2H4O',
    'CH2',
    'CH2N',
    'CH2NO',
    'CH2O',
    'N',
    'NO',
    'O'
  ]);
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
