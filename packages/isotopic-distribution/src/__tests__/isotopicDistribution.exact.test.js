import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { IsotopicDistribution } from '..';

expect.extend({ toBeDeepCloseTo });

describe('isotopicDistribution with composition', () => {
  it('CN', () => {
    let isotopicDistribution = new IsotopicDistribution('CN', {
      fwhm: 1e-10,
    });
    const distribution = isotopicDistribution
      .getDistribution()
      .array.sort((a, b) => b.y - a.y);

    expect(distribution).toBeDeepCloseTo([
      {
        x: 26.003074004429998,
        y: 0.985698948,
        composition: { '12C': 1, '14N': 1 },
        label: '¹²C¹⁴N',
        shortComposition: {},
        shortLabel: '',
        deltaNeutrons: 0,
      },
      {
        x: 27.0064288395,
        y: 0.010661051999999999,
        composition: { '13C': 1, '14N': 1 },
        label: '¹³C¹⁴N',
        shortComposition: { '13C': 1 },
        shortLabel: '¹³C',
        deltaNeutrons: 1,
      },
      {
        x: 27.00010889888,
        y: 0.003601052,
        composition: { '12C': 1, '15N': 1 },
        label: '¹²C¹⁵N',
        shortComposition: { '15N': 1 },
        shortLabel: '¹⁵N',
        deltaNeutrons: 1,
      },
      {
        x: 28.00346373395,
        y: 0.000038948,
        composition: { '13C': 1, '15N': 1 },
        label: '¹³C¹⁵N',
        shortComposition: { '13C': 1, '15N': 1 },
        shortLabel: '¹³C¹⁵N',
        deltaNeutrons: 2,
      },
    ]);
  });
  it('C2', () => {
    let isotopicDistribution = new IsotopicDistribution('C2', {
      fwhm: 1e-10,
    });

    const distribution = isotopicDistribution
      .getDistribution()
      .array.sort((a, b) => b.y - a.y);

    expect(distribution).toBeDeepCloseTo([
      {
        x: 24,
        y: 0.9787144899999999,
        composition: { '12C': 2 },
        label: '¹²C₂',
        shortComposition: {},
        shortLabel: '',
        deltaNeutrons: 0,
      },
      {
        x: 25.00335483507,
        y: 0.02117102,
        composition: { '12C': 1, '13C': 1 },
        label: '¹²C¹³C',
        shortComposition: { '13C': 1 },
        shortLabel: '¹³C',
        deltaNeutrons: 1,
      },
      {
        x: 26.00670967014,
        y: 0.00011448999999999998,
        composition: { '13C': 2 },
        label: '¹³C₂',
        shortComposition: { '13C': 2 },
        shortLabel: '¹³C₂',
        deltaNeutrons: 2,
      },
    ]);
  });
  it('C100', () => {
    let isotopicDistribution = new IsotopicDistribution('C100', {
      fwhm: 1e-10,
    });

    const distribution = isotopicDistribution
      .getDistribution()
      .array.sort((a, b) => b.y - a.y)
      .slice(0, 2);

    expect(distribution).toBeDeepCloseTo([
      {
        x: 1201.00335483507,
        y: 0.36885585055424797,
        composition: { '12C': 99, '13C': 1 },
        label: '¹²C₉₉¹³C',
        deltaNeutrons: 1,
        shortComposition: { '13C': 1 },
        shortLabel: '¹³C',
      },
      {
        x: 1200,
        y: 0.34103653547039026,
        composition: { '12C': 100 },
        label: '¹²C₁₀₀',
        deltaNeutrons: 0,
        shortComposition: {},
        shortLabel: '',
      },
    ]);
  });
  it('C100H100', () => {
    let isotopicDistribution = new IsotopicDistribution('C100H100', {
      fwhm: 1e-10,
    });

    const distribution = isotopicDistribution
      .getDistribution()
      .array.sort((a, b) => b.y - a.y)
      .slice(0, 3);
    expect(distribution).toBeDeepCloseTo([
      {
        x: 1301.78585805807,
        y: 0.3646380645014197,
        composition: { '12C': 99, '13C': 1, '1H': 100 },
        label: '¹²C₉₉¹³C¹H₁₀₀',
        deltaNeutrons: 1,
        shortComposition: { '13C': 1 },
        shortLabel: '¹³C',
      },
      {
        x: 1300.782503223,
        y: 0.33713685720678,
        composition: { '12C': 100, '1H': 100 },
        label: '¹²C₁₀₀¹H₁₀₀',
        deltaNeutrons: 0,
        shortComposition: {},
        shortLabel: '',
      },
      {
        x: 1302.78921289314,
        y: 0.1952193984263388,
        composition: { '12C': 98, '13C': 2, '1H': 100 },
        label: '¹²C₉₈¹³C₂¹H₁₀₀',
        deltaNeutrons: 2,
        shortComposition: { '13C': 2 },
        shortLabel: '¹³C₂',
      },
    ]);
  });
  it('Cys100', () => {
    let isotopicDistribution = new IsotopicDistribution('Cys100', {
      fwhm: 1e-10,
    });
    const distribution = isotopicDistribution
      .getDistribution()
      .array.sort((a, b) => b.y - a.y)
      .slice(0, 3);
    expect(distribution).toBeDeepCloseTo([
      {
        x: 10311.91174377861,
        y: 0.010579745566715856,
        composition: {
          '12C': 297,
          '13C': 3,
          '1H': 500,
          '14N': 100,
          '16O': 100,
          '32S': 96,
          '34S': 4,
        },
        label: '¹²C₂₉₇¹³C₃¹H₅₀₀¹⁴N₁₀₀¹⁶O₁₀₀³²S₉₆³⁴S₄',
        deltaNeutrons: 11,
        shortComposition: { '13C': 3, '34S': 4 },
        shortLabel: '¹³C₃³⁴S₄',
      },
      {
        x: 10310.908388943539,
        y: 0.009847464990107253,
        composition: {
          '12C': 298,
          '13C': 2,
          '1H': 500,
          '14N': 100,
          '16O': 100,
          '32S': 96,
          '34S': 4,
        },
        label: '¹²C₂₉₈¹³C₂¹H₅₀₀¹⁴N₁₀₀¹⁶O₁₀₀³²S₉₆³⁴S₄',
        deltaNeutrons: 10,
        shortComposition: { '13C': 2, '34S': 4 },
        shortLabel: '¹³C₂³⁴S₄',
      },
      {
        x: 10309.91594794901,
        y: 0.009751073682302864,
        composition: {
          '12C': 297,
          '13C': 3,
          '1H': 500,
          '14N': 100,
          '16O': 100,
          '32S': 97,
          '34S': 3,
        },
        label: '¹²C₂₉₇¹³C₃¹H₅₀₀¹⁴N₁₀₀¹⁶O₁₀₀³²S₉₇³⁴S₃',
        deltaNeutrons: 9,
        shortComposition: { '13C': 3, '34S': 3 },
        shortLabel: '¹³C₃³⁴S₃',
      },
    ]);
  });

  it('create distribution of C1.C2 and getPeaks', () => {
    let isotopicDistribution = new IsotopicDistribution('C1++.C2(-).B', {
      fwhm: 0,
    });
    let peaks = isotopicDistribution.getPeaks({ maxValue: 1 });
    expect(peaks[0]).toStrictEqual({
      x: 5.99945142009093,
      y: 1,
      composition: { '12C': 1 },
      label: '¹²C',
      shortComposition: {},
      shortLabel: '',
      deltaNeutrons: 0,
    });
    expect(peaks[2]).toStrictEqual({
      x: 10.01293695,
      y: 0.20115232993025373,
      composition: { '10B': 1 },
      label: '¹⁰B',
      shortComposition: { '10B': 1 },
      shortLabel: '¹⁰B',
      deltaNeutrons: -1,
    });
  });
});
