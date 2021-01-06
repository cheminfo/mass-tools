'use strict';

const searchPubchem = require('../searchPubchem.js');

describe('searchPubchem', () => {
  it('simple case', async () => {
    let data = await searchPubchem(60, {
      ionizations: '(H+)2, H+',
      precision: 10,
    });
    expect(data).toHaveLength(2);
    expect(data).toMatchSnapshot();
  });


  it('highly precise', async () => {
    let data = await searchPubchem(81.06987671016094, {
      ionizations: 'H+',
      precision: 1,
    });
    expect(data).toHaveLength(1);
  });

});

