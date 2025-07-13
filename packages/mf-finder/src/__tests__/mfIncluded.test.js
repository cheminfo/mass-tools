import { expect, test } from 'vitest';

import { mfIncluded } from '..';

test('mfIncluded', () => {
  expect(mfIncluded('C', 'C0-2H0-2C')).toBe(true);
  expect(mfIncluded('C3', 'C0-2H0-2C')).toBe(true);
  expect(mfIncluded('C4', 'C0-2H0-2C')).toBe(false);
  expect(mfIncluded('C', 'Me0-5')).toBe(false);
  expect(mfIncluded('CH3', 'Me0-5')).toBe(true);
  expect(mfIncluded('C2H6', 'Me0-5')).toBe(true);
  expect(mfIncluded('C2H6O', 'Me0-5(CH3O)0-5')).toBe(true);
  expect(
    mfIncluded('C2H6O', 'Me0-5(CH3O)0-5', {
      filter: { unsaturation: { min: 0 } },
    }),
  ).toBe(true);
  expect(
    mfIncluded('C2H6O', 'Me0-5(CH3O)0-5', {
      filter: { unsaturation: { min: 1 } },
    }),
  ).toBe(false);
  expect(
    mfIncluded('C2H6O', 'Me0-5(CH3O)0-5', {
      filter: { unsaturation: { min: 1 } },
    }),
  ).toBe(false);
  expect(mfIncluded('C2H6O', 'Me0-5')).toBe(false);
});
