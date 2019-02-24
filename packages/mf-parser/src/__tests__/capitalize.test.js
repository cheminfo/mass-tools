'use strict';

const capitalize = require('../capitalize');

test('capitalize', () => {
  expect(capitalize('c10')).toBe('C10');
  expect(capitalize('c5h6o3')).toBe('C5H6O3');
  expect(capitalize('h2o')).toBe('H2O');
  expect(capitalize('chon')).toBe('CHON');
  expect(capitalize('ch3coocl')).toBe('CH3COOCl');
  expect(capitalize('no2')).toBe('NO2');
  expect(capitalize('nacl')).toBe('NaCl');
  expect(capitalize('ruhg')).toBe('RuHg');
  expect(capitalize('ch3cn')).toBe('CH3CN');
});
