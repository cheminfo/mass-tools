import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { MF } from 'mf-parser';
import {
  xMaxValue,
  xyObjectMaxYPoint,
  xyObjectMinYPoint,
} from 'ml-spectra-processing';
import { describe, expect, it } from 'vitest';

import { IsotopicDistribution } from '..';

expect.extend({ toBeDeepCloseTo });

describe('test isotopicDistribution', () => {
  it('create distribution of CH0', () => {
    const isotopicDistribution = new IsotopicDistribution('CH00');
    expect(isotopicDistribution.getTable()).toStrictEqual([
      { x: 12, y: 0.9893 },
      { x: 13.00335483507, y: 0.0107 },
    ]);
    expect(isotopicDistribution.getText()).toStrictEqual(`12.00000	98.930
13.00335	1.070`);
    expect(isotopicDistribution.getText({ delimiter: ',' }))
      .toStrictEqual(`12.00000,98.930
13.00335,1.070`);
    expect(
      isotopicDistribution.getText({
        delimiter: ',',
        numberXDecimals: 2,
        numberYDecimals: 4,
      }),
    ).toStrictEqual(`12.00,98.9300
13.00,1.0700`);

    expect(
      isotopicDistribution.getTable({ xLabel: 'mz', yLabel: 'intensity' }),
    ).toStrictEqual([
      { mz: 12, intensity: 0.9893 },
      { mz: 13.00335483507, intensity: 0.0107 },
    ]);
    expect(isotopicDistribution.getTable({ maxValue: 100 })).toStrictEqual([
      { x: 12, y: 100 },
      { x: 13.00335483507, y: 1.0815728292732234 },
    ]);
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array[0].x).toBe(12);
  });

  it('create distribution of [13C]', () => {
    const isotopicDistribution = new IsotopicDistribution('[13C]', {
      fwhm: 1e-8,
    });
    const peaks = isotopicDistribution.getXY();
    expect(peaks).toBeDeepCloseTo({
      x: [13.00335483507],
      y: [100],
      composition: [{ '13C': 1 }],
      label: ['¹³C'],
      shortComposition: [{ '13C': 1 }],
      deltaNeutrons: [0],
      shortLabel: ['¹³C'],
    });
  });

  it('create distribution of C Ag+', () => {
    const isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'Ag+',
    });
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toStrictEqual([
      { x: 118.90454302009094, y: 0.512843227 },
      { x: 119.90789785516094, y: 0.005546773 },
      { x: 120.90420672009094, y: 0.47645677299999994 },
      { x: 121.90756155516094, y: 0.005153227 },
    ]);
  });

  it('create distribution for multiplepart, C.C.C2', () => {
    const isotopicDistribution = new IsotopicDistribution('C.C.C2');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 12, y: 1.9786 },
      { x: 13.00335483507, y: 0.0214 },
      { x: 24, y: 0.9787144899999999 },
      { x: 25.00335483507, y: 0.02117102 },
      { x: 26.00670967014, y: 0.00011448999999999998 },
    ]);
  });

  it('create distribution with minY', () => {
    const isotopicDistribution = new IsotopicDistribution('C', { minY: 0.1 });
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([{ x: 12, y: 0.9893 }]);
  });

  it('create distribution with impossible minY', () => {
    const isotopicDistribution = new IsotopicDistribution('C', { minY: 1 });
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([]);
  });

  it('create distribution from parts', () => {
    const parts = [
      {
        mf: 'C',
        intensity: 2,
        ms: { ionization: '', em: 0, charge: 0 },
        ionization: { mf: '', em: 0, charge: 0 },
      },
      {
        mf: 'C2',
        ms: { ionization: '', em: 0, charge: 0 },
        ionization: { mf: '', em: 0, charge: 0 },
      },
    ];
    const isotopicDistribution = new IsotopicDistribution(parts);
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 12, y: 1.9786 },
      { x: 13.00335483507, y: 0.0214 },
      { x: 24, y: 0.9787144899999999 },
      { x: 25.00335483507, y: 0.02117102 },
      { x: 26.00670967014, y: 0.00011448999999999998 },
    ]);
  });

  it('create distribution of CN default res', () => {
    const isotopicDistribution = new IsotopicDistribution('CN');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution).toHaveLength(3);
  });

  it('create distribution of CN high res', () => {
    const isotopicDistribution = new IsotopicDistribution('CN', { fwhm: 0 });
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution).toHaveLength(4);
  });

  it('create distribution of C1000', () => {
    const isotopicDistribution = new IsotopicDistribution('C1000');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array[0].x).toBe(12000);
  });

  it('create distribution for multiplepart, C.C2', () => {
    const isotopicDistribution = new IsotopicDistribution('C.C2');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 12, y: 0.9893 },
      { x: 13.00335483507, y: 0.0107 },
      { x: 24, y: 0.9787144899999999 },
      { x: 25.00335483507, y: 0.02117102 },
      { x: 26.00670967014, y: 0.00011448999999999998 },
    ]);
  });
  it('create distribution for multiplepart, C.C2.C3', () => {
    const isotopicDistribution = new IsotopicDistribution('C.C2.C3');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array.reduce((e, p) => e + p.y, 0)).toBeCloseTo(3, 5);
  });

  it('create distribution for charged multiplepart, C+.(C+)2', () => {
    const isotopicDistribution = new IsotopicDistribution('C+.(C+)2');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 11.99945142009093, y: 1.9680144899999998 },
      { x: 12.501128837625929, y: 0.02117102 },
      { x: 13.00280625516093, y: 0.01081449 },
    ]);
  });

  it('getParts of isotopic distribution', () => {
    const isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'H+',
    });
    const parts = isotopicDistribution.getParts();
    expect(parts[0].ms.em).toBeCloseTo(13.00727645232093, 5);
  });

  it('create distribution for many ionizations, C + (+, ++)', () => {
    const isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: '+,++',
    });
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 5.99945142009093, y: 0.9893 },
      { x: 6.50112883762593, y: 0.0107 },
      { x: 11.99945142009093, y: 0.9893 },
      { x: 13.00280625516093, y: 0.0107 },
    ]);
    expect(isotopicDistribution.getParts()).toMatchSnapshot();
  });

  it('create distribution for many ionizations, C + H+', () => {
    const isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'H+',
    });
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 13.00727645232093, y: 0.9891862305 },
      { x: 14.010662031727025, y: 0.010812539 },
      { x: 15.01690803328093, y: 0.0000012305 },
    ]);
  });

  it('create distribution of C10 and getXY', () => {
    const isotopicDistribution = new IsotopicDistribution('C10');
    const xy = isotopicDistribution.getXY();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    expect(xy.x[0]).toBe(120);
    expect(xy.y[0]).toBe(100);
  });

  it('create distribution of C10 and getPeaks', () => {
    const isotopicDistribution = new IsotopicDistribution('C10', {
      fwhm: 0,
    });
    const peaks = isotopicDistribution.getPeaks({ maxValue: 1 });
    expect(peaks[0]).toStrictEqual({
      x: 120,
      y: 1,
      composition: { '12C': 10 },
      label: '¹²C₁₀',
      deltaNeutrons: 0,
      shortComposition: {},
      shortLabel: '',
    });
  });

  it('negative number of atoms', () => {
    const isotopicDistribution = new IsotopicDistribution('CH-1');
    const xy = isotopicDistribution.getXY({ sumValue: 100 });
    expect(xy).toStrictEqual({ x: [], y: [] });
    const gaussian = isotopicDistribution.getGaussian({ maxValue: 100 });
    expect(gaussian).toStrictEqual({ x: [], y: [] });
    const table = isotopicDistribution.getTable();
    expect(table).toStrictEqual([]);
  });

  it('create distribution of C10 and getXY with sumValue to 100', () => {
    const isotopicDistribution = new IsotopicDistribution('C10');
    const xy = isotopicDistribution.getXY({ sumValue: 100 });
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    expect(xy.x[0]).toBe(120);
    expect(xy.y.reduce((previous, current) => previous + current, 0)).toBe(100);
  });

  it('create distribution of C10 with threshold', () => {
    const isotopicDistribution = new IsotopicDistribution('C10', {
      threshold: 0.1,
    });
    const xy = isotopicDistribution.getXY({ sumValue: 100 });
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.95);
    expect(xy.x[0]).toBe(120);
    expect(xy.y.reduce((previous, current) => previous + current, 0)).toBe(100);
  });

  it('create distribution of C10 with limit', () => {
    const isotopicDistribution = new IsotopicDistribution('C10', {
      limit: 2,
    });
    const xy = isotopicDistribution.getXY();
    expect(xy).toBeDeepCloseTo({
      x: [120, 121.00335483507],
      y: [100, 10.815728292732235],
    });
  });

  it('create distribution of C10 and getVariables with maxValue to 100', () => {
    const isotopicDistribution = new IsotopicDistribution('C10');
    const variables = isotopicDistribution.getVariables();
    expect(variables.x.data.length).toBe(6);
    expect(Math.max(...variables.y.data)).toBe(100);
  });

  it('C1000000', () => {
    const isotopicDistribution = new IsotopicDistribution('C1000000');
    const variables = isotopicDistribution.getVariables();
    expect(variables.x.data.length).toBe(822);
    expect(Math.max(...variables.y.data)).toBe(100);
    const spectrum = isotopicDistribution.getGaussian();
    expect(spectrum.x).toHaveLength(28950);
  });

  it('create distribution of Ru5 and getXY', () => {
    const isotopicDistribution = new IsotopicDistribution('Ru5');
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    const element = distribution.array[25];
    expect(element).toStrictEqual({ x: 505.52516825500203, y: 1 });
  });

  it('create distribution of empty array and getXY', () => {
    const isotopicDistribution = new IsotopicDistribution([]);
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeNaN();
    distribution.maxToOne();
    expect(isotopicDistribution.getXY()).toStrictEqual({ x: [], y: [] });
    expect(isotopicDistribution.getCSV()).toBe('');
    expect(isotopicDistribution.getTable()).toStrictEqual([]);
    expect(isotopicDistribution.getGaussian()).toStrictEqual({ x: [], y: [] });
  });

  it('create distribution of C1000H1000', () => {
    const isotopicDistribution = new IsotopicDistribution('C1000H1000');
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toStrictEqual({
      x: 13017.858890698088,
      y: 1,
    });
  });

  it('create distribution of C1000H1000N1000', () => {
    const isotopicDistribution = new IsotopicDistribution('C1000H1000N1000');
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toStrictEqual({
      x: 27024.926947823435,
      y: 1,
    });
  });

  it('create distribution of Ala1000', () => {
    const isotopicDistribution = new IsotopicDistribution('Ala1000');
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toStrictEqual({ x: 71076.21791348715, y: 1 });
  });

  it('create distribution with charged molecule C+', () => {
    const isotopicDistribution = new IsotopicDistribution('C+');
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    expect(distribution.array[0].x).toBeCloseTo(11.99945, 5);
  });
  it('create distribution with charged molecule C2(+2)', () => {
    const isotopicDistribution = new IsotopicDistribution('C2(+2)');
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    expect(distribution.array[0].x).toBeCloseTo(11.99945, 5);
  });
  it('create distribution with charged molecule C2(-2)', () => {
    const isotopicDistribution = new IsotopicDistribution('C2(-2)');
    const distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    expect(distribution.array[0].x).toBeCloseTo(12.00055, 5);
  });

  it('create distribution with no elements Ru0', () => {
    const isotopicDistribution = new IsotopicDistribution('Ru0');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([{ x: 0, y: 1 }]);
  });

  it('create distribution with null elements', () => {
    const isotopicDistribution = new IsotopicDistribution('CRu0C');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution.array[0].x).toBe(24);
  });

  it('distribution of CH-1', () => {
    const isotopicDistribution = new IsotopicDistribution('CH-1');
    const distribution = isotopicDistribution.getDistribution();
    expect(distribution).toStrictEqual({ array: [] });
  });

  it('gaussian of N(H-1)', () => {
    const isotopicDistribution = new IsotopicDistribution('NH-1');
    const distribution = isotopicDistribution.getGaussian();
    expect(distribution).toStrictEqual({ x: [], y: [] });
  });

  it('extreme case with very few points', () => {
    const isotopicDistribution = new IsotopicDistribution('C1000000', {
      fwhm: 600, // Used both to determine gaussian width and whether to merge close centroids.
      maxLines: 2e6, // Maximal number of peaks during calculations.
      limit: 1e6, // Maximum number of peaks to keep.
      minY: 1e-8, // Optimization parameter. The lower, the slower.
      allowNeutral: true, // Whether to keep the distribution if the molecule has no charge.
      ensureCase: false, // Ensure uppercase / lowercase.
    });

    const peaks = isotopicDistribution.getXY();
    expect(peaks.x).toHaveLength(1);
    expect(peaks.y).toStrictEqual([100]);

    const profile = isotopicDistribution.getGaussian({
      gaussianWidth: 10,
      maxValue: 100,
      threshold: 0,
      maxLength: 1e7,
    });
    expect(profile.x[0]).toBeCloseTo(12010736, 0);
    expect(profile.y[0]).toBeCloseTo(100);
  });

  it('Cys100 should not give a gaussian with y over 100', () => {
    const isotopicDistribution = new IsotopicDistribution('Cys100', {
      fwhm: 0.01,
    });

    const profile = isotopicDistribution.getGaussian({
      gaussianWidth: 10,
      maxValue: 100,
      threshold: 0,
      maxLength: 1e7,
      peakWidthFct: () => 1,
    });
    const maxValue = xMaxValue(profile.y);
    expect(maxValue).toBeCloseTo(100);
  });

  it('Cys and check max / min values', () => {
    const mf = 'CysH(+1)'; // Cys with H+ Ionization
    const info = new MF(mf).getInfo();
    const observedMass = info.observedMonoisotopicMass || info.monoisotopicMass;
    const fwhm = observedMass / 2e4;

    const isotopicDistributionForGaussian = new IsotopicDistribution(mf, {
      fwhm: Math.min(fwhm || 1e-4, 0.1),
      maxLines: 2e6,
      limit: 1e6,
      minY: 1e-8,
      allowNeutral: true,
      ensureCase: false,
    });

    const profile = isotopicDistributionForGaussian.getGaussian({
      gaussianWidth: 10,
      maxValue: 100,
      threshold: 0,
      maxLength: 1e7,
      peakWidthFct: () => fwhm || 1e-4,
    });

    const isotopicDistributionForPeaks = new IsotopicDistribution(mf, {
      fwhm: 0, // we will not merge close centroids and we can therefore calculate the exact isotopic composition (isotopologues) of each peak.
      maxLines: 1e5, // Maximal number of peaks during calculations.
      limit: 1e5, // Maximum number of peaks to keep.
      minY: 1e-8, // Optimization parameter. The lower, the slower.
      allowNeutral: true, // Whether to keep the distribution if the molecule has no charge.
      ensureCase: false, // Ensure uppercase / lowercase.
    });

    const peaks = isotopicDistributionForPeaks.getPeaks();
    const maxPoint = xyObjectMaxYPoint(peaks);
    expect(maxPoint.y).toBe(100);
    const minPoint = xyObjectMinYPoint(peaks);
    expect(minPoint.y).greaterThanOrEqual(0);

    const maxValue = xMaxValue(profile.y);
    expect(maxValue).toBe(100);
  });
});
