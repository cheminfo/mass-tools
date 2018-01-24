'use strict';

const DBManager = require('..');

test('test DBManager', async () => {
    let dbManager = new DBManager();

    await dbManager.loadContaminants();
    await dbManager.loadKnapSack();

    expect(dbManager.listDatabases()).toEqual(['contaminants', 'knapSack']);
    expect(dbManager.get('contaminants').length).toBeGreaterThan(1000);

});
