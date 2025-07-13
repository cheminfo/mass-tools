import { describe, expect, it } from 'vitest';

import { findMFs } from '..';

describe('test mf-finder', () => {
  it('basic case', async () => {
    let result = await findMFs(24, {
      ranges: [{ mf: 'C', min: 0, max: 2 }],
      precision: 1e5,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(1);
  });

  it('negative atoms', async () => {
    let result = await findMFs(24, {
      ranges: 'C-1 C0-3',
      precision: 1e5,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(1);
  });

  it('negative atoms as second parameter', async () => {
    let result = await findMFs(24, {
      ranges: 'C0-3 H0-5 C-1',
      precision: 1,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(1);
  });

  it('basic case with charge', async () => {
    let result = await findMFs(24, {
      ranges: [{ mf: 'C', min: 1, max: 2 }],
      precision: 1e5,
      ionizations: 'H+',
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0]).toMatchObject({
      em: 24,
      unsaturation: 3,
      mf: 'C2',
      charge: 0,
      ionization: { charge: 1, em: 1.00782503223, mf: 'H+' },
      ms: {
        delta: -1.00727645232093,
        em: 25.00727645232093,
        ppm: -40279.33446656661,
        charge: 1,
      },
    });
  });

  it('basic case with negative charge and wrong parameters', async () => {
    let result = await findMFs(24 + 35.5, {
      ranges: [{ mf: 'C', min: 1, max: 2 }],
      minCharge: 1, // this is a mistake, it should not be at this level
      precision: 1e5,
      ionizations: 'Cl-',
    });

    expect(result.mfs).toHaveLength(1);
  });

  it('basic case with negative charge', async () => {
    let result = await findMFs(24 + 35.5, {
      ranges: [{ mf: 'C', min: 1, max: 2 }],
      filter: { minCharge: 1 }, // this is a mistake, it should not be at this level
      precision: 1e5,
      ionizations: 'Cl-',
    });

    expect(result.mfs).toHaveLength(0);
  });

  it('basic case with charge and extreme error', async () => {
    let result = await findMFs(24, {
      ranges: [{ mf: 'C', min: 1, max: 2 }],
      precision: 1e6,
      ionizations: 'H+',
    });

    expect(result.mfs).toHaveLength(2);
  });

  it('basic case with advanced filtering (callback)', async () => {
    let result = await findMFs(12, {
      ranges: [
        { mf: 'C', min: 1, max: 10 },
        { mf: 'H', min: 1, max: 10 },
      ],
      precision: 1e8,
      ionizations: 'H+',
      filter: {
        callback: (entry) => entry.atoms.H === entry.atoms.C,
      },
    });

    expect(result.mfs).toHaveLength(10);
  });

  it('basic case with limit', async () => {
    let result = await findMFs(24, {
      ranges: [{ mf: 'C', min: 1, max: 2 }],
      precision: 1e6,
      allowNeutral: true,
      ionizations: ',H+',
      limit: 1,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].ms.ppm).toBe(0);
  });

  it('basic case with double charge and extreme error', async () => {
    let result = await findMFs(24, {
      ranges: [{ mf: 'C', min: 1, max: 2 }],
      precision: 1e6,
      ionizations: 'H(+2)',
    });

    expect(result.mfs[1]).toMatchObject({
      em: 12,
      unsaturation: 2,
      mf: 'C',
      charge: 0,
      ionization: { mf: 'H(+2)', em: 1.00782503223, charge: 2 },
      ms: {
        em: 6.50336393620593,
        delta: 17.49663606379407,
        charge: 2,
        ppm: 2690397.8057241603,
      },
    });

    expect(result.mfs).toHaveLength(2);
  });

  it('simple combinations', async () => {
    let result = await findMFs(24, {
      ranges: [
        { mf: 'C', min: 0, max: 2 },
        { mf: 'H', min: 0, max: 1 },
      ],
      precision: 1e5,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(2);
    expect(result.mfs[0].mf).toBe('C2');
    expect(result.mfs[1].mf).toBe('C2H');
  });

  it('twice same range', async () => {
    let result = await findMFs(24, {
      ranges: 'C0-2 C0-2',
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(3);
  });

  it('twice same range with uniqueMF', async () => {
    let result = await findMFs(24, {
      ranges: 'C0-2 C0-2',
      allowNeutral: true,
      uniqueMFs: true,
    });

    expect(result.mfs).toHaveLength(1);
  });

  it('ethane with groups and uniqueMF', async () => {
    let result = await findMFs(30.04695, {
      ranges: 'C0-2 H0-5 Me0-2',
      allowNeutral: true,
      uniqueMFs: true,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('(Me)2');
  });

  it('ethylbenzene with advanced groups and uniqueMF', async () => {
    let result = await findMFs(106.07825, {
      ranges: 'Ph0-1 C0-10 H0-10 Me0-3',
      allowNeutral: true,
      uniqueMFs: true,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('CH2MePh');
  });

  it('ethylbenzene with uniqueMF', async () => {
    let result1 = await findMFs(519.127524, {
      ranges: 'C0-100 H0-200 N0-20 O0-20 F0-3',
      allowNeutral: true,
      uniqueMFs: false,
    });
    let result2 = await findMFs(519.127524, {
      ranges: 'C0-100 H0-200 N0-20 O0-20 F0-3',
      allowNeutral: true,
      uniqueMFs: true,
    });

    expect(result1.mfs).toHaveLength(result2.mfs.length);
  });

  it('ethane with groups in parenthesis and uniqueMF', async () => {
    let result = await findMFs(30.04695, {
      ranges: 'C0-2 H0-5 (CH3)0-2',
      allowNeutral: true,
      uniqueMFs: true,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('(CH3)2');
  });

  it('ethanewith many groups and uniqueMF', async () => {
    let result = await findMFs(30.04695, {
      ranges: 'C0-2 H0-5 Et0-2 Me0-2',
      allowNeutral: true,
      uniqueMFs: true,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('HEt');
  });

  it('simple combinations with unsaturation', async () => {
    let result = await findMFs(16, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
      ],
      precision: 1e5,
      allowNeutral: true,
      filter: {
        unsaturation: {
          min: 0,
          max: 1,
        },
      },
    });

    expect(result.mfs).toHaveLength(2);
    expect(result.mfs[0].mf).toBe('CH4');
  });

  it('simple combinations with integer unsaturation', async () => {
    let result = await findMFs(16, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
      ],
      precision: 1e5,
      allowNeutral: true,
      filter: {
        unsaturation: {
          min: 0,
          max: 1,
          onlyInteger: true,
        },
      },
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('CH4');
  });

  it('simple combinations with impossible', async () => {
    let result = await findMFs(24, {
      ranges: [
        { mf: 'C', min: 0, max: 2 },
        { mf: 'H', min: 0, max: 1 },
        { mf: 'S', min: 0, max: 100 },
      ],
      precision: 1e5,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(2);
    expect(result.mfs[0].mf).toBe('C2');
    expect(result.mfs[1].mf).toBe('C2H');
  });

  it('simple combinations from string ranges', async () => {
    let result = await findMFs(24, {
      ranges: 'C0-2H0-1S0-100',
      precision: 1e5,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(2);
    expect(result.mfs[0].mf).toBe('C2');
    expect(result.mfs[1].mf).toBe('C2H');
  });

  it('groups and atoms', async () => {
    let result = await findMFs(92.99814, {
      ranges: '(CH2)0-1C0-1',
      precision: 1e10,
      allowNeutral: true,
    });

    expect(result.mfs[0].atoms).toStrictEqual({ C: 2, H: 2 });
    expect(result.mfs[0].groups).toStrictEqual({ '(CH2)': 1 });
    expect(result.mfs[2].atoms).toStrictEqual({ C: 1 });
    expect(result.mfs[2].groups).toStrictEqual({});
  });

  it('simple combinations for polymers', async () => {
    let result = await findMFs(92.99814, {
      ranges: '(CH2)0-10NOCl',
      precision: 1e4,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('(CH2)2NOCl');
  });

  it('simple combinations from string ranges with ionizations', async () => {
    let result = await findMFs(12, {
      ranges: [
        { mf: 'C', min: 0, max: 2 },
        { mf: 'H', min: 0, max: 1 },
        { mf: 'H+', min: 0, max: 2 },
      ],
      precision: 1e5,
      ionizations: 'H+, H++',
    });

    expect(result.mfs).toHaveLength(4);
    expect(result.mfs[0].mf).toBe('C2');
  });

  it('combinations with no answer', async () => {
    let result = await findMFs(5, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'N', min: 0, max: 100 },
        { mf: 'S', min: 0, max: 100 },
      ],
      precision: 1e4,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(0);
  });

  it('simple combinations with optimisation for large values', async () => {
    let result = await findMFs(24.001, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
        { mf: 'S', min: 0, max: 100 },
      ],
      precision: 1000,
      allowNeutral: true,
    });

    expect(result.info.numberResults).toBe(1);
    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('C2');
  });

  it('simple combinations with 2 possibilities', async () => {
    let result = await findMFs(24, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
        { mf: 'S', min: 0, max: 100 },
      ],
      precision: 10000,
      allowNeutral: true,
    });

    expect(result.info.numberResults).toBe(3);
    expect(result.mfs).toHaveLength(3);
    expect(result.mfs[0].mf).toBe('C2');
    expect(result.mfs[1].mf).toBe('CH12');
    expect(result.mfs[2].mf).toBe('H24');
  });

  it('simple combinations with edge case', async () => {
    let result = await findMFs(1200.0001, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
      ],
      precision: 1,
      allowNeutral: true,
    });

    expect(result.info.numberMFEvaluated).toBeLessThan(50);
    expect(result.info.numberResults).toBe(1);
    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('C100');
  });

  it('large combination', async () => {
    let result = await findMFs(1200.0000000001, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
        { mf: 'S', min: 0, max: 100 },
        { mf: 'N', min: 0, max: 100 },
        { mf: 'O', min: 0, max: 100 },
      ],
      precision: 0.0001,
      allowNeutral: true,
    });

    expect(result.info.numberMFEvaluated).toBeLessThan(500000);
    expect(result.info.numberResults).toBe(1);
    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('C100');
  });

  it('check order in molecular formula', async () => {
    let result = await findMFs(1199, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
        { mf: 'S', min: 0, max: 10 },
        { mf: 'N', min: 0, max: 10 },
        { mf: 'O', min: 0, max: 10 },
      ],
      precision: 1,
      allowNeutral: true,
    });

    expect(result.mfs[0].mf).toBe('C88H5N3O4S');
  });

  it('check impossible charge', async () => {
    let result = await findMFs(24, {
      ranges: [
        { mf: 'C', min: 0, max: 2 },
        { mf: 'H+', min: 0, max: 2 },
      ],
      precision: 1e4,
    });

    expect(result.mfs).toHaveLength(0);
  });

  it('check charge', async () => {
    let result = await findMFs(12, {
      ranges: [
        { mf: 'C', min: 0, max: 2 },
        { mf: 'C+', min: 0, max: 2 },
      ],
      precision: 1e5,
    });

    expect(result.mfs).toHaveLength(2);
  });

  it('check when all are charged', async () => {
    let result = await findMFs(12, {
      ranges: [
        { mf: 'H+', min: 0, max: 2 },
        { mf: 'C+', min: 0, max: 2 },
        { mf: 'S+', min: 0, max: 2 },
      ],
      precision: 1e5,
    });

    expect(result.mfs).toHaveLength(5);
  });

  it('check when all are charged and filter by charge', async () => {
    let result = await findMFs(12, {
      ranges: [
        { mf: 'H+', min: 0, max: 2 },
        { mf: 'C+', min: 0, max: 2 },
        { mf: 'S+', min: 0, max: 2 },
      ],
      precision: 1e5,
      filter: {
        maxCharge: 1,
        minCharge: 1,
      },
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('C+');
  });

  it('check one possibility 12', async () => {
    let result = await findMFs(12, {
      ranges: [{ mf: 'C', min: 1, max: 1 }],
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('C');
  });

  it('check one possibility 24', async () => {
    let result = await findMFs(24, {
      ranges: [
        { mf: 'C', min: 0, max: 100 },
        { mf: 'H', min: 0, max: 100 },
      ],
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(1);
    expect(result.mfs[0].mf).toBe('C2');
  });

  it('should yield to 3 results', async () => {
    let result = await findMFs(24, {
      ranges: [
        { mf: 'C', min: 0, max: 3 },
        { mf: 'H', min: 0, max: 40 },
      ],
      precision: 10000,
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(3);
  });

  it('check one possibility 12 with charge', async () => {
    let result = await findMFs(12, {
      ranges: [{ mf: 'C+', min: 1, max: 2 }],
      allowNeutral: true,
    });

    expect(result.mfs).toHaveLength(2);
    expect(result.mfs[0].mf).toBe('C+');
    expect(result.mfs[1].mf).toBe('(C+)2');
  });
});
