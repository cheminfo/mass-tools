'use strict';

const sequenceParser = require('../sequenceParser');

test('A A A', () => {
  let result = sequenceParser('AA(Ph)A(Ph)A(Ts)A(Ph)U');
  expect(result).toStrictEqual({
    begin: 'H',
    end: 'OH',
    parts: [
      { value: 'Ala', code: 'A' },
      { value: 'Ala(Ph)', code: 'α' },
      { value: 'Ala(Ph)', code: 'α' },
      { value: 'Ala(Ts)', code: '¹α' },
      { value: 'Ala(Ph)', code: 'α' },
      { value: 'Sec', code: 'Θ' }
    ],
    alternatives: { α: { count: 2 } },
    replacements: {
      'Ala(Ph)': { code: 'α', residue: 'Ala', modification: 'Ph' },
      'Ala(Ts)': { code: '¹α', residue: 'Ala', modification: 'Ts' },
      Sec: { code: 'Θ', id: 'Sec' }
    }
  });
});

test('HAlaAlaAlaOH', () => {
  let result = sequenceParser('HAlaAlaAlaOH');
  expect(result).toStrictEqual({
    alternatives: {},
    begin: 'H',
    end: 'OH',
    parts: [
      { code: 'A', value: 'Ala' },
      { code: 'A', value: 'Ala' },
      { code: 'A', value: 'Ala' }
    ],
    replacements: {}
  });
});

test('HAlaAla(H-1OH)AlaOH', () => {
  let result = sequenceParser('HAlaAla(H-1OH)AlaOH');
  expect(result).toStrictEqual({
    alternatives: { α: { count: 1 } },
    begin: 'H',
    end: 'OH',
    parts: [
      { code: 'A', value: 'Ala' },
      { code: 'α', value: 'Ala(H-1OH)' },
      { code: 'A', value: 'Ala' }
    ],
    replacements: {
      'Ala(H-1OH)': { code: 'α', modification: 'H-1OH', residue: 'Ala' }
    }
  });
});

test('H(+)AlaAla(H-1OH)AlaOH', () => {
  let result = sequenceParser('H(+)AlaAla(H-1OH)AlaOH');
  expect(result).toStrictEqual({
    alternatives: { α: { count: 1 } },
    begin: 'H(+)',
    end: 'OH',
    parts: [
      { code: 'A', value: 'Ala' },
      { code: 'α', value: 'Ala(H-1OH)' },
      { code: 'A', value: 'Ala' }
    ],
    replacements: {
      'Ala(H-1OH)': { code: 'α', modification: 'H-1OH', residue: 'Ala' }
    }
  });
});

test('ForAlaAla(H-1OH)AlaOH', () => {
  let result = sequenceParser('(For)AlaAla(H-1OH)AlaOH');
  expect(result).toStrictEqual({
    alternatives: { α: { count: 1 } },
    begin: 'For',
    end: 'OH',
    parts: [
      { value: 'Ala', code: 'A' },
      { value: 'Ala(H-1OH)', code: 'α' },
      { value: 'Ala', code: 'A' }
    ],
    replacements: {
      'Ala(H-1OH)': { code: 'α', residue: 'Ala', modification: 'H-1OH' }
    }
  });
});
