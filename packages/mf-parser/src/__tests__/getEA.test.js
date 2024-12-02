import { toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { expect, test } from 'vitest';

import { MF } from '../MF';

expect.extend({ toMatchCloseTo });

test('getEA', () => {
  expect(new MF('C').getEA()).toMatchCloseTo(
    [{ element: 'C', mass: 12.011, ratio: 1 }],
    3,
  );

  let result1 = new MF('4C').getEA();
  let result2 = new MF('2C2').getEA();
  let result3 = new MF('C4').getEA();
  let result4 = new MF('C2 . 2C').getEA();
  expect(result1).toStrictEqual(result2);
  expect(result1).toStrictEqual(result3);
  expect(result1).toStrictEqual(result4);

  expect(new MF('[13C]').getEA()).toMatchCloseTo(
    [{ element: 'C', mass: 13.0033, ratio: 1 }],
    3,
  );

  expect(new MF('C{50,50}10').getEA()).toMatchCloseTo(
    [{ element: 'C', mass: 125.01677, ratio: 1 }],
    3,
  );

  expect(new MF('Me2').getEA()).toMatchCloseTo(
    [
      { element: 'C', mass: 24.02147, ratio: 0.7988 },
      { element: 'H', mass: 6.0476, ratio: 0.20112 },
    ],
    3,
  );
});
