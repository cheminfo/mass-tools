import { describe, expect, it } from 'vitest';

import { ensureUppercaseSequence } from '../ensureUppercaseSequence';

describe('ensureUppercaseSequence', () => {
  it('aattccgg', () => {
    let sequence = ensureUppercaseSequence('aattccgg');

    expect(sequence).toBe('AATTCCGG');
  });

  it('aa(C2H5)ttcc(Me)gg', () => {
    let sequence = ensureUppercaseSequence('aa(C2H5)ttcc(Me)gg');

    expect(sequence).toBe('AA(C2H5)TTCC(Me)GG');
  });

  it('Tmp(C2H5)Adp(Me)Amp', () => {
    let sequence = ensureUppercaseSequence('Tmp(C2H5)Adp(Me)Amp');

    expect(sequence).toBe('Tmp(C2H5)Adp(Me)Amp');
  });

  it('HOTmp(C2H5)Adp(Me)AmpH', () => {
    let sequence = ensureUppercaseSequence('HOTmp(C2H5)Adp(Me)AmpH');

    expect(sequence).toBe('HOTmp(C2H5)Adp(Me)AmpH');
  });
});
