'use strict';

const DBManager = require('..');

test('test searchEM', async () => {

    let dbManager = new DBManager(); 
    await dbManager.loadContaminants();

    let result = dbManager.searchEM(100.123);

    console.log(result);
    
});
