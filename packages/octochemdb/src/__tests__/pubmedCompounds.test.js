import { expect, test } from 'vitest';

import { pubmedCompounds } from '../pubmedCompounds.js';

test('pubmedCompounds', { timeout: 30_000 }, async () => {
  const results = await pubmedCompounds('15455066', {
    limit: 10,
  });

  expect(results).toHaveLength(3);
});
