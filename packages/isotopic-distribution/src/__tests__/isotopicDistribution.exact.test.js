'use strict';

const IsotopicDistribution = require('../IsotopicDistribution.js');

describe('isotopicDistribution with composition', () => {
  it('CN', () => {
    let isotopicDistribution = new IsotopicDistribution('CN', { fwhm: 1e-10 });
    console.log(isotopicDistribution.getDistribution());
  });
});
