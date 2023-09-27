import { defaultDatabase } from './database.js';

export function getDatabases(options = {}) {
  const {
    ionization = 'esi',
    mode = 'positive',
    database = defaultDatabase,
  } = options;

  // need to filter database by ionization and mode somehow
  const ionizations = database.filter((entry) => entry.kind === 'ionization');
  const fragmentations = database.filter(
    (entry) => entry.kind !== 'ionization',
  );

  return { ionizations, fragmentations };
}
