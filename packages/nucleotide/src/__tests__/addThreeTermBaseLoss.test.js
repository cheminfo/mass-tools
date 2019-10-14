'use strict';

const generateFragments = require('../generateFragments');

describe('addFiveTermBaseLoss', () => {
  it('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', {
      x: true,
      wxyzBaseLoss: true
    });
    expect(fragments).toStrictEqual([
      'H-1DcmpH$x1',
      'H-1DrmpH$x1-B1',
      'H-1DtmpDcmpH$x2',
      'H-1DrmpDcmpH$x2-B1',
      'H-1DtmpDrmpH$x2-B2'
    ]);
  });
});
