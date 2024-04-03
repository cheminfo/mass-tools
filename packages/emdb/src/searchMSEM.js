import { msemMatcher } from 'mf-matcher';
import { preprocessIonizations } from 'mf-utilities';

/**
Search for an experimental monoisotopic mass
* @param {number}   msem - The observed monoisotopic mass
* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten=false] - should we return the array as a flat result
* @param {string}   [options.ionizations] - list the allowed ionizations possibilities
* @param {import('mf-matcher').MSEMFilterOptions}        [options.filter={}]
*/

export function searchMSEM(emdb, msem, options = {}) {
  let filter = { ...(options.filter || {}), targetMass: msem };
  let { databases = Object.keys(emdb.databases), flatten = false } = options;

  let ionizations = preprocessIonizations(options.ionizations);
  let results = {};
  for (let database of databases) {
    results[database] = [];
  }
  for (let ionization of ionizations) {
    filter.ionization = ionization;
    for (let database of databases) {
      for (let entry of emdb.databases[database]) {
        let match = msemMatcher(entry, filter);
        if (match) {
          results[database].push({
            ...entry,
            ms: match.ms,
            ionization: match.ionization,
          });
        }
      }
    }
  }
  if (flatten) {
    let flattenResults = [];
    for (let database of databases) {
      for (let entry of results[database]) {
        entry.database = database;
        flattenResults.push(entry);
      }
    }
    flattenResults.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));
    return flattenResults;
  } else {
    Object.keys(results).forEach((k) =>
      results[k].sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm)),
    );
    return results;
  }
}
