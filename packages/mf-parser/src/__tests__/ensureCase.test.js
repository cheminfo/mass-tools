'use strict';

const ensureCase = require('../ensureCase');

test('ensureCase', () => {
  expect(ensureCase('ch3cooh')).toBe('CH3COOH');
  expect(ensureCase('c10')).toBe('C10');
  expect(ensureCase('c5h6o3')).toBe('C5H6O3');
  expect(ensureCase('h2o')).toBe('H2O');
  expect(ensureCase('chon')).toBe('CHON');
  expect(ensureCase('ch3coocl')).toBe('CH3COOCl');
  expect(ensureCase('no2')).toBe('NO2');
  expect(ensureCase('nacl')).toBe('NaCl');
  expect(ensureCase('ruhg')).toBe('RuHg');
  expect(ensureCase('ch3cn')).toBe('CH3CN');
});
