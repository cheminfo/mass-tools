'use strict';

const { generateFragments } = require('..');

describe('test generate fragments', () => {
  it('nucleotide to sequence of OHDampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', { a: true });
    expect(fragments).toStrictEqual(['HODampO-1H-1$a1', 'HODampDtmpO-1H-1$a2']);
  });
  it('nucleotide to sequence of HODampDtmpDcmpH', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', { a: true, ab: true });
    expect(fragments).toStrictEqual([
      'HODampO-1H-1$a1',
      'HC5H6O4P$a1 - B',
      'HODampDtmpO-1H-1$a2',
      'HODampC5H6O4P$a2 - B'
    ]);
  });
  it('nucleotide to sequence of HODampDtmpDcmpH and many fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpH', {
      a: true,
      ab: true,
      b: true,
      c: true,
      d: true,
      w: true,
      x: true,
      y: true,
      z: true
    });
    expect(fragments).toStrictEqual([
      'HODampO-1H-1$a1',
      'HC5H6O4P$a1 - B',
      'HODamp$bH-11',
      'HODampPO2$c1',
      'HODampPO3H2$d1',
      'HODcmpH$w1',
      'H-2DcmpH$x1',
      'O-2H-1P-1DcmpH$y1',
      'O-3H-4P-1DcmpH$z1',
      'HODampDtmpO-1H-1$a2',
      'HODampC5H6O4P$a2 - B',
      'HODampDtmp$bH-12',
      'HODampDtmpPO2$c2',
      'HODampDtmpPO3H2$d2',
      'HODtmpDcmpH$w2',
      'H-2DtmpDcmpH$x2',
      'O-2H-1P-1DtmpDcmpH$y2',
      'O-3H-4P-1DtmpDcmpH$z2'
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal aby fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      abw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpC5H6O4P$B2:B3',
      'HODtmpDcmpC5H6O4P$B2:B4',
      'HODcmpC5H6O4P$B3:B4'
    ]);
  });
});
