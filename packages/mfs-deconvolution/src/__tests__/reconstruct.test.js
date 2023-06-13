import { toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { reconstruct } from '../reconstruct';


expect.extend({ toMatchCloseTo });

test('reconstruct', () => {
  const mfs = [
    {
      distribution: {
        x: [1, 2, 3],
        y: [1, 2, 3],
      }
    },
    {
      distribution: {
        x: [1.1, 2.1, 3.1],
        y: [1, 2, 3],
      }
    },
    {
      distribution: {
        x: [1.5, 2.5, 3.5],
        y: [1, 2, 3],
      }
    },
  ];
  const reconstructed = reconstruct(mfs, {
    mass: {
      precision: 1, peakWidthFct: "mass * 0.1"
    }
  });
  expect(reconstructed).toMatchCloseTo(
    {
      x: [1.05, 1.5, 2.05, 2.5, 3.05, 3.5],
      y: [2, 1, 4, 2, 6, 3]
    }
  )

});