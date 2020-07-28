'use strict';

const ensureUppercaseSequence = require('../ensureUppercaseSequence');

describe('ensureUppercaseSequence', () => {
  it('aattccgg', () => {
    let sequence = ensureUppercaseSequence('aattccgg');
    expect(sequence).toStrictEqual('AATTCCGG');
  });

  it('aa(C2H5)ttcc(Me)gg', () => {
    let sequence = ensureUppercaseSequence('aa(C2H5)ttcc(Me)gg');
    expect(sequence).toStrictEqual('AA(C2H5)TTCC(Me)GG');
  });

  it('Tmp(C2H5)Adp(Me)Amp', () => {
    let sequence = ensureUppercaseSequence('Tmp(C2H5)Adp(Me)Amp');
    expect(sequence).toStrictEqual('Tmp(C2H5)Adp(Me)Amp');
  });

  it('HOTmp(C2H5)Adp(Me)AmpH', () => {
    let sequence = ensureUppercaseSequence('HOTmp(C2H5)Adp(Me)AmpH');
    expect(sequence).toStrictEqual('HOTmp(C2H5)Adp(Me)AmpH');
  });
});
