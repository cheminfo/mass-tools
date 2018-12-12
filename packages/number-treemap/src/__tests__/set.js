'use strict';

const TreeMap = require('../TreeMap');

test('test TreeMap put', () => {
  let treeMap = new TreeMap();
  treeMap.set(1, 10);
  treeMap.set(2, 20);
  treeMap.set(3, 30);
  treeMap.set(2.5, 25);
  treeMap.set(0.5, 5);

  expect(treeMap.root).toMatchObject({
    key: 1,
    value: 10,
    left: {
      key: 0.5,
      value: 5,
      left: null,
      right: null
    },
    right: {
      key: 2,
      value: 20,
      left: null,
      right: {
        key: 3,
        value: 30,
        left: {
          key: 2.5,
          value: 25
        },
        right: null
      }
    }
  });
});

test('test TreeMap put existing values', () => {
  let treeMap = new TreeMap();
  treeMap.set(1, 10);
  treeMap.set(2, 20);
  treeMap.set(1, 25);
  treeMap.set(2, 5);

  expect(treeMap.root).toMatchObject({
    key: 1,
    value: 25,
    left: null,
    right: {
      key: 2,
      value: 5,
      left: null,
      right: null
    }
  });
});
