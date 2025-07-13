import { describe, expect, it } from 'vitest';

import { getRangesForFragment } from '../getRangesForFragment';

describe('getRangesForFragment', () => {
  it('Phe (CH2) C0-2 H0-2', () => {
    let range = getRangesForFragment('Phe (CH2) C0-2 H0-2');

    expect(range).toMatch('Phe0-1 (CH2)0-1 C0-2 H0-2');
  });

  it('(CH3CH2)1-2Me', () => {
    let range = getRangesForFragment('(CH3CH2)0-2Me');

    expect(range).toMatch('(CH3CH2)0-2 Me0-1');
  });

  it('[13C]2[15N]', () => {
    let range = getRangesForFragment('[13C]2[15N]');

    expect(range).toMatch('[13C]0-2 [15N]0-1');
  });

  it('(CH2CH2O)0-5Me2Ph1-3', () => {
    let range = getRangesForFragment('(CH2CH2O)0-5Me2Ph1-3');

    expect(range).toMatch('(CH2CH2O)0-5 Me0-2 Ph0-3');
  });
});
