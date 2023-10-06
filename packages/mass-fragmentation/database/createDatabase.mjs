import { readFileSync, writeFileSync } from 'fs';

import { parseDwar } from 'openchemlib-utils';

const dwar = readFileSync(
  new URL('ReactionMassFragmentation.dwar', import.meta.url),
  'utf8',
);

const database = parseDwar(dwar).data;

writeFileSync(
  new URL('../src/database/defaultDatabase.js', import.meta.url),
  `export const defaultDatabase=${JSON.stringify(database, null, 2)}`,
  'utf-8',
);
