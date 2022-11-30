import { generalMatcher } from 'mf-matcher';

/**
    Searching by various criteria. This mass will not take into account the mass
    of the mass of the electron
* @param {object}   [filter={}]
* @param {number}   [filter.minMW=0] - Minimal molecular weight
* @param {number}   [filter.maxMW=+Infinity] - Maximal molecular weight
* @param {number}   [filter.minEM=0] - Minimal monoisotopic mass
* @param {number}   [filter.maxEM=+Infinity] - Maximal monoisotopic mass
* @param {number}   [filter.minCharge=-Infinity] - Minimal charge
* @param {number}   [filter.maxCharge=+Infinity] - Maximal charge
* @param {object}   [filter.unsaturation={}]
* @param {number}   [filter.unsaturation.min=-Infinity] - Minimal unsaturation
* @param {number}   [filter.unsaturation.max=+Infinity] - Maximal unsaturation
* @param {number}   [filter.unsaturation.onlyInteger=false] - Integer unsaturation
* @param {number}   [filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
* @param {object}   [filter.atoms] - object of atom:{min, max}

* @param {object}   [options={}]
* @param {array}    [options.databases] - an array containing the name of the databases so search, by default all
* @param {boolean}  [options.flatten=false] - should we return the array as a flat result
*/

export function search(emdb, filter, options = {}) {
  let { databases = Object.keys(emdb.databases), flatten = false } = options;

  let results = {};
  for (let database of databases) {
    results[database] = emdb.databases[database].filter((entry) =>
      generalMatcher(entry, filter),
    );
  }

  if (flatten) {
    let flattenResults = [];
    for (let database of databases) {
      for (let entry of results[database]) {
        entry.database = database;
        flattenResults.push(entry);
      }
    }
    return flattenResults;
  } else {
    return results;
  }
}
