'use strict';

const DBManager = require('..');

test('loadTest', async () => {
  let dbManager = new DBManager();
  await dbManager.loadTest();
  expect(dbManager.databases.test).toMatchSnapshot();
});
