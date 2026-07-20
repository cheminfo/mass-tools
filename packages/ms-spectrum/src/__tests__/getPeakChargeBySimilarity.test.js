import { generateSpectrum } from 'spectrum-generator';
import { expect, test } from 'vitest';

import { Spectrum } from '../Spectrum';
import { getPeakChargeBySimilarity } from '../getPeakChargeBySimilarity';

const SIMILARITY = {
  zone: { low: -0.5, high: 2.5 },
  widthBottom: 0.1,
  widthTop: 0.1,
};

test('default options', () => {
  // the tolerance on the position of an isotopologue is relative, so the masses
  // have to be those of a real spectrum
  const data = {
    x: [1000, 1000 + 1 / 3, 1000 + 2 / 3, 1001, 1500],
    y: [100, 55, 18, 5, 80],
  };
  const spectrum = new Spectrum(data);

  expect(getPeakChargeBySimilarity(spectrum, 1000)).toBe(3);
  // the peak standing alone belongs to no series
  expect(getPeakChargeBySimilarity(spectrum, 1500)).toBeUndefined();
});

const FROM = 997;
const TO = 1007;

/**
 * Build a continuous (profile) spectrum around m/z 1000.
 * @param {object} [options={}]
 * @param {Array<[number, number]>} [options.peaks=[]] - [x, y] pairs
 * @param {number} [options.spacing=0.01] - sampling step
 * @param {number} [options.width=0.05] - fwhm of each peak
 * @param {number} [options.baseline=0.05]
 * @param {number} [options.noise=0] - noise, in percent of the highest value
 * @returns {import('cheminfo-types').DataXY}
 */
function createProfileSpectrum(options = {}) {
  const {
    peaks = [],
    spacing = 0.01,
    width = 0.05,
    baseline = 0.05,
    noise = 0,
  } = options;
  return generateSpectrum(
    peaks.map(([x, y]) => ({ x, y, width })),
    {
      // isContinuous needs more than 100 points and a step of at most 0.1
      generator: {
        from: FROM,
        to: TO,
        nbPoints: Math.round((TO - FROM) / spacing) + 1,
      },
      baseline: () => baseline,
      noise: noise
        ? { distribution: 'normal', seed: 7, percent: noise }
        : undefined,
    },
  );
}

/**
 * Isotopologues of `charge` around m/z 1000, with decreasing heights.
 * @param {number} charge
 * @returns {Array<[number, number]>}
 */
function isotopologues(charge) {
  return [
    [1000, 1],
    [1000 + 1 / charge, 0.55],
    [1000 + 2 / charge, 0.18],
  ];
}

test('continuous spectrum, resolved charge 3', () => {
  const spectrum = new Spectrum(
    createProfileSpectrum({ peaks: isotopologues(3) }),
  );

  expect(spectrum.isContinuous()).toBe(true);

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBe(3);
});

test('continuous spectrum, resolved charge 1', () => {
  const spectrum = new Spectrum(
    createProfileSpectrum({ peaks: isotopologues(1) }),
  );

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBe(1);
});

test('continuous spectrum, a single peak has no charge', () => {
  const spectrum = new Spectrum(createProfileSpectrum({ peaks: [[1000, 1]] }));

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBeUndefined();
});

test('continuous spectrum, baseline only has no charge', () => {
  const spectrum = new Spectrum(createProfileSpectrum());

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBeUndefined();
});

test('continuous spectrum, an unresolved peak has no charge', () => {
  // a broad blob: finely sampled, but the isotopologues are not separated
  const spectrum = new Spectrum(
    createProfileSpectrum({ peaks: [[1000, 1]], width: 0.9 }),
  );

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBeUndefined();
});

test('continuous spectrum, coarse sampling that still resolves the isotopologues', () => {
  // only ~4 points per isotopologue distance, but gsd separates the 3 peaks,
  // so the charge must be found rather than lowered to a "safer" one
  const spectrum = new Spectrum(
    createProfileSpectrum({
      peaks: isotopologues(3),
      spacing: 0.08,
      width: 0.15,
    }),
  );

  expect(spectrum.isContinuous()).toBe(true);
  expect(
    spectrum.getPeaks({ from: 999.5, to: 1002.5, threshold: 0 }),
  ).toHaveLength(3);

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBe(3);
});

test('noise is never given a charge', () => {
  // the reason of the noise filter: on the raw data a flat noise used to match
  // a flat theoretical pattern perfectly and was annotated with a charge
  const spectrum = new Spectrum(createProfileSpectrum({ noise: 40 }));

  expect(spectrum.isContinuous()).toBe(true);

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBeUndefined();
});

test('a resolved envelope keeps its charge in a noisy spectrum', () => {
  const spectrum = new Spectrum(
    createProfileSpectrum({ peaks: isotopologues(3), noise: 1 }),
  );

  const charge = getPeakChargeBySimilarity(spectrum, 1000, {
    similarity: SIMILARITY,
    minCharge: 1,
    maxCharge: 10,
  });

  expect(charge).toBe(3);
});

test('an empty spectrum throws', () => {
  expect(() => getPeakChargeBySimilarity(new Spectrum(), 1000)).toThrow(
    'You need to add an experimental spectrum first',
  );
});

test('the charge is evaluated on the magnitude, whatever the sign of the range', () => {
  const spectrum = new Spectrum(
    createProfileSpectrum({ peaks: isotopologues(3) }),
  );
  const options = { similarity: SIMILARITY };

  expect(
    getPeakChargeBySimilarity(spectrum, 1000, {
      ...options,
      minCharge: -10,
      maxCharge: -1,
    }),
  ).toBe(3);
  // a range crossing 0 starts at charge 1
  expect(
    getPeakChargeBySimilarity(spectrum, 1000, {
      ...options,
      minCharge: -3,
      maxCharge: 3,
    }),
  ).toBe(3);
});
