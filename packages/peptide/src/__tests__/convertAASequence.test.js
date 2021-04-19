const convertAASequence = require('../convertAASequence');

describe('Checking convert AA sequence', () => {
  it('AAAAAAA', () => {
    const result = convertAASequence('AAAAAAA');
    expect(result).toEqual('HAlaAlaAlaAlaAlaAlaAlaOH');
  });

  it('HAlaAla(H-1OH)AlaOH', () => {
    const result = convertAASequence('HAlaAla(H-1OH)AlaOH');
    expect(result).toEqual('HAlaAla(H-1OH)AlaOH');
  });
  it('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH', () => {
    const result = convertAASequence(
      '(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH',
    );
    expect(result).toEqual('(C33H37O6N3Si) GluTyrGluLys(C16H30O)GluTyrGluOH');
  });

  it('(Me)AAAAAAA(NH2)', () => {
    const result = convertAASequence('(Me)AAAAAAA(NH2)');
    expect(result).toEqual('(Me)AlaAlaAlaAlaAlaAlaAla(NH2)');
  });

  it('HAlaGlyProOH', () => {
    const result = convertAASequence('HAlaGlyProOH');
    expect(result).toEqual('HAlaGlyProOH');
  });

  it('ALA SER LYS GLY PRO', () => {
    const result = convertAASequence('ALA SER LYS GLY PRO');
    expect(result).toEqual('HAlaSerLysGlyProOH');
  });
});
