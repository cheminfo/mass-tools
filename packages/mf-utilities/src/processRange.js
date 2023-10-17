/**
 * Expand all the ranges to exact molecular formula
 * @param {string} string
 * @param {string} comment
 * @param {object} [options={}]
 * @param {number} [options.limit]
 * @param {boolean} [options.optimization=false] If true, it will simplify the problem by combining identical ranges the ranges.
 *
 * @returns
 */

export function processRange(string, comment, options = {}) {
  const { limit, optimization = false } = options;
  let results = [];
  let parts = string.split(/ *(-?[0-9]+--?[0-9]+) */).filter((v) => v); // remove empty parts

  let position = -1;
  let mfs = [];
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (!~part.search(/-?[0-9]--?[0-9]/)) {
      position++;
      mfs[position] = {
        mf: part,
        min: 1,
        max: 1,
      };
    } else {
      let min = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$1') >> 0;
      let max = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$2') >> 0;
      mfs[position].min = Math.min(min, max);
      mfs[position].max = Math.max(min, max);
    }
  }

  if (optimization) {
    mfs = optimizeRanges(mfs);
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
    if (results.length > limit) {
      throw Error(`processRange generates to many fragments (over ${limit})`);
    }
  }

  results.push(getMF(mfs, currents, comment));
  return results;
}

/**
 * If we have many times the same mf we can combine them
 */
function optimizeRanges(mfs) {
  let newMFs = [];
  let mfsObject = {};
  for (const mf of mfs) {
    if (!mfsObject[mf.mf]) {
      mfsObject[mf.mf] = {
        mf: mf.mf,
        min: mf.min,
        max: mf.max,
      };
      newMFs.push(mfsObject[mf.mf]);
    } else {
      mfsObject[mf.mf].min = mfsObject[mf.mf].min + mf.min;
      mfsObject[mf.mf].max = mfsObject[mf.mf].max + mf.max;
    }
  }
  return newMFs;
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
