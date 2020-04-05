'use strict';

let tests = [
  {
    mf: 'C10',
    parsed: [
      { kind: 'atom', value: 'C' },
      { kind: 'multiplier', value: 10 },
    ],
    result: [
      { kind: 'text', value: 'C' },
      { kind: 'subscript', value: '10' },
    ],
  },
  {
    mf: 'C-1',
    parsed: [
      { kind: 'atom', value: 'C' },
      { kind: 'multiplier', value: -1 },
    ],
    result: [
      { kind: 'text', value: 'C' },
      { kind: 'subscript', value: '-1' },
    ],
  },
  {
    mf: 'C1-10',
    parsed: [
      { kind: 'atom', value: 'C' },
      { kind: 'multiplierRange', value: { from: 1, to: 10 } },
    ],
    result: [
      { kind: 'text', value: 'C' },
      { kind: 'subscript', value: '1-10' },
    ],
  },
  {
    mf: '2H',
    parsed: [
      { kind: 'preMultiplier', value: 2 },
      { kind: 'atom', value: 'H' },
    ],
    result: [{ kind: 'text', value: '2H' }],
  },
  {
    mf: '[13C]',
    parsed: [{ kind: 'isotope', value: { atom: 'C', isotope: 13 } }],
    result: [
      { kind: 'superscript', value: 13 },
      { kind: 'text', value: 'C' },
    ],
  },
  {
    mf: 'C++',
    parsed: [
      { kind: 'atom', value: 'C' },
      { kind: 'charge', value: 2 },
    ],
    result: [
      { kind: 'text', value: 'C' },
      { kind: 'superscript', value: '+2' },
    ],
  },
  {
    mf: 'C2+',
    parsed: [
      { kind: 'atom', value: 'C' },
      { kind: 'multiplier', value: 2 },
      { kind: 'charge', value: 1 },
    ],
    result: [
      { kind: 'text', value: 'C' },
      { kind: 'superimpose', over: '+', under: '2' },
    ],
  },
  {
    mf: 'C(H-2)',
    parsed: [
      { kind: 'atom', value: 'C' },
      { kind: 'openingParenthesis', value: '(' },
      { kind: 'atom', value: 'H' },
      { kind: 'multiplier', value: -2 },
      { kind: 'closingParenthesis', value: ')' },
    ],
    result: [
      { kind: 'text', value: 'C(H' },
      { kind: 'subscript', value: '-2' },
      { kind: 'text', value: ')' },
    ],
  },
  {
    mf: 'H.Cl',
    parsed: [
      { kind: 'atom', value: 'H' },
      { kind: 'salt', value: '.' },
      { kind: 'atom', value: 'Cl' },
    ],
    result: [{ kind: 'text', value: 'H • Cl' }],
  },
  {
    mf: 'H{1,1}',
    parsed: [{ kind: 'isotopeRatio', value: { atom: 'H', ratio: [1, 1] } }],
    result: [
      { kind: 'text', value: 'H' },
      { kind: 'superscript', value: '{1,1}' },
    ],
  },
];

const toDisplay = require('../toDisplay');

test.each(tests)('toDisplay', function (aTest) {
  let display = toDisplay(aTest.parsed);
  expect(display).toMatchObject(aTest.result);
});
