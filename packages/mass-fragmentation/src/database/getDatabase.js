import { parseDwar } from 'openchemlib-utils';

import { defaultDatabase } from './defaultDatabase.js';
/**
 * @description Get the default databases of reactions for positive and negative mode
 * @param {Object} options - Options for database selection
 * @param {('ionization'|'resonance'|'reaction')[]} [options.kind=['ionization','resonance','reaction']] - The kind of database to be used
 * @param {('esi'|'ei')[]} [options.ionization=['esi','ei']] - The ionization technique to be used
 * @param {('positive'|'negative')[]} [options.mode=['positive','negative']] - The ionization mode to be used
 * @param {string} [options.dwar] - The dwar file to use. Default will use an included mass fragmentation database
 * @returns
 */
export function getDatabase(options = {}) {
  const {
    kind = ['ionization', 'resonance', 'reaction'],
    ionization = ['esi', 'ei'],
    mode = ['positive', 'negative'],
    dwar,
  } = options;
  const fullDatabase = dwar ? parseDwar(dwar).data : defaultDatabase;
  const database = fullDatabase.filter(
    (entry) =>
      kind.some((k) => entry.kind.includes(k)) &&
      ionization.some((ik) => entry.ionization.split(',').includes(ik)) &&
      mode.some((m) => entry.mode.split(',').includes(m)),
  );
  return database;
}
