import { pubmedCompounds } from '../pubmedCompounds.js';

test('pubmedCompounds', async () => {
  const results = await pubmedCompounds('15455066');
  expect(results).toHaveLength(4);
}, 30000);
