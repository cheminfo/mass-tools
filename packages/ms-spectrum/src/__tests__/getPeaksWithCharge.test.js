import { expect, test } from 'vitest';

import { getPeaksWithCharge } from '../getPeaksWithCharge';

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

  const charges = getPeaksWithCharge(peaks, peaks).map((peak) => peak.charge);

  // the last one included: on its own it has nothing after it to be compared
  // with, its neighbours are what shows the charge
  expect(charges).toStrictEqual([2, 2, 2, 2]);
});

test('only the selected peaks are returned', () => {
  const peaks = series(1000, 3, 5);
  const selected = [peaks[1], peaks[3]];

  const result = getPeaksWithCharge(selected, peaks);

  expect(result).toStrictEqual([
    { ...peaks[1], charge: 3 },
    { ...peaks[3], charge: 3 },
  ]);
});

test('a peak belonging to no series gets no charge', () => {
  const peaks = series(1000, 1, 3);
  const alone = { x: 1500, y: 80 };
  const all = [...peaks, alone];

  expect(getPeaksWithCharge(all, all).map((peak) => peak.charge)).toStrictEqual(
    [1, 1, 1, undefined],
  );
});

test('two peaks at the right distance are not a series', () => {
  const peaks = series(1000, 2, 2);

  expect(
    getPeaksWithCharge(peaks, peaks).map((peak) => peak.charge),
  ).toStrictEqual([undefined, undefined]);
});

test('two series of different charges live side by side', () => {
  const doubly = series(1000, 2, 5);
  const triply = series(1200, 3, 5);
  const peaks = [...doubly, ...triply];

  const charges = getPeaksWithCharge(peaks, peaks).map((peak) => peak.charge);

  expect(charges).toStrictEqual([2, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
});

test('a peak of the spectrum can be asked for by its mass only', () => {
  const peaks = series(1000, 4, 5);

  const [found] = getPeaksWithCharge([{ x: 1000.25, y: 0 }], peaks);

  expect(found.charge).toBe(4);
});

test('a mass matching no peak gets no charge', () => {
  const peaks = series(1000, 4, 5);

  const [found] = getPeaksWithCharge([{ x: 1050, y: 0 }], peaks);

  expect(found.charge).toBeUndefined();
});
