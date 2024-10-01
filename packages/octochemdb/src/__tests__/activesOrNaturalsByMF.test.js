import { activesOrNaturalsByMF } from '../activesOrNaturalsByMF.js';

import { server } from './testServer';

// Enable request interception.
beforeAll(() => {
  server.listen();
});
// Reset handlers so that each test could alter them
//without affecting other, unrelated tests.
afterEach(() => server.resetHandlers());

// Don't forget to clean up afterwards.
afterAll(() => {
  server.close();
});
describe('activesOrNaturalsByMF', () => {
  it('simple case', async () => {
    let data = await activesOrNaturalsByMF({
      url: 'http://localhost/data/activesOrNaturalsByMFSimple.json',
      masses: 300.123,
      ionizations: '(H+)2, H+',
      precision: 1,
      limit: 100,
    });
    expect(data.length).toBeGreaterThan(2);
  }, 30000);

  it('with range', async () => {
    let entries = await activesOrNaturalsByMF({
      url: 'http://localhost/data/activesOrNaturalsByMFRange.json',
      masses: 300.123,
      ionizations: '(H+)2, H+, Na+',
      precision: 1000,
      ranges: 'C0-100 H0-100 O0-100 N0-100 Br0-100',
      limit: 100,
    });

    expect(entries.length).toBeGreaterThan(2);

    const nbNaturals = entries.reduce(
      (sum, value) => sum + value.nbNaturals,
      0,
    );
    const nbBioactives = entries.reduce(
      (sum, value) => sum + value.nbBioactives,
      0,
    );
    const nbPatents = entries.reduce((sum, value) => sum + value.nbPatents, 0);
    const nbPubmeds = entries.reduce((sum, value) => sum + value.nbPubmeds, 0);
    const nbMassSpectra = entries.reduce(
      (sum, value) => sum + value.nbMassSpectra,
      0,
    );

    expect(nbNaturals).toBeGreaterThan(3);
    expect(nbBioactives).toBeGreaterThan(33);
    expect(nbPatents).toBeGreaterThan(238);
    expect(nbPubmeds).toBeGreaterThan(36);
    expect(nbMassSpectra).toBeGreaterThanOrEqual(0);
  }, 30000);
});
