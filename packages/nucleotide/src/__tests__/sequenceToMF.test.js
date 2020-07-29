'use strict';

const sequenceToMF = require('../sequenceToMF');

const MF = require('mf-parser').MF;

describe('sequenceToMF', () => {
  it('emtpy string', () => {
    let sequence = sequenceToMF(' ');
    expect(sequence).toStrictEqual('');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(0, 1);
  });

  it('atc', () => {
    let sequence = sequenceToMF('atc');
    expect(sequence).toStrictEqual('HODampDtmpDcmpH.HODgmpDampDtmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1889.23, 1);
  });

  it('ATC', () => {
    let sequence = sequenceToMF('ATC');
    expect(sequence).toStrictEqual('HODampDtmpDcmpH.HODgmpDampDtmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1889.23, 1);
  });
  it('A(H-1C-1)TC', () => {
    let sequence = sequenceToMF('A(H-1C-1)TC', { kind: 'dna' });
    expect(sequence).toStrictEqual('HODamp(H-1C-1)DtmpDcmpH');
  });

  it('HODampDtmpDcmpH', () => {
    let sequence = sequenceToMF('HODampDtmpDcmpH', { kind: 'dna' });
    expect(sequence).toStrictEqual('HODampDtmpDcmpH');
  });

  it('HODamp(H-1C-1)DtmpDcmpH', () => {
    let sequence = sequenceToMF('HODamp(H-1C-1)DtmpDcmpH', { kind: 'dna' });
    expect(sequence).toStrictEqual('HODamp(H-1C-1)DtmpDcmpH');
  });

  it('atc kind dna', () => {
    let sequence = sequenceToMF('atc', { kind: 'dna' });
    expect(sequence).toStrictEqual('HODampDtmpDcmpH');
  });

  it('(HO)ATC(NH2)', () => {
    let sequence = sequenceToMF('(HO)ATC(NH2)', { kind: 'dna' });
    expect(sequence).toStrictEqual('(HO)DampDtmpDcmp(NH2)');
  });

  it('(HO)atc(NH2)', () => {
    let sequence = sequenceToMF('(HO)atc(NH2)', { kind: 'dna' });
    expect(sequence).toStrictEqual('(HO)DampDtmpDcmp(NH2)');
  });

  it('AAU', () => {
    let sequence = sequenceToMF('AAU');
    expect(sequence).toStrictEqual('HOAmpAmpUmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(982.6, 1);
  });

  it('circular AAA', () => {
    let sequence = sequenceToMF('AAA', { circular: true });
    expect(sequence).toStrictEqual('DampDampDamp.DtmpDtmpDtmp');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1852.21, 1);
  });

  it('RNA AAA', () => {
    let sequence = sequenceToMF('AAA', { kind: 'RNA' });
    expect(sequence).toStrictEqual('HOAmpAmpAmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1005.63, 1);
  });

  it('oligonucleotide œεξ£', () => {
    let sequence = sequenceToMF('œεξ£', { kind: 'RNA' });
    expect(sequence).toStrictEqual('HODamDgmDimTiaH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1596.28, 1);
  });

  it('DNA AAA', () => {
    let sequence = sequenceToMF('AAA', { kind: 'DNA' });
    expect(sequence).toStrictEqual('HODampDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(957.64, 1);
  });

  it('ds-DNA AAA', () => {
    let sequence = sequenceToMF('AAA', { kind: 'ds-DNA' });
    expect(sequence).toStrictEqual('HODampDampDampH.HODtmpDtmpDtmpH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1888.24, 1);
  });

  it("DNA AAA with 5' alcohol", () => {
    let sequence = sequenceToMF('AAA', {
      fivePrime: 'alcohol',
      kind: 'DNA',
    });
    expect(sequence).toStrictEqual('HODadeDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(877.66, 1);
  });

  it("DNA AAA with 5' monophosphate", () => {
    let sequence = sequenceToMF('AAA', {
      fivePrime: 'monophosphate',
      kind: 'DNA',
    });
    expect(sequence).toStrictEqual('HODampDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(957.64, 1);
  });
  it("DNA AAA with 5' diphosphate", () => {
    let sequence = sequenceToMF('AAA', {
      fivePrime: 'diphosphate',
      kind: 'DNA',
    });
    expect(sequence).toStrictEqual('HODadpDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1037.62, 1);
  });

  it("DNA AAA with 5' triphosphate", () => {
    let sequence = sequenceToMF('AAA', {
      fivePrime: 'triphosphate',
      kind: 'DNA',
    });
    expect(sequence).toStrictEqual('HODatpDampDampH');
    let mass = new MF(sequence).getInfo().mass;
    expect(mass).toBeCloseTo(1117.6, 1);
  });

  it('HOℵβℑH', () => {
    let sequence = sequenceToMF('HOℵβℑH', {
      fivePrime: 'monophosphate',
      kind: 'RNA',
    });
    expect(sequence).toStrictEqual('HOAmcTmcRygH');
  });
});
