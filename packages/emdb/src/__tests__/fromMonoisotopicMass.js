'use strict';

const DBManager = require('..');

test('test fromMonoisotopicMass', () => {
    let dbManager = new DBManager();
    dbManager.fromMonoisotopicMass(120, {
        allowNeutral: true
    });
    expect(dbManager.databases.monoisotopic).toHaveLength(8);
});

test('test fromMonoisotopicMass with ionizations', () => {
    let dbManager = new DBManager();
    dbManager.fromMonoisotopicMass(120, {
        ionizations: ', H+, K+',
        precision: 100,
    });
    expect(dbManager.databases.monoisotopic).toHaveLength(9);
});

test('test fromMonoisotopicMass large database', () => {
    let dbManager = new DBManager();
    dbManager.fromMonoisotopicMass(1000, {
        ranges: 'C0-100 H0-100 N0-100 O0-100',
        minUnsaturation: 0,
        maxUnsaturation: 100,
        precision: 100,
        onlyIntegerUnsaturation: true,
        allowNeutral: true,
    });
    expect(dbManager.databases.monoisotopic).toHaveLength(1407);
});
