'use strict';

const TreeMap = require('../TreeMap');

test('test TreeMap get', () => {
    let treeMap = new TreeMap();
    treeMap.set(1, 10);
    treeMap.set(2, 20);
    treeMap.set(3, 30);
    treeMap.set(2.5, 25);
    treeMap.set(0.5, 5);

    expect(treeMap.getEntry(2.5)).toMatchObject({ key: 2.5, value: 25 });
    expect(treeMap.getEntry(0.5)).toMatchObject({ key: 0.5, value: 5 });
    expect(treeMap.getEntry(0)).toBeNull();
});
