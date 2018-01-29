'use strict';

const loadCommercial = require('../loadCommercial');

test('test loadCommercial', async () => {

    let data = await loadCommercial();

    expect(data.length).toBeGreaterThan(10000);
    let first = data[0];
    expect(first.mf).toBe('Li');
    expect(first.em).toBeGreaterThan(0);
    expect(first.charge).toBe(0);
    expect(first.msem).toBeUndefined();
});
