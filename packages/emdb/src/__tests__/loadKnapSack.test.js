'use strict';

const loadKnapSack = require('../loadKnapSack');

jest.setTimeout(30000);
test('loadKnapSack', async () => {
  let data = await loadKnapSack();

  expect(data.length).toBeGreaterThan(40000);

  let first = data[0];
  expect(first.mf).toBe('H3N');
  expect(first.em).toBeGreaterThan(0);
  expect(first.charge).toBe(0);
  expect(first.msem).toBeUndefined();
});
