import { describe, expect, it } from 'vitest';

import { Distribution } from '../Distribution.js';

describe('test array-object-xy square', () => {
  it('should yield the product', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 2 }, { x: 2, y: 3 });
    distribution.square();
    expect(distribution.array).toStrictEqual([
      { x: 2, y: 4 },
      { x: 3, y: 12 },
      { x: 4, y: 9 },
    ]);
  });
});
