import { describe, expect, it } from 'vitest';

import { Distribution } from '../Distribution.js';

describe('test distribution multiply', () => {
  it('should yield the product', () => {
    let dist1 = new Distribution();
    dist1.push({ x: 1, y: 2 }, { x: 2, y: 3 });
    let dist2 = new Distribution();
    dist2.push({ x: 1, y: 2 }, { x: 2, y: 3 });
    let dist3 = dist1.multiply(dist2);

    dist3.sortX();

    expect(dist1.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 3, y: 12 },
      { x: 4, y: 9 },
    ]);
    expect(dist3.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 3, y: 12 },
      { x: 4, y: 9 },
    ]);
  });
});
