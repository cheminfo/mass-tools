'use strict';

const Distribution = require('../Distribution.js');

describe('test distribution normalize', () => {
  it('should yield the product', () => {
    let dist = new Distribution();
    dist.push(1, 2);
    dist.push(2, 3);
    dist.normalize();

    expect(dist.array).toStrictEqual([{ x: 1, y: 0.4 }, { x: 2, y: 0.6 }]);
  });
});
