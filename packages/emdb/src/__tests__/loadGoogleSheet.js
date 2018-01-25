'use strict';

const loadGoogleSheet = require('../loadGoogleSheet');

test('test load google sheet', async () => {

    let data = await loadGoogleSheet();
    expect(data.length).toBeGreaterThan(1000);

    let first = data[0];
    expect(first.mf).toBe('CN');
    expect(first.modification).toEqual({ charge: -1, em: 0, mf: '(-)' });
    expect(first.em).toBeGreaterThan(0);
    expect(first.charge).not.toBe(0);
    expect(first.msem).toBeGreaterThan(0);
});
