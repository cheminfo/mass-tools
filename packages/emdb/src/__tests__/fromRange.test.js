'use strict';

const DBManager = require('..');

test('fromRange', () => {
  let dbManager = new DBManager();
  dbManager.fromRange('C1-10, H1-10; Cl0-1 Br0-1');
  expect(dbManager.databases.generated).toHaveLength(80);
});
