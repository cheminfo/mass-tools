'use strict';

const DBManager = require('..');

test('test fromArray', () => {
    let dbManager = new DBManager();
    dbManager.fromPeptidicSequence('AAKK', {
        allowNeutralLoss: false,
        protonation: false,
        protonationPH: 7,
        ionizations: 'H+,Na+',
        fragmentation: {
            a: true
        },
        mfFilter: {
            minMSEM: 100,
            maxMSEM: 300
        },
    });

    expect(dbManager.databases.peptidic).toHaveLength(2);
    expect(dbManager.databases.peptidic).toMatchSnapshot();
});
