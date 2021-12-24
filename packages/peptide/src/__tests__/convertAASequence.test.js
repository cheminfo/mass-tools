'use strict';

const convertAASequence = require('../convertAASequence');

describe('Checking convert AA sequence', () => {
  it('AAAAAAA', () => {
    const result = convertAASequence('AAAAAAA');
    expect(result).toBe('HAlaAlaAlaAlaAlaAlaAlaOH');
  });

  it('HAlaAla(H-1OH)AlaOH', () => {
    const result = convertAASequence('HAlaAla(H-1OH)AlaOH');
    expect(result).toBe('HAlaAla(H-1OH)AlaOH');
  });
  it('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH', () => {
    const result = convertAASequence(
      '(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH',
    );
    expect(result).toBe(
      '(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH',
    );
  });

  it('(Me)AAAAAAA(NH2)', () => {
    const result = convertAASequence('(Me)AAAAAAA(NH2)');
    expect(result).toBe('(Me)AlaAlaAlaAlaAlaAlaAla(NH2)');
  });

  it('HAlaGlyProOH', () => {
    const result = convertAASequence('HAlaGlyProOH');
    expect(result).toBe('HAlaGlyProOH');
  });

  it('ALA SER LYS GLY PRO', () => {
    const result = convertAASequence('ALA SER LYS GLY PRO');
    expect(result).toBe('HAlaSerLysGlyProOH');
  });
});
