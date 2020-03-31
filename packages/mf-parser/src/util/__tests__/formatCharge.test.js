'use strict';

const formatCharge = require('../formatCharge');

test('formatCharge', function () {
  expect(formatCharge(-2)).toBe('-2');
  expect(formatCharge(-1)).toBe('-1');
  expect(formatCharge(0)).toBe('');
  expect(formatCharge(1)).toBe('+');
  expect(formatCharge(2)).toBe('+2');
});
