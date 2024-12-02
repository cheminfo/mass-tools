import { expect, test } from 'vitest';

import { Distribution } from '../Distribution.js';

test('distribution closestPointX', () => {
  let distribution = new Distribution();
  distribution.push(
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 4, y: 3 },
  );

  expect(distribution.closestPointX(2)).toStrictEqual({ x: 2, y: 3 });
  expect(distribution.closestPointX(0)).toStrictEqual({ x: 1, y: 2 });
  expect(distribution.closestPointX(2.1)).toStrictEqual({ x: 2, y: 3 });
  expect(distribution.closestPointX(1.9)).toStrictEqual({ x: 2, y: 3 });
  expect(distribution.closestPointX(5.1)).toStrictEqual({ x: 4, y: 3 });
  expect(distribution.closestPointX(4.9)).toStrictEqual({ x: 4, y: 3 });
});
