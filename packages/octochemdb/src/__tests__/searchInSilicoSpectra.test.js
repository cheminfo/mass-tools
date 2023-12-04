import { readFileSync } from 'fs';
import { join } from 'path';

import { searchInSilicoSpectra } from '../searchInSilicoSpectra.js';

test('searchInsilicoSpectra', async () => {
  const mdma = JSON.parse(
    readFileSync(join(__dirname, 'data/mdma.json'), 'utf8'),
  );

  const results = await searchInSilicoSpectra(mdma, 'C11H15NO2', {
    precision: 50,
  });
  expect(results.length).toBeGreaterThan(5);
});
