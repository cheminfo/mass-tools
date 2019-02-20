'use strict';

const MF = require('mf-parser').MF;
const matcher = require('mf-matcher').msem;
const sum = require('sum-object-keys');
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');

/**
 * Generate all the possible combinations of molecular formula and calculate
 * for each of them the monoisotopic mass and observed moniisotopic mass (m/z)
 * In the molecular formula there may be a comment after the '$' symbol
 *
 * @param keys
 * @param {object} options
 * @param {number} [options.limit=10000000] - Maximum number of results
 * @param {boolean} [canonizeMF=true] - Canonize molecular formula
 * @param {boolean} [uniqueMFs=true] - Force canonization and make MF unique
 * @param {string} [ionizations=''] - Comma separated list of ionizations (to charge the molecule)
 * @param {number} [options.filter.minMass=0] - Minimal monoisotopic mass
 * @param {number} [options.filter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number} [options.filter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number} [options.filter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number} [options.filter.targetMass] - Experimental observed mass
 * @param {number} [options.filter.precision=1000] - Precision
 * @param {number} [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number} [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {number} [options.filter.minUnsaturation=-Infinity] - Minimal unsaturation
 * @param {number} [options.filter.maxUnsaturation=+Infinity] - Maximal unsaturation
 * @param {number} [options.filter.onlyIntegerUnsaturation=false] - Integer unsaturation
 * @param {number} [options.filter.onlyNonIntegerUnsaturation=false] - Non integer unsaturation
 * @param {object} [options.filter.atoms] - object of atom:{min, max}
 * @returns {Array}
 */

module.exports = function generateMFs(keys, options = {}) {
  let { limit = 10000000, uniqueMFs } = options;
  if (uniqueMFs === undefined) uniqueMFs = true;
  if (uniqueMFs === true) options.canonizeMF = true;
  if (options.canonizeMF === undefined) options.canonizeMF = true;
  options.ionizations = preprocessIonizations(options.ionizations);

  if (!Array.isArray(keys)) {
    throw new Error('You need to specify an array of strings or arrays');
  }

  // we allow String delimited by ". or ;" instead of an array
  for (let i = 0; i < keys.length; i++) {
    if (!Array.isArray(keys[i])) {
      keys[i] = keys[i].split(/[.,]/);
    }
  }

  // we allow ranges in a string ...
  // problem with ranges is that we need to know to what the range applies
  for (let i = 0; i < keys.length; i++) {
    let parts = keys[i];
    let newParts = [];
    for (let j = 0; j < parts.length; j++) {
      let part = parts[j];
      let comment = part.replace(/^([^$]*\$|.*)/, '');
      part = part.replace(/\$.*/, '').replace(/\s/g, '');
      if (~part.indexOf('-')) {
        // there are ranges ... we are in trouble !
        newParts = newParts.concat(processRange(part, comment));
      } else {
        newParts.push(parts[j]); // the part with the comments !
      }
    }
    keys[i] = newParts;
  }

  let results = [];
  let sizes = [];
  let currents = [];
  for (let i = 0; i < keys.length; i++) {
    sizes.push(keys[i].length - 1);
    currents.push(0);
  }
  let position = 0;
  let evolution = 0;

  while (position < currents.length) {
    if (currents[position] < sizes[position]) {
      evolution++;
      appendResult(results, currents, keys, options);
      currents[position]++;
      for (let i = 0; i < position; i++) {
        currents[i] = 0;
      }
      position = 0;
    } else {
      position++;
    }
    if (evolution > limit) {
      throw new Error(
        `You have reached the limit of ${limit}. You could still change this value using the limit option but it is likely to crash.`
      );
    }
  }
  appendResult(results, currents, keys, options);

  if (uniqueMFs) {
    var uniqueMFsObject = {};
    results.forEach((r) => {
      uniqueMFsObject[r.mf + r.ionization.mf] = r;
    });
    results = Object.keys(uniqueMFsObject).map((k) => uniqueMFsObject[k]);
  }
  results.sort((a, b) => a.em - b.em);
  return results;
};

var ems = {};

// internal method used as a cache
function getMonoisotopicMass(mfString) {
  if (!ems[mfString]) {
    // we need to calculate based on the mf but not very often ...
    let mf = new MF(mfString);
    let info = mf.getInfo();
    ems[mfString] = {
      em: info.monoisotopicMass,
      charge: info.charge,
      mw: info.mass,
      unsaturation: (info.unsaturation - 1) * 2,
      atoms: info.atoms
    };
  }
  return ems[mfString];
}

function getEMFromParts(parts, currents, ionization) {
  var charge = 0;
  var em = 0;
  var mw = 0;
  var unsaturation = 0;
  var validUnsaturation = true;
  var atoms = {};

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i][currents[i]];
    if (part) {
      let info = getMonoisotopicMass(part);
      charge += info.charge;
      em += info.em;
      mw += info.mw;
      sum(atoms, info.atoms);
      if (info.unsaturation && validUnsaturation) {
        unsaturation += info.unsaturation;
      }
    }
  }

  return {
    charge,
    em,
    mw,
    ionization: ionization,
    unsaturation: validUnsaturation ? unsaturation / 2 + 1 : undefined,
    atoms
  };
}

function appendResult(results, currents, keys, options = {}) {
  const { canonizeMF, filter, ionizations } = options;

  // this script is designed to combine molecular formula
  // that may contain comments after a "$" sign
  // therefore we should put all the comments at the ned

  for (let ionization of ionizations) {
    let result = getEMFromParts(keys, currents, ionization);

    let match = matcher(result, filter);

    if (!match) return;
    result.ms = match.ms;
    result.ionization = match.ionization;
    result.parts = [];
    result.mf = '';

    let comments = [];
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i][currents[i]];
      if (key) {
        if (key.indexOf('$') > -1) {
          comments.push(key.replace(/^[^$]*\$/, ''));
          key = key.replace(/\$.*/, '');
        }
        result.parts[i] = key;
        result.mf += key;
      }
    }

    if (canonizeMF) {
      result.mf = new MF(result.mf).toMF();
    }
    if (comments.length > 0) {
      result.comment = comments.join(' ');
    }
    results.push(result);
  }
}

function processRange(string, comment) {
  var results = [];
  var parts = string.split(/([0-9]+-[0-9]+)/).filter((v) => v); // remove empty parts
  let position = -1;
  var mfs = [];
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (!~part.search(/[0-9]-[0-9]/)) {
      position++;
      mfs[position] = {
        mf: part,
        min: 1,
        max: 1
      };
    } else {
      mfs[position].min = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$1') >> 0;
      mfs[position].max = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$2') >> 0;
    }
  }

  let currents = new Array(mfs.length);
  for (let i = 0; i < currents.length; i++) {
    currents[i] = mfs[i].min;
  }
  position = 0;
  while (position < currents.length) {
    if (currents[position] < mfs[position].max) {
      results.push(getMF(mfs, currents, comment));
      currents[position]++;
      for (let i = 0; i < position; i++) {
        currents[i] = mfs[i].min;
      }
      position = 0;
    } else {
      position++;
    }
  }
  results.push(getMF(mfs, currents, comment));
  return results;
}

function getMF(mfs, currents, comment) {
  let mf = '';
  for (let i = 0; i < mfs.length; i++) {
    if (currents[i] === 0) {
      // TODO we need to remove from currents[i] till we reach another part of the MF
      mf += removeMFLastPart(mfs[i].mf);
    } else {
      mf += mfs[i].mf;
      if (currents[i] !== 1) {
        mf += currents[i];
      }
    }
  }
  if (comment) mf += `$${comment}`;
  return mf;
}

/*
 Allows to remove the last part of a MF. Useful when you have something with '0' times.
 C10H -> C10
 C10((Me)N) -> C10
 C10Ala -> C10
 C10Ala((Me)N) -> C10Ala
 */
function removeMFLastPart(mf) {
  let parenthesis = 0;
  let start = true;
  for (let i = mf.length - 1; i >= 0; i--) {
    let ascii = mf.charCodeAt(i);

    if (ascii > 96 && ascii < 123) {
      // lowercase
      if (!start && !parenthesis) {
        return mf.substr(0, i + 1);
      }
    } else if (ascii > 64 && ascii < 91) {
      // uppercase
      if (!start && !parenthesis) {
        return mf.substr(0, i + 1);
      }
      start = false;
    } else if (ascii === 40) {
      // (
      parenthesis--;
      if (!parenthesis) return mf.substr(0, i);
    } else if (ascii === 41) {
      // )
      parenthesis++;
    } else {
      start = false;
      if (!parenthesis) return mf.substr(0, i + 1);
    }
  }
  return '';
}
