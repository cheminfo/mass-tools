import { parseDwar } from 'openchemlib-utils';

import { defaultDatabase } from './defaultDatabase.js';
/**
 * @description Get the default databases of reactions for positive and negative mode
 * @param {Object} options - Options for database selection
 * @param {'positive'|'negative'|'both'} [options.mode='positive'] - The mode to be used
 * @param {'ionization'|'resonance'|'reaction'} [options.kind='ionization'] - The kind of database to be used
 * @param {'esi'|'ei'} [options.ionizationKind='esi'] - The ionization technique to be used
 * @param {string} [options.dwar] - The dwar file to use. Default will use an included mass fragmentation database
 * @returns
 */
export function getDatabases(options = {}) {
  const {
    mode = 'positive',
    kind = 'ionization',
    ionizationKind = 'esi',
    dwar,
  } = options;

  const fullDatabase = dwar ? parseDwar(dwar).data : defaultDatabase;

  const database = fullDatabase.filter(
    (entry) =>
      entry.kind === kind &&
      (entry.mode === mode || entry?.mode === 'both') &&
      entry.ionization === ionizationKind,
  );

  return database;
}
