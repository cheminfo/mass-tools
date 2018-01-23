'use strict';

const DBManager = require('..');

test('test fromMonoisotopicMass', () => {
    let dbManager = new DBManager();
    dbManager.fromMonoisotopicMass(120, {
        allowNeutral: true
    });
    expect(dbManager.databases.monoisotopic).toHaveLength(8);
});

test('test fromMonoisotopicMass with modifications', () => {
    let dbManager = new DBManager();
    dbManager.fromMonoisotopicMass(120, {
        modifications: ', H+, K+',
        precision: 100,
    });
    expect(dbManager.databases.monoisotopic).toHaveLength(9);
});
