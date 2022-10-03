'use strict';

const getFragmentedCandidateScore = require('../getFragmentedCandidateScore.js');

describe('test getMatchingScore', () => {
  let matchedExpFragments = {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    y: [8, 7, 6, 5, 4, 3, 2, 1],
  };
  let fragmentsContribution = [1, 2, 3, 4, 5];
  let options = { massCoefficient: 2, intensityCoefficient: 0.8 };

  it('custom options', () => {
    let result = getFragmentedCandidateScore(
      matchedExpFragments,
      fragmentsContribution,
      options,
    );
    expect(result).toBeCloseTo(446.76604692483096);
  });
  it('default options', () => {
    let result = getFragmentedCandidateScore(
      matchedExpFragments,
      fragmentsContribution,
    );
    expect(result).toBeCloseTo(2028.039654693095);
  });
  it('missing fragmentsContribution and options', () => {
    let result = getFragmentedCandidateScore(matchedExpFragments);
    expect(result).toBeCloseTo(2013.039654693095);
  });

  it('all zeros', () => {
    let matchedExpFragmentsAllZeros = {
      x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    let result = getFragmentedCandidateScore(matchedExpFragmentsAllZeros);
    expect(result).toBeCloseTo(0);
  });
});
