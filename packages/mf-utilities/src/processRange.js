'use strict';

function processRange(string, comment) {
  let results = [];
  let parts = string.split(/(-?[0-9]+--?[0-9]+)/).filter((v) => v); // remove empty parts

  let position = -1;
  let mfs = [];
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (!~part.search(/-?[0-9]--?[0-9]/)) {
      position++;
      mfs[position] = {
        mf: part,
        min: 1,
        max: 1
      };
    } else {
      let min = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$1') >> 0;
      let max = part.replace(/^(-?[0-9]*)-(-?[0-9]*)/, '$2') >> 0;
      mfs[position].min = Math.min(min, max);
      mfs[position].max = Math.max(min, max);
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

module.exports = processRange;
