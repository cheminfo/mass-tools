import { compoundsFromMF } from '../compoundsFromMF';

import { server } from './testServer';

// Enable request interception.
beforeAll(() => {
  server.listen();
});
// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => server.resetHandlers());

// Don't forget to clean up afterwards.
afterAll(() => {
  server.close();
});

describe('compoundsFromMF', () => {
  it('simple case', async () => {
    const baseURL = 'http://localhost/data/';
    const route = 'compoundsFromMF.json';
    let data = await compoundsFromMF('C5H10', {
      baseURL,
      route,
      fields: 'data.ocl.idCode,data.ocl.index,data.iupac,data.mf',
    });
    const entry = data.filter((datum) => datum.data.iupac === 'pent-2-ene')[0];
    expect(entry.data.title).toBe('2-Pentene');
  }, 30000);
});
