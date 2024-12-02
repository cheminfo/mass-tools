import { describe, expect, it } from 'vitest';

import { Distribution } from '../Distribution.js';

describe('test distribution power', () => {
  it('power 2', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 2 }, { x: 2, y: 3 });
    distribution.power(2);
    expect(distribution.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 3, y: 12 },
      { x: 4, y: 9 },
    ]);
  });

  it('power 3 - 1 peak', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 1 });
    distribution.power(3);
    expect(distribution.array).toStrictEqual([{ x: 3, y: 1 }]);
  });

  it('power 3 - 2 peaks', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 1 }, { x: 2, y: 1 });
    distribution.power(3);
    expect(distribution.array).toStrictEqual([
      { x: 3, y: 1 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 6, y: 1 },
    ]);
  });

  it('power 1000 - 2 peaks', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 1 }, { x: 2, y: 1 });
    distribution.power(1000);
    expect(distribution.array).toHaveLength(1001);
    expect(distribution.array[1]).toStrictEqual({ x: 1001, y: 1000 });
  });

  it('power 100000 - 10 peaks', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 0.5 }, { x: 2, y: 0.5 });
    distribution.power(100000);
    let sum = distribution.array.reduce((s, a) => s + a.y, 0);
    expect(sum).toBeGreaterThan(0.99);
    expect(sum).toBeLessThan(1);
  });
});
