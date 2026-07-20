import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from 'vitest';
import { parseXY } from 'xy-parser';

import { Spectrum } from '../Spectrum';
import {
  getChargeClusters,
  getPeaksWithClusterCharge,
} from '../getChargeClusters';

/**
 * @param {string} name
 * @returns {Spectrum}
 */
function loadSlice(name) {
  const text = readFileSync(path.join(__dirname, 'data', name), 'utf8');
  return new Spectrum(parseXY(text));
}

/**
 * Number of peaks per charge, `none` for the peaks left without one.
 * @param {Array} peaks
 * @returns {object}
 */
function countCharges(peaks) {
  const counts = {};
  for (const peak of peaks) {
    const key = peak.charge ?? 'none';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

test('a series of peaks one dalton apart is singly charged', () => {
  const peaks = [
    { x: 1000, y: 100 },
    { x: 1001, y: 55 },
    { x: 1002, y: 18 },
  ];

  expect(
    getPeaksWithClusterCharge(peaks).map((peak) => peak.charge),
  ).toStrictEqual([1, 1, 1]);
});

test('the charge of a series is given to all its peaks, the last one included', () => {
  // the peak that ends an envelope has nothing after it: on its own no charge
  // could be evaluated, its neighbours are what proves it
  const peaks = [
    { x: 1000, y: 100 },
    { x: 1000.5, y: 55 },
    { x: 1001, y: 18 },
    { x: 1001.5, y: 5 },
  ];

  expect(
    getPeaksWithClusterCharge(peaks).map((peak) => peak.charge),
  ).toStrictEqual([2, 2, 2, 2]);
});

test('a series of two peaks is not enough', () => {
  // two peaks at the right distance happen all the time
  const peaks = [
    { x: 1000, y: 100 },
    { x: 1000.5, y: 55 },
  ];

  expect(
    getPeaksWithClusterCharge(peaks).map((peak) => peak.charge),
  ).toStrictEqual([undefined, undefined]);
});

test('the charge explaining the most peaks wins', () => {
  // the peaks of charge 1 are also every other peak of the charge 2 series, so
  // both explain the spectrum: the one holding more of it has to win
  const peaks = [
    { x: 1000, y: 100 },
    { x: 1000.5, y: 80 },
    { x: 1001, y: 55 },
    { x: 1001.5, y: 30 },
    { x: 1002, y: 18 },
  ];

  expect(
    getPeaksWithClusterCharge(peaks).map((peak) => peak.charge),
  ).toStrictEqual([2, 2, 2, 2, 2]);
});

test('an electrospray of PEG3000, which carries three charges at once', () => {
  const spectrum = loadSlice('pegEsiSlice.txt');

  expect(spectrum.isContinuous()).toBe(true);

  const counts = countCharges(
    spectrum.getSelectedPeaksWithCharge(spectrum.peakPicking()),
  );

  // the three charge states of the sample are found in this single window
  expect(counts[2]).toBe(10);
  expect(counts[3]).toBe(56);
  expect(counts[4]).toBe(11);

  const [biggest] = spectrum.getChargeClusters();

  expect(biggest.charge).toBe(3);
  expect(biggest.peaks.length).toBeGreaterThan(8);
});

test('the isotopologues of a cluster are really one dalton over the charge apart', () => {
  const spectrum = loadSlice('pegEsiSlice.txt');

  for (const cluster of spectrum.getChargeClusters()) {
    const masses = cluster.peaks.map((peak) => peak.x);
    const spacing =
      (masses.at(-1) - masses[0]) / (masses.length - 1) / (1 / cluster.charge);

    // within 2% of the distance the charge of the cluster implies
    expect(spacing).toBeGreaterThan(0.98);
    expect(spacing).toBeLessThan(1.02);
  }
});

test('the maxima of the noise of a reflectron join no cluster', () => {
  const spectrum = loadSlice('maldiReflectronNoisySlice.txt');
  const inWindow = spectrum
    .getSelectedPeaksWithCharge(spectrum.peakPicking())
    .filter((peak) => peak.x > 2011 && peak.x < 2016);
  const charged = inWindow.filter((peak) => peak.charge !== undefined);

  // only the two peaks of the series get a charge, the maxima of the noise
  // around them belong to nothing
  expect(charged).toHaveLength(2);
  expect(charged.map((peak) => peak.charge)).toStrictEqual([1, 1]);
  expect(inWindow.length).toBeGreaterThan(charged.length);
});

test('a cluster holds a charge and the peaks that show it', () => {
  const spectrum = loadSlice('pegEsiSlice.txt');
  const clusters = getChargeClusters(spectrum.getPeaks({ threshold: 0.01 }));
  const [first] = clusters;

  expect(Object.keys(first).toSorted()).toStrictEqual(['charge', 'peaks']);
  expect(first.peaks[0]).toHaveProperty('x');
  expect(first.peaks[0]).toHaveProperty('y');

  // from the cluster holding the most intensity to the one holding the least
  const intensities = clusters.map((cluster) => {
    let total = 0;
    for (const peak of cluster.peaks) total += peak.y;
    return total;
  });
  for (let i = 1; i < intensities.length; i++) {
    expect(intensities[i - 1]).toBeGreaterThanOrEqual(intensities[i]);
  }
});
