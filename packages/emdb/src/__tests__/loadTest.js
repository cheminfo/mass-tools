'use strict';

const DBManager = require('..');

test('test loadTest', () => {
  let dbManager = new DBManager();
  dbManager.loadTest();
  expect(dbManager.databases.test).toMatchSnapshot();
});
