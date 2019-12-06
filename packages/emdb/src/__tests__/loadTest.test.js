'use strict';

const DBManager = require('..');

test('loadTest', () => {
  let dbManager = new DBManager();
  dbManager.loadTest();
  expect(dbManager.databases.test).toMatchSnapshot();
});
