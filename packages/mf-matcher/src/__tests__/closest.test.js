'use strict';

const closest = require('../closest');

test('test closest even', () => {
  let array = [0, 0.1, 1, 2, 3, 4];

  expect(closest(array, 2)).toBe(2);
  expect(closest(array, 1.4)).toBe(1);
  expect(closest(array, 1.6)).toBe(2);
  expect(closest(array, -1)).toBe(0);
  expect(closest(array, 4.1)).toBe(4);
  expect(closest(array, 0)).toBe(0);
});

test('test closest odd', () => {
  let array = [10, 11, 12, 13];

  expect(closest(array, 2)).toBe(10);
  expect(closest(array, 20)).toBe(13);
  expect(closest(array, 11.4)).toBe(11);
  expect(closest(array, 11.6)).toBe(12);
  expect(closest(array, 10)).toBe(10);
  expect(closest(array, 11)).toBe(11);
  expect(closest(array, 12)).toBe(12);
  expect(closest(array, 13)).toBe(13);
});
