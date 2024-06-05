import { toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { mfFromAtomicRatio } from '..';

expect.extend({ toMatchCloseTo });

test('basic case', async () => {
  let mfs = await mfFromAtomicRatio(
    { C: 2, H: 2 },
    {
      ranges: 'C0-1 H0-1',
    },
  );
  expect(mfs).toHaveLength(1);
  expect(mfs[0]).toMatchCloseTo({
    em: 13.00782503223,
    mw: 13.018676650791026,
    mf: 'CH',
    mfAtomicComposition: [
      { element: 'C', count: 1, theoretical: 0.5 },
      { element: 'H', count: 1, theoretical: 0.5 }
    ],
    atomicRatios: [
      {
        element: 'C',
        experimental: 0.5,
        count: 1,
        theoretical: 0.5,
        error: 0
      },
      {
        element: 'H',
        experimental: 0.5,
        count: 1,
        theoretical: 0.5,
        error: 0
      }
    ],
    totalError: 0
  })
});

test('More advanced case with filtering', async () => {
  const mfs = await mfFromAtomicRatio(
    { C: 3, O: 2 },
    {
      ranges: 'C0-10 H0-10 O0-10 N0-10',
      maxElementError: 0.01,
      maxTotalError: 0.02,
    },
  );
  expect(mfs).toHaveLength(363);
  expect(mfs[0]).toMatchCloseTo({
    em: 67.98982923914,
    mw: 68.03101753884229,
    mf: 'C3O2',
    mfAtomicComposition: [
      { element: 'C', count: 3, theoretical: 0.6 },
      { element: 'O', count: 2, theoretical: 0.4 }
    ],
    atomicRatios: [
      {
        element: 'C',
        experimental: 0.6,
        count: 3,
        theoretical: 0.6,
        error: 0
      },
      {
        element: 'O',
        experimental: 0.4,
        count: 2,
        theoretical: 0.4,
        error: 0
      }
    ],
    totalError: 0
  })
});
