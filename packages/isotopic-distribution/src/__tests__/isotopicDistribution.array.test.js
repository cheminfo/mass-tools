import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { describe, expect, it } from 'vitest';

import { IsotopicDistribution } from '..';

expect.extend({ toBeDeepCloseTo });

describe('isotopicDistribution with array', () => {
  it('C,C2,C3', () => {
    let isotopicDistribution = new IsotopicDistribution(
      [
        {
          mf: 'C',
          ms: { charge: 1, similarity: { factor: 1 } },
          ionization: { mf: '' },
        },
        {
          mf: 'C2',
          ms: { charge: 1, similarity: { factor: 2 } },
          ionization: { mf: '' },
        },
        {
          mf: 'C3',
          ms: { charge: 1, similarity: { factor: 3 } },
          ionization: { mf: '' },
        },
      ],
      {
        fwhm: 1e-10,
      },
    );
    const intensities = isotopicDistribution
      .getDistribution()
      .array.sort((a, b) => b.y - a.y)
      .map((entry) => entry.y)
      .slice(0, 3);

    expect(intensities).toBeDeepCloseTo([2.9, 1.96, 0.989], 2);
  });
});
