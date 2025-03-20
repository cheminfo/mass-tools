import { expect, test } from 'vitest';

import { MFInternal } from '../../MFInternal.js';
import { toDisplay } from '../toDisplay';

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

// eslint-disable-next-line no-unused-vars
test.each(tests)('toDisplay $mf', ({ mf, parsed, result }) => {
  let display = toDisplay(parsed);
  expect(display).toMatchObject(result);
});

const testsCharges = [
  {
    mf: '(+)',
    result: [
      { kind: 'text', value: '-e' },
      { kind: 'superscript', value: '-' },
    ],
  },
  {
    mf: '(-)',
    result: [
      { kind: 'text', value: '+e' },
      { kind: 'superscript', value: '-' },
    ],
  },
  {
    mf: '(+3)',
    result: [
      { kind: 'text', value: '-3e' },
      { kind: 'superscript', value: '-' },
    ],
  },
  {
    mf: '(-3)',
    result: [
      { kind: 'text', value: '+3e' },
      { kind: 'superscript', value: '-' },
    ],
  },
  {
    mf: '(-)1',
    result: [
      { kind: 'text', value: '+e' },
      { kind: 'superscript', value: '-' },
    ],
  },
  {
    mf: '(+)1',
    result: [
      { kind: 'text', value: '-e' },
      { kind: 'superscript', value: '-' },
    ],
  },
  {
    mf: '(-)2',
    result: [
      { kind: 'text', value: '+2e' },
      { kind: 'superscript', value: '-' },
    ],
  },
  {
    mf: '(+)2',
    result: [
      { kind: 'text', value: '-2e' },
      { kind: 'superscript', value: '-' },
    ],
  },
];

test.each(testsCharges)('toDisplay simple charges $mf', ({ mf, result }) => {
  const parsed = new MFInternal(mf).parsed;
  let display = toDisplay(parsed);
  expect(display).toMatchObject(result);
});

const testsParenthesis = [
  {
    mf: 'CH2',
    result: [
      { kind: 'text', value: 'CH' },
      { kind: 'subscript', value: '2' },
    ],
  },
  {
    mf: 'CH2+',
    result: [
      { kind: 'text', value: 'CH' },
      { kind: 'superimpose', over: '+', under: '2' },
    ],
  },
  {
    mf: '(((CH2)2)3)1',
    result: [
      { kind: 'text', value: '((CH' },
      { kind: 'subscript', value: '2' },
      { kind: 'text', value: ')' },
      { kind: 'subscript', value: '2' },
      { kind: 'text', value: ')' },
      { kind: 'subscript', value: '3' },
    ],
  },
  {
    mf: 'CH(CH2(CH3))1',
    result: [
      { kind: 'text', value: 'CH(CH' },
      { kind: 'subscript', value: '2' },
      { kind: 'text', value: '(CH' },
      { kind: 'subscript', value: '3' },
      { kind: 'text', value: '))' },
    ],
  },
  {
    mf: 'C(CH2)2',
    result: [
      { kind: 'text', value: 'C(CH' },
      { kind: 'subscript', value: '2' },
      { kind: 'text', value: ')' },
      { kind: 'subscript', value: '2' },
    ],
  },
  {
    mf: 'C(CH2)1+',
    result: [
      { kind: 'text', value: 'C(CH' },
      { kind: 'subscript', value: '2' },
      { kind: 'text', value: ')' },
      { kind: 'superscript', value: '+' },
    ],
  },
  {
    mf: '((CH2)1)(+)',
    result: [
      { kind: 'text', value: 'CH' },
      { kind: 'superimpose', value: undefined, over: '+', under: '2' },
    ],
  },
];

test.each(testsParenthesis)('toDisplay parenthesis $mf', ({ mf, result }) => {
  const parsed = new MFInternal(mf).parsed;
  let display = toDisplay(parsed);
  expect(display).toMatchObject(result);
});
