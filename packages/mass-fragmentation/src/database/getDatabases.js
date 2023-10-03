import { readFileSync } from 'fs';
import { join } from 'path';

import { parseDwar } from 'openchemlib-utils';
/**
 * @description Get the default databases of reactions for positive and negative mode
 * @param {Object} options - Options for database selection
 * @param {string} [options.mode='positive'] - The mode to be used
 * @param {string} [options.kind='ionization'] - The kind of database to be used
 * @param {string} dwarEntry - The dwar entry to be used
 * @returns
 */
export function getDatabases(options = {}, dwarEntry = '') {
  const { mode = 'positive', kind = 'ionization' } = options;
  if (!dwarEntry) {
    dwarEntry = readFileSync(
      join(__dirname, './ReactionMassFragmentation.dwar'),
      'utf8',
    );
  }

  const data = parseDwar(dwarEntry).data;
  const database = data.filter(
    (entry) =>
      // @ts-ignore
      entry.kind === kind && (entry.mode === mode || entry?.mode === 'both'),
  );

  return database;
}
