'use strict';

const DBManager = require('..');

test('test fromArray', () => {
    let dbManager = new DBManager();
    dbManager.fromPeptidicSequence('AAKK', {
        allowNeutralLoss: false,
        protonation: false,
        protonationPH: 7,

    });

    console.log(dbManager.databases.peptidic.length);

    dbManager.databases.peptidic.forEach((e) => console.log(e.mf));
    //  expect(dbManager.databases.peptidic).toHaveLength(4);
});
