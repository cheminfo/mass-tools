'use strict';

const IsotopicDistribution = require('../IsotopicDistribution.js');

describe('test isotopicDistribution', () => {
  it('create distribution of CH0', () => {
    let isotopicDistribution = new IsotopicDistribution('CH0');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array[0].x).toBe(12);
  });

  it('create distribution of CN default res', () => {
    let isotopicDistribution = new IsotopicDistribution('CN');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.length).toBe(3);
  });

  it('create distribution of CN high res', () => {
    let isotopicDistribution = new IsotopicDistribution('CN', {fwhm: 0});
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.length).toBe(4);
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
      { x: 26.00670967014, y: 0.00011448999999999998 }
    ]);
  });
  it('create distribution for multiplepart, C.C2.C3', () => {
    let isotopicDistribution = new IsotopicDistribution('C.C2.C3');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array.reduce((e, p) => (e += p.y), 0)).toBeCloseTo(
      3,
      5
    );
  });

  it('create distribution for charged multiplepart, C+.(C+)2', () => {
    let isotopicDistribution = new IsotopicDistribution('C+.(C+)2');
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 11.99945142009093, y: 1.9680144899999998 },
      { x: 12.501128837625929, y: 0.02117102 },
      { x: 13.00280625516093, y: 0.01081449 }
    ]);
  });

  it('getParts of isotopic distribution', () => {
    let isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'H+'
    });
    let parts = isotopicDistribution.getParts();
    expect(parts[0].ms.em).toBeCloseTo(13.00727645232093, 5);
  });

  it('create distribution for many ionizations, C + (+, ++)', () => {
    let isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: '+,++'
    });
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 5.99945142009093, y: 0.9893 },
      { x: 6.50112883762593, y: 0.0107 },
      { x: 11.99945142009093, y: 0.9893 },
      { x: 13.00280625516093, y: 0.0107 }
    ]);
    expect(isotopicDistribution.getParts()).toMatchSnapshot();
  });

  it('create distribution for many ionizations, C + H+', () => {
    let isotopicDistribution = new IsotopicDistribution('C', {
      ionizations: 'H+'
    });
    let distribution = isotopicDistribution.getDistribution();
    expect(distribution.array).toMatchObject([
      { x: 13.00727645232093, y: 0.9893 },
      { x: 14.01063128739093, y: 0.0107 }
    ]);
  });

  it('create distribution of C10 and getXY', () => {
    let isotopicDistribution = new IsotopicDistribution('C10');
    let xy = isotopicDistribution.getXY();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    expect(xy.x[0]).toEqual(120);
    expect(xy.y[0]).toEqual(100);
  });

  it('create distribution of Ru5 and getXY', () => {
    let isotopicDistribution = new IsotopicDistribution('Ru5');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    let element = distribution.array[25];
    expect(element).toEqual({ x: 505.52516825500203, y: 1 });
  });

  it('create distribution of C1000H1000', () => {
    let isotopicDistribution = new IsotopicDistribution('C1000H1000');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toEqual({ x: 13017.858890698088, y: 1 });
  });

  it('create distribution of C1000H1000N1000', () => {
    let isotopicDistribution = new IsotopicDistribution('C1000H1000N1000');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.99999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toEqual({ x: 27024.926947823435, y: 1 });
  });

  it('create distribution of Ala1000', () => {
    let isotopicDistribution = new IsotopicDistribution('Ala1000');
    let distribution = isotopicDistribution.getDistribution();
    expect(isotopicDistribution.confidence).toBeGreaterThan(0.9999);
    distribution.maxToOne();
    distribution.sortY();
    expect(distribution.array[0]).toEqual({ x: 71076.21791348715, y: 1 });
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
});
