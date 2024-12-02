import { describe, expect, it } from 'vitest';

import { getFragmentPeaks } from '../getFragmentPeaks';

describe('test getFragmentPeaks', () => {
  let peaks = [
    { x: 12, y: 1 },
    { x: 20, y: 2 },
    { x: 36, y: 3 },
  ];
  it('default options', async () => {
    let results = await getFragmentPeaks(peaks, 'C3', {
      ionizations: '+',
      precision: 50,
    });
    expect(results).toHaveLength(2);
    expect(results[0]).toStrictEqual({
      x: 12,
      y: 1,
      mfs: [
        {
          em: 12,
          unsaturation: 2,
          mf: 'C',
          charge: 0,
          ionization: { mf: '+', em: 0, charge: 1, atoms: {} },
          atoms: { C: 1 },
          groups: {},
          ms: {
            ionization: '+',
            em: 11.99945142009093,
            charge: 1,
            delta: 0.0005485799090703125,
            ppm: 45.71708237860056,
          },
        },
      ],
    });
  });
});
