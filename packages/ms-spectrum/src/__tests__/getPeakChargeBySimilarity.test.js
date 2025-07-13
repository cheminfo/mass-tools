import { expect, test } from 'vitest';

import { Spectrum } from '../Spectrum';
import { getPeakChargeBySimilarity } from '../getPeakChargeBySimilarity';

test('default options', () => {
  const data = {
    x: [1, 2, 3, 4, 4.333, 4.666, 7, 8, 9],
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  };
  const spectrum = new Spectrum(data);

  let charge = getPeakChargeBySimilarity(spectrum, 4, {
    similarity: {
      zone: { low: -0.5, high: 2.5 },
      widthBottom: 0.1,
      widthTop: 0.1,
    },
    minCharge: 1,
    maxCharge: 4,
  });

  expect(charge).toBe(3);
});
