'use strict';

const loadGoogleSheet = require('../loadGoogleSheet');

test('test loadKnapSack', async () => {

    let data = await loadGoogleSheet();

    console.log('xx', data.length);


    // expect(myModule()).toEqual(42);

});
