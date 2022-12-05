import { loadGoogleSheet } from '../loadGoogleSheet';

test('load google sheet', async () => {
  let data = await loadGoogleSheet();
  expect(data.length).toBeGreaterThan(1000);

  let first = data[0];
  expect(first.mf).toBe('CN');
  expect(first.ionization).toStrictEqual({
    charge: -1,
    em: 0,
    mf: '(-)',
    atoms: {},
  });
  expect(first.em).toBeGreaterThan(0);
  expect(first.ms.charge).not.toBe(0);
  expect(first.ms.em).toBeGreaterThan(0);
}, 10000);
