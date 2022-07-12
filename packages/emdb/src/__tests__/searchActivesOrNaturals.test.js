'use strict';

const searchActivesOrNaturals = require('../searchActivesOrNaturals.js');

describe('searchActivesOrNaturals', () => {
  it('simple case', async () => {
    let data = await searchActivesOrNaturals(300.123, {
      ionizations: '(H+)2, H+',
      precision: 1,
      limit: 100,
    });
    expect(data.length).toBeGreaterThan(2);
    expect(data[0].molecules.length).toBeGreaterThan(0);
  });
});
