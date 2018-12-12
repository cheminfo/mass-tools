'use strict';

const TreeMap = require('../TreeMap');

test('test TreeMap get', () => {
  let treeMap = new TreeMap();
  expect(treeMap.getFirstEntry()).toBeNull();
  treeMap.set(1, 10);
  expect(treeMap.getFirstEntry()).toMatchObject({ key: 1, value: 10 });
  treeMap.set(2, 20);
  expect(treeMap.getFirstEntry()).toMatchObject({ key: 1, value: 10 });
  treeMap.set(0.5, 5);
  expect(treeMap.getFirstEntry()).toMatchObject({ key: 0.5, value: 5 });
});

