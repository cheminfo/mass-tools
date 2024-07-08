import { readFileSync } from 'node:fs';
import path from 'node:path';

import { includeDBRefs } from '../includeDBRefs.js';

test('includeDBRefs', async () => {
  const object = JSON.parse(
    readFileSync(path.join(__dirname, 'details.json'), 'utf8'),
  );
  let nbPatents = object.data.patents.filter((patent) => patent.data).length;
  expect(nbPatents).toBe(18);
  await includeDBRefs(object, { collections: ['patents'] });
  nbPatents = object.data.patents.filter((patent) => patent.data).length;
  expect(nbPatents).toBe(23);
});
