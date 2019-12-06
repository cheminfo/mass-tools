'use strict';

const TreeMap = require('../TreeMap');

test('TreeMap get', () => {
  let treeMap = new TreeMap();
  treeMap.set(1, 10);
  treeMap.set(2, 20);
  treeMap.set(3, 30);
  treeMap.set(2.5, 25);
  treeMap.set(0.5, 5);

  expect(treeMap.get(2.5)).toBe(25);
  expect(treeMap.get(0.5)).toBe(5);
  expect(treeMap.get(0)).toBeNull();
});

test('TreeMap set existing values', () => {
  let treeMap = new TreeMap();
  treeMap.set(1, 10);
  treeMap.set(2, 20);
  treeMap.set(1, 25);
  treeMap.set(2, 5);

  expect(treeMap.get(1)).toBe(25);
  expect(treeMap.get(2)).toBe(5);
  expect(treeMap.get(0)).toBeNull();
});
