'use strict';

const searchPubchem = require('../searchPubchem.js');

test('test searchPubchem', async () => {
  let data = await searchPubchem(60, {
    ionizations: '(H+)2, H+',
    precision: 10
  });
  expect(data).toMatchSnapshot();
});
