import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from 'vitest';
import { parseXY } from 'xy-parser';

import { Spectrum } from '../Spectrum';
import {
  NEUTRON_MASS,
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

test('the isotopologues are spaced by 13C - 12C and not by a round dalton', () => {
  // the two are 3.35 mDa apart, 22 ppm at m/z 150
  const peaks = [
    { x: 150, y: 100 },
    { x: 150 + NEUTRON_MASS, y: 8 },
    { x: 150 + 2 * NEUTRON_MASS, y: 0.4 },
  ];

  expect(
    getPeaksWithClusterCharge(peaks).map((peak) => peak.charge),
  ).toStrictEqual([1, 1, 1]);
  expect(
    getPeaksWithClusterCharge(peaks, { neutronMass: 1 }).map(
      (peak) => peak.charge,
    ),
  ).toStrictEqual([undefined, undefined, undefined]);
});

test('a neighbour an order of magnitude down ends the series', () => {
  const peaks = [
    { x: 1000, y: 100 },
    { x: 1000 + NEUTRON_MASS, y: 55 },
    { x: 1000 + 2 * NEUTRON_MASS, y: 30 },
    { x: 1000 + 3 * NEUTRON_MASS, y: 0.5 },
  ];

  expect(
    getPeaksWithClusterCharge(peaks).map((peak) => peak.charge),
  ).toStrictEqual([1, 1, 1, undefined]);
  expect(
    getPeaksWithClusterCharge(peaks, { minRatio: 0 }).map(
      (peak) => peak.charge,
    ),
  ).toStrictEqual([1, 1, 1, 1]);
});

test('one isotopologue out of four is not a singly charged species', () => {
  // a quadruply charged envelope, and three peaks a dalton apart lying between
  // its isotopologues: read alone they are a series, but the envelope they sit
  // inside is what they belong to
  const peaks = [];
  for (let i = 0; i < 7; i++) {
    peaks.push({ x: 1000 + (i * NEUTRON_MASS) / 4, y: 100 - i * 8 });
  }
  for (let i = 0; i < 3; i++) {
    peaks.push({ x: 1000.1 + i * NEUTRON_MASS, y: 5 });
  }
  peaks.sort((a, b) => a.x - b.x);

  const charges = getPeaksWithClusterCharge(peaks, { maxCharge: 4 }).map(
    (peak) => peak.charge,
  );

  expect(charges.filter((charge) => charge === 4)).toHaveLength(7);
  expect(charges.filter((charge) => charge === 1)).toHaveLength(0);
});

test('a charge claiming a mass wider than the series shown is refused', () => {
  // read as 27-fold charged the three maxima claim 10.6 kDa, which spreads
  // over eight isotopologues
  const noise = [];
  for (let i = 0; i < 3; i++) {
    noise.push({ x: 394 + (i * NEUTRON_MASS) / 27, y: 100 - i * 10 });
  }

  expect(
    getPeaksWithClusterCharge(noise, { maxCharge: 100 }).map(
      (peak) => peak.charge,
    ),
  ).toStrictEqual([undefined, undefined, undefined]);

  // a sample holding no carbon has no envelope to be held to
  expect(
    getPeaksWithClusterCharge(noise, {
      maxCharge: 100,
      daltonPerCarbon: Infinity,
    }).map((peak) => peak.charge),
  ).toStrictEqual([27, 27, 27]);

  // singly charged, 394 Da is an envelope of one or two isotopologues
  const singly = [
    { x: 394, y: 100 },
    { x: 394 + NEUTRON_MASS, y: 22 },
    { x: 394 + 2 * NEUTRON_MASS, y: 3 },
  ];

  expect(
    getPeaksWithClusterCharge(singly, { maxCharge: 100 }).map(
      (peak) => peak.charge,
    ),
  ).toStrictEqual([1, 1, 1]);
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
  expect(counts[2]).toBe(4);
  expect(counts[3]).toBe(50);
  expect(counts[4]).toBe(17);

  const [biggest] = spectrum.getChargeClusters();

  expect(biggest.charge).toBe(3);
  expect(biggest.peaks).toHaveLength(8);
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

test('the CID of a disaccharide keeps its fragments singly charged', () => {
  // m/z 370 to 400 of GalA2 on an Orbitrap Elite: four fragments and, between
  // them, the evenly spaced maxima an FT transform leaves behind
  const spectrum = loadSlice('sugarMs2Slice.txt');
  const peaks = spectrum.getSelectedPeaksWithCharge(spectrum.peakPicking());

  let tallest = 0;
  for (const peak of peaks) {
    if (peak.y > tallest) tallest = peak.y;
  }
  const fragments = peaks
    .filter((peak) => peak.y >= 0.04 * tallest)
    .toSorted((a, b) => a.x - b.x)
    .map((peak) => [Number(peak.x.toFixed(4)), peak.charge ?? 0]);

  expect(fragments).toStrictEqual([
    [375.0537, 1],
    [376.0569, 1],
    [393.0641, 1],
    [393.2099, 1],
    // isotopologues outside the window, so no charge
    [393.2976, 0],
    [394.0676, 1],
    [394.213, 1],
    [395.2769, 0],
  ]);

  expect(peaks.filter((peak) => peak.charge > 2)).toStrictEqual([]);
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
