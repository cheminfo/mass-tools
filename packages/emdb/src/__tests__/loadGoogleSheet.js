'use strict';

const loadGoogleSheet = require('../loadGoogleSheet');

test('test load google sheet', async () => {

    let data = await loadGoogleSheet();

    console.log('xx', data.length);


    // expect(myModule()).toEqual(42);

});
