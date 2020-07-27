'use strict';

const { baseLoss } = require('..');

describe('baseLoss', () => {
  it('Base loss of HAlaDampDtmpDcmpDcmpOH', () => {
    let nucleotides = baseLoss('HAlaDampDtmpDcmpDcmpOH');
    expect(nucleotides).toHaveLength(3);
    expect(nucleotides).toStrictEqual([
      'HAlaDampDtmpDcmpDcmpOH(C-5H-5N-5)$A*',
      'HAlaDampDtmpDcmpDcmpOH(C-5H-6N-2O-2)$T*',
      'HAlaDampDtmpDcmpDcmpOH(C-4H-5N-3O-1)$C*',
    ]);
  });

  it('Base loss of HODampDtmpDcmpDcmpH', () => {
    let nucleotides = baseLoss('HODampDtmpDcmpDcmpH');
    expect(nucleotides).toHaveLength(3);
    expect(nucleotides).toStrictEqual([
      'HODampDtmpDcmpDcmpH(C-5H-5N-5)$A*',
      'HODampDtmpDcmpDcmpH(C-5H-6N-2O-2)$T*',
      'HODampDtmpDcmpDcmpH(C-4H-5N-3O-1)$C*',
    ]);
  });

  it('Base loss of HODampH', () => {
    let nucleotides = baseLoss('HODampH');
    expect(nucleotides).toHaveLength(1);
    expect(nucleotides).toStrictEqual(['HODampH(C-5H-5N-5)$A*']);
  });
});
