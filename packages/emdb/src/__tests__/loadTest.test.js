import { expect, test } from 'vitest';

import { EMDB } from '..';

test('loadTest', async () => {
  let emdb = new EMDB();
  await emdb.loadTest();

  expect(emdb.databases.test).toMatchSnapshot();
});
