import { searchAndGroupActivesOrNaturals } from '../searchAndGroupActivesOrNaturals.js';

describe('searchAndGroupActivesOrNaturals', () => {
  it('simple case', async () => {
    let data = await searchAndGroupActivesOrNaturals({
      masses: 300.123,
      ionizations: '(H+)2, H+',
      precision: 1,
      limit: 100,
    });
    expect(data.length).toBeGreaterThan(2);
  });

  it('with range', async () => {
    let data = await searchAndGroupActivesOrNaturals({
      masses: 300.123,
      ionizations: '(H+)2, H+, Na+',
      precision: 1000,
      ranges: 'C0-100 H0-100 O0-100 N0-100 Br0-100',
      limit: 10000,
    });

    expect(data.length).toBeGreaterThan(2);

    const nbNaturals = data.reduce((sum, value) => sum + value.nbNaturals, 0);
    const nbBioactives = data.reduce(
      (sum, value) => sum + value.nbBioactives,
      0,
    );
    const nbPatents = data.reduce((sum, value) => sum + value.nbPatents, 0);
    const nbPubmeds = data.reduce((sum, value) => sum + value.nbPubmeds, 0);
    const nbMassSpectra = data.reduce(
      (sum, value) => sum + value.nbMassSpectra,
      0,
    );

    expect(nbNaturals).toBeGreaterThan(1000);
    expect(nbBioactives).toBeGreaterThan(1000);
    expect(nbPatents).toBeGreaterThan(1000);
    expect(nbPubmeds).toBeGreaterThan(1000);
    expect(nbMassSpectra).toBeGreaterThan(1000);
  });
});