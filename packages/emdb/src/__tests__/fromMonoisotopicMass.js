'use strict';

const DBManager = require('..');

test('test fromMonoisotopicMass', async () => {
    let dbManager = new DBManager();
    dbManager.fromMonoisotopicMass(120, {
        allowNeutral: true
    });
    expect(dbManager.databases.monoisotopic).toHaveLength(8);
});
