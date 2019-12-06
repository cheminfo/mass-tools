'use strict';

const matcher = require('../generalMatcher');

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

  expect(matcher(entry, { minCharge: 1 })).toBe(false);
  expect(matcher(entry, { maxCharge: -1 })).toBe(false);
  expect(matcher(entry, { maxCharge: 0 })).toBe(true);
  expect(matcher(entry, { minCharge: -1 })).toBe(true);
  expect(
    matcher(entry, {
      atoms: {
        C: { min: 10, max: 20 },
      },
    }),
  ).toBe(true);
  expect(
    matcher(entry, {
      atoms: {
        N: { min: 10, max: 20 },
      },
    }),
  ).toBe(false);
  expect(
    matcher(entry, {
      atoms: {
        C: { min: 5, max: 9 },
      },
    }),
  ).toBe(false);
  expect(
    matcher(entry, {
      atoms: {
        C: { min: 10, max: 20 },
        N: { min: 0, max: 10 },
      },
    }),
  ).toBe(true);
});
