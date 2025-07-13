import { describe, expect, it } from 'vitest';

import { mfsFromEMs } from '../mfsFromEMs.js';

describe('mfsFromEMs', () => {
  it('simple case', { timeout: 30_000 }, async () => {
    let data = await mfsFromEMs(60, {
      ionizations: '(H+)2,H+',
      precision: 10,
      limit: 10,
    });

    expect(data).toHaveLength(2);
    expect(data[0]).toMatchObject({
      _id: 'C2H4N2P2',
      data: {
        em: 117.98497213462,
        atoms: { C: 2, H: 4, N: 2, P: 2 },
        unsaturation: 3,
        count: 7,
      },
      mfInfo: {
        mass: 118.0141652294252,
        charge: 0,
        mf: 'C2H4N2P2',
        atoms: { C: 2, H: 4, N: 2, P: 2 },
        em: 117.98497213462,
        unsaturation: 3,
      },
      ionization: {
        mf: '(H+)2',
        em: 2.01565006446,
        charge: 2,
        atoms: { H: 2 },
      },
      ms: {
        ionization: '(H+)2',
        em: 59.99976251963093,
        charge: 2,
        delta: 0.00023748036907278447,
        ppm: 3.958021817087773,
      },
    });
  });

  it(
    'string containing more than 1 monoisotopic mass',
    { timeout: 30_000 },
    async () => {
      let data = await mfsFromEMs('12,24,36', {
        ionizations: '',
        precision: 10,
        minCount: 0,
        limit: 10,
      });

      expect(data).toHaveLength(3);
      expect(data).toMatchSnapshot();
    },
  );

  it('simple case negative ionization', { timeout: 30_000 }, async () => {
    let data = await mfsFromEMs(60, {
      ionizations: '(H+)-2, (H+)-1',
      precision: 10,
      limit: 10,
    });

    expect(data).toHaveLength(4);
    expect(data).toMatchSnapshot();
  });

  it('highly precise', { timeout: 30_000 }, async () => {
    let data = await mfsFromEMs(81.06987671016094, {
      ionizations: 'H+',
      precision: 1,
      limit: 10,
    });

    expect(data).toHaveLength(1);
  });

  it('simple case with range filter', { timeout: 30_000 }, async () => {
    let data = await mfsFromEMs(60, {
      ionizations: '(H+)2, H+',
      precision: 100,
      ranges: 'C0-10H0-10N0-10O0-10',
      limit: 50,
    });

    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      _id: 'C3H2O5',
      data: {
        em: 117.99022316231,
        unsaturation: 3,
        count: 13,
      },
      mfInfo: {
        mass: 118.04511381990868,
        charge: 0,
        mf: 'C3H2O5',
        em: 117.99022316231,
        unsaturation: 3,
      },
      ionization: { mf: '(H+)2', em: 2.01565006446, charge: 2 },
      ms: {
        ionization: '(H+)2',
        em: 60.00238803347593,
        charge: 2,
        delta: -0.002388033475931195,
        ppm: -39.798973910819804,
      },
    });
  });
});
