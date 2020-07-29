'use strict';

const { generateFragments } = require('..');

describe('test generate internal fragments', () => {
  it('nucleotide HODampDtmpDcmpDgmpDampH internal abw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      abw: true,
    });
    expect(fragments).toStrictEqual([
      'HODtmpFurp$w4:a3-B',
      'HODtmpDcmpFurp$w4:a4-B',
      'HODcmpFurp$w3:a4-B',
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal aby fragments', () => {
    let fragments = generateFragments('HODthyDcmpDcmpDgmpDtmpDcmpH', {
      aby: true,
    });
    expect(fragments).toStrictEqual([
      'O-2P-1DcmpFurp$y5:a3-B',
      'O-2P-1DcmpDcmpFurp$y5:a4-B',
      'O-2P-1DcmpDcmpDgmpFurp$y5:a5-B',
      'O-2P-1DcmpFurp$y4:a4-B',
      'O-2P-1DcmpDgmpFurp$y4:a5-B',
      'O-2P-1DgmpFurp$y3:a5-B',
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
    expect(fragments).toStrictEqual(['HODampFurp$w3:a3-B']);
  });
});
