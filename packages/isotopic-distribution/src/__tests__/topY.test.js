'use strict';

const Distribution = require('../Distribution.js');

describe('test distribution topY', () => {
  it('create array', () => {
    let dist = new Distribution();
    dist.push({ x: 1, y: 2 });
    dist.push({ x: 2, y: 3 });
    dist.push({ x: 2, y: 1 });
    dist.push({ x: 2, y: 4 });
    dist.topY(2);

    expect(dist.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ]);
  });
});
