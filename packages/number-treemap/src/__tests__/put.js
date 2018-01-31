'use strict';

const TreeMap = require('..');

test('test TreeMap', () => {
    let treeMap = new TreeMap();
    treeMap.put(1, 10);
    treeMap.put(2, 20);
    treeMap.put(3, 30);
    treeMap.put(2.5, 25);
    treeMap.put(0.5, 5);

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
