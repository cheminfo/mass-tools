'use strict';

const { ELECTRON_MASS } = require('chemical-elements/src/constants');
const MF = require('mf-parser').MF;
const matcher = require('mf-matcher').msem;
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');
const processRange = require('mf-utilities/src/processRange');
const sum = require('sum-object-keys');
/**
 * Generate all the possible combinations of molecular formula and calculate
 * for each of them the monoisotopic mass and observed moniisotopic mass (m/z)
 * In the molecular formula there may be a comment after the '$' symbol
 *
 * @param keys
 * @param {object}        [options={}]
 * @param {number}        [options.limit=10000000] - Maximum number of results
 * @param {boolean}       [options.estimate=false] - estimate the number of MF without filters
 * @param {boolean}       [canonizeMF=true] - Canonize molecular formula
 * @param {boolean}       [uniqueMFs=true] - Force canonization and make MF unique
 * @param {string}        [ionizations=''] - Comma separated list of ionizations (to charge the molecule)
 * @param {number}        [options.filter.minMass=0] - Minimal monoisotopic mass
 * @param {number}        [options.filter.maxMass=+Infinity] - Maximal monoisotopic mass
 * @param {number}        [options.filter.minEM=0] - Minimal neutral monoisotopic mass
 * @param {number}        [options.filter.maxEM=+Infinity] - Maximal neutral monoisotopic mass
 * @param {number}        [options.filter.precision=1000] - The precision on the experimental mass
 * @param {number}        [options.filter.targetMass] - Target mass, allows to calculate error and filter results
 * @param {Array<number>} [options.filter.targetMasses] - Target masses: SORTED array of numbers
 * @param {number}        [options.filter.precision=1000] - Precision
 * @param {number}        [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number}        [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {object}        [options.filter.unsaturation={}}]
 * @param {number}        [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}        [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number}        [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {number}        [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object}        [options.filter.atoms] - object of atom:{min, max}
 * @param {function}      [options.filter.callback] - a function to filter the MF
 * @param {string}        [options.filterFct]
 * @returns {Array}
 */

module.exports = function generateMFs(keys, options = {}) {
  options = { ...options };

  let { limit = 100000, uniqueMFs = true, estimate = false } = options;

  options.filterFctVariables = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (typeof key === 'object' && key.name) {
      options.filterFctVariables[key.name] = i;
      keys[i] = key.value;
    }
  }

  if (options.filterFct) {
    // we create a real javascript function
    let variables = Object.keys(options.filterFctVariables);
    variables.push('mm', 'mz', 'charge', 'unsaturation', 'atoms');
    // eslint-disable-next-line no-new-func
    options.filterFct = new Function(
      ...variables,
      `return ${options.filterFct}`,
    );
  }

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
      if (part.match(/[0-9]-[0-9-]/)) {
        // deal with negative numbers
        // there are ranges ... we are in trouble !
        newParts = newParts.concat(processRange(part, comment, { limit }));
      } else {
        newParts.push(parts[j]); // the part with the comments !
      }
    }
    keys[i] = newParts;
  }

  if (estimate) {
    let total = keys.reduce(
      (previous, current) => previous * current.length,
      1,
    );
    return total * options.ionizations.length;
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
        `You have reached the limit of ${limit}. You could still change this value using the limit option but it is likely to crash.`,
      );
    }
  }

  appendResult(results, currents, keys, options);
  if (uniqueMFs) {
    let uniqueMFsObject = {};
    results.forEach((result) => {
      uniqueMFsObject[result.mf + result.ionization.mf] = result;
    });
    results = Object.keys(uniqueMFsObject).map((k) => uniqueMFsObject[k]);
  }
  results.sort((a, b) => a.em - b.em);
  return results;
};

let ems = {};

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
      atoms: info.atoms,
    };
  }
  return ems[mfString];
}

function getEMFromParts(parts, currents, ionization) {
  let charge = 0;
  let em = 0;
  let mw = 0;
  let unsaturation = 0;
  let validUnsaturation = true;
  let atoms = {};

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
    atoms,
  };
}

function appendResult(results, currents, keys, options = {}) {
  const { canonizeMF, filter, ionizations } = options;
  // this script is designed to combine molecular formula
  // that may contain comments after a "$" sign
  // therefore we should put all the comments at the ned

  for (let ionization of ionizations) {
    let result = getEMFromParts(keys, currents, ionization);
    if (options.filterFct) {
      let variables = [];
      for (let key in options.filterFctVariables) {
        variables.push(currents[options.filterFctVariables[key]]);
      }

      variables.push(
        result.em,
        (result.em + ionization.em - ionization.charge * ELECTRON_MASS) /
          Math.abs(ionization.charge),
        result.charge + result.ionization.charge,
        result.unsaturation,
        result.atoms,
      );
      if (!options.filterFct.apply(null, variables)) continue;
    }

    let match = matcher(result, filter);
    if (!match) continue;
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
