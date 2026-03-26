import { expect, test } from 'vitest';

import { stableIsotopesObject } from '..';

test('stableIsotopesObject', () => {
  const data = stableIsotopesObject;

  expect(data['12C']).toStrictEqual({
    name: 'Carbon',
    mass: 12,
    symbol: 'C',
    mostAbundant: true,
    deltaNeutron: 0,
  });

  expect(data['13C']).toStrictEqual({
    name: 'Carbon',
    mass: 13.00335483507,
    symbol: 'C',
    mostAbundant: false,
    deltaNeutron: 1,
  });

  expect(data['10B']).toStrictEqual({
    name: 'Boron',
    mass: 10.01293695,
    symbol: 'B',
    mostAbundant: false,
    deltaNeutron: -1,
  });

  expect(data['11B']).toStrictEqual({
    name: 'Boron',
    mass: 11.00930536,
    symbol: 'B',
    mostAbundant: true,
    deltaNeutron: 0,
  });
});
