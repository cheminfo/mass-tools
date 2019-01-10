'use strict';

const IsotopicDistribution = require('../IsotopicDistribution.js');

describe('test isotopicDistribution', () => {
  it('create distribution of C1 with default options', () => {
    let isotopicDistribution = new IsotopicDistribution('C', { fwhm: 0.1 });
    let gaussian = isotopicDistribution.getGaussian();
    expect(gaussian.x).toHaveLength(601);
    expect(Math.min(...gaussian.x)).toBe(10);
    expect(Math.max(...gaussian.x)).toBe(16);
    expect(Math.min(...gaussian.y)).toBe(0);
    expect(Math.max(...gaussian.y)).toBe(0.9893);
  });
  it('create distribution of C1 and getGaussian', () => {
    let isotopicDistribution = new IsotopicDistribution('C', { fwhm: 0.1 });
    let gaussian = isotopicDistribution.getGaussian({
      from: 11.0,
      to: 13.0
    });
    expect(gaussian.x).toHaveLength(201);
    expect(Math.min(...gaussian.x)).toBe(11);
    expect(Math.max(...gaussian.x)).toBe(13);
    expect(Math.min(...gaussian.y)).toBe(0);
    expect(Math.max(...gaussian.y)).toBe(0.9893);
  });
});
