const convertAASequence = require('../convertAASequence');

describe('Checking convert AA sequence', () => {
  test('AAAAAAA', () => {
    const result = convertAASequence('AAAAAAA');
    expect(result).toEqual('HAlaAlaAlaAlaAlaAlaAlaOH');
  });

  test('HAlaAla(H-1OH)AlaOH', () => {
    const result = convertAASequence('HAlaAla(H-1OH)AlaOH');
    expect(result).toEqual('HAlaAla(H-1OH)AlaOH');
  });
  test('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH', () => {
    const result = convertAASequence(
      '(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH'
    );
    expect(result).toEqual('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH');
  });

  test('(Me)AAAAAAA(NH2)', () => {
    const result = convertAASequence('(Me)AAAAAAA(NH2)');
    expect(result).toEqual('(Me)AlaAlaAlaAlaAlaAlaAla(NH2)');
  });

  test('HAlaGlyProOH', () => {
    const result = convertAASequence('HAlaGlyProOH');
    expect(result).toEqual('HAlaGlyProOH');
  });

  test('ALA SER LYS GLY PRO', () => {
    const result = convertAASequence('ALA SER LYS GLY PRO');
    expect(result).toEqual('HAlaSerLysGlyProOH');
  });
});
