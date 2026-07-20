import { describe, expect, it } from 'vitest';

import { compoundsFromMF } from '../compoundsFromMF';

import { useMockServer } from './testServer.js';

useMockServer();

describe('compoundsFromMF', { timeout: 30_000 }, () => {
  it('simple case', async () => {
    const baseURL = 'http://localhost/data/';
    const route = 'compoundsFromMF.json';
    let data = await compoundsFromMF('C5H10', {
      baseURL,
      route,
      fields: 'data.ocl.idCode,data.ocl.index,data.iupac,data.mf',
    });
    const entry = data.find((datum) => datum.data.iupac === 'pent-2-ene');

    expect(entry.data.title).toBe('Pent-2-ene');
  });
});
