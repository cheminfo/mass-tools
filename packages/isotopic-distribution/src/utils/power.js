'use strict';

// https://en.wikipedia.org/wiki/Exponentiation_by_squaring

module.exports = function power(p, options = {}) {
  if (p <= 0) throw new Error('power must be larger than 0');
  if (p === 1) return this;
  if (p === 2) {
    return this.square();
  }

  p--;
  let base = this.copy(); // linear time
  while (p !== 0) {
    if ((p & 1) !== 0) {
      this.multiply(base, options); // executed <= log2(p) times
    }
    p >>= 1;
    if (p !== 0) base.square(options); // executed <= log2(p) times
  }

  return this;
};
