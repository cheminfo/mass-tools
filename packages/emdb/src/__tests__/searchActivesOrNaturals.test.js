'use strict';

const searchActivesOrNaturals = require('../searchActivesOrNaturals.js');

describe('searchActivesOrNaturals', () => {
  it('simple case', async () => {
    let data = await searchActivesOrNaturals(300.123, {
      ionizations: '(H+)2, H+',
      precision: 1,
      limit: 100,
      url: 'https://pubchem-beta.cheminfo.org/activesOrNaturals/v1/fromEM',
    });
    expect(data.length).toBeGreaterThan(2);
    expect(data[0].molecules.length).toBeGreaterThan(0);
  });
  it('with range', async () => {
    let data = await searchActivesOrNaturals(300.123, {
      ionizations: '(H+)2, H+',
      precision: 1000,
      ranges: 'C0-100 H0-100 O0-100 N0-100 Br0-100 S0',
      limit: 100,
      url: 'https://pubchem-beta.cheminfo.org/activesOrNaturals/v1/fromEM',
    });
    expect(data.length).toBeGreaterThan(2);
    expect(data[0].molecules.length).toBeGreaterThan(0);
  });
});
