'use strict';

const { generateFragments } = require('..');

describe('test generate interal fragments', () => {
  it('nucleotide HODampDtmpDcmpH internal abw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      abw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpC5H6O4P$w2:aB3',
      'HODtmpDcmpC5H6O4P$w2:aB4',
      'HODtmpDcmpDgmpDampC5H6O4P$w2:aB5',
      'HODcmpC5H6O4P$w3:aB4',
      'HODcmpDgmpDampC5H6O4P$w3:aB5',
      'HODgmpDampC5H6O4P$w4:aB5'
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal aby fragments', () => {
    let fragments = generateFragments('HODthyDcmpDcmpDgmpDtmpDcmpH', {
      aby: true
    });
    expect(fragments).toStrictEqual([
      'O-2P-1DcmpC5H6O4P$y2:aB3',
      'O-2P-1DcmpDcmpC5H6O4P$y2:aB4',
      'O-2P-1DcmpDcmpDgmpC5H6O4P$y2:aB5',
      'O-2P-1DcmpDcmpDgmpDtmpDcmpC5H6O4P$y2:aB6',
      'O-2P-1DcmpC5H6O4P$y3:aB4',
      'O-2P-1DcmpDgmpC5H6O4P$y3:aB5',
      'O-2P-1DcmpDgmpDtmpDcmpC5H6O4P$y3:aB6',
      'O-2P-1DgmpC5H6O4P$y4:aB5',
      'O-2P-1DgmpDtmpDcmpC5H6O4P$y4:aB6',
      'O-2P-1DtmpDcmpC5H6O4P$y5:aB6'
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
      'HODtmpDcmpDgmpDampHO-1H-1$w2:a5',
      'HODcmpDgmpO-1H-1$w3:a4',
      'HODcmpDgmpDampHO-1H-1$w3:a5',
      'HODgmpDampHO-1H-1$w4:a5'
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal bw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      bw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpDcmpH-1$w2:a3',
      'HODtmpDcmpDgmpH-1$w2:a4',
      'HODtmpDcmpDgmpDampHH-1$w2:a5',
      'HODcmpDgmpH-1$w3:a4',
      'HODcmpDgmpDampHH-1$w3:a5',
      'HODgmpDampHH-1$w4:a5'
    ]);
  });
});
