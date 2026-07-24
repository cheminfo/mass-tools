import { expect, test } from 'vitest';

import { getChargeAtMass, getPeaksWithCharge } from '../getPeaksWithCharge';

/**
 * An isotopologue series of `nbPeaks` peaks of a given charge, with decreasing
 * intensities. Real masses, because the tolerance on their position is relative.
 * @param {number} from - mass of the first isotopologue
 * @param {number} charge
 * @param {number} nbPeaks
 * @returns {Array<{x: number, y: number}>}
 */
function series(from, charge, nbPeaks) {
  const peaks = [];
  for (let i = 0; i < nbPeaks; i++) {
    peaks.push({ x: from + i / charge, y: 100 / (i + 1) });
  }
  return peaks;
}

test('every peak of a series takes the charge of the series', () => {
  const peaks = series(1000, 2, 4);

  const charges = getPeaksWithCharge(peaks).map((peak) => peak.charge);

  // the last one included: on its own it has nothing after it to be compared
  // with, its neighbours are what shows the charge
  expect(charges).toStrictEqual([2, 2, 2, 2]);
});

test('every returned peak is a copy carrying its charge', () => {
  const peaks = series(1000, 3, 5);

  const result = getPeaksWithCharge(peaks);

  expect(result).toHaveLength(5);
  expect(result[1]).toStrictEqual({ ...peaks[1], charge: 3 });
  expect(result[1]).not.toBe(peaks[1]);
});

test('a peak belonging to no series gets no charge', () => {
  const peaks = series(1000, 1, 3);
  const alone = { x: 1500, y: 80 };
  const all = [...peaks, alone];

  expect(getPeaksWithCharge(all).map((peak) => peak.charge)).toStrictEqual([
    1,
    1,
    1,
    undefined,
  ]);
});

test('two peaks at the right distance are not a series', () => {
  const peaks = series(1000, 2, 2);

  expect(getPeaksWithCharge(peaks).map((peak) => peak.charge)).toStrictEqual([
    undefined,
    undefined,
  ]);
});

test('two series of different charges live side by side', () => {
  const doubly = series(1000, 2, 5);
  const triply = series(1200, 3, 5);
  const peaks = [...doubly, ...triply];

  const charges = getPeaksWithCharge(peaks).map((peak) => peak.charge);

  expect(charges).toStrictEqual([2, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
});

test('the charge at a mass can be read from the result', () => {
  const peaks = series(1000, 4, 5);
  const withCharge = getPeaksWithCharge(peaks);
  const masses = Float64Array.from(withCharge, (peak) => peak.x);

  expect(getChargeAtMass(withCharge, masses, 1000.25, 20)).toBe(4);
});

test('a mass matching no peak gets no charge', () => {
  const peaks = series(1000, 4, 5);
  const withCharge = getPeaksWithCharge(peaks);
  const masses = Float64Array.from(withCharge, (peak) => peak.x);

  expect(getChargeAtMass(withCharge, masses, 1050, 20)).toBeUndefined();
});
