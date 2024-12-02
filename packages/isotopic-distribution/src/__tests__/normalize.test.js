import { describe, expect, it } from 'vitest';

import { Distribution } from '../Distribution.js';

describe('test distribution normalize', () => {
  it('should yield the product', () => {
    let distribution = new Distribution();
    distribution.push({ x: 1, y: 2 }, { x: 2, y: 3 });
    distribution.normalize();

    expect(distribution.array).toStrictEqual([
      { x: 1, y: 0.4 },
      { x: 2, y: 0.6 },
    ]);
  });
});
