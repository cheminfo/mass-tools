import { expect, test } from 'vitest';

import { pubmedCompounds } from '../pubmedCompounds.js';

test('pubmedCompounds', async () => {
  const results = await pubmedCompounds('15455066', {
    limit: 10,
  });
  expect(results).toHaveLength(3);
}, 30000);
