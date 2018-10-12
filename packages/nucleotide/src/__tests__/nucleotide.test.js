'use strict';

const Nucleotide = require('..');
const MF = require('mf-parser').MF;

describe('test nucleotide', () => {
  test('nucleotide to sequence of ATC', () => {
    let sequence = Nucleotide.sequenceToMF('ATC');
    expect(sequence).toEqual('HODampDtmpDcmpH.HODgmpDampDtmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1889.23, 1);
  });

  test('nucleotide to sequence of AAU ', () => {
    let sequence = Nucleotide.sequenceToMF('AAU');
    expect(sequence).toEqual('HOAmpAmpUmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(982.6, 1);
  });

  test('nucleotide to sequence of circular AAA ', () => {
    let sequence = Nucleotide.sequenceToMF('AAA', { circular: true });
    expect(sequence).toEqual('DampDampDamp.DtmpDtmpDtmp');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1852.21, 1);
  });

  test('nucleotide to sequence of DNA AAA ', () => {
    let sequence = Nucleotide.sequenceToMF('AAA', { kind: 'DNA' });
    expect(sequence).toEqual('HODampDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(957.64, 1);
  });

  test('nucleotide to sequence of ds-DNA AAA ', () => {
    let sequence = Nucleotide.sequenceToMF('AAA', { kind: 'ds-DNA' });
    expect(sequence).toEqual('HODampDampDampH.HODtmpDtmpDtmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1888.24, 1);
  });

  test(`nucleotide to sequence of DNA AAA with 5' alcohol`, () => {
    let sequence = Nucleotide.sequenceToMF('AAA', {
      fivePrime: 'alcohol',
      kind: 'DNA'
    });
    expect(sequence).toEqual('HODadeDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(877.66, 1);
  });

  test(`nucleotide to sequence of DNA AAA with 5' monophosphate`, () => {
    let sequence = Nucleotide.sequenceToMF('AAA', {
      fivePrime: 'monophosphate',
      kind: 'DNA'
    });
    expect(sequence).toEqual('HODampDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(957.64, 1);
  });
  test(`nucleotide to sequence of DNA AAA with 5' diphosphate`, () => {
    let sequence = Nucleotide.sequenceToMF('AAA', {
      fivePrime: 'diphosphate',
      kind: 'DNA'
    });
    expect(sequence).toEqual('HODadpDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1037.62, 1);
  });

  test(`nucleotide to sequence of DNA AAA with 5' triphosphate`, () => {
    let sequence = Nucleotide.sequenceToMF('AAA', {
      fivePrime: 'triphosphate',
      kind: 'DNA'
    });
    expect(sequence).toEqual('HODatpDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1117.6, 1);
  });
});
