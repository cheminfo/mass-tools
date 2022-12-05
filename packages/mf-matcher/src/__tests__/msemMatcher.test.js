import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { msemMatcher } from '..';

expect.extend({ toBeDeepCloseTo });

describe('msemMatcher', () => {
  it('various parameters', () => {
    let entry = {
      mf: 'C10',
      em: 120,
      msem: 0,
      charge: 0,
      unsaturation: 11,
      atoms: {
        C: 10,
      },
    };

    expect(msemMatcher(entry, { targetMass: 120, minCharge: 1 })).toBe(false);
    expect(msemMatcher(entry, { targetMass: 120, maxCharge: -1 })).toBe(false);
    expect(
      msemMatcher(entry, {
        targetMass: 120,
        ionization: { charge: 1, em: 0 },
        atoms: {
          N: { min: 10, max: 20 },
        },
      }),
    ).toBe(false);
    expect(
      msemMatcher(entry, {
        targetMass: 120,
        atoms: {
          C: { min: 5, max: 9 },
        },
      }),
    ).toBe(false);
    expect(
      msemMatcher(entry, {
        targetMass: 120,
        ionization: { charge: 1, em: 0 },
        atoms: {
          C: { min: 10, max: 20 },
          N: { min: 0, max: 10 },
        },
      }),
    ).toStrictEqual({
      ionization: { charge: 1, em: 0 },
      ms: {
        charge: 1,
        delta: 0.0005485799090649834,
        em: 119.99945142009094,
        ionization: undefined,
        ppm: 4.571520140909056,
      },
    });
    expect(
      msemMatcher(entry, {
        callback: (item) => item.atoms.C > 15,
      }),
    ).toBe(false);
    expect(
      msemMatcher(entry, {
        callback: (item) => item.atoms.C > 5,
      }),
    ).toBeInstanceOf(Object);
  });

  it('forced ionization', () => {
    let entry = {
      mf: 'C10',
      em: 120,
      msem: 0,
      charge: 0,
      unsaturation: 11,
      atoms: {
        C: 10,
      },
      ionization: { mf: 'H+', charge: 1, em: 1 },
    };

    expect(
      msemMatcher(entry, {
        targetMass: 120,
        maxCharge: 1,
        minCharge: 1,
        ionization: { mf: 'H+', charge: 1, em: 0 },
        forceIonization: true,
      }),
    ).toStrictEqual({
      ionization: { charge: 1, em: 0, mf: 'H+' },
      ms: {
        charge: 1,
        delta: 0.0005485799090649834,
        em: 119.99945142009094,
        ionization: 'H+',
        ppm: 4.571520140909056,
      },
    });
  });

  it('test msemMatcher with list of target mass', () => {
    let entry = {
      mf: 'C10',
      em: 120,
      msem: 0,
      charge: 0,
      unsaturation: 11,
      atoms: {
        C: 10,
      },
      ionization: { mf: 'H+', charge: 1, em: 0 },
    };

    expect(
      msemMatcher(entry, {
        targetMasses: [119, 120, 121, 122, 123],
      }),
    ).toStrictEqual({
      ionization: { charge: 1, em: 0, mf: 'H+' },
      ms: {
        charge: 1,
        delta: 0.0005485799090649834,
        em: 119.99945142009094,
        ionization: 'H+',
        ppm: 4.571520140909056,
        target: { mass: 120 },
      },
    });

    expect(
      msemMatcher(entry, {
        targetMasses: [119, 120, 121, 122, 123],
        targetIntensities: [5, 10, 15, 10, 5],
      }),
    ).toStrictEqual({
      ionization: { charge: 1, em: 0, mf: 'H+' },
      ms: {
        charge: 1,
        delta: 0.0005485799090649834,
        em: 119.99945142009094,
        ionization: 'H+',
        ppm: 4.571520140909056,
        target: { mass: 120, intensity: 10 },
      },
    });
  });

  it('test msemMatcher with list of target mass, no forced ionization', () => {
    let entry = {
      mf: 'C10',
      em: 120,
      msem: 0,
      charge: 0,
      unsaturation: 11,
      atoms: {
        C: 10,
      },
    };

    expect(
      msemMatcher(entry, {
        targetMasses: [50, 60, 70],
        precision: 100,
        ionization: { mf: '(H+)2', charge: 2, em: 0 },
      }),
    ).toStrictEqual({
      ms: {
        ionization: '(H+)2',
        em: 59.99945142009093,
        charge: 2,
        delta: 0.0005485799090720889,
        ppm: 9.143082079720413,
        target: {
          mass: 60,
        },
      },
      ionization: { mf: '(H+)2', charge: 2, em: 0 },
    });
  });

  it('negative atoms', () => {
    let entry = {
      mf: 'C-10',
      charge: 0,
      atoms: {
        C: -10,
      },
    };
    expect(msemMatcher(entry, { allowNegativeAtoms: true })).toStrictEqual({
      ionization: { atoms: {}, charge: 0, em: 0, mf: '' },
      ms: { charge: 0, em: 0, ionization: '' },
    });
    expect(msemMatcher(entry)).toBe(false);
    expect(
      msemMatcher(entry, {
        ionization: { mf: '(H+)2', charge: 2, em: 0, atoms: { H: 2 } },
      }),
    ).toBe(false);
  });

  it('negative ionizations', () => {
    let entry = {
      mf: 'C10',
      em: 120,
      charge: 0,
      atoms: {
        C: 10,
      },
    };
    expect(
      msemMatcher(entry, {
        allowNegativeAtoms: true,
        ionization: { mf: '(H+)-2', charge: -2, em: 0, atoms: { H: -2 } },
      }),
    ).toBeDeepCloseTo({
      ms: { ionization: '(H+)-2', em: 60.00054857990907, charge: -2 },
      ionization: { mf: '(H+)-2', charge: -2, em: 0, atoms: { H: -2 } },
    });
    expect(
      msemMatcher(entry, {
        ionization: { mf: 'C-2(+)', charge: 1, em: -24, atoms: { C: -2 } },
      }),
    ).toBeDeepCloseTo({
      ms: { ionization: 'C-2(+)', em: 95.99945142009094, charge: 1 },
      ionization: { mf: 'C-2(+)', charge: 1, em: -24, atoms: { C: -2 } },
    });
    expect(
      msemMatcher(entry, {
        ionization: { mf: '(H+)-2', charge: -2, em: 0, atoms: { H: -2 } },
      }),
    ).toBe(false);
    expect(
      msemMatcher(entry, {
        ionization: { mf: 'C-20', charge: 0, em: 0, atoms: { C: -20 } },
      }),
    ).toBe(false);
    expect(
      msemMatcher(entry, {
        ionization: { mf: 'C-10', charge: 0, em: 0, atoms: { C: -10 } },
      }),
    ).toStrictEqual({
      ionization: { atoms: { C: -10 }, charge: 0, em: 0, mf: 'C-10' },
      ms: { charge: 0, em: 0, ionization: 'C-10' },
    });
  });
});
