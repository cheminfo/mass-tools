import { expect, test } from 'vitest';

import { appendAndFilterSimilarity, uniqueMol } from '../massSpectra.js';

const experimental = { x: [100, 120, 140], y: [100, 50, 25] };

function candidate(id, ocl, spectrumData) {
  return { _id: id, data: { ocl, spectrum: { data: spectrumData } } };
}

function score(candidates, similarity = {}) {
  return appendAndFilterSimilarity(candidates, {
    precision: 50,
    similarity: { experimental, nbPeaks: 3, minSimilarity: 0.2, ...similarity },
  });
}

test('scores intensity spectra with the weighted cosine, filters and sorts', () => {
  const results = score([
    // disjoint masses → cosine 0, dropped
    candidate('miss', { idCode: 'far' }, { x: [10, 20], y: [1, 1] }),
    // partial overlap → lower cosine
    candidate(
      'partial',
      { idCode: 'mid' },
      { x: [100, 120, 999], y: [100, 50, 1] },
    ),
    // identical → cosine ~1
    candidate(
      'exact',
      { idCode: 'near' },
      { x: [100, 120, 140], y: [100, 50, 25] },
    ),
  ]);

  expect(results.map((result) => result._id)).toStrictEqual([
    'exact',
    'partial',
  ]);
  expect(results[0].similarity.cosine).toBeCloseTo(1, 6);
  expect(results[1].similarity.cosine).toBeLessThan(0.999);
});

test('scores intensity-less in-silico fragments without throwing', () => {
  const results = score([
    candidate(
      'insilico',
      { noStereoTautomerID: 'nst' },
      { x: [100, 120, 140] },
    ),
  ]);

  expect(results).toHaveLength(1);
  expect(results[0].similarity.nbCommonPeaks).toBe(3);
  expect(results[0].similarity.cosine).toBeGreaterThan(0.2);
});

test('skips entries without spectrum data', () => {
  const results = score([
    { _id: 'empty', data: { ocl: { idCode: 'x' }, spectrum: {} } },
    candidate('ok', { idCode: 'y' }, { x: [100, 120, 140], y: [100, 50, 25] }),
  ]);

  expect(results.map((result) => result._id)).toStrictEqual(['ok']);
});

test('returns results unchanged when no experimental spectrum is provided', () => {
  const candidates = [candidate('a', { idCode: 'x' }, { x: [100], y: [1] })];

  expect(appendAndFilterSimilarity(candidates, {})).toBe(candidates);
});

test('uniqueMol keeps one entry per molecule, keyed by idCode then noStereoTautomerID', () => {
  const results = uniqueMol([
    candidate('a-hi', { idCode: 'same' }, {}),
    candidate('a-lo', { idCode: 'same' }, {}),
    candidate('insilico', { noStereoTautomerID: 'nst' }, {}),
    { _id: 'no-key', data: { ocl: {} } },
  ]);

  expect(results.map((result) => result._id)).toStrictEqual([
    'a-hi',
    'insilico',
  ]);
});
