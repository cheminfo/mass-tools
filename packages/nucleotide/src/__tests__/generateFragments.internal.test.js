'use strict';

const { generateFragments } = require('..');

describe('test generate internal fragments', () => {
  it('nucleotide HODampDtmpDcmpDgmpDampH internal abw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      abw: true,
    });
    expect(fragments).toStrictEqual([
      'HODtmpC5H6O4P$w4:a-B3',
      'HODtmpDcmpC5H6O4P$w4:a-B4',
      'HODcmpC5H6O4P$w3:a-B4',
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal aby fragments', () => {
    let fragments = generateFragments('HODthyDcmpDcmpDgmpDtmpDcmpH', {
      aby: true,
    });
    expect(fragments).toStrictEqual([
      'O-2P-1DcmpC5H6O4P$y5:a-B3',
      'O-2P-1DcmpDcmpC5H6O4P$y5:a-B4',
      'O-2P-1DcmpDcmpDgmpC5H6O4P$y5:a-B5',
      'O-2P-1DcmpC5H6O4P$y4:a-B4',
      'O-2P-1DcmpDgmpC5H6O4P$y4:a-B5',
      'O-2P-1DgmpC5H6O4P$y3:a-B5',
    ]);
  });

  it('nucleotide HODthyDampDcmpDgmpDtmpDgmpDcmpDcmpDampDampDtmpDampDcmpH internal abw fragments', () => {
    let fragments = generateFragments(
      'HODthyDampDcmpDgmpDtmpDgmpDcmpDcmpDampDampDtmpDampDcmpH',
      {
        abw: true,
      },
    );
    expect(fragments).toMatchSnapshot();
  });

  it('nucleotide HODampDtmpDcmpH internal aw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      aw: true,
    });
    expect(fragments).toStrictEqual([
      'HODtmpDcmpO-1H-1$w4:a3',
      'HODtmpDcmpDgmpO-1H-1$w4:a4',
      'HODcmpDgmpO-1H-1$w3:a4',
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal bw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      bw: true,
    });
    expect(fragments).toStrictEqual([
      'HODtmpDcmpH$w4:b3',
      'HODtmpDcmpDgmpH$w4:b4',
      'HODcmpDgmpH$w3:b4',
    ]);
  });

  it('nucleotide to sequence internal modification of HODamp(NH2)DtmpDcmpH with internal fragments', () => {
    let fragments = generateFragments('HODampDampDtmp(NH2)DampH', {
      abw: true,
    });
    expect(fragments).toStrictEqual(['HODampC5H6O4P$w3:a-B3']);
  });
});
