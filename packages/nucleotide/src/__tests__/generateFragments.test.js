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
      'HOC5H6O4P$a1 - B',
      'HODampDtmpO-1H-1$a2',
      'HODampC5H6O4P$a2 - B'
    ]);
  });

  it('nucleotide HODampDtmpDcmpH dh2o (d with loss of water)', () => {
    let fragments = generateFragments('HODampDampH', {
      dh2o: true
    });
    expect(fragments).toStrictEqual(['HODampPO2$d-H2O1']);
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
      'HOC5H6O4P$a1 - B',
      'HODampH-1$b1',
      'HODampPO2$c1',
      'HODampPO3H2$d1',
      'HODcmpH$w1',
      'H-1DcmpH$x1',
      'O-2P-1DcmpH$y1',
      'O-3H-1P-1(+)DcmpH$z1',
      'HODampDtmpO-1H-1$a2',
      'HODampC5H6O4P$a2 - B',
      'HODampDtmpH-1$b2',
      'HODampDtmpPO2$c2',
      'HODampDtmpPO3H2$d2',
      'HODtmpDcmpH$w2',
      'H-1DtmpDcmpH$x2',
      'O-2P-1DtmpDcmpH$y2',
      'O-3H-1P-1(+)DtmpDcmpH$z2'
    ]);
  });
});
