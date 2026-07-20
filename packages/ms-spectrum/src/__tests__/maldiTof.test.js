import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from 'vitest';
import { parseXY } from 'xy-parser';

import { Spectrum } from '../Spectrum';
import { getPeakChargeBySimilarity } from '../getPeakChargeBySimilarity';

/**
 * A slice of a MALDI-TOF spectrum of a tryptic digest, acquired in linear mode
 * on a Bruker autoflex. A time of flight is sampled evenly in time, so the m/z
 * step grows with the m/z: it is 0.33 Da here, way over the 0.1 Da that a
 * profile spectrum was allowed to have.
 * @returns {Spectrum}
 */
function loadMaldiTof() {
  const text = readFileSync(
    path.join(__dirname, 'data/maldiTofSlice.txt'),
    'utf8',
  );
  return new Spectrum(parseXY(text));
}

test('a coarsely sampled time of flight is a profile spectrum', () => {
  const spectrum = loadMaldiTof();
  const { x } = spectrum.data;
  const steps = [];
  for (let i = 0; i < x.length - 1; i++) steps.push(x[i + 1] - x[i]);
  const median = steps.toSorted((a, b) => a - b)[steps.length >> 1];

  expect(median).toBeCloseTo(0.33, 2);
  expect(spectrum.isContinuous()).toBe(true);
});

test('the charge of an unresolved envelope can not be evaluated', () => {
  const spectrum = loadMaldiTof();

  // the peak is 4.6 Da wide, the isotopologues of a charge 3 would be 0.33 Da
  // apart: they are not resolved, so no charge can be given
  const peaks = spectrum.getPeaks({ from: 3025.5, to: 3028.5, threshold: 0 });

  expect(peaks).toHaveLength(1);
  expect(peaks[0].x).toBeCloseTo(3026.06, 1);
  expect(peaks[0].width).toBeGreaterThan(3);

  const charge = getPeakChargeBySimilarity(spectrum, 3026.0767, {
    similarity: {
      zone: { low: -0.5, high: 2.5 },
      widthBottom: 0.1,
      widthTop: 0.1,
    },
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBeUndefined();
});

test('the raw sampling step aliases with the charge 3 isotopologues', () => {
  // why the charge used to be evaluated to 3: the step of this time of flight
  // is 0.329 Da around m/z 3026, and the isotopologues of a charge 3 are
  // 0.333 Da apart. Every raw point falls on a theoretical isotopologue.
  const spectrum = loadMaldiTof();
  const { x } = spectrum.data;
  let index = 0;
  while (x[index] < 3026) index++;
  const step = x[index + 1] - x[index];

  expect(step).toBeCloseTo(1 / 3, 2);
});
