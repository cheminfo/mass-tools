'use strict';

const TreeMap = require('../TreeMap');

test('TreeMap get', () => {
  let treeMap = new TreeMap();
  treeMap.set(1, 10);
  treeMap.set(2, 20);
  treeMap.set(3, 30);
  treeMap.set(2.5, 25);
  treeMap.set(0.5, 5);

  expect(treeMap.getClosestEntry(0)).toMatchObject({ key: 0.5, value: 5 });
  expect(treeMap.getClosestEntry(2.1)).toMatchObject({ key: 2, value: 20 });
  expect(treeMap.getClosestEntry(2.4)).toMatchObject({ key: 2.5, value: 25 });
  expect(treeMap.getClosestEntry(2.5)).toMatchObject({ key: 2.5, value: 25 });
  expect(treeMap.getClosestEntry(2.6)).toMatchObject({ key: 2.5, value: 25 });
  expect(treeMap.getClosestEntry(4)).toMatchObject({ key: 3, value: 30 });
});
