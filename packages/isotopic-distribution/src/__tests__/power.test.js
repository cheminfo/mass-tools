'use strict';

const Distribution = require('../Distribution.js');

describe('test distribution power', () => {
  it('power 2', () => {
    let dist = new Distribution();
    dist.push(1, 2);
    dist.push(2, 3);
    dist.power(2);
    expect(dist.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 3, y: 12 },
      { x: 4, y: 9 },
    ]);
  });

  it('power 3 - 1 peak', () => {
    let dist = new Distribution();
    dist.push(1, 1);
    dist.power(3);
    expect(dist.array).toStrictEqual([{ x: 3, y: 1 }]);
  });

  it('power 3 - 2 peaks', () => {
    let dist = new Distribution();
    dist.push(1, 1);
    dist.push(2, 1);
    dist.power(3);
    expect(dist.array).toStrictEqual([
      { x: 3, y: 1 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 1 },
    ]);
  });

  it('power 1000 - 2 peaks', () => {
    let dist = new Distribution();
    dist.push(1, 1);
    dist.push(2, 1);
    dist.power(1000);
    expect(dist.array).toHaveLength(1001);
    expect(dist.array[1]).toStrictEqual({ x: 1001, y: 1000 });
  });

  it('power 100000 - 10 peaks', () => {
    let dist = new Distribution();
    dist.push(1, 0.5);
    dist.push(2, 0.5);
    dist.power(100000);
    let sum = dist.array.reduce((s, a) => s + a.y, 0);
    expect(sum).toBeGreaterThan(0.99);
    expect(sum).toBeLessThan(1);
  });
});
