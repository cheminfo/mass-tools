'use strict';

const TreeMap = require('../TreeMap');

test('test TreeMap get', () => {
  let treeMap = new TreeMap();
  expect(treeMap.getLastEntry()).toBeNull();
  treeMap.set(1, 10);
  expect(treeMap.getLastEntry()).toMatchObject({ key: 1, value: 10 });
  treeMap.set(2, 20);
  expect(treeMap.getLastEntry()).toMatchObject({ key: 2, value: 20 });
  treeMap.set(0.5, 5);
  expect(treeMap.getLastEntry()).toMatchObject({ key: 2, value: 20 });
});
