import { readFileSync } from 'node:fs';
import path from 'node:path';

import { Spectrum } from 'ms-spectrum';

import { OctoChemDB } from '../OctoChemDB.js';

test('searchInSilicoSpectraByMasses', async () => {
  const mdma = JSON.parse(
    readFileSync(path.join(__dirname, 'data/mdma.json'), 'utf8'),
  );
  // by default peaks over 1%
  const spectrum = new Spectrum(mdma).getPeaksAsDataXY();
  const octoChemDB = new OctoChemDB();

  const results = await octoChemDB.searchInSilicoSpectraByMasses(
    spectrum,
    194.1174,
    {
      precision: 20,
      ionizations: 'H+',
    },
  );
  expect(results.length).toBeGreaterThan(5);
});
