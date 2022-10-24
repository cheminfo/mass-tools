'use strict';

const matcher = require('mf-matcher').msem;
const atomSorter = require('atom-sorter');
const getMsInfo = require('mf-utilities/src/getMsInfo');
const preprocessIonizations = require('mf-utilities/src/preprocessIonizations');
const preprocessRanges = require('mf-utilities/src/preprocessRanges');

const TargetMassCache = require('./TargetMassCache');

let targetMassCache;

/**
 * @param {number}        targetMass - Monoisotopic mass
 * @param {object}        [options={}]
 * @param {number}        [options.maxIterations=10000000] - Maximum number of iterations
 * @param {boolean}       [options.allowNeutral=true]
 * @param {boolean}       [options.uniqueMFs=true]
 * @param {number}        [options.limit=1000] - Maximum number of results
 * @param {string}        [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string}        [options.ranges='C0-100 H0-100 O0-100 N0-100'] - range of mfs to search
 * @param {number}        [options.precision=100] - Allowed mass range based on precision
 * @param {object}        [options.filter={}]
 * @param {number}        [options.filter.minCharge=-Infinity] - Minimal charge
 * @param {number}        [options.filter.maxCharge=+Infinity] - Maximal charge
 * @param {object}        [options.filter.unsaturation={}]
 * @param {number}        [options.filter.unsaturation.min=-Infinity] - Minimal unsaturation
 * @param {number}        [options.filter.unsaturation.max=+Infinity] - Maximal unsaturation
 * @param {number}        [options.filter.unsaturation.onlyInteger=false] - Integer unsaturation
 * @param {number}        [options.filter.unsaturation.onlyNonInteger=false] - Non integer unsaturation
 * @param {object}        [options.filter.atoms] - object of atom:{min, max}
 * @param {function}      [options.filter.callback] - a function to filter the MF
 * @returns {Promise}
 */

module.exports = async function mfFinder(targetMass, options = {}) {
  const {
    filter = {},
    maxIterations = 1e8,
    limit = 1000,
    allowNeutral = true, // if there is no msem we use em !
    uniqueMFs = false, // if there is no msem we use em !
    ranges = [
      { mf: 'C', min: 0, max: 100 },
      { mf: 'H', min: 0, max: 100 },
      { mf: 'O', min: 0, max: 100 },
      { mf: 'N', min: 0, max: 100 },
    ],
  } = options;

  const {
    minCharge = Number.MIN_SAFE_INTEGER,
    maxCharge = Number.MAX_SAFE_INTEGER,
    unsaturation = {},
  } = filter;

  let filterUnsaturation = unsaturation ? true : false;
  // we calculate not the real unsaturation but the one before dividing by 2 + 1
  let fakeMinUnsaturation =
    unsaturation.min === undefined
      ? Number.MIN_SAFE_INTEGER
      : (unsaturation.min - 1) * 2;
  let fakeMaxUnsaturation =
    unsaturation.max === undefined
      ? Number.MAX_SAFE_INTEGER
      : (unsaturation.max - 1) * 2;

  let filterCharge =
    minCharge !== Number.MIN_SAFE_INTEGER ||
    maxCharge !== Number.MAX_SAFE_INTEGER;

  let advancedFilter;
  if (filter.atoms || filter.callback) {
    advancedFilter = {
      atoms: filter.atoms,
      callback: filter.callback,
    };
  }

  let result = {
    mfs: [],
    info: {
      numberMFEvaluated: 0,
      numberResults: 0,
    },
  };
  let orderMapping = []; // used to sort the atoms

  // we need to make the processing for all the ionizations
  let ionizations = preprocessIonizations(options.ionizations);
  for (let ionization of ionizations) {
    let currentIonization = {
      currentMonoisotopicMass: ionization.em || 0,
      currentCharge: ionization.charge,
      currentUnsaturation: 0, // we don't take into account the unsaturation of the ionization agent
    };
    // if (DEBUG) console.log('new ionization', ionization.mf, ionization.em, ionization.charge);
    // ionization em and charge will be used to set the first atom value
    let possibilities = preprocessRanges(ranges);
    orderMapping = getOrderMapping(possibilities);

    if (possibilities.length === 0) return { mfs: [] };
    targetMassCache = new TargetMassCache(
      targetMass,
      possibilities,
      Object.assign({}, options, { charge: ionization.charge }),
    );

    let theEnd = false;
    let maxPosition = possibilities.length;
    let lastPosition = possibilities.length - 1;
    let currentPosition = 0;
    let currentAtom;
    let previousAtom;
    let lastPossibility = possibilities[lastPosition];

    initializePossibilities(possibilities, currentIonization);

    //  if (DEBUG) console.log('possibilities', possibilities.map((a) => `${a.mf + a.originalMinCount}-${a.originalMaxCount}`));

    let isValid = false; // designed so that the first time it is not a valid solution
    while (!theEnd) {
      if (result.info.numberMFEvaluated++ > maxIterations) {
        throw Error(
          `Iteration number is over the current maximum of: ${maxIterations}`,
        );
      }
      if (filterUnsaturation) {
        let unsaturationValue = lastPossibility.currentUnsaturation;
        let isOdd = Math.abs(unsaturationValue % 2);
        if (
          (unsaturation.onlyInteger && isOdd === 1) ||
          (unsaturation.onlyNonInteger && isOdd === 0) ||
          fakeMinUnsaturation > unsaturationValue ||
          fakeMaxUnsaturation < unsaturationValue
        ) {
          isValid = false;
        }
      }
      if (
        filterCharge &&
        (lastPossibility.currentCharge < minCharge ||
          lastPossibility.currentCharge > maxCharge)
      ) {
        isValid = false;
      }

      if (isValid) {
        let minMass = targetMassCache.getMinMass(lastPossibility.currentCharge);
        let maxMass = targetMassCache.getMaxMass(lastPossibility.currentCharge);
        if (
          lastPossibility.currentMonoisotopicMass < minMass ||
          lastPossibility.currentMonoisotopicMass > maxMass
        ) {
          isValid = false;
        }
      }

      if (isValid) {
        result.info.numberResults++;
        let newResult = getResult(
          possibilities,
          targetMass,
          allowNeutral,
          ionization,
          orderMapping,
        );
        if (advancedFilter) {
          isValid = matcher(newResult, advancedFilter) !== false;
        }
        if (isValid) {
          result.mfs.push(newResult);
          if (result.mfs.length > 2 * limit) {
            if (uniqueMFs) ensureUniqueMF(result);
            result.mfs.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));
            result.mfs.length = limit;
          }
        }
      }

      isValid = true;
      // we need to setup all the arrays if possible
      while (currentPosition < maxPosition && currentPosition >= 0) {
        currentAtom = possibilities[currentPosition];
        previousAtom =
          currentPosition === 0
            ? currentIonization
            : possibilities[currentPosition - 1];
        if (currentAtom.currentCount < currentAtom.currentMaxCount) {
          currentAtom.currentCount++;
          updateCurrentAtom(currentAtom, previousAtom);
          if (currentPosition < lastPosition) {
            currentPosition++;
            setCurrentMinMax(
              possibilities[currentPosition],
              possibilities[currentPosition - 1],
            );
          } else {
            break;
          }
        } else {
          currentPosition--;
        }
      }

      if (currentPosition < 0) {
        theEnd = true;
      }
    }
  }

  if (uniqueMFs) ensureUniqueMF(result);
  result.mfs.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));
  if (result.mfs.length > limit) {
    result.mfs.length = limit;
  }
  result.mfs.forEach((mf) => delete mf.currentCounts);
  return result;
};

/**
 * Ensure that we have only once the same MF
 * In order to improve the speed we just consider the em
 * @param {object} result
 */
function ensureUniqueMF(result) {
  result.mfs.sort((a, b) => a.em - b.em);
  let previousEM = 0;
  let bestCounts = [];
  const mfs = [];
  next: for (let current of result.mfs) {
    if (current.em - previousEM > 1e-8) {
      previousEM = current.em;
      bestCounts = current.currentCounts;
      mfs.push(current);
    } else {
      for (let i = 0; i < current.currentCounts.length; i++) {
        // better priority ???
        if (current.currentCounts[i] > bestCounts[i]) {
          mfs.pop();
          mfs.push(current);
          bestCounts = current.currentCounts;
          continue;
        } else {
          if (current.currentCounts[i] < bestCounts[i]) {
            continue next;
          }
        }
      }
    }
  }
  result.mfs = mfs;
}

function updateCurrentAtom(currentAtom, previousAtom) {
  currentAtom.currentMonoisotopicMass =
    previousAtom.currentMonoisotopicMass +
    currentAtom.em * currentAtom.currentCount;
  currentAtom.currentCharge =
    previousAtom.currentCharge + currentAtom.charge * currentAtom.currentCount;
  currentAtom.currentUnsaturation =
    previousAtom.currentUnsaturation +
    currentAtom.unsaturation * currentAtom.currentCount;
}

function getResult(
  possibilities,
  targetMass,
  allowNeutralMolecules,
  ionization,
  orderMapping,
) {
  let lastPossibility = possibilities[possibilities.length - 1];

  let result = {
    em: lastPossibility.currentMonoisotopicMass - ionization.em,
    unsaturation: lastPossibility.currentUnsaturation,
    mf: '',
    charge: lastPossibility.currentCharge - ionization.charge,
    ionization,
    atoms: {},
    groups: {},
    currentCounts: possibilities.map((possibility) => possibility.currentCount),
  };

  // we check that the first time we meet the ionization group it does not end
  // in the final result

  for (let i = 0; i < possibilities.length; i++) {
    let possibility = possibilities[orderMapping[i]];
    if (possibility.currentCount !== 0) {
      if (possibility.isGroup) {
        if (possibility.currentCount === 1) {
          result.mf += `${possibility.mf}`;
        } else {
          if (possibility.mf.match(/^\([^()]*\)$/)) {
            result.mf += `${possibility.mf}${possibility.currentCount}`;
          } else {
            result.mf += `(${possibility.mf})${possibility.currentCount}`;
          }
        }
        if (result.groups[possibility.mf]) {
          result.groups[possibility.mf] += possibility.currentCount;
        } else {
          result.groups[possibility.mf] = possibility.currentCount;
        }
      } else {
        result.mf += possibility.mf;
        if (possibility.currentCount !== 1) {
          result.mf += possibility.currentCount;
        }
      }
      for (let atom in possibility.atoms) {
        if (result.atoms[atom]) {
          result.atoms[atom] +=
            possibility.atoms[atom] * possibility.currentCount;
        } else {
          result.atoms[atom] =
            possibility.atoms[atom] * possibility.currentCount;
        }
      }
    }
  }
  result.unsaturation = (result.unsaturation + Math.abs(result.charge)) / 2 + 1;
  result.ms = getMsInfo(result, { targetMass, allowNeutralMolecules }).ms;
  return result;
}

function setCurrentMinMax(currentAtom, previousAtom) {
  // the current min max can only be optimize if the charge will not change anymore
  if (currentAtom.innerCharge === true || currentAtom.charge !== 0) {
    currentAtom.currentMinCount = currentAtom.originalMinCount;
    currentAtom.currentMaxCount = currentAtom.originalMaxCount;
    currentAtom.currentCount = currentAtom.currentMinCount - 1;
  } else {
    // no more change of charge, we can optimize
    let currentMass =
      previousAtom !== undefined ? previousAtom.currentMonoisotopicMass : 0;
    let currentCharge =
      previousAtom !== undefined ? previousAtom.currentCharge : 0;
    currentAtom.currentMinCount = Math.max(
      Math.floor(
        (targetMassCache.getMinMass(currentCharge) -
          currentMass -
          currentAtom.maxInnerMass) /
          currentAtom.em,
      ),
      currentAtom.originalMinCount,
    );
    currentAtom.currentMaxCount = Math.min(
      Math.floor(
        (targetMassCache.getMaxMass(currentCharge) -
          currentMass -
          currentAtom.minInnerMass) /
          currentAtom.em,
      ),
      currentAtom.originalMaxCount,
    );
    currentAtom.currentCount = currentAtom.currentMinCount - 1;
  }
}

function initializePossibilities(possibilities, currentIonization) {
  for (let i = 0; i < possibilities.length; i++) {
    if (i === 0) {
      updateCurrentAtom(possibilities[i], currentIonization);
      setCurrentMinMax(possibilities[i], currentIonization);
    } else {
      updateCurrentAtom(possibilities[i], possibilities[i - 1]);
    }
  }
}

// eslint-disable-next-line no-unused-vars
function possibilitiesToString(possibilities) {
  return possibilities.map((a) => [
    `mf:${a.mf}`,
    `current:${a.currentCount}`,
    `min:${a.currentMinCount}`,
    `max:${a.currentMaxCount}`,
    `charge:${a.currentCharge}`,
  ]);
}

function getOrderMapping(possibilities) {
  let mapping = possibilities.map((p, i) => ({ atom: p.mf, index: i }));
  mapping.sort((a, b) => {
    return atomSorter(a.atom, b.atom);
  });
  return mapping.map((a) => a.index);
}
