'use strict';

const getFragmentedCandidateScore = require('../getFragmentedCandidateScore.js');

describe('test getMatchingScore', () => {
  let experimentalSpecturm = {
    masses: [1, 2, 3, 4, 5, 6, 7, 8],
    intensities: [8, 7, 6, 5, 4, 3, 2, 1],
  };
  let fragments = [1.00004, 2.00001, 3.00005, 4.00005, 5.000002];
  let options = {
    massCoefficient: 2,
    intensityCoefficient: 0.8,
    precision: 100,
  };

  it('custom options', () => {
    let result = getFragmentedCandidateScore(
      experimentalSpecturm,
      fragments,
      options,
    );
    expect(result).toBeCloseTo(195.75600305170587);
  });
  it('default options', () => {
    let result = getFragmentedCandidateScore(experimentalSpecturm, fragments);
    expect(result).toBeCloseTo(287.1745887492587);
  });
  it('missing fragments and options', () => {
    let result = getFragmentedCandidateScore(experimentalSpecturm);
    expect(result).toBeCloseTo(0);
  });
});
