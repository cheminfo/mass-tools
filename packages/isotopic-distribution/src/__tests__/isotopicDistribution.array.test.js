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
      .array.toSorted((a, b) => b.y - a.y)
      .map((entry) => entry.y)
      .slice(0, 3);

    expect(intensities).toBeDeepCloseTo([2.9, 1.96, 0.989], 2);
  });

  it('C,C2,C3 simplified', () => {
    let isotopicDistribution = new IsotopicDistribution(
      [
        {
          mf: 'C',
          ionization: { mf: 'H+' },
          intensity: 1,
        },
        {
          mf: 'C2 H(++)',
          intensity: 2,
        },
        {
          mf: 'C3 H(++)',
          ionization: { mf: '' },
          intensity: 3,
        },
      ],
      {
        fwhm: 1e-10,
      },
    );
    const intensities = isotopicDistribution
      .getDistribution()
      .array.toSorted((a, b) => b.y - a.y)
      .map((entry) => ({ x: entry.x, y: entry.y }))
      .slice(0, 3);

    expect(intensities).toBeDeepCloseTo(
      [
        { x: 18.503, y: 2.904 },
        { x: 12.503, y: 1.957 },
        { x: 13.007, y: 0.989 },
      ],
      2,
    );

    const peaks = isotopicDistribution
      .getPeaks({ maxValue: 100 })
      .toSorted((a, b) => b.y - a.y);
    const deltaNeutrons = peaks.slice(0, 4).map((p) => p.deltaNeutrons);

    expect(deltaNeutrons).toStrictEqual([0, 0, 0, 1]);
  });

  it('C,[13C] simplified', () => {
    let isotopicDistribution = new IsotopicDistribution(
      [
        {
          mf: 'C',
          ionization: { mf: 'H+' },
          intensity: 1,
        },
        {
          mf: '[13C]',
          intensity: 2,
        },
      ],
      {
        fwhm: 1e-10,
      },
    );

    const peaks = isotopicDistribution
      .getPeaks({ maxValue: 100 })
      .toSorted((a, b) => b.y - a.y);

    expect(peaks.slice(0, 3)).toBeDeepCloseTo([
      {
        x: 13.00335483507,
        y: 100,
        composition: { '13C': 1 },
        label: '¹³C',
        shortComposition: { '13C': 1 },
        shortLabel: '¹³C',
        deltaNeutrons: 0,
      },
      {
        x: 13.00727645232093,
        y: 49.459311525,
        composition: { '12C': 1, '1H': 1 },
        label: '¹²C¹H',
        shortComposition: {},
        shortLabel: '',
        deltaNeutrons: 0,
      },
      {
        x: 14.01063128739093,
        y: 0.534938475,
        composition: { '13C': 1, '1H': 1 },
        label: '¹³C¹H',
        shortComposition: { '13C': 1 },
        shortLabel: '¹³C',
        deltaNeutrons: 1,
      },
    ]);
  });

  it('supports deltaNeutrons', () => {
    const isotopicDistributionForPeaks = new IsotopicDistribution(
      [{ mf: `C2H7O+`, intensity: 1 }],
      {
        fwhm: 0,
        maxLines: 1e5,
        limit: 1e5,
        minY: 1e-8,
        allowNeutral: true,
        ensureCase: false,
      },
    );

    const isotopologues = isotopicDistributionForPeaks.getPeaks();
    const deltaNeutronsNaN = isotopologues
      .map((i) => i.deltaNeutrons)
      .filter(Number.isNaN);

    expect(deltaNeutronsNaN).toHaveLength(0);
  });
});
