import { describe, expect, it } from 'vitest';

import { Distribution } from '../Distribution.js';

describe('test distribution append', () => {
  it('should append one distribution to another', () => {
    let dist1 = new Distribution();
    dist1.push({ x: 1, y: 2 }, { x: 2, y: 3 });
    let dist2 = new Distribution();
    dist2.push({ x: 2, y: 4 }, { x: 3, y: 5 });

    dist1.append(dist2);
    dist1.sortX();

    expect(dist1.array).toStrictEqual([
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 5 },
    ]);
  });
});
