'use strict';

const DBManager = require('../DBManager');

test('test DBManager', async () => {

    let dbManager = new DBManager();

    console.log(dbManager);

    await dbManager.loadContaminants();
    await dbManager.loadKnapSack();

    expect(dbManager.listDatabases()).toEqual();

});
