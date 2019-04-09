'use strict';

const { baseLoss } = require('..');

describe('test base loss', () => {
  it('Base loss of HDampDtmpDcmpOH', () => {
    let nucleotides = baseLoss('HDampDampDtmpDcmpDcmpOH');
    console.log(nucleotides);
    expect(nucleotides).toHaveLength(0);
  });
});
