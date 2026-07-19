import { xIsEquallySpaced } from 'ml-spectra-processing';
import { generateSpectrum } from 'spectrum-generator';
import { expect, test } from 'vitest';

import { Spectrum } from '../Spectrum';

const FROM = 900;
const TO = 1100;
const NB_POINTS = 20001;

/**
 * A noisy spectrum sampled on an axis that is not equally spaced, like a real
 * mass spectrum: the m/z step of an orbitrap or a tof grows with the m/z.
 * @param {object} [options={}]
 * @param {Array<{x: number, y: number, width: number}>} [options.peaks=[]]
 * @param {number} [options.percent=40] - noise, in percent of the highest value
 * @param {number} [options.noiseFactor=3]
 * @returns {Spectrum}
 */
function createNoisySpectrum(options = {}) {
  const { peaks = [], percent = 40, noiseFactor = 3 } = options;
  const data = generateSpectrum(peaks, {
    generator: { from: FROM, to: TO, nbPoints: NB_POINTS },
    // the baseline is added before the noise, so it is what the noise scales on
    baseline: () => 0.05,
    noise: { distribution: 'normal', seed: 7, percent },
  });
  // the generator only builds equally spaced axes, so we bend it afterwards.
  // The steps then spread by ~10%: over the 5% tolerance of xIsEquallySpaced,
  // but still far under the 0.1 that isContinuous refuses.
  return new Spectrum(data, { noiseFactor }).rescaleX(warp);
}

/**
 * @param {number} x
 * @returns {number}
 */
function warp(x) {
  return x + (x - FROM) ** 2 / 4000;
}

test('the axis is not equally spaced but is still continuous', () => {
  const spectrum = createNoisySpectrum();

  expect(xIsEquallySpaced(spectrum.data.x)).toBe(false);
  expect(spectrum.isContinuous()).toBe(true);
});

test('the noise level has to be given when the axis is not equally spaced', () => {
  // gsd only estimates a noise level by itself when the steps are within 5%,
  // so without the level we give it every maximum of the noise becomes a peak
  expect(createNoisySpectrum({ noiseFactor: 0 }).peakPicking()).toHaveLength(
    2848,
  );

  // a gaussian noise still leaves ~0.135% of the points over median + 3 sd,
  // here 27 of the 20001 points, so a few maxima of the noise survive
  expect(createNoisySpectrum({ noiseFactor: 3 }).peakPicking()).toHaveLength(
    31,
  );

  // the residue is only removed by a stricter factor
  expect(createNoisySpectrum({ noiseFactor: 5 }).peakPicking()).toHaveLength(0);
});

test('a real peak stays over the noise', () => {
  const spectrum = createNoisySpectrum({
    peaks: [{ x: 1000, y: 1, width: 0.05 }],
    percent: 5,
  });

  const byHeight = spectrum.peakPicking().toSorted((a, b) => b.y - a.y);

  // the maxima of the noise are still there, but the real peak dominates them
  expect(byHeight[0].x).toBeCloseTo(warp(1000), 2);
  expect(byHeight[0].y).toBeCloseTo(1.05, 1);
  expect(byHeight[1].y).toBeLessThan(0.3);
});

test('a centroid spectrum is not noise filtered', () => {
  // there is no baseline to measure on a centroid spectrum: the median of the
  // intensities is signal, not noise, so filtering would empty an already
  // cleaned peak list
  const data = {
    x: [1, 2, 3, 4, 4.333, 4.666, 7, 8, 9],
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
  const spectrum = new Spectrum(data);

  expect(spectrum.isContinuous()).toBe(false);
  expect(spectrum.peakPicking()).toHaveLength(9);

  // the noiseFactor changes nothing, every point stays a peak
  expect(new Spectrum(data, { noiseFactor: 5 }).peakPicking()).toHaveLength(9);
});
