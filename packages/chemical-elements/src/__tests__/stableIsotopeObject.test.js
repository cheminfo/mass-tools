'use strict';

const stableIsotopeObject = require('../stableIsotopeObject');

test('stableIsotopeObject', () => {
  const data = stableIsotopeObject;

  expect(data['12C']).toStrictEqual({
    name: 'Carbon',
    mass: 12,
    symbol: 'C',
    mostAbundant: true,
  });

  expect(data['13C']).toStrictEqual({
    name: 'Carbon',
    mass: 13.00335483507,
    symbol: 'C',
  });
});
