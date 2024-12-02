import { describe, expect, it } from 'vitest';

import { sequenceToMF } from '..';

describe('Checking convert AA sequence', () => {
  it('AAAAAAA', () => {
    const result = sequenceToMF('AAAAAAA');
    expect(result).toBe('HAlaAlaAlaAlaAlaAlaAlaOH');
  });

  it('aaaaaaa', () => {
    const result = sequenceToMF('aaaaaaa');
    expect(result).toBe('HAlaAlaAlaAlaAlaAlaAlaOH');
  });

  it('(H)aaaaaaa', () => {
    const result = sequenceToMF('(H)aaaaaaa');
    expect(result).toBe('(H)AlaAlaAlaAlaAlaAlaAlaOH');
  });

  it('X', () => {
    const result = sequenceToMF('X');
    expect(result).toBe('HXaaOH');
  });

  it('A', () => {
    const result = sequenceToMF('A');
    expect(result).toBe('HAlaOH');
  });

  it('HAlaAla(H-1OH)AlaOH', () => {
    const result = sequenceToMF('HAlaAla(H-1OH)AlaOH');
    expect(result).toBe('HAlaAla(H-1OH)AlaOH');
  });
  it('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH', () => {
    const result = sequenceToMF(
      '(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH',
    );
    expect(result).toBe('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH');
  });

  it('(Me)AAAAAAA(NH2)', () => {
    const result = sequenceToMF('(Me)AAAAAAA(NH2)');
    expect(result).toBe('(Me)AlaAlaAlaAlaAlaAlaAla(NH2)');
  });

  it('HAlaGlyProOH', () => {
    const result = sequenceToMF('HAlaGlyProOH');
    expect(result).toBe('HAlaGlyProOH');
  });

  it('ALA SER LYS GLY PRO', () => {
    const result = sequenceToMF('ALA SER LYS GLY PRO');
    expect(result).toBe('HAlaSerLysGlyProOH');
  });
});
