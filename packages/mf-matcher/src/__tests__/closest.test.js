'use strict';

const closest = require('../closest');

test('test closest even', () => {
  let array = [0, 0.1, 1, 2, 3, 4];

  expect(closest(array, 2)).toBe(3);
  expect(closest(array, 1.4)).toBe(2);
  expect(closest(array, 1.6)).toBe(3);
  expect(closest(array, -1)).toBe(0);
  expect(closest(array, 4.1)).toBe(5);
  expect(closest(array, 0)).toBe(0);
});

test('test closest even small array', () => {
  let array = [10, 11, 12, 13];

  expect(closest(array, 2)).toBe(0);
  expect(closest(array, 20)).toBe(3);
  expect(closest(array, 11.4)).toBe(1);

  expect(closest(array, 11.6)).toBe(2);
  expect(closest(array, 10)).toBe(0);
  expect(closest(array, 11)).toBe(1);
  expect(closest(array, 12)).toBe(2);
  expect(closest(array, 13)).toBe(3);
});

test('test closest odd small array', () => {
  let array = [50, 60, 70];

  expect(closest(array, 49)).toBe(0);
  expect(closest(array, 50)).toBe(0);
  expect(closest(array, 51)).toBe(0);

  expect(closest(array, 59)).toBe(1);
  expect(closest(array, 60)).toBe(1);
  expect(closest(array, 61)).toBe(1);

  expect(closest(array, 69)).toBe(2);
  expect(closest(array, 70)).toBe(2);
  expect(closest(array, 71)).toBe(2);
});

test('test closest odd array of 5 elements', () => {
  let array = [50, 55, 60, 65, 70];

  expect(closest(array, 49)).toBe(0);
  expect(closest(array, 50)).toBe(0);
  expect(closest(array, 51)).toBe(0);

  expect(closest(array, 59)).toBe(2);
  expect(closest(array, 60)).toBe(2);
  expect(closest(array, 61)).toBe(2);

  expect(closest(array, 69)).toBe(4);
  expect(closest(array, 70)).toBe(4);
  expect(closest(array, 71)).toBe(4);
});
