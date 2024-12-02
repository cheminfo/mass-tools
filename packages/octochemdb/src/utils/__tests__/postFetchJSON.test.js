import { expect, test } from 'vitest';

import { postFetchJSON } from '../postFetchJSON.js';

test('postFetchJSON', async () => {
  const patents = await postFetchJSON(
    'https://octochemdb.epfl.ch/patents/v1/ids',
    { ids: ['EP-2078065-A2, EP-1293521-A2'] },
  );
  expect(patents.data.length).toBe(2);
});
