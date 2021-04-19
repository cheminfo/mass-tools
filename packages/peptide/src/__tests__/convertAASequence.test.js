'use strict';

const convertAASequence = require('../convertAASequence');

describe('Checking convert AA sequence', () => {
  it('AAAAAAA', () => {
    const result = convertAASequence('AAAAAAA');
    expect(result).toStrictEqual('HAlaAlaAlaAlaAlaAlaAlaOH');
  });

  it('HAlaAla(H-1OH)AlaOH', () => {
    const result = convertAASequence('HAlaAla(H-1OH)AlaOH');
    expect(result).toStrictEqual('HAlaAla(H-1OH)AlaOH');
  });
  it('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH', () => {
    const result = convertAASequence(
      '(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH',
    );
    expect(result).toStrictEqual(
      '(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH',
    );
  });

  it('(Me)AAAAAAA(NH2)', () => {
    const result = convertAASequence('(Me)AAAAAAA(NH2)');
    expect(result).toStrictEqual('(Me)AlaAlaAlaAlaAlaAlaAla(NH2)');
  });

  it('HAlaGlyProOH', () => {
    const result = convertAASequence('HAlaGlyProOH');
    expect(result).toStrictEqual('HAlaGlyProOH');
  });

  it('ALA SER LYS GLY PRO', () => {
    const result = convertAASequence('ALA SER LYS GLY PRO');
    expect(result).toStrictEqual('HAlaSerLysGlyProOH');
  });
});
