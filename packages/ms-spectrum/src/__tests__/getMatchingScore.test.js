'use strict';

const getMatchingScore = require('../getMatchingScore');

describe('test getMatchingScore', () => {
  let matchedExpFragments = {
    x: [1, 2, 3, 4, 5, 6, 7, 8],
    y: [8, 7, 6, 5, 4, 3, 2, 1],
  };
  let fragmentsContribution = [1, 2, 3, 4, 5];
  let options = { m: 2, i: 0.8 };

  it('custom options', () => {
    let result = getMatchingScore(
      matchedExpFragments,
      fragmentsContribution,
      options,
    );
    expect(result).toBe(446.766);
  });
  it('default options', () => {
    let result = getMatchingScore(matchedExpFragments, fragmentsContribution);
    expect(result).toBe(2028.04);
  });
  it('missing fragmentsContribution and options', () => {
    let result = getMatchingScore(matchedExpFragments);
    expect(result).toBe(2013.04);
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
