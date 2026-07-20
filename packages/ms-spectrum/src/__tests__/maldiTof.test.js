import { readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, test } from 'vitest';
import { parseXY } from 'xy-parser';

import { Spectrum } from '../Spectrum';
import { getPeakChargeBySimilarity } from '../getPeakChargeBySimilarity';

const SIMILARITY = {
  zone: { low: -0.5, high: 2.5 },
  widthBottom: 0.1,
  widthTop: 0.1,
};

/**
 * Slices of four spectra of the same sample, acquired on the instruments we
 * use. They all are profile spectra, but their m/z step goes from 0.0014 Da on
 * the orbitrap to 0.33 Da on the linear time of flight, because a time of
 * flight is sampled evenly in time and its m/z step grows with the m/z.
 * @param {string} name
 * @returns {Spectrum}
 */
function loadSlice(name) {
  const text = readFileSync(path.join(__dirname, 'data', name), 'utf8');
  return new Spectrum(parseXY(text));
}

/**
 * @param {Spectrum} spectrum
 * @param {number} targetMass
 * @returns {number|undefined}
 */
function chargeOf(spectrum, targetMass) {
  return getPeakChargeBySimilarity(spectrum, targetMass, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });
}

test('orbitrap, electrospray: the isotopologues are resolved and the ion is doubly charged', () => {
  const spectrum = loadSlice('orbitrapEsiSlice.txt');

  expect(spectrum.isContinuous()).toBe(true);
  // an electrospray gives multiply charged ions, and the resolution is there
  // to tell: the peaks are 0.5 Da apart
  expect(chargeOf(spectrum, 530.2849)).toBe(2);
});

test('maldi in reflectron mode: singly charged, isotopologues resolved', () => {
  const spectrum = loadSlice('maldiReflectronSlice.txt');

  expect(spectrum.isContinuous()).toBe(true);
  expect(chargeOf(spectrum, 1169.4125)).toBe(1);
});

test('maldi in linear mode: a coarsely sampled profile spectrum', () => {
  const spectrum = loadSlice('maldiTofSlice.txt');
  const { x } = spectrum.data;
  const steps = [];
  for (let i = 0; i < x.length - 1; i++) steps.push(x[i + 1] - x[i]);
  const median = steps.toSorted((a, b) => a - b)[steps.length >> 1];

  // 0.33 Da: way over the 0.1 Da a profile spectrum was allowed to have
  expect(median).toBeCloseTo(0.33, 2);
  expect(spectrum.isContinuous()).toBe(true);
});

test('the charge of an unresolved envelope can not be evaluated', () => {
  const spectrum = loadSlice('maldiTofSlice.txt');

  // the peak is 4.6 Da wide, the isotopologues of a charge 3 would be 0.33 Da
  // apart: they are not resolved, so no charge can be given
  const peaks = spectrum.getPeaks({ from: 3025.5, to: 3028.5, threshold: 0 });

  expect(peaks).toHaveLength(1);
  expect(peaks[0].x).toBeCloseTo(3026.06, 1);
  expect(peaks[0].width).toBeGreaterThan(3);

  expect(chargeOf(spectrum, 3026.0767)).toBeUndefined();
});

test('the raw sampling step aliases with the charge 3 isotopologues', () => {
  // why the charge used to be evaluated to 3: the step of this time of flight
  // is 0.329 Da around m/z 3026, and the isotopologues of a charge 3 are
  // 0.333 Da apart. Every raw point fell on a theoretical isotopologue.
  const spectrum = loadSlice('maldiTofSlice.txt');
  const { x } = spectrum.data;
  let index = 0;
  while (x[index] < 3026) index++;

  expect(x[index + 1] - x[index]).toBeCloseTo(1 / 3, 2);
});

test('a second linear maldi, digested otherwise, behaves the same', () => {
  const spectrum = loadSlice('maldiLinearGluCSlice.txt');

  expect(spectrum.isContinuous()).toBe(true);

  const peaks = spectrum.getPeaks({ from: 1123.5, to: 1126.5, threshold: 0 });

  expect(peaks).toHaveLength(1);
  expect(peaks[0].width).toBeGreaterThan(2);

  expect(chargeOf(spectrum, 1124.0011)).toBeUndefined();
});

test('an unresolved envelope gets no charge through getSelectedPeaksWithCharge either', () => {
  // the two ways of evaluating a charge now share the same code: the peak at
  // m/z 2205 of the linear maldi used to be annotated with a charge of 1, which
  // was only the charge the search was started with
  const spectrum = loadSlice('maldiLinearGluCSlice.txt');
  const peaks = spectrum.getPeaks({ from: 1123.5, to: 1126.5, threshold: 0 });

  const [peak] = spectrum.getSelectedPeaksWithCharge(peaks);

  expect(peak.charge).toBeUndefined();
  expect(chargeOf(spectrum, 1124.0011)).toBeUndefined();
});

test('peaks that do not stand out of the noise get no charge', () => {
  // a noisy region of the reflectron: the maxima of the noise used to be given
  // charges of 2, 5, 7 and 8, because their position is random and one of them
  // always falls close to a theoretical isotopologue
  const spectrum = loadSlice('maldiReflectronNoisySlice.txt');
  const withCharge = spectrum.getSelectedPeaksWithCharge(
    spectrum.peakPicking(),
  );
  const charged = withCharge.filter((peak) => peak.charge !== undefined);

  // one singly charged series explains the whole region
  expect(charged.map((peak) => peak.charge)).toStrictEqual([1, 1, 1, 1]);
  expect(charged.map((peak) => Number(peak.x.toFixed(3)))).toStrictEqual([
    2009.639, 2010.648, 2011.638, 2012.637,
  ]);

  // 2010.908 is over the noise as well, but belongs to no series: being intense
  // enough is not the same as showing a charge
  const alone = withCharge.find((peak) => Math.abs(peak.x - 2010.908) < 0.01);

  expect(alone.y).toBeGreaterThan(150);
  expect(alone.charge).toBeUndefined();
});
