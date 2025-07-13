import { describe, expect, it } from 'vitest';

import { massShifts } from '../massShifts';

describe('test massShifts', () => {
  it('should give the right function', async () => {
    let data = [
      {
        ms: {
          em: 10,
          delta: 0.2,
          similarity: { value: 0.99 },
        },
      },
      {
        ms: {
          em: 20,
          delta: 0.3,
          similarity: { value: 0.99 },
        },
      },
      {
        ms: {
          em: 30,
          delta: 0.4,
          similarity: { value: 0.99 },
        },
      },
    ];

    let result = massShifts(data, { minLength: 2 });

    expect(result.intercept).toBe(0.1);
    expect(result.slope).toBe(0.01);
    expect(result.shifts).toStrictEqual({
      x: [10, 20, 30],
      y: [0.2, 0.3, 0.4],
    });
    expect(result.score.r).toBe(1);
    expect(result.fit.x).toHaveLength(1001);
    expect(result.fit.y).toHaveLength(1001);
  });
});
