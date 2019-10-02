'use strict';

const Distribution = require('../Distribution.js');

describe('test array-object-xy square', () => {
  it('should yield the product', () => {
    let dist = new Distribution();
    dist.push(1, 2);
    dist.push(2, 3);
    dist.square();
    expect(dist.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 3, y: 12 },
      { x: 4, y: 9 },
    ]);
  });
});
