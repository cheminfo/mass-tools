import { readFileSync } from 'fs';
import { join } from 'path';

import { appendURLs } from '../appendURLs.js';

test('appendURLs', async () => {
  const object = JSON.parse(
    readFileSync(join(__dirname, 'details.json'), 'utf8'),
  );
  let nbPatents = object.data.patents.filter((patent) => patent.url).length;
  expect(nbPatents).toBe(18);
  await appendURLs(object);
  nbPatents = object.data.patents.filter((patent) => patent.url).length;
  expect(nbPatents).toBe(23);
});
