'use strict';

const Kind = require('mf-parser/src/Kind');
const MF = require('mf-parser/src/MF');
const parse = require('mf-parser/src/parse');

module.exports = function preprocessRanges(ranges, targetEA) {
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
        case Kind.ISOTOPE:
          if (parenthesisLevel === 0 && currentMF) {
            current.mf += currentMF;
            currentMF = '';
          }
          currentMF += `[${item.value.isotope}${item.value.atom}]`;
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
      minCount: min, // value defined by the user
      maxCount: max, // value defined by the user
      targetEA: targetEA[range.mf],
      mw: 0, // mw till this level
      aw: 0, // atomic weight (mass * currentCount)
      maxRatio: 0, // maximum ratio possible if all next elements are 0
      currentValue: 0,
      currentCount: min - 1,
      currentUnsaturation: 0,
      initialOrder: i,
    };
    possibilities.push(possibility);
    let info = new MF(range.mf).getInfo();
    possibility.mass = info.mass;
    possibility.unsaturation =
      range.unsaturation === undefined
        ? (info.unsaturation - 1) * 2
        : range.unsaturation;
    if (possibility.mf !== info.mf) possibility.isGroup = true;
  }
  possibilities = possibilities.filter(
    (r) => r.minCount !== 0 || r.maxCount !== 0,
  );

  possibilities.sort((a, b) => {
    return b.targetEA - a.targetEA;
  });

  return possibilities;
};
