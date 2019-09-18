'use strict';

/**
 * Returns true if the entry containing MF information match
 * @param {object}   [entry={}}] - object containing mw, ...
 * @param {object}   [options={}}]
 * @param {number}   [options.minMW=0] - Minimal molecular weight
 * @param {number}   [options.maxMW=+Infinity] - Maximal molecular weight
 * @param {number}   [options.minEM=0] - Minimal monoisotopic mass
 * @param {number}   [options.maxEM=+Infinity] - Maximal monoisotopic mass
 * @param {number}   [options.minCharge=-Infinity] - Minimal charge
 * @param {number}   [options.maxCharge=+Infinity] - Maximal charge
 * @param {object}   [options.unsaturation={}}]
 * @param {number}   [options.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}   [options.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number}   [options.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {number}   [options.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object}   [options.atoms] - object of atom:{min, max}
 * @return {boolean}
 */

module.exports = function generalMatcher(entry, options = {}) {
  const {
    minMW = 0,
    maxMW = +Infinity,
    minEM = 0,
    maxEM = +Infinity,
    minCharge = Number.MIN_SAFE_INTEGER,
    maxCharge = Number.MAX_SAFE_INTEGER,
    unsaturation = {},
    atoms,
  } = options;

  if (entry.mw !== undefined) {
    if (entry.mw < minMW || entry.mw > maxMW) return false;
  }

  if (entry.em !== undefined) {
    if (entry.em < minEM || entry.em > maxEM) return false;
  }

  if (entry.charge !== undefined) {
    if (entry.charge < minCharge || entry.charge > maxCharge) return false;
  }

  if (unsaturation !== undefined && entry.unsaturation !== undefined) {
    if (!require('./unsaturationMatcher')(entry, unsaturation)) return false;
  }

  if (entry.atoms !== undefined && atoms) {
    // all the atoms of the entry must fit in the range
    for (let atom of Object.keys(entry.atoms)) {
      if (!atoms[atom]) return false;
      if (entry.atoms[atom] < atoms[atom].min) return false;
      if (entry.atoms[atom] > atoms[atom].max) return false;
    }
  }
  return true;
};
