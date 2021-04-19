'use strict';

const parse = require('../parse');

let tests = {
  C10: [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 10 },
  ],
  'C-1': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: -1 },
  ],
  'C1-10': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplierRange', value: { from: 1, to: 10 } },
  ],
  '2H': [
    { kind: 'preMultiplier', value: 2 },
    { kind: 'atom', value: 'H' },
  ],
  '[13C]': [{ kind: 'isotope', value: { atom: 'C', isotope: 13 } }],
  '[2H]': [{ kind: 'isotope', value: { atom: 'H', isotope: 2 } }],
  'C+': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: 1 },
  ],
  'C-': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -1 },
  ],
  'C-H': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -1 },
    { kind: 'atom', value: 'H' },
  ],
  'C++': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: 2 },
  ],
  'C--': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -2 },
  ],
  'C2+': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 2 },
    { kind: 'charge', value: 1 },
  ],
  'C(2+)': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: 2 },
  ],
  'C(++)': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: 2 },
  ],
  'C(+2)': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: 2 },
  ],
  'C(2-)': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -2 },
  ],
  'C(-2)': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -2 },
  ],
  'C(--)': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -2 },
  ],
  '(H+)': [
    { kind: 'openingParenthesis', value: '(' },
    { kind: 'atom', value: 'H' },
    { kind: 'charge', value: 1 },
    { kind: 'closingParenthesis', value: ')' },
  ],
  C$ABC: [
    { kind: 'atom', value: 'C' },
    { kind: 'comment', value: 'ABC' },
  ],
  'C(-1)(-3)': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -1 },
    { kind: 'charge', value: -3 },
  ],
  'C(-1)2(-3)3': [
    { kind: 'atom', value: 'C' },
    { kind: 'charge', value: -1 },
    { kind: 'multiplier', value: 2 },
    { kind: 'charge', value: -3 },
    { kind: 'multiplier', value: 3 },
  ],
  'C(H-2)': [
    { kind: 'atom', value: 'C' },
    { kind: 'openingParenthesis', value: '(' },
    { kind: 'atom', value: 'H' },
    { kind: 'multiplier', value: -2 },
    { kind: 'closingParenthesis', value: ')' },
  ],
  'H.Cl': [
    { kind: 'atom', value: 'H' },
    { kind: 'salt', value: '.' },
    { kind: 'atom', value: 'Cl' },
  ],
  'H{1,1}': [{ kind: 'isotopeRatio', value: { atom: 'H', ratio: [1, 1] } }],
  'C10 . H20': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 10 },
    { kind: 'text', value: ' ' },
    { kind: 'salt', value: '.' },
    { kind: 'text', value: ' ' },
    { kind: 'atom', value: 'H' },
    { kind: 'multiplier', value: 20 },
  ],
  '(CH(CH3)2)3N.2HCl': [
    { kind: 'openingParenthesis', value: '(' },
    { kind: 'atom', value: 'C' },
    { kind: 'atom', value: 'H' },
    { kind: 'openingParenthesis', value: '(' },
    { kind: 'atom', value: 'C' },
    { kind: 'atom', value: 'H' },
    { kind: 'multiplier', value: 3 },
    { kind: 'closingParenthesis', value: ')' },
    { kind: 'multiplier', value: 2 },
    { kind: 'closingParenthesis', value: ')' },
    { kind: 'multiplier', value: 3 },
    { kind: 'atom', value: 'N' },
    { kind: 'salt', value: '.' },
    { kind: 'preMultiplier', value: 2 },
    { kind: 'atom', value: 'H' },
    { kind: 'atom', value: 'Cl' },
  ],
  'C.C2.C3': [
    { kind: 'atom', value: 'C' },
    { kind: 'salt', value: '.' },
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 2 },
    { kind: 'salt', value: '.' },
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 3 },
  ],
  'C10.C20.C30': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 10 },
    { kind: 'salt', value: '.' },
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 20 },
    { kind: 'salt', value: '.' },
    { kind: 'atom', value: 'C' },
    { kind: 'multiplier', value: 30 },
  ],
  'C.0.5H2O.0.6HCl': [
    { kind: 'atom', value: 'C' },
    { kind: 'salt', value: '.' },
    { kind: 'preMultiplier', value: 0.5 },
    { kind: 'atom', value: 'H' },
    { kind: 'multiplier', value: 2 },
    { kind: 'atom', value: 'O' },
    { kind: 'salt', value: '.' },
    { kind: 'preMultiplier', value: 0.6 },
    { kind: 'atom', value: 'H' },
    { kind: 'atom', value: 'Cl' },
  ],
  'NH3 . 2HCl': [
    { kind: 'atom', value: 'N' },
    { kind: 'atom', value: 'H' },
    { kind: 'multiplier', value: 3 },
    { kind: 'text', value: ' ' },
    { kind: 'salt', value: '.' },
    { kind: 'text', value: ' ' },
    { kind: 'preMultiplier', value: 2 },
    { kind: 'atom', value: 'H' },
    { kind: 'atom', value: 'Cl' },
  ],
  '2NH3 . 2HCl': [
    { kind: 'preMultiplier', value: 2 },
    { kind: 'atom', value: 'N' },
    { kind: 'atom', value: 'H' },
    { kind: 'multiplier', value: 3 },
    { kind: 'text', value: ' ' },
    { kind: 'salt', value: '.' },
    { kind: 'text', value: ' ' },
    { kind: 'preMultiplier', value: 2 },
    { kind: 'atom', value: 'H' },
    { kind: 'atom', value: 'Cl' },
  ],
  D: [{ kind: 'atom', value: 'D' }],
  'C1-2': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplierRange', value: { from: 1, to: 2 } },
  ],
  'C2-1': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplierRange', value: { from: 1, to: 2 } },
  ],
  'C-1--2': [
    { kind: 'atom', value: 'C' },
    { kind: 'multiplierRange', value: { from: -2, to: -1 } },
  ],
  'CaCO3 . 3/2H2O': [
    { kind: 'atom', value: 'Ca' },
    { kind: 'atom', value: 'C' },
    { kind: 'atom', value: 'O' },
    { kind: 'multiplier', value: 3 },
    { kind: 'text', value: ' ' },
    { kind: 'salt', value: '.' },
    { kind: 'text', value: ' ' },
    { kind: 'preMultiplier', value: 1.5 },
    { kind: 'atom', value: 'H' },
    { kind: 'multiplier', value: 2 },
    { kind: 'atom', value: 'O' },
  ],
  'C#2H': [
    { kind: 'atom', value: 'C' },
    { kind: 'anchor', value: 2 },
    { kind: 'atom', value: 'H' },
  ],
};

test.each(Object.keys(tests))('parse molecular formula %s', function (key) {
  let parsed = parse(key);
  expect(parsed).toMatchObject(tests[key]);
});

test('not same opening and closing parenthesis', function () {
  expect(() => {
    parse('C(');
  }).toThrow(/.*opening and closing.*/);
});
