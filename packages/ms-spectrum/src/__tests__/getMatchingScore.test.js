'use strict';

const getMatchingScore = require('../getMatchingScore');

describe('test getMatchingScore', () => {
  let matchedExpFragments = {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    y: [8, 7, 6, 5, 4, 3, 2, 1],
  };
  let fragmentsContribution = [1, 2, 3, 4, 5];
  let options = { massCoefficient: 2, intensityCoefficient: 0.8 };

  it('custom options', () => {
    let result = getMatchingScore(
      matchedExpFragments,
      fragmentsContribution,
      options,
    );
    expect(result).toBe(446.76604692483096);
  });
  it('default options', () => {
    let result = getMatchingScore(matchedExpFragments, fragmentsContribution);
    expect(result).toBe(2028.039654693095);
  });
  it('missing fragmentsContribution and options', () => {
    let result = getMatchingScore(matchedExpFragments);
    expect(result).toBe(2013.039654693095);
  });

  it('all zeros', () => {
    let matchedExpFragmentsAllZeros = {
      x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
    let result = getMatchingScore(matchedExpFragmentsAllZeros);
    expect(result).toBe(0);
  });
});
