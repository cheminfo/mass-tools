import { atomSorter } from 'atom-sorter';

import { preprocessEARanges } from './preprocessEARanges';

/**
 * Returns possible combinations
 * @param {object} [targetEA]
 * @param {object} [options={}]
 * @param {string} [options.ranges='C0-100 H0-100 O0-100 N0-100'] - range of mfs to search
 * @param {number} [options.maxElementError=0.003]
 * @param {number} [options.maxTotalError=0.01]
 * @param {number} [options.minMW=0] minimal molecular weight
 * @param {number} [options.maxMW=+Infinity] maximal molecular weight
 * @param {object} [options.unsaturation={}]
 * @param {number} [options.unsaturation.min=-Infinity] Minimal unsaturation
 * @param {number} [options.unsaturation.max=+Infinity] Maximal unsaturation
 * @param {boolean} [options.unsaturation.onlyInteger=false] Integer unsaturation
 * @param {boolean} [options.unsaturation.onlyNonInteger=false] Non integer unsaturation
 * @return {Array<object>}
 */

export function mfFromEA(targetEA, options = {}) {
  const {
    unsaturation = {},
    maxIterations = 1e8,
    minMW = 0,
    maxMW = +Infinity,
    ranges = [
      { mf: 'C', min: 0, max: 100 },
      { mf: 'H', min: 0, max: 100 },
      { mf: 'O', min: 0, max: 100 },
      { mf: 'N', min: 0, max: 100 },
    ],
    maxElementError = 0.003,
    maxTotalError = 0.01,
  } = options;

  let filterUnsaturation = !!unsaturation;
  // we calculate not the real unsaturation but the one before dividing by 2 + 1
  let fakeMinUnsaturation =
    typeof unsaturation.min === 'undefined'
      ? Number.MIN_SAFE_INTEGER
      : (unsaturation.min - 1) * 2;
  let fakeMaxUnsaturation =
    typeof unsaturation.max === 'undefined'
      ? Number.MAX_SAFE_INTEGER
      : (unsaturation.max - 1) * 2;

  let results = {
    mfs: [],
    info: {
      numberMFEvaluated: 0,
      numberResults: 0,
    },
  };
  let orderMapping = []; // used to sort the atoms

  let possibilities = preprocessEARanges(ranges, targetEA, maxElementError);
  orderMapping = getOrderMapping(possibilities);

  if (possibilities.length === 0) return { mfs: [] };

  let currentPosition = 0;
  let currentAtom;

  //  if (DEBUG) console.log('possibilities', possibilities.map((a) => `${a.mf + a.originalMinCount}-${a.originalMaxCount}`));

  mfWhile: while (true) {
    while (currentPosition < possibilities.length && currentPosition >= 0) {
      let previousAtom =
        currentPosition === 0 ? { mw: 0 } : possibilities[currentPosition - 1];
      currentAtom = possibilities[currentPosition];
      if (currentAtom.currentCount < currentAtom.maxCount) {
        currentAtom.currentCount++;
        currentAtom.aw = currentAtom.mass * currentAtom.currentCount;
        currentAtom.mw = currentAtom.aw + previousAtom.mw;
        currentAtom.maxRatio = currentAtom.aw / currentAtom.mw;
        // we should check if we can reach the target
        if (
          currentAtom.targetEA &&
          currentAtom.aw / currentAtom.mw - currentAtom.targetEA <
            -maxElementError
        ) {
          // we already don't have enough quantity of this element and it can only become worse
          continue;
        }

        if (currentPosition < possibilities.length - 1) {
          currentPosition++;
        } else {
          break;
        }
      } else {
        currentAtom.currentCount = currentAtom.minCount - 1;
        currentPosition--;
      }
    }
    if (currentPosition < 0) {
      break;
    }

    if (results.info.numberMFEvaluated++ > maxIterations) {
      throw Error(
        `Iteration number is over the current maximum of: ${maxIterations}`,
      );
    }
    if (filterUnsaturation) {
      let unsaturationValue = 0;
      for (const possibility of possibilities) {
        unsaturationValue +=
          possibility.unsaturation * possibility.currentCount;
      }

      let isOdd = Math.abs(unsaturationValue % 2);
      if (
        (unsaturation.onlyInteger && isOdd === 1) ||
        (unsaturation.onlyNonInteger && isOdd === 0) ||
        fakeMinUnsaturation > unsaturationValue ||
        fakeMaxUnsaturation < unsaturationValue
      ) {
        continue;
      }
    }

    let mw = currentAtom.mw;
    if (mw < minMW || mw > maxMW) continue;

    let totalError = 0;
    for (let i = 0; i < possibilities.length; i++) {
      const possibility = possibilities[i];
      let ratio = (possibility.mass * possibility.currentCount) / mw;
      if (typeof possibility.targetEA !== 'undefined') {
        let error = Math.abs(possibility.targetEA - ratio);
        if (error > maxElementError) {
          continue mfWhile;
        }
        totalError += error;
      }

      possibility.currentValue = ratio;
    }
    if (isNaN(totalError) || totalError > maxTotalError) continue;
    results.mfs.push(getResult(possibilities, totalError, orderMapping));
    results.info.numberResults++;
  }

  results.mfs.sort((a, b) => Math.abs(a.totalError) - Math.abs(b.totalError));
  return results;
}

function getResult(possibilities, totalError, orderMapping) {
  const result = { mf: '', totalError };
  // we check that the first time we meet the ionization group it does not end
  // in the final result
  for (let i = 0; i < possibilities.length; i++) {
    let possibility = possibilities[orderMapping[i]];
    if (possibility.currentCount !== 0) {
      if (possibility.isGroup) {
        result.mf += `(${possibility.mf})`;
        if (possibility.currentCount !== 1) {
          result.mf += possibility.currentCount;
        }
      } else {
        result.mf += possibility.mf;
        if (possibility.currentCount !== 1) {
          result.mf += possibility.currentCount;
        }
      }
    }

    result.ea = possibilities.map((current) => ({
      mf: current.mf,
      value: current.currentValue,
      expected: current.targetEA,
      error:
        current.targetEA === undefined
          ? undefined
          : Math.abs(current.targetEA - current.currentValue),
    }));
  }
  return result;
}

function getOrderMapping(possibilities) {
  let mapping = possibilities.map((p, i) => ({ atom: p.mf, index: i }));
  mapping.sort((a, b) => {
    return atomSorter(a.atom, b.atom);
  });
  return mapping.map((a) => a.index);
}
