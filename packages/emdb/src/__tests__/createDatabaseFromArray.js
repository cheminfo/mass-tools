'use strict';

const DBManager = require('..');

test('test createDatatabaseFromArray', async () => {
    let dbManager = new DBManager();
    dbManager.createDatatabaseFromArray(['C.N','N.O']);
    expect(dbManager.databases.created.length).toBe(4);
});
