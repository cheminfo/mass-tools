'use strict';

const { generateFragments } = require('..');

describe('test generate interal fragments', () => {
  it('nucleotide HODampDtmpDcmpH internal abw fragments', () => {
    let fragments = generateFragments('HODampDtmpDcmpDgmpDampH', {
      abw: true
    });
    expect(fragments).toStrictEqual([
      'HODtmpC5H6O4P$Bw2:B2',
      'HODtmpDcmpC5H6O4P$Bw2:B3',
      'HODtmpDcmpDgmpDampC5H6O4P$Bw2:B4',
      'HODcmpC5H6O4P$Bw3:B3',
      'HODcmpDgmpDampC5H6O4P$Bw3:B4',
      'HODgmpDampC5H6O4P$Bw4:B4'
    ]);
  });

  it('nucleotide HODampDtmpDcmpH internal aby fragments', () => {
    let fragments = generateFragments('HODthyDcmpDcmpDgmpDtmpDcmpH', {
      aby: true
    });

    expect(fragments).toStrictEqual([
      'O-2P-1DcmpC5H6O4P$By2:B2',
      'O-2P-1DcmpDcmpC5H6O4P$By2:B3',
      'O-2P-1DcmpDcmpDgmpC5H6O4P$By2:B4',
      'O-2P-1DcmpDcmpDgmpDtmpDcmpC5H6O4P$By2:B5',
      'O-2P-1DcmpC5H6O4P$By3:B3',
      'O-2P-1DcmpDgmpC5H6O4P$By3:B4',
      'O-2P-1DcmpDgmpDtmpDcmpC5H6O4P$By3:B5',
      'O-2P-1DgmpC5H6O4P$By4:B4',
      'O-2P-1DgmpDtmpDcmpC5H6O4P$By4:B5',
      'O-2P-1DtmpDcmpC5H6O4P$By5:B5'
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
});
