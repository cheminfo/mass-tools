import { parseDwar } from 'openchemlib-utils';

import { defaultDatabase } from './defaultDatabase.js';
/**
 * @description Get the default databases of reactions for positive and negative mode
 * @param {Object} options - Options for database selection
 * @param {('ionization'|'resonance'|'reaction')[]} [options.kind=['ionization','resonance','reaction']] - The kind of database to be used
 * @param {('esi'|'ei')[]} [options.ionizations=['esi','ei']] - The ionization technique to be used
 * @param {('positive'|'negative')[]} [options.modes=['positive','negative']] - The ionization mode to be used
 * @param {string} [options.dwar] - The dwar file to use. Default will use an included mass fragmentation database
 * @returns
 */
export function getDatabase(options = {}) {
  const {
    kind = ['ionization', 'resonance', 'reaction'],
    ionizations = ['esi', 'ei'],
    modes = ['positive', 'negative'],
    dwar,
  } = options;
  const fullDatabase = dwar ? parseDwar(dwar).data : defaultDatabase;
  const database = fullDatabase.filter(
    (entry) =>
      kind.some((k) => entry.kind.includes(k)) &&
      ionizations.some((ik) => entry.ionization.split(',').includes(ik)) &&
      modes.some((m) => entry.mode.split(',').includes(m)),
  );
  return database;
}
