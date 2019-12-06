'use strict';

const Distribution = require('../Distribution.js');

describe('test distribution topY', () => {
  it('create array', () => {
    let dist = new Distribution();
    dist.push(1, 2);
    dist.push(2, 3);
    dist.push(2, 1);
    dist.push(2, 4);
    dist.topY(2);

    expect(dist.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ]);
  });
});
