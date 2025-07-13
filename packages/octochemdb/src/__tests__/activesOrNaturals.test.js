import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { activesOrNaturals } from '../activesOrNaturals.js';

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

describe('activesOrNaturals', () => {
  it('simple case', async () => {
    let data = await activesOrNaturals({
      baseURL: 'http://localhost/',
      route: 'data/activesOrNaturalsSimple.json',
      masses: 300.123,
      ionizations: '(H+)2, H+',
      precision: 1,
      limit: 100,
    });

    expect(data).toHaveLength(100);
  });

  it('with range', { timeout: 30_000 }, async () => {
    let data = await activesOrNaturals({
      baseURL: 'http://localhost/',
      route: 'data/activesOrNaturalsWithRange.json',
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

  it('with range and many ionizations', { timeout: 30_000 }, async () => {
    let data = await activesOrNaturals({
      baseURL: 'http://localhost/',
      route: 'data/activesOrNaturalsRangeAndIonization.json',
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

  it('search by keywords', { timeout: 300_000 }, async () => {
    let data = await activesOrNaturals({
      baseURL: 'http://localhost/',
      route: 'data/activesOrNaturalsKeywords.json',
      kwMeshTerms: 'antibiotic',
      limit: 10,
      fields: 'data',
    });
    const fields = new Set();
    for (const entry of data) {
      for (const field of Object.keys(entry.data)) {
        fields.add(field);
      }
    }

    expect([...fields].sort()).toStrictEqual([
      'activities',
      'bioactive',
      'cas',
      'charge',
      'em',
      'kwActiveAgainst',
      'kwBioassays',
      'kwMeshTerms',
      'kwTaxonomies',
      'kwTitles',
      'mf',
      'molecules',
      'naturalProduct',
      'nbActivities',
      'nbMassSpectra',
      'nbMolecules',
      'nbPatents',
      'nbPubmeds',
      'nbTaxonomies',
      'noStereoOCL',
      'patents',
      'pubmeds',
      'taxonomies',
      'titles',
      'unsaturation',
    ]);
  });

  it('noStereoTautomerID case', async () => {
    let data = await activesOrNaturals({
      baseURL: 'http://localhost/',
      route: 'data/activesOrNaturalsSimple.json',
      noStereoTautomerID:
        'ei]REH@MLd^^Dbnco`XZVP@cIEHeDeDidhdmMbimEIUDYGKOFejjjjjjjjjjjjjjh@CWjcGFELZXlpy`KDVDlYXjpuck@vEl[XNp}c{ANJ\\RxUq~fFEUl_CGpwu[Gpq|MSTq|L_C@',
    });

    expect(data).toHaveLength(1);
  });
});
