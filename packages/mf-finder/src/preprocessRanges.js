'use strict';

const MF = require('mf-parser/src/MF');
const parse = require('mf-parser/src/parse');
const Kind = require('mf-parser/src/Kind');

module.exports = function preprocessRanges(ranges) {
  ranges = JSON.parse(JSON.stringify(ranges));
  if (typeof ranges === 'string') {
    // need to convert to ranges
    let parsed = parse(ranges.replace(/[\r\n\t ]/g, ''));
    let newRanges = [];
    let current = {
      mf: '',
      min: 1,
      max: 1,
    };

    // example ClBr2(CH2)0-2NO
    // the idea is that has long as we don't have a range we don't really care
    // there is a limitation is that the range has to be first level of parenthesis
    let parenthesisLevel = 0;
    let currentMF = ''; // start at an atom first level or a parenthesis
    for (let item of parsed) {
      switch (item.kind) {
        case Kind.ATOM:
          if (parenthesisLevel === 0 && currentMF) {
            current.mf += currentMF;
            currentMF = '';
          }
          currentMF += item.value;
          break;
        case Kind.MULTIPLIER:
          if (parenthesisLevel === 0 && currentMF) {
            current.mf += currentMF + item.value;
            currentMF = '';
          } else {
            currentMF += item.value;
          }
          break;
        case Kind.MULTIPLIER_RANGE:
          if (parenthesisLevel !== 0) {
            throw new Error('Range multiplier can only be at the first level');
          }
          newRanges.push({
            mf: currentMF,
            min: item.value.from,
            max: item.value.to,
          });
          currentMF = '';
          break;
        case Kind.OPENING_PARENTHESIS:
          parenthesisLevel++;
          currentMF += '(';
          break;
        case Kind.CLOSING_PARENTHESIS:
          parenthesisLevel--;
          currentMF += ')';
          break;
        default:
          throw Error(`can not preprocess ${ranges}`);
      }
    }
    if (currentMF) {
      current.mf += currentMF;
    }
    if (current.mf) {
      newRanges.push(current);
    }
    ranges = newRanges;
  }

  let possibilities = [];
  for (let i = 0; i < ranges.length; i++) {
    let range = ranges[i];
    let min = range.min === undefined ? 0 : range.min;
    let max = range.max === undefined ? 1 : range.max;
    let possibility = {
      mf: range.mf,
      originalMinCount: min, // value defined by the user
      originalMaxCount: max, // value defined by the user
      currentMinCount: min,
      currentMaxCount: max,
      currentCount: min,
      currentMonoisotopicMass: 0,
      currentCharge: 0,
      currentUnsaturation: 0,
      initialOrder: i,
      minInnerMass: 0,
      maxInnerMass: 0,
      minInnerCharge: 0,
      maxInnerCharge: 0,
      minCharge: 0,
      maxCharge: 0,
      minMass: 0,
      maxMass: 0,
      innerCharge: false,
    };
    possibilities.push(possibility);
    let info = new MF(range.mf).getInfo();
    possibility.em = range.em || info.monoisotopicMass;
    possibility.charge = range.charge || info.charge;
    possibility.unsaturation =
      range.unsaturation === undefined
        ? (info.unsaturation - 1) * 2
        : range.unsaturation;
    if (possibility.mf !== info.mf) possibility.isGroup = true;
  }
  possibilities = possibilities.filter(
    (r) => r.originalMinCount !== 0 || r.originalMaxCount !== 0,
  );
  // we will sort the way we analyse the data
  // 1. The one possibility parameter
  // 2. The charged part
  // 3. Decreasing em
  possibilities.sort((a, b) => {
    if (a.originalMinCount === a.originalMaxCount) return -1; // should be in front, they are 'static'
    if (b.originalMinCount === b.originalMaxCount) return 1;
    if (a.charge && b.charge) {
      if (Math.abs(a.charge) > Math.abs(b.charge)) return -1;
      if (Math.abs(a.charge) < Math.abs(b.charge)) return 1;
      return b.em - a.em;
    }
    if (a.charge) return -1;
    if (b.charge) return 1;
    return b.em - a.em;
  });

  // we calculate couple of fixed values

  for (let i = 0; i < possibilities.length; i++) {
    for (let j = i; j < possibilities.length; j++) {
      let possibility = possibilities[j];
      if (possibility.em > 0) {
        possibilities[i].minMass +=
          possibility.em * possibility.originalMinCount;
        possibilities[i].maxMass +=
          possibility.em * possibility.originalMaxCount;
      } else {
        possibilities[i].minMass +=
          possibility.em * possibility.originalMaxCount;
        possibilities[i].maxMass +=
          possibility.em * possibility.originalMinCount;
      }
      if (possibility.charge > 0) {
        possibilities[i].minCharge +=
          possibility.charge * possibility.originalMinCount;
        possibilities[i].maxCharge +=
          possibility.charge * possibility.originalMaxCount;
      } else {
        possibilities[i].minCharge +=
          possibility.charge * possibility.originalMaxCount;
        possibilities[i].maxCharge +=
          possibility.charge * possibility.originalMinCount;
      }
    }
  }

  for (let i = 0; i < possibilities.length; i++) {
    if (i < possibilities.length - 1) {
      let possibility = possibilities[i];
      let innerPossibility = possibilities[i + 1];
      possibility.minInnerMass = innerPossibility.minMass;
      possibility.maxInnerMass = innerPossibility.maxMass;
      possibility.minInnerCharge = innerPossibility.minCharge;
      possibility.maxInnerCharge = innerPossibility.maxCharge;
      if (possibility.minInnerCharge || possibility.maxInnerCharge) {
        possibility.innerCharge = true;
      }
    }
  }

  return possibilities;
};
