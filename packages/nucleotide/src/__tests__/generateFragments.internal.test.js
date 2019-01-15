'use strict';

const { generateFragments } = require('..');

describe('test generate interal fragments', () => {
  it('nucleotide HODampDtmpDcmpH internal aby fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      abw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpC5H6O4P$B2:B2',
      'HODtmpDcmpC5H6O4P$B2:B3',
      'HODtmpDcmpDgmpDampC5H6O4P$B2:B4',
      'HODcmpC5H6O4P$B3:B3',
      'HODcmpDgmpDampC5H6O4P$B3:B4',
      'HODgmpDampC5H6O4P$B4:B4'
    ]);
  });

  it('nucleotide HODthyDampDcmpDgmpDtmpDgmpDcmpDcmpDampDampDtmpDampDcmpH internal aby fragments', () => {
    let fragments = generateFragments(
      'HODthyDampDcmpDgmpDtmpDgmpDcmpDcmpDampDampDtmpDampDcmpH',
      {
        abw: true
      }
    );
    expect(fragments).toMatchSnapshot();
  });
});
