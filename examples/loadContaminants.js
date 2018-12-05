'use strict';

const EMDB = require('../packages/emdb/src/index.js');
const emdb = new EMDB();
execute();

async function execute() {
    await emdb.loadContaminants();
    let results = emdb.searchMSEM(166.02, {
        ionizations: 'H+',
        filter: {
            precision: 10000
        }
    });

    console.log(results);
}
