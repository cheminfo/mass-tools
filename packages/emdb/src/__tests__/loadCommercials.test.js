import { loadCommercials } from '../loadCommercials';

test('loadCommercials', async () => {
  let data = await loadCommercials();
  expect(data.length).toBeGreaterThan(10000);
  let first = data[0];
  expect(first.mf).toBe('Li');
  expect(first.em).toBeGreaterThan(0);
  expect(first.charge).toBe(0);
  expect(first.unsaturation).toBeDefined();
  expect(first.msem).toBeUndefined();
});
