import { parseDwar } from 'openchemlib-utils';

import { defaultDatabase } from './defaultDatabase.js';
/**
 * @description Get the default databases of reactions for positive and negative mode
 * @param {Object} options - Options for database selection
 * @param {string} [options.mode='positive'] - The mode to be used
 * @param {string} [options.kind='ionization'] - The kind of database to be used
 * @param {string} [options.dwar] - The dwar file to use. Default will use an included mass fragmentation database
 * @returns
 */
export function getDatabases(options = {}) {
  const { mode = 'positive', kind = 'ionization', dwar } = options;

  const fullDatabase = dwar ? parseDwar(dwar).data : defaultDatabase;

  const database = fullDatabase.filter(
    (entry) =>
      // @ts-ignore
      entry.kind === kind && (entry.mode === mode || entry?.mode === 'both'),
  );

  return database;
}
