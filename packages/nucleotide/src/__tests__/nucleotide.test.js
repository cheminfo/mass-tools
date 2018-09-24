'use strict';

const Nucleotide = require('..');

describe('test nucleotide', () => {
  test('sequenceToMF of ATC ', () => {
    expect(Nucleotide.sequenceToMF('ATC')).toEqual(
      'HODampDtmpDcmpH.HODgmpDampDtmpH'
    );
  });

  test('sequenceToMF of AAU ', () => {
    expect(Nucleotide.sequenceToMF('AAU')).toEqual('HOAmpAmpUmpH');
  });

  test('sequenceToMF of circular AAA ', () => {
    expect(Nucleotide.sequenceToMF('AAA', { circular: true })).toEqual(
      'DampDampDamp.DtmpDtmpDtmp'
    );
  });

  test('sequenceToMF of DNA AAA ', () => {
    expect(Nucleotide.sequenceToMF('AAA', { kind: 'DNA' })).toEqual(
      'HODampDampDampH'
    );
  });

  test('sequenceToMF of ds-DNA AAA ', () => {
    expect(Nucleotide.sequenceToMF('AAA', { kind: 'ds-DNA' })).toEqual(
      'HODampDampDampH.HODtmpDtmpDtmpH'
    );
  });
});
