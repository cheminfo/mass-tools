'use strict';

const generateFragments = require('../generateFragments');

describe('addFiveTermBaseLoss', () => {
  it('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', {
      a: true,
      ab: true,
      abcdBaseLoss: true,
    });
    expect(fragments).toStrictEqual([
      'HODampO-1H-1$a1',
      'HOC5H6O4P$a1 - B',
      'HODrmpO-1H-1$a1-B1',
      'HODampDtmpO-1H-1$a2',
      'HODampC5H6O4P$a2 - B',
      'HODrmpDtmpO-1H-1$a2-B1',
      'HODampDrmpO-1H-1$a2-B2',
    ]);
  });
});
