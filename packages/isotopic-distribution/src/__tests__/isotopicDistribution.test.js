'use strict';

const IsotopicDistribution = require('../IsotopicDistribution.js');

describe('test isotopicDistribution', () => {
  it('create distribution of CH0', () => {
    let isotopicDistribution = new IsotopicDistribution('CH00');
    expect(isotopicDistribution.getTable()).toStrictEqual([
      { x: 12, y: 0.9893 },
      { x: 13.00335483507, y: 0.0107 },
    ]);
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
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array[0].x).toBe(12);
  });

  it('create distribution of C Ag+', () => {
    let isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'Ag+',
    });
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toStrictEqual([
      { x: 118.90454302009094, y: 0.512843227 },
      { x: 119.90789785516094, y: 0.005546773 },
      { x: 120.90420672009094, y: 0.47645677299999994 },
      { x: 121.90756155516094, y: 0.005153227 },
    ]);
  });

  it('create distribution for multiplepart, C.C.C2', () => {
    let isotopicDistribution = new IsotopicDistribution('C.C.C2');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 12, y: 1.9786 },
      { x: 13.00335483507, y: 0.0214 },
      { x: 24, y: 0.9787144899999999 },
      { x: 25.00335483507, y: 0.02117102 },
      { x: 26.00670967014, y: 0.00011448999999999998 },
    ]);
  });

  it('create distribution from parts', () => {
    let parts = [
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
    let isotopicDistribution = new IsotopicDistribution(parts);
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 12, y: 1.9786 },
      { x: 13.00335483507, y: 0.0214 },
      { x: 24, y: 0.9787144899999999 },
      { x: 25.00335483507, y: 0.02117102 },
      { x: 26.00670967014, y: 0.00011448999999999998 },
    ]);
  });

  it('create distribution of CN default res', () => {
    let isotopicDistribution = new IsotopicDistribution('CN');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution).toHaveLength(3);
  });

  it('create distribution of CN high res', () => {
    let isotopicDistribution = new IsotopicDistribution('CN', { fwhm: 0 });
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution).toHaveLength(4);
  });

  it('create distribution of C1000', () => {
    let isotopicDistribution = new IsotopicDistribution('C1000');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array[0].x).toBe(12000);
  });

  it('create distribution for multiplepart, C.C2', () => {
    let isotopicDistribution = new IsotopicDistribution('C.C2');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 12, y: 0.9893 },
      { x: 13.00335483507, y: 0.0107 },
      { x: 24, y: 0.9787144899999999 },
      { x: 25.00335483507, y: 0.02117102 },
      { x: 26.00670967014, y: 0.00011448999999999998 },
    ]);
  });
  it('create distribution for multiplepart, C.C2.C3', () => {
    let isotopicDistribution = new IsotopicDistribution('C.C2.C3');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array.reduce((e, p) => (e += p.y), 0)).toBeCloseTo(
      3,
      5,
    );
  });

  it('create distribution for charged multiplepart, C+.(C+)2', () => {
    let isotopicDistribution = new IsotopicDistribution('C+.(C+)2');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 11.99945142009093, y: 1.9680144899999998 },
      { x: 12.501128837625929, y: 0.02117102 },
      { x: 13.00280625516093, y: 0.01081449 },
    ]);
  });

  it('getParts of isotopic distribution', () => {
    let isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'H+',
    });
    let parts = isotopicDistribution.getParts();
    expect(parts[0].ms.em).toBeCloseTo(13.00727645232093, 5);
  });

  it('create distribution for many ionizations, C + (+, ++)', () => {
    let isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: '+,++',
    });
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 5.99945142009093, y: 0.9893 },
      { x: 6.50112883762593, y: 0.0107 },
      { x: 11.99945142009093, y: 0.9893 },
      { x: 13.00280625516093, y: 0.0107 },
    ]);
    expect(isotopicDistribution.getParts()).toMatchSnapshot();
  });

  it('create distribution for many ionizations, C + H+', () => {
    let isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'H+',
    });
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 13.00727645232093, y: 0.9891862305 },
      { x: 14.010662031727025, y: 0.010812539 },
      { x: 15.01690803328093, y: 0.0000012305 },
    ]);
  });

  it('create distribution of C10 and getXY', () => {
    let isotopicDistribution = new IsotopicDistribution('C10');
    let xy = isotopicDistribution.getXY();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    expect(xy.x[0]).toBe(120);
    expect(xy.y[0]).toBe(100);
  });

  it('create distribution of C10 and getPeaks', () => {
    let isotopicDistribution = new IsotopicDistribution('C10', {
      fwhm: 0,
    });
    let peaks = isotopicDistribution.getPeaks({ maxValue: 1 });
    expect(peaks[0]).toStrictEqual({
      x: 120,
      y: 1,
      composition: { '12C': 10 },
      label: '¹²C₁₀',
      shortComposition: {},
      shortLabel: '',
    });
  });

  it('create distribution of C10 and getXY with sumValue to 1', () => {
    let isotopicDistribution = new IsotopicDistribution('C10');
    let xy = isotopicDistribution.getXY({ sumValue: 100 });
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    expect(xy.x[0]).toBe(120);
    expect(xy.y.reduce((previous, current) => previous + current, 0)).toBe(100);
  });

  it('create distribution of Ru5 and getXY', () => {
    let isotopicDistribution = new IsotopicDistribution('Ru5');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    let element = distribution.array[25];
    expect(element).toStrictEqual({ x: 505.52516825500203, y: 1 });
  });

  it('create distribution of empty array and getXY', () => {
    let isotopicDistribution = new IsotopicDistribution([]);
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeNaN();
    distribution.maxToOne();
    expect(isotopicDistribution.getXY()).toStrictEqual({ x: [], y: [] });
    expect(isotopicDistribution.getCSV()).toBe('');
    expect(isotopicDistribution.getTable()).toStrictEqual([]);
    expect(isotopicDistribution.getGaussian()).toStrictEqual({ x: [], y: [] });
  });

  it('create distribution of C1000H1000', () => {
    let isotopicDistribution = new IsotopicDistribution('C1000H1000');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toStrictEqual({
      x: 13017.858890698088,
      y: 1,
    });
  });

  it('create distribution of C1000H1000N1000', () => {
    let isotopicDistribution = new IsotopicDistribution('C1000H1000N1000');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toStrictEqual({
      x: 27024.926947823435,
      y: 1,
    });
  });

  it('create distribution of Ala1000', () => {
    let isotopicDistribution = new IsotopicDistribution('Ala1000');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toStrictEqual({ x: 71076.21791348715, y: 1 });
  });

  it('create distribution with charged molecule C+', () => {
    let isotopicDistribution = new IsotopicDistribution('C+');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    expect(distribution.array[0].x).toBeCloseTo(11.99945, 5);
  });
  it('create distribution with charged molecule C2(+2)', () => {
    let isotopicDistribution = new IsotopicDistribution('C2(+2)');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    expect(distribution.array[0].x).toBeCloseTo(11.99945, 5);
  });
  it('create distribution with charged molecule C2(-2)', () => {
    let isotopicDistribution = new IsotopicDistribution('C2(-2)');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    expect(distribution.array[0].x).toBeCloseTo(12.00055, 5);
  });

  it('create distribution with no elements Ru0', () => {
    let isotopicDistribution = new IsotopicDistribution('Ru0');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([{ x: 0, y: 1 }]);
  });

  it('create distribution with null elements', () => {
    let isotopicDistribution = new IsotopicDistribution('CRu0C');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array[0].x).toBe(24);
  });

  it('distribution of CH-1', () => {
    let isotopicDistribution = new IsotopicDistribution('CH-1');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution).toStrictEqual({ array: [] });
  });

  it('gaussian of N(H-1)', () => {
    let isotopicDistribution = new IsotopicDistribution('NH-1');
    let distribution = isotopicDistribution.getGaussian();
    expect(distribution).toStrictEqual({ x: [], y: [] });
  });
});
