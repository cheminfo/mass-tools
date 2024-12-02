import { expect, test } from 'vitest';

import { generalMatcher } from '..';

test('mfFilter', () => {
  let entry = {
    mf: 'C10',
    mw: 120.11,
    em: 120,
    msem: 0,
    charge: 0,
    unsaturation: 11,
    atoms: {
      C: 10,
    },
  };

  expect(generalMatcher(entry, { minCharge: 1 })).toBe(false);
  expect(generalMatcher(entry, { maxCharge: -1 })).toBe(false);
  expect(generalMatcher(entry, { maxCharge: 0 })).toBe(true);
  expect(generalMatcher(entry, { minCharge: -1 })).toBe(true);

  expect(
    generalMatcher(entry, {
      atoms: {
        C: { min: 10, max: 20 },
      },
    }),
  ).toBe(true);
  expect(
    generalMatcher(entry, {
      atoms: {
        N: { min: 10, max: 20 },
      },
    }),
  ).toBe(false);
  expect(
    generalMatcher(entry, {
      atoms: {
        C: { min: 5, max: 9 },
      },
    }),
  ).toBe(false);
  expect(
    generalMatcher(entry, {
      atoms: {
        C: { min: 10, max: 20 },
        N: { min: 0, max: 10 },
      },
    }),
  ).toBe(true);
});

test('negative charge', () => {
  let entry = {
    mf: 'C10',
    em: 120,
    charge: -1,
    msem: 0,
    unsaturation: 11,
  };

  expect(generalMatcher(entry, { minCharge: 0 })).toBe(false);
  expect(generalMatcher(entry, { minCharge: -1 })).toBe(true);
  expect(generalMatcher(entry, { minCharge: 0, absoluteCharge: true })).toBe(
    true,
  );
  expect(
    generalMatcher(entry, { minCharge: 0, maxCharge: 0, absoluteCharge: true }),
  ).toBe(false);
  expect(generalMatcher(entry, { minCharge: 2, absoluteCharge: true })).toBe(
    false,
  );
  expect(generalMatcher(entry, { minCharge: 1, absoluteCharge: true })).toBe(
    true,
  );
});
