import { expect, test } from 'vitest';

import { fromMonoisotopicMass } from '../..';

test('fromMonoisotopicMass', async () => {
  const { mfs } = await fromMonoisotopicMass(120, {
    allowNeutral: true,
  });
  expect(mfs).toHaveLength(8);
});

test('fromMonoisotopicMass string', async () => {
  const { mfs } = await fromMonoisotopicMass('120,60', {
    allowNeutral: true,
  });
  expect(mfs).toHaveLength(10);
});

test('fromMonoisotopicMass array', async () => {
  const { mfs } = await fromMonoisotopicMass([60, 120], {
    allowNeutral: true,
  });
  expect(mfs).toHaveLength(10);
});

test('fromMonoisotopicMass with ionizations', async () => {
  const { mfs } = await fromMonoisotopicMass(120, {
    allowNeutral: false,
    ionizations: ', H+, K+',
    precision: 100,
  });
  expect(mfs).toHaveLength(9);
});

test('fromMonoisotopicMass large database', async () => {
  const { mfs } = await fromMonoisotopicMass(1000, {
    ranges: 'C0-100 H0-100 N0-100 O0-100',
    filter: {
      unsaturation: {
        min: 0,
        max: 100,
        onlyInteger: true,
      },
    },
    precision: 100,
    allowNeutral: true,
    limit: 10000,
  });
  expect(mfs).toHaveLength(1407);
});
