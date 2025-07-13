import { expect, test } from 'vitest';

import { MF } from '../../MF';
import { getNumberOfIsotopologues } from '../getNumberOfIsotopologues';

const tests = [
  { mf: 'C2', expected: 3 },
  { mf: 'C1000', expected: 1001 },
  { mf: 'CH', expected: 4 },
  { mf: 'CH2', expected: 6 },
  { mf: 'S', expected: 4 },
  { mf: 'S2', expected: 10 },
  { mf: 'Hs', expected: 0 },
  { mf: '', expected: 0 },
];

test.each(tests)(
  'getNumberOfIsotopologues $mf to be $expected',
  ({ mf, expected }) => {
    const atoms = new MF(mf).getInfo().atoms;
    expect(getNumberOfIsotopologues(atoms)).toBe(expected);
  },
);
