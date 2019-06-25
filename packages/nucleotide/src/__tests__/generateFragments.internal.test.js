'use strict';

const { generateFragments } = require('..');

describe('test generate internal fragments', () => {
  it('nucleotide HODampDtmpDcmpH internal abw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      abw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpC5H6O4P$w2:a-B3',
      'HODtmpDcmpC5H6O4P$w2:a-B4',
      'HODcmpC5H6O4P$w3:a-B4'
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal aby fragments', () => {
    let fragments = generateFragments('HODthyDcmpDcmpDgmpDtmpDcmpH', {
      aby: true
    });
    expect(fragments).toStrictEqual([
      'O-2P-1DcmpC5H6O4P$y2:a-B3',
      'O-2P-1DcmpDcmpC5H6O4P$y2:a-B4',
      'O-2P-1DcmpDcmpDgmpC5H6O4P$y2:a-B5',
      'O-2P-1DcmpC5H6O4P$y3:a-B4',
      'O-2P-1DcmpDgmpC5H6O4P$y3:a-B5',
      'O-2P-1DgmpC5H6O4P$y4:a-B5'
    ]);
  });

  it('nucleotide HODthyDampDcmpDgmpDtmpDgmpDcmpDcmpDampDampDtmpDampDcmpH internal abw fragments', () => {
    let fragments = generateFragments(
      'HODthyDampDcmpDgmpDtmpDgmpDcmpDcmpDampDampDtmpDampDcmpH',
      {
        abw: true
      }
    );
    expect(fragments).toMatchSnapshot();
  });

  it('nucleotide HODampDtmpDcmpH internal aw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      aw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpDcmpO-1H-1$w2:a3',
      'HODtmpDcmpDgmpO-1H-1$w2:a4',
      'HODcmpDgmpO-1H-1$w3:a4'
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal bw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      bw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpDcmpH$w2:a3',
      'HODtmpDcmpDgmpH$w2:a4',
      'HODcmpDgmpH$w3:a4'
    ]);
  });
});
