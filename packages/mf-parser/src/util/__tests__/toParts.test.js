'use strict';

const parse = require('../../parse');

let tests = [
  { mf: 'C', result: [[{ kind: 'atom', value: 'C', multiplier: 1 }]] },
  { mf: 'C2', result: [[{ kind: 'atom', value: 'C', multiplier: 2 }]] },
  { mf: 'CCC', result: [[{ kind: 'atom', value: 'C', multiplier: 3 }]] },
  { mf: '2CCC', result: [[{ kind: 'atom', value: 'C', multiplier: 6 }]] },
  {
    mf: '2C(C(C2)2)3',
    result: [[{ kind: 'atom', value: 'C', multiplier: 32 }]],
  },
  {
    mf: '3C.2C.C4',
    result: [
      [{ kind: 'atom', value: 'C', multiplier: 3 }],
      [{ kind: 'atom', value: 'C', multiplier: 2 }],
      [{ kind: 'atom', value: 'C', multiplier: 4 }],
    ],
  },
  {
    mf: 'Et3N.ClH',
    result: [
      [
        { kind: 'atom', value: 'C', multiplier: 6 },
        { kind: 'atom', value: 'H', multiplier: 15 },
        { kind: 'atom', value: 'N', multiplier: 1 },
      ],
      [
        { kind: 'atom', value: 'H', multiplier: 1 },
        { kind: 'atom', value: 'Cl', multiplier: 1 },
      ],
    ],
  },
  {
    mf: '3[13C]2C',
    result: [
      [
        { kind: 'atom', value: 'C', multiplier: 3 },
        { kind: 'isotope', value: { atom: 'C', isotope: 13 }, multiplier: 6 },
      ],
    ],
  },
  {
    mf: 'D',
    result: [
      [{ kind: 'isotope', value: { atom: 'H', isotope: 2 }, multiplier: 1 }],
    ],
  },
];

const toParts = require('../toParts');

test.each(tests)('toParts %p', function (aTest) {
  let parsed = parse(aTest.mf);
  let parts = toParts(parsed);
  expect(parts).toMatchObject(aTest.result);
});
