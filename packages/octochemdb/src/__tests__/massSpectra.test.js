import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { massSpectra } from '../massSpectra.js';

describe('massSpectra', () => {
  it('simple case', { timeout: 30_000 }, async () => {
    const resultsAll = await massSpectra({
      limit: 100,
      masses: [100, 200, 300],
      precision: 200,
      modifications: 'CH2,O-1',
      uniqueMolecules: false,
    });

    const resultsUnique = await massSpectra({
      masses: [100, 200, 300],
      precision: 200,
      modifications: 'CH2,O-1',
      uniqueMolecules: true,
    });

    expect(resultsAll.length).toBeGreaterThan(resultsUnique.length);
  });

  // calling massSpectra with a single mass is too slow. Need to more the API or add a test without calling the API
  it.todo('mdma and mass', { timeout: 10_000 }, async () => {
    const peaks = JSON.parse(
      readFileSync(path.join(__dirname, './mdma.json'), 'utf8'),
    );

    let results = await massSpectra({
      limit: 100,
      masses: [163.07519620166275, 133.06465132824812, 105.06969463079821],
      precision: 100,
    });

    expect(results.length).toBeGreaterThan(40);

    results = await massSpectra({
      limit: 100,
      masses: [163.07519620166275, 133.06465132824812, 105.06969463079821],
      precision: 100,
      similarity: {}, // by default minSimilarity is 0.2 but no experimental spectrum is provided so no filtering
    });

    expect(results.length).toBeGreaterThan(40);

    results = await massSpectra({
      limit: 100,
      masses: [163.07519620166275, 133.06465132824812, 105.06969463079821],
      precision: 100,
      similarity: {
        experimental: {
          x: peaks.map((peak) => peak.x),
          y: peaks.map((peak) => peak.y),
        },
      }, // by default minSimilarity is 0.2 but no experimental spectrum is provided so no filtering
    });

    expect(results.length).toBeGreaterThan(5);
    expect(results.length).toBeLessThan(200);

    results = await massSpectra({
      masses: [163.07519620166275, 133.06465132824812, 105.06969463079821],
      precision: 100,
      similarity: {
        experimental: {
          x: peaks.map((peak) => peak.x),
          y: peaks.map((peak) => peak.y),
        },
        minSimilarity: 0.8,
      },
    });

    expect(results.length).toBeGreaterThan(2);
    expect(results.length).toBeLessThan(20);
  });

  it('mdma and mf', { timeout: 30_000 }, async () => {
    let results = await massSpectra({
      limit: 100,
      mf: 'C11H15NO2',
    });

    expect(results.length).toBeGreaterThan(5);
    expect(results.length).toBeLessThan(50);
  });

  // skip for now, inSilicoFragments is not ready
  it.todo('mdma in inSilicoFragments', { timeout: 10_000 }, async () => {
    const options = {
      limit: 100,
      masses: [194.117555, 163.075356, 135.044055],
      precision: 100,
      modes: 'positive',
      databases: ['inSilicoFragments'],
    };
    let results = await massSpectra(options);

    // mdma and mdma-HCL
    expect(results.length).toBeGreaterThan(1);

    results = await massSpectra({
      ...options,
      modes: 'negative',
    });

    expect(results).toHaveLength(0);

    results = await massSpectra({
      ...options,
      modes: 'positive',
      databases: ['inSilicoFragments', 'massBank', 'gnps'],
    });

    expect(results[0].url).toMatchInlineSnapshot(
      '"https://massbank.eu/MassBank/RecordDisplay?id=MSBNK-Washington_State_Univ-BML00795"',
    );
  });
});
