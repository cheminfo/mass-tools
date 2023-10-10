import { parseDwar } from 'openchemlib-utils';

import { defaultDatabase } from './defaultDatabase.js';
/**
 * @description Get the default databases of reactions for positive and negative mode
 * @param {Object} options - Options for database selection
 * @param {'ionization'|'resonance'|'reaction'|'all'} [options.kind='all'] - The kind of database to be used
 * @param {'esiPos'|'esiNeg'|'ei'|'all'} [options.ionizationKind='all'] - The ionization technique to be used
 * @param {string} [options.dwar] - The dwar file to use. Default will use an included mass fragmentation database
 * @returns
 */
export function getDatabase(options = {}) {
  const { kind = 'all', ionizationKind = 'all', dwar } = options;

  const fullDatabase = dwar ? parseDwar(dwar).data : defaultDatabase;

  const database = fullDatabase.filter(
    (entry) =>
      (entry.ionization === ionizationKind && entry.kind === kind) ||
      (kind === 'all' && entry.ionization === ionizationKind) ||
      (entry.kind === kind && ionizationKind === 'all') ||
      (kind === 'all' && ionizationKind === 'all'),
  );
  return database;
}
