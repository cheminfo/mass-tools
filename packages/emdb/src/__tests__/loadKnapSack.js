'use strict';

const loadKnapSack = require('../loadKnapSack');

test('test loadKnapSack', async () => {

    let data = await loadKnapSack();
    expect(data.length).toBeGreaterThan(1000);

    let first = data[0];
    expect(first.mf).toBe('H3N');
    expect(first.em).toBeGreaterThan(0);
    expect(first.charge).not.toBe(0);
    expect(first.msem).toBeUndefined();
});
