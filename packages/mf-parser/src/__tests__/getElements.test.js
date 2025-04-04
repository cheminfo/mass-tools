import { toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { expect, test } from 'vitest';

import { MF } from '..';

expect.extend({ toMatchCloseTo });

test('getElements', () => {
  expect(new MF('C2').getElements()).toStrictEqual([
    { symbol: 'C', number: 2 },
  ]);
  expect(new MF('C.C').getElements()).toStrictEqual([
    { symbol: 'C', number: 2 },
  ]);
  expect(new MF('CO2').getElements()).toStrictEqual([
    { symbol: 'C', number: 1 },
    { symbol: 'O', number: 2 },
  ]);
  expect(new MF('C2[13C]3').getElements()).toStrictEqual([
    { symbol: 'C', number: 2 },
    { symbol: 'C', number: 3, isotope: 13 },
  ]);
  expect(new MF('CCC2[13C]2ON.N').getElements()).toStrictEqual([
    { symbol: 'C', number: 4 },
    { symbol: 'C', number: 2, isotope: 13 },
    { symbol: 'N', number: 2 },
    { symbol: 'O', number: 1 },
  ]);
});
