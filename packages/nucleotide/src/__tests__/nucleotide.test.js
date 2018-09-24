'use strict';

const Nucleotide = require('..');

describe('test nucleotide', () => {
  test('sequenceToMF of ATC ', () => {
    expect(Nucleotide.sequenceToMF('ATC')).toEqual(
      'HDampDtmpDcmpOH.HDgmpDampDtmpOH'
    );
  });

  test('sequenceToMF of AAU ', () => {
    expect(Nucleotide.sequenceToMF('AAU')).toEqual('HAmpAmpUmpOH');
  });

  test('sequenceToMF of circular AAA ', () => {
    expect(Nucleotide.sequenceToMF('AAA', { circular: true })).toEqual(
      'DampDampDamp.DtmpDtmpDtmp'
    );
  });

  test('sequenceToMF of DNA AAA ', () => {
    expect(Nucleotide.sequenceToMF('AAA', { kind: 'DNA' })).toEqual(
      'HDampDampDampOH'
    );
  });

  test('sequenceToMF of ds-DNA AAA ', () => {
    expect(Nucleotide.sequenceToMF('AAA', { kind: 'ds-DNA' })).toEqual(
      'HDampDampDampOH.HDtmpDtmpDtmpOH'
    );
  });

  test(`sequenceToMF of DNA AAA with 5' alcohol`, () => {
    expect(
      Nucleotide.sequenceToMF('AAA', { fivePrime: 'alcohol', kind: 'DNA' })
    ).toEqual('HDadeDampDampOH');
  });

  test(`sequenceToMF of DNA AAA with 5' monophosphate`, () => {
    expect(
      Nucleotide.sequenceToMF('AAA', {
        fivePrime: 'monophosphate',
        kind: 'DNA'
      })
    ).toEqual('HDampDampDampOH');
  });
  test(`sequenceToMF of DNA AAA with 5' diphosphate`, () => {
    expect(
      Nucleotide.sequenceToMF('AAA', { fivePrime: 'diphosphate', kind: 'DNA' })
    ).toEqual('HDadpDampDampOH');
  });

  test(`sequenceToMF of DNA AAA with 5' triphosphate`, () => {
    expect(
      Nucleotide.sequenceToMF('AAA', { fivePrime: 'triphosphate', kind: 'DNA' })
    ).toEqual('HDatpDampDampOH');
  });
});
