'use strict';

const Kind = require('mf-parser/src/Kind');
const parse = require('mf-parser/src/parse');

function getRangeForFragment(ranges) {
  ranges = JSON.parse(JSON.stringify(ranges));
  if (typeof ranges === 'string') {
    // need to convert to ranges
    let parsed = parse(ranges.replace(/[\r\n\t ]/g, ''));
    let newRanges = [];

    // example ClBr2(CH2)0-2NO
    // the idea is that has long as we don't have a range we don't really care
    // there is a limitation is that the range has to be first level of parenthesis
    let parenthesisLevel = 0;
    let currentMF = ''; // start at an atom first level or a parenthesis
    for (let item of parsed) {
      switch (item.kind) {
        case Kind.ATOM:
          if (parenthesisLevel === 0 && currentMF) {
            newRanges.push({
              mf: currentMF,
            });
            currentMF = '';
          }
          currentMF += item.value;
          break;
        case Kind.ISOTOPE:
          if (parenthesisLevel === 0 && currentMF) {
            newRanges.push({
              mf: currentMF,
            });
            currentMF = '';
          }
          currentMF += `[${item.value.isotope}${item.value.atom}]`;
          break;
        case Kind.MULTIPLIER:
          if (parenthesisLevel === 0 && currentMF) {
            newRanges.push({
              mf: currentMF,
              max: item.value,
            });
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
          if (parenthesisLevel === 0 && currentMF) {
            newRanges.push({
              mf: currentMF,
            });
            currentMF = '';
          }
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
      newRanges.push({ mf: currentMF });
    }
    ranges = newRanges;
  }
  let possibilities = [];
  for (const range of ranges) {
    if (range.max === 0) continue;
    let max = range.max === undefined ? 1 : range.max;
    possibilities.push(`${range.mf}0-${max}`);
  }

  return possibilities.join(' ');
}

module.exports = getRangeForFragment;
