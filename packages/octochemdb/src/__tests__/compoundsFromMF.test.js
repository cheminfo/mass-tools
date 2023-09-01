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
    const url = 'http://localhost/data/compoundsFromMF.json';

    let data = await compoundsFromMF('C5H10', {
      url,
      fields: 'data.ocl.idCode,data.ocl.index,data.iupac,data.mf',
    });
    const entry = data.filter((datum) => datum.data.iupac === 'pentane')[0];
    expect(entry.data.title).toBe('(1,5-Pentanediyl)radical');
  }, 30000);
});
