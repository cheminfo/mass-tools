'use strict';

const Distribution = require('../Distribution.js');

describe('test distribution closestPointX', () => {
  it('should yield the right point', () => {
    let dist = new Distribution();
    dist.push(1, 2);
    dist.push(2, 3);
    dist.push(3, 3);
    dist.push(4, 3);

    expect(dist.closestPointX(2)).toStrictEqual({ x: 2, y: 3 });
    expect(dist.closestPointX(0)).toStrictEqual({ x: 1, y: 2 });
    expect(dist.closestPointX(2.1)).toStrictEqual({ x: 2, y: 3 });
    expect(dist.closestPointX(1.9)).toStrictEqual({ x: 2, y: 3 });
    expect(dist.closestPointX(5.1)).toStrictEqual({ x: 4, y: 3 });
    expect(dist.closestPointX(4.9)).toStrictEqual({ x: 4, y: 3 });
  });
});
