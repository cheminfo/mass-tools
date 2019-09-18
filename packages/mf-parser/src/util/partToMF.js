'use strict';

const Kind = require('../Kind');

module.exports = function partToMF(part, options = {}) {
  let mf = [];
  for (let line of part) {
    switch (line.kind) {
      case Kind.ISOTOPE:
        if (line.multiplier !== 0) {
          mf.push(
            `[${line.value.isotope}${line.value.atom}]${
              line.multiplier !== 1 ? line.multiplier : ''
            }`,
          );
        }
        break;
      case Kind.ISOTOPE_RATIO:
        if (line.multiplier !== 0) {
          mf.push(
            `${line.value.atom}{${line.value.ratio.join(',')}}${
              line.multiplier !== 1 ? line.multiplier : ''
            }`,
          );
        }
        break;
      case Kind.ATOM:
        if (line.multiplier !== 0) {
          mf.push(line.value + (line.multiplier !== 1 ? line.multiplier : ''));
        }
        break;
      case Kind.CHARGE:
        if (line.value === 0 || options.neutral) break;
        mf.push(`(${line.value > 0 ? `+${line.value}` : line.value})`);
        break;
      default:
    }
  }
  return mf.join('');
};
