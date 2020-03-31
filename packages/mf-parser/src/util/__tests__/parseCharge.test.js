'use strict';

const getCharge = require('../parseCharge');

test('getCharge', function () {
  expect(getCharge('---')).toBe(-3);
  expect(getCharge('+++')).toBe(3);
  expect(getCharge('---++')).toBe(-1);
  expect(getCharge('(-3)')).toBe(-3);
  expect(getCharge('(+1)')).toBe(1);
  expect(getCharge('(---)')).toBe(-3);
  expect(getCharge('(++)')).toBe(2);
});
