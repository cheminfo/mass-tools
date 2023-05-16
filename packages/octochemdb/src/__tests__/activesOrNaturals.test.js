import { activesOrNaturals } from '../activesOrNaturals.js';

describe('activesOrNaturals', () => {
  it('simple case', async () => {
    let data = await activesOrNaturals({
      masses: 300.123,
      ionizations: '(H+)2, H+',
      precision: 1,
      limit: 100,
    });
    expect(data.length).toBe(100);
  });
  it('with range', async () => {
    let data = await activesOrNaturals({
      masses: 300.123,
      ionizations: 'H+',
      precision: 3,
      ranges: 'C0-100 H0-100 O0-100 N0-100 Br0-100 S0 P0',
      limit: 100,
    });

    const uniqueMFs = new Set();
    for (const entry of data) {
      uniqueMFs.add(entry.data.mf);
    }
    expect([...uniqueMFs]).toStrictEqual(['C17H17NO4']);
  });

  it('with range and many ionizations', async () => {
    let data = await activesOrNaturals({
      masses: 300.123,
      ionizations: 'H+,(H+)2',
      precision: 3,
      ranges: 'C0-100 H0-100 O0-100 N0-100 Br0-100 S0 P0',
      limit: 100,
    });

    const uniqueMFs = new Set();
    for (const entry of data) {
      uniqueMFs.add(entry.data.mf);
    }
    expect([...uniqueMFs]).toStrictEqual(['C17H17NO4', 'C34H34N2O8']);
  });

  it('search by keywords', async () => {
    let data = await activesOrNaturals({
      kwMeshTerms: 'antibiotic',
      limit: 5,
      fields: 'data',
    });
    expect(Object.keys(data[0].data).sort()).toStrictEqual([
      'bioactive', 'charge',
      'compounds', 'em',
      'kwMeshTerms', 'mf',
      'naturalProduct', 'nbActivities',
      'nbMassSpectra', 'nbPatents',
      'nbPubmeds', 'nbTaxonomies',
      'noStereoOCL', 'patents',
      'pubmeds', 'unsaturation'
    ]);
  });
});
