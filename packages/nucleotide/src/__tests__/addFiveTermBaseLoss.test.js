'use strict';

const generateFragments = require('../generateFragments');

describe('addFiveTermBaseLoss', () => {
  it('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', {
      a: true, // a fragment
      ab: true, // a fragment with base loss
      abcdBaseLoss: true,
    });

    expect(fragments).toStrictEqual([
      'HODampO-1H-1$a1',
      'HODamp(C-5H-5N-5)O-1H-1$a1 A*',
      'HODampDtmpO-1H-1$a2',
      'HODampC5H6O4P$a2-B',
      'HODampDtmp(C-5H-5N-5)O-1H-1$a2 A*',
      'HODampDtmp(C-5H-6N-2O-2)O-1H-1$a2 T*',
    ]);
  });
});
