'use strict';

const { baseLoss } = require('..');

describe('test base loss', () => {
  it('Base loss of HAlaDampDtmpDcmpDcmpOH', () => {
    let nucleotides = baseLoss('HAlaDampDtmpDcmpDcmpOH');
    expect(nucleotides).toHaveLength(4);
    expect(nucleotides).toStrictEqual([
      'HAlaDrmpDtmpDcmpDcmpOH',
      'HAlaDampDrmpDcmpDcmpOH',
      'HAlaDampDtmpDrmpDcmpOH',
      'HAlaDampDtmpDcmpDrmpOH'
    ]);
  });
});
