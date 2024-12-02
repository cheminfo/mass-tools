import { describe, expect, it } from 'vitest';

import { generateFragments } from '../generateFragments';

describe('addFiveTermBaseLoss', () => {
  it('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', {
      x: true,
      wxyzBaseLoss: true,
    });
    expect(fragments).toStrictEqual([
      'H-1DcmpH$x1',
      'H-1DcmpH(C-4H-5N-3O-1)$x1 C*',
      'H-1DtmpDcmpH$x2',
      'H-1DtmpDcmpH(C-5H-6N-2O-2)$x2 T*',
      'H-1DtmpDcmpH(C-4H-5N-3O-1)$x2 C*',
    ]);
  });
});
