import { readFileSync } from 'node:fs';
import path from 'node:path';

import { searchInSilicoSpectraByMF } from '../searchInSilicoSpectraByMF.js';

test('searchInsilicoSpectra', async () => {
  const mdma = JSON.parse(
    readFileSync(path.join(__dirname, 'data/mdma.json'), 'utf8'),
  );

  const results = await searchInSilicoSpectraByMF(mdma, 'C11H15NO2', {
    precision: 50,
  });
  expect(results.length).toBeGreaterThan(5);
});
